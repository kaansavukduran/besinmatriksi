import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeRecipe, normalizeCustom, recipeCost } from '../src/records.js';
import { parseImport, exportPayload } from '../src/store.js';
import { aggregate, scaleItem, derive } from '../src/calc.js';
const ref = { t: 'u', id: 'test' };
test('bozuk tarif alanları ve referanslar uygulamayı bozamaz', () => {
  const r = normalizeRecipe({ name: ' Test ', servings: -10, cookedWeight: Infinity,
    items: [null, { ref: 'invalid', g: 100 }, { ref, g: Infinity }, { ref, g: -10 }, { ref, g: 5000 }, { ref, g: .5 }] });
  assert.equal(r.name, 'Test'); assert.equal(r.servings, 1); assert.equal(r.cookedWeight, null);
  assert.deepEqual(r.items.map(x => x.g), [1000, 1]); assert.equal(normalizeRecipe([]), null);
});
test('kendi besininde eksik, negatif ve geçersiz değerler sıfıra çevrilmez', () => {
  const f = normalizeCustom({ id: 'test', name: 'Besin', v: { energy: 0, protein: -1, fe: Infinity, b12: null, ca: '12', k: 100, fake: 15 } });
  assert.deepEqual(f.v, { energy: 0, k: 100 });
});
test('yedeği yeniden almak tarifin özel besinini diğer kayıtla karıştırmaz', () => {
  const recipe = { name: 'Tarif', items: [{ ref, g: 100 }], servings: 2 };
  const payload = exportPayload([recipe], {}, [{ id: 'test', name: 'Benim ürünüm', v: { energy: 20 } }]);
  const a = parseImport(payload), b = parseImport(payload);
  assert.notEqual(a.custom[0].id, 'test'); assert.notEqual(a.custom[0].id, b.custom[0].id);
  assert.equal(a.recipes[0].items[0].ref.id, a.custom[0].id);
  assert.throws(() => parseImport('{"app":"besin-matriksi","version":99,"recipes":[]}'));
});
test('maliyet sıfır fiyatı tanır, eksik fiyatı kısmi gösterir ve porsiyona böler', () => {
  const r = normalizeRecipe({ name: 'Tarif', servings: 2, items: [{ ref, g: 250, pricePerKg: 80 }, { ref, g: 100, pricePerKg: 0 }, { ref, g: 100 }] });
  assert.deepEqual(recipeCost(r), { total: 20, perServing: 10, known: 2, count: 3, complete: false });
  r.items[0].g = 500; assert.equal(recipeCost(r).perServing, 20);
});
test('bulunamayan malzemenin ağırlığı ve eksik kapsamı korunur; kısmi oranlar üretilmez', () => {
  const known = scaleItem({ v: { energy: 100, protein: 5, fat: 2, fiber: 3, carb: 20, na: 100, k: 200, ca: 50, p: 60, mg: 20 }, s: {} }, 100);
  const agg = aggregate([known, { v: {}, s: {}, grams: 250 }]);
  assert.equal(agg.grams, 350); assert.equal(agg.n, 2); assert.equal(agg.cov.energy, 1);
  assert.equal(agg.v.energy, 100); assert.deepEqual(derive(agg), {});
  assert.ok(derive(known).energySplit);
});

test('aynı yedek iki kez içe aktarılınca kopya oluşmaz; yeni kayıtlar eklenir (B133)', async () => {
  const { exportPayload, parseImport, mergeImport } = await import('../src/store.js');
  const custom = [{ id: 'c1', name: 'Ev ekmeğim', liquid: false, portion: null, note: '', v: { energy: 250, protein: 9 } }];
  const recipes = [{ id: 'r1', name: 'Kahvaltı', servings: 1, cookedWeight: null, created: 1, updated: 1, items: [{ id: 'i1', ref: { t: 'u', id: 'c1' }, g: 50, pricePerKg: null }, { id: 'i2', ref: { t: 'c', id: 'nohut', f: 0 }, g: 100, pricePerKg: null }] }];
  const collections = [{ id: 'k1', name: 'Favoriler', parent: null, items: [{ t: 'u', id: 'c1' }] }];
  const text = exportPayload(recipes, {}, custom, [], collections);
  // 1. içe aktarma (boş cihaz): her şey eklenir
  const first = mergeImport({ recipes: [], custom: [], profiles: [], collections: [] }, parseImport(text));
  assert.equal(first.recipes.length, 1); assert.equal(first.custom.length, 1); assert.equal(first.collections.length, 1); assert.equal(first.skipped, 0);
  // 2. aynı dosya: hiçbir şey eklenmez, bağlar mevcut kendi besine yönlenir
  const cur = { recipes: first.recipes, custom: first.custom, profiles: first.profiles, collections: first.collections };
  const second = mergeImport(cur, parseImport(text));
  assert.deepEqual([second.recipes.length, second.custom.length, second.collections.length], [0, 0, 0]);
  assert.equal(second.skipped, 3);
  // Farklı bir tarif içeren yedek: yalnız yeni tarif eklenir ve mevcut kendi besine bağlanır
  const text2 = exportPayload([...recipes, { ...recipes[0], id: 'r2', name: 'Öğle' }], {}, custom, [], collections);
  const third = mergeImport(cur, parseImport(text2));
  assert.equal(third.recipes.length, 1); assert.equal(third.recipes[0].name, 'Öğle');
  assert.equal(third.recipes[0].items[0].ref.id, first.custom[0].id);
});

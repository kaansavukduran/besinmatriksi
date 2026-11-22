import test from 'node:test';
import assert from 'node:assert/strict';
import { recipeGaps } from '../src/gaps.js';

const N = [{ key: 'energy', unit: 'kcal' }, { key: 'fe', unit: 'mg' }, { key: 'ca', unit: 'mg' }, { key: 'k', unit: 'mg' }, { key: 'b12', unit: 'µg' }, { key: 'zn', unit: 'mg' }];
const REF = { energy: 2000, fe: 14, ca: 800, k: 2000, b12: 2.5, zn: 10 };
const refFor = (n) => ({ value: REF[n.key] });
const foods = [
  { id: 'a', forms: [{ v: { fe: 8, ca: 100 } }] },
  { id: 'b', forms: [{ v: { fe: 3, ca: 300 } }] },
  { id: 'c', forms: [{ v: { fe: null, ca: 0 } }] },
  { id: 'p', cat: 'baharat', forms: [{ v: { fe: 80, ca: 900 } }] },
];

test('en düşük yüzdeler önce; veri yok açık sayılmaz; enerji dışlanır', () => {
  const r = { n: 2, v: { energy: 100, fe: 1.4, ca: 400, k: 2500, b12: 0.1, zn: null }, cov: { fe: 2, ca: 1, k: 2, b12: 2 } };
  const g = recipeGaps(r, N, foods, refFor);
  assert.deepEqual(g.map((x) => x.n.key), ['b12', 'fe', 'ca']); // k ≥%100, zn veri yok, energy dışlanır
  assert.equal(g[0].noPlant, true); assert.equal(g[0].foods.length, 0); // test listesinde hayvansal yok
  assert.deepEqual(g[1].foods.map((x) => x.f.id), ['a', 'b']); // null ve 0 önerilmez
  assert.equal(g[2].partial, true);
  assert.equal(Math.round(g[1].pct), 10);
});

test('referans yoksa öneri yok', () => {
  const r = { n: 1, v: { fe: 1 }, cov: { fe: 1 } };
  assert.deepEqual(recipeGaps(r, N, foods, () => ({ value: undefined })), []);
});

test('B12/D: rastgele bitkisel iz ölçümü B12 sayılmaz; zenginleştirilmiş bitkisel içecekler, UV mantarları ve tüm biçimler değerlendirilir (B252)', () => {
  const N2 = [{ key: 'b12', unit: 'µg' }, { key: 'vitd', unit: 'µg' }];
  const fs2 = [
    { id: 'kultur_mantari', cat: 'mantar', forms: [{ label: 'Çiğ', v: { b12: 0.04, vitd: 0.2 } }] },
    { id: 'tempeh', tr: 'Tempeh', cat: 'soya', forms: [{ label: 'Çiğ', v: { b12: 0.08 } }] },
    { id: 'soya_sutu_z', tr: 'Soya sütü (eklenmiş)', cat: 'soya', forms: [{ label: 'İçecek', v: { b12: 1.11, vitd: 1.2 }, usda: { desc: 'Soymilk, fortified' } }] },
    { id: 'portobello_uv', tr: 'Portobello (UV)', cat: 'mantar', forms: [{ label: 'Çiğ', v: { b12: 0.05, vitd: 28.4 } }] },
    { id: 'shiitake', tr: 'Shiitake', cat: 'mantar', forms: [{ label: 'Çiğ', v: { vitd: 0.4 } }, { label: 'Kurutulmuş', v: { vitd: 3.9 } }] },
    { id: 'ciger', animal: true, forms: [{ label: 'Pişmiş', v: { b12: 59, vitd: 1.2 } }] },
  ];
  const gAll = recipeGaps({ n: 1, v: { b12: 0, vitd: 0 }, cov: { b12: 1, vitd: 1 } }, N2, fs2, (n) => ({ value: n.key === 'b12' ? 2.5 : 15 }));
  const b12All = gAll.find((x) => x.n.key === 'b12');
  const vitdAll = gAll.find((x) => x.n.key === 'vitd');
  assert.deepEqual(b12All.foods.map((x) => x.f.id), ['ciger', 'soya_sutu_z']); // mantar ve tempeh B12 için önerilmez
  assert.deepEqual(vitdAll.foods.map((x) => x.f.id), ['portobello_uv', 'shiitake', 'soya_sutu_z']); // shiitake ikinci biçimi (kurutulmuş, 3.9) seçilir
  assert.equal(vitdAll.foods[1].fi, 1);

  const gVegan = recipeGaps({ n: 1, v: { b12: 0, vitd: 0 }, cov: { b12: 1, vitd: 1 } }, N2, fs2.filter((f) => !f.animal), (n) => ({ value: n.key === 'b12' ? 2.5 : 15 }));
  assert.deepEqual(gVegan.find((x) => x.n.key === 'b12').foods.map((x) => x.f.id), ['soya_sutu_z']);
  assert.deepEqual(gVegan.find((x) => x.n.key === 'vitd').foods.map((x) => x.f.id), ['portobello_uv', 'shiitake', 'soya_sutu_z']);
});

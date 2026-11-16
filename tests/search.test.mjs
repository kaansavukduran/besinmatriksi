import { test } from 'node:test';
import assert from 'node:assert/strict';
import { norm } from '../src/util.js';
import { searchKey, recentSearches } from '../src/search.js';
import { normalizeProfiles, exportPayload, parseImport } from '../src/store.js';
import fs from 'node:fs';
import {EN_FOODS} from '../src/i18n-foods.js';
test('B154 dried apricots use a plain name and common searches while retaining sulphite/source identity',()=>{
 const food=JSON.parse(fs.readFileSync(new URL('../src/data/foods.json',import.meta.url))).foods.find(f=>f.id==='kuru_kayisi');
 assert.equal(food.tr,'Kuru kayısı');assert.equal(EN_FOODS[food.id],'Dried apricots');
 const key=searchKey(food);for(const query of ['kuru kayısı','kayısı kurusu','kükürtlü kuru kayısı','dried apricots','sulphured','sulfured'])for(const term of norm(query).split(' '))assert.ok(key.includes(term),query);
 assert.ok(!key.includes('kukurtsuz'));assert.ok(!key.includes('gun kurusu'));
 assert.deepEqual(food.allergens,['sulfit']);assert.match(food.note,/kükürt dioksitle işlenmiş/);assert.match(food.note,/ayrı bir ölçüm değildir/);
 assert.equal(food.forms[0].usda.ndb,'09032');assert.equal(food.forms[0].v.energy,241);
});
test('Türkçe arama İ/ı, ş ve diakritiklere duyarsızdır; eş anlamlıları bulur', () => {
  assert.equal(norm('İSPaNAK ışık Şeftâli'), 'ispanak isik seftali');
  assert.ok(searchKey({ id: 'salatalik', tr: 'Salatalık', en: 'Cucumber' }).includes(norm('hıyar')));
  assert.ok(searchKey({ id: 'ahududu', tr: 'Ahududu' }).includes('frambuaz'));
});
test('B141 gündelik kahve ve atıştırmalık adları Türkçe eş anlamlarla bulunur', () => {
  assert.ok(searchKey({ id: 'espresso', tr: 'Espresso', en: 'coffee' }).includes('doppio'));
  assert.ok(searchKey({ id: 'cappuccino_sutlu', tr: 'Cappuccino (sütlü)', en: 'coffee' }).includes(norm('kapuçino')));
  assert.ok(searchKey({ id: 'dondurulmus_pizza_peynirli', tr: 'Dondurulmuş pizza', en: 'frozen cheese pizza' }).includes(norm('donmuş pizza')));
});
test('son aramalar yerel, sınırlı, sıralı ve tekrar içermeyen listedir', () => {
  assert.deepEqual(recentSearches(['Ispanak', 'muz', null], 'ıspanak'), ['ıspanak', 'muz']);
  assert.equal(recentSearches(Array.from({ length: 15 }, (_, i) => `besin ${i}`)).length, 8);
  assert.deepEqual(recentSearches({}, '   '), []);
});
test('profiller eski ayarlara varsayılan ekler; tam yedekle taşınır', () => {
  const ps = normalizeProfiles([{ id: 'p1', name: 'Gece', settings: { theme: 'dark' } }, { id: '<bad>', name: 'Hata' }]);
  assert.equal(ps.length, 1); assert.equal(ps[0].settings.theme, 'dark'); assert.equal(ps[0].settings.fontSize, 17);
  const imp = parseImport(exportPayload([], {}, [], ps));
  assert.equal(imp.profiles[0].name, 'Gece'); assert.notEqual(imp.profiles[0].id, 'p1');
});

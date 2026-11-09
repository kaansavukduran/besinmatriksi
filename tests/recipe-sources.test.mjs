import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aggregate, scaleItem, scaleAggregate } from '../src/calc.js';
import { NUTRIENTS } from '../src/nutrients.js';
import { recipeContributions, renderRecipeSources } from '../src/recipe-sources.js';

const foods = {
  a: { name: 'Bir <besin>', formLabel: 'Çiğ', v: { energy: 80, na: 20, protein: 0, carb: 15, fiber: 3 }, s: { energy: 'u', na: 'u', protein: 'u', carb: 'u', fiber: 'u' }, usda: { ndb: '00001', desc: 'Source <record>' } },
  b: { name: 'Etiket', formLabel: 'Kendi besinim', v: { energy: 40, protein: 2 }, s: { energy: 'k', protein: 'k' } },
};
const resolve = ref => foods[ref.id];
const recipe = { items: [{ ref: { id: 'a' }, g: 250 }, { ref: { id: 'b' }, g: 100 }, { ref: { id: 'missing' }, g: 50 }, { ref: { id: 'a' }, g: 25 }] };

test('malzeme dökümü kaynak kaydını, sıfırı, veri boşluğunu ve yinelenen malzemeyi ayırır', () => {
  const rows = recipeContributions(recipe, resolve, 'protein');
  assert.deepEqual(rows.map(r => r.value), [0, 2, null, 0]);
  assert.deepEqual(rows.map(r => r.source), ['u', 'k', undefined, 'u']);
  assert.equal(rows[0].usda.ndb, '00001');
  assert.equal(rows[2].missingRecord, true);
  const na = recipeContributions(recipe, resolve, 'na');
  assert.equal(na[1].value, null); assert.equal(na[1].missingRecord, false);
});

test('her bileşenin katkıları toplam/porsiyon/pişmiş 100 g matrisini yeniden oluşturur', () => {
  const scaled = recipe.items.map(i => resolve(i.ref) ? scaleItem(resolve(i.ref), i.g) : { v: {}, s: {}, grams: i.g });
  const agg = aggregate(scaled);
  for (const factor of [1, 1 / 3, 100 / 320]) {
    const result = scaleAggregate(agg, factor);
    for (const n of NUTRIENTS) {
      const rows = recipeContributions(recipe, resolve, n.key, factor);
      const known = rows.filter(r => r.value != null);
      assert.equal(known.length, result.cov[n.key] || 0, n.key);
      if (!known.length) assert.equal(result.v[n.key], undefined, n.key);
      else assert.ok(Math.abs(known.reduce((sum, r) => sum + r.value, 0) - result.v[n.key]) < 1e-10, n.key);
    }
  }
});

test('hesaplanan tuz/kJ/karbonhidrat girdileri aynı payda ölçeklenir; kaynak ölçümü korunur', () => {
  const salt = recipeContributions(recipe, resolve, 'salt', .5)[0];
  assert.equal(salt.value, .0625); assert.equal(salt.source, 'd');
  assert.deepEqual(salt.inputs, [{ key: 'na', value: 25, source: 'u' }]);
  assert.match(salt.formula, /sodyum/);
  const kj = recipeContributions(recipe, resolve, 'energy_kj', .5)[1];
  assert.equal(kj.value, 40 * 4.184 * .5); assert.equal(kj.inputs[0].source, 'k');
  const carb = recipeContributions(recipe, resolve, 'carb_avail', .5)[0];
  assert.equal(carb.value, 15); assert.deepEqual(carb.inputs.map(i => i.value), [18.75, 3.75]);
  const measured = { items: [{ ref: { id: 'measured' }, g: 100 }] };
  assert.equal(recipeContributions(measured, () => ({ v: { energy_kj: 101 }, s: { energy_kj: 'u' } }), 'energy_kj')[0].formula, null);
});

test('kaynak görünümü kullanıcı metnini kaçırır, tamamı eksik veriyi sıfır olarak göstermez', () => {
  const html = renderRecipeSources(recipe, resolve, { key: 'protein', basisLabel: '<Toplam>', open: true });
  assert.match(html, /Bir &lt;besin&gt;/); assert.match(html, /Source &lt;record&gt;/);
  assert.match(html, /3\/4 malzemede veri · kısmi toplam/);
  assert.match(html, /Kullanıcının ürün etiketi/);
  const missing = renderRecipeSources(recipe, resolve, { key: 'oxalate' });
  assert.match(missing, /veri yok<\/b> · 0\/4/);
  assert.ok(!missing.includes('0 mg</b>'));
});

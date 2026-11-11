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
  assert.equal(g[0].noPlant, true); assert.equal(g[0].foods.length, 0);
  assert.deepEqual(g[1].foods.map((x) => x.f.id), ['a', 'b']); // null ve 0 önerilmez
  assert.equal(g[2].partial, true);
  assert.equal(Math.round(g[1].pct), 10);
});

test('referans yoksa öneri yok', () => {
  const r = { n: 1, v: { fe: 1 }, cov: { fe: 1 } };
  assert.deepEqual(recipeGaps(r, N, foods, () => ({ value: undefined })), []);
});

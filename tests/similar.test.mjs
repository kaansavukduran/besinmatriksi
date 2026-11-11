import test from 'node:test';
import assert from 'node:assert/strict';
import { similarFoods, profileDistance } from '../src/similar.js';

const F = (id, cat, v) => ({ id, cat, forms: [{ v }] });
const foods = [
  F('mercimek', 'baklagil', { energy: 352, protein: 25, carb_avail: 50, fat: 1, fiber: 11 }),
  F('nohut', 'baklagil', { energy: 378, protein: 20, carb_avail: 51, fat: 6, fiber: 12 }),
  F('soya', 'baklagil', { energy: 446, protein: 36, carb_avail: 21, fat: 20, fiber: 9 }),
  F('fasulye', 'baklagil', { energy: 333, protein: 24, carb_avail: 45, fat: 1, fiber: 15 }),
  F('eksik', 'baklagil', { energy: 300, protein: null, carb_avail: null, fat: null, fiber: null }),
  F('muz', 'meyve', { energy: 89, protein: 1, carb_avail: 20, fat: 0.3, fiber: 2.6 }),
];

test('aynı kategoride en yakın profil önce; eksik veri ve başka kategori dışarıda', () => {
  const s = similarFoods(foods[0], foods).map((f) => f.id);
  assert.deepEqual(s, ['fasulye', 'nohut', 'soya']);
  assert.equal(profileDistance({ energy: 1, protein: null }, { energy: 1 }), null);
  assert.equal(profileDistance(foods[0].forms[0].v, foods[0].forms[0].v), 0);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { recipeToEntries } from '../src/personal.js';

let n = 0; const id = () => 'e' + (n++);
const items = [{ ref: { t: 'c', id: 'muz', f: 0 }, g: 200 }, { ref: { t: 'c', id: 'yok', f: 0 }, g: 50 }, { ref: { t: 'c', id: 'tuz', f: 0 }, g: 1 }, { ref: { t: 'c', id: 'yulaf', f: 0 }, g: 900 }];
const exists = (r) => r.id !== 'yok';

test('porsiyona göre ölçekler, büyük miktarı böler, bulunamayan ve 1 g altını atlar', () => {
  const { entries, skipped } = recipeToEntries(items, 3, 2, '2026-11-11', exists, id);
  // muz 300, tuz 1.5, yulaf 1350 → 1000 + 350
  assert.deepEqual(entries.map((e) => [e.ref.id, e.g]), [['muz', 300], ['tuz', 1.5], ['yulaf', 1000], ['yulaf', 350]]);
  assert.equal(skipped, 1);
  assert.ok(entries.every((e) => e.day === '2026-11-11' && e.consumed === false));
  const half = recipeToEntries(items, 1, 4, '2026-11-11', exists, id);
  assert.deepEqual(half.entries.map((e) => [e.ref.id, e.g]), [['muz', 50], ['yulaf', 225]]);
  assert.equal(half.skipped, 2); // yok + tuz 0,25 g
});

test('geçersiz porsiyon veya gün hiçbir şey eklemez', () => {
  assert.equal(recipeToEntries(items, 0, 1, '2026-11-11', exists, id).entries.length, 0);
  assert.equal(recipeToEntries(items, 1, 1, '2026-13-40', exists, id).entries.length, 0);
});

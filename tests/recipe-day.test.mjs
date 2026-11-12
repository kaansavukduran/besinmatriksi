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

import { dayToRecipeItems } from '../src/personal.js';
test('günün kayıtları tarife: aynı besin birleşir, gün ve tüketildi filtresi, üst sınır sayılır', () => {
  const E = [
    { day: '2026-11-11', ref: { t: 'c', id: 'muz', f: 0 }, g: 120, consumed: true },
    { day: '2026-11-11', ref: { t: 'c', id: 'yulaf', f: 0 }, g: 600, consumed: false },
    { day: '2026-11-10', ref: { t: 'c', id: 'elma', f: 0 }, g: 100, consumed: true },
    { day: '2026-11-11', ref: { t: 'c', id: 'muz', f: 0 }, g: 80, consumed: true },
    { day: '2026-11-11', ref: { t: 'c', id: 'yulaf', f: 0 }, g: 600, consumed: true },
  ];
  const all = dayToRecipeItems(E, '2026-11-11', { newId: () => 'x' });
  assert.deepEqual(all.items.map((i) => [i.ref.id, i.g]), [['muz', 200], ['yulaf', 1000]]);
  assert.equal(all.capped, 1);
  const eaten = dayToRecipeItems(E, '2026-11-11', { consumedOnly: true, newId: () => 'x' });
  assert.deepEqual(eaten.items.map((i) => [i.ref.id, i.g]), [['muz', 200], ['yulaf', 600]]);
  assert.equal(dayToRecipeItems(E, '2026-11-12').items.length, 0);
});

import { weekSeries, shiftDay } from '../src/personal.js';
test('7 günlük seri: kayıtsız gün null, kısmi kapsam işaretli, ay geçişi doğru', () => {
  assert.equal(shiftDay('2026-03-01', -1), '2026-02-28');
  const items = { a: { v: { energy: 100 }, s: {} }, b: { v: { protein: 1 }, s: {} } };
  const resolve = (r) => items[r.id] ? { ...items[r.id], name: r.id, formLabel: '', cat: 'x', portions: [] } : null;
  const st = { entries: [
    { id: '1', day: '2026-11-12', ref: { t: 'c', id: 'a', f: 0 }, g: 200, consumed: true },
    { id: '2', day: '2026-11-12', ref: { t: 'c', id: 'b', f: 0 }, g: 50, consumed: true },
    { id: '3', day: '2026-11-10', ref: { t: 'c', id: 'a', f: 0 }, g: 100, consumed: false },
  ] };
  const s = weekSeries(st, '2026-11-12', resolve, 'energy');
  assert.equal(s.length, 7); assert.equal(s[0].day, '2026-11-06'); assert.equal(s[6].day, '2026-11-12');
  assert.equal(s[6].v, 200); assert.equal(s[6].partial, true);
  assert.equal(s[4].v, 100); assert.equal(s[4].partial, false);
  assert.equal(s[5].v, null); assert.equal(s[5].n, 0);
  assert.equal(weekSeries(st, '2026-11-12', resolve, 'energy', true)[4].v, null);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { rangeSummary, monthGrid, shiftMonth, summarize } from '../src/history.js';

const items = { a: { v: { energy: 100, protein: 10, fiber: 2 }, s: {} }, b: { v: { energy: 50 }, s: {} } };
const resolve = (r) => items[r.id] ? { ...items[r.id], name: r.id.toUpperCase(), formLabel: '', cat: 'x', portions: [] } : null;
const st = { entries: [
  { id: '1', day: '2026-11-19', ref: { t: 'c', id: 'a', f: 0 }, g: 200, consumed: true },
  { id: '2', day: '2026-11-19', ref: { t: 'c', id: 'b', f: 0 }, g: 100, consumed: true },
  { id: '3', day: '2026-11-17', ref: { t: 'c', id: 'a', f: 0 }, g: 100, consumed: false },
  { id: '4', day: '2026-11-01', ref: { t: 'c', id: 'a', f: 0 }, g: 100, consumed: true },
] };

test('B217 geçmiş özeti: kayıtsız gün 0 sayılmaz, ortalama yalnız bilinen günlerden, eksik ölçüm ≥', () => {
  const r = rangeSummary(st, '2026-11-19', 7, resolve);
  assert.equal(r.total, 7); assert.equal(r.logged, 2);
  assert.equal(r.avg.energy.value, (250 + 100) / 2); // 19: 200+50, 17: 100
  assert.equal(r.avg.energy.partial, false);
  assert.equal(r.avg.protein.value, (20 + 10) / 2);
  assert.equal(r.avg.protein.partial, true); // 19'da b'nin proteini ölçülmemiş
  assert.equal(r.days[6].v.energy, 250); assert.equal(r.days[5].v.energy, null); assert.equal(r.days[5].n, 0);
  assert.deepEqual(r.top.map((f) => [f.name, f.days, f.g]), [['A', 2, 300], ['B', 1, 100]]);
  const c = rangeSummary(st, '2026-11-19', 7, resolve, true); // yalnız tüketilenler
  assert.equal(c.logged, 1); assert.equal(c.avg.energy.value, 250);
  assert.equal(rangeSummary(st, '2026-11-19', 30, resolve).logged, 3);
  const empty = rangeSummary({ entries: [] }, '2026-11-19', 7, resolve);
  assert.equal(empty.avg.energy.value, null); assert.deepEqual(empty.top, []);
});

test('B217 ay ızgarası Pazartesi başlar, ay dışı boş; ay kaydırma yıl geçer', () => {
  const g = monthGrid(2026, 10); // Kasım 2026: 1'i Pazar
  assert.equal(g[0][6], '2026-11-01'); assert.equal(g[0][0], null);
  assert.ok(g.every((w) => w.length === 7));
  assert.equal(g.flat().filter(Boolean).length, 30);
  assert.equal(g.flat().filter(Boolean).at(-1), '2026-11-30');
  assert.equal(monthGrid(2026, 1).flat().filter(Boolean).length, 28);
  assert.equal(shiftMonth('2026-12', 1), '2027-01'); assert.equal(shiftMonth('2026-01', -1), '2025-12');
});

import { copyDayEntries } from '../src/personal.js';
test('B220 günü kopyala: yeni kimlik, hedef gün, planlandı; aynı güne kopya yok; yalnız tüketilenler süzgeci', () => {
  let n = 0; const newId = () => 'n' + (n++);
  const out = copyDayEntries(st.entries, '2026-11-19', '2026-11-20', { newId });
  assert.equal(out.length, 2);
  assert.ok(out.every((e) => e.day === '2026-11-20' && e.consumed === false && e.id.startsWith('n')));
  assert.deepEqual(out.map((e) => e.g), [200, 100]);
  assert.equal(st.entries[0].day, '2026-11-19'); // kaynak değişmez
  assert.deepEqual(copyDayEntries(st.entries, '2026-11-19', '2026-11-19'), []);
  assert.equal(copyDayEntries(st.entries, '2026-11-17', '2026-11-20', { consumedOnly: true }).length, 0);
});

import { historyCSV } from '../src/history.js';
test('B221 geçmiş CSV: BOM, ; ayraç, ondalık virgül, kayıtsız gün boş (0 değil), formül enjeksiyonu yok', () => {
  const r = rangeSummary(st, '2026-11-19', 3, resolve);
  const csv = historyCSV(r.days, resolve);
  assert.ok(csv.startsWith('﻿Tarih;Kayıt;Enerji (kcal);Protein (g)'));
  const lines = csv.slice(1).split('\r\n');
  assert.equal(lines.length, 4);
  assert.equal(lines[2], '2026-11-18;0;;;;;'); // kayıt yok: boş hücreler
  assert.match(lines[3], /^2026-11-19;2;250;20;4;protein fiber;"A 200 g; B 100 g"$/);
  const evil = historyCSV([{ day: '2026-11-19', n: 1, v: {}, partial: {}, entries: [{ ref: { id: 'x' }, g: 5 }] }], () => ({ name: '=HYPERLINK("x")' }));
  assert.ok(evil.includes(`"'=HYPERLINK(""x"") 5 g"`));
});

import { loggingStreak, periodDelta } from '../src/history.js';
test('B222 kayıt serisi ve önceki dönemle fark', () => {
  const e = (day, consumed = true) => ({ day, consumed, ref: { id: 'a' }, g: 100 });
  assert.equal(loggingStreak([e('2026-11-19'), e('2026-11-18'), e('2026-11-17'), e('2026-11-15')], '2026-11-19'), 3);
  assert.equal(loggingStreak([e('2026-11-18'), e('2026-11-17')], '2026-11-19'), 2); // bugün henüz kayıt yok: seri dünden sayılır
  assert.equal(loggingStreak([e('2026-11-16')], '2026-11-19'), 0);
  assert.equal(loggingStreak([e('2026-11-19', false)], '2026-11-19', true), 0); // yalnız tüketilenler
  assert.equal(loggingStreak([], '2026-11-19'), 0);
  const cur = rangeSummary(st, '2026-11-19', 7, resolve), prev = rangeSummary(st, '2026-11-12', 7, resolve);
  assert.equal(periodDelta(cur, prev).energy, null); // önceki 7 günde kayıt yok → fark yok (0 değil)
  const d = periodDelta(rangeSummary(st, '2026-11-19', 1, resolve), rangeSummary(st, '2026-11-18', 1, resolve));
  assert.equal(d.energy, null);
  const d2 = periodDelta(rangeSummary(st, '2026-11-19', 1, resolve), rangeSummary(st, '2026-11-17', 1, resolve));
  assert.equal(d2.energy.value, 150); // 250 − 100
});

test('B227 sık yenenlerde olağan miktar: kayıt başına ortalama, 5 g yuvarlı, en az 1 g', () => {
  const s = summarize([
    { day: 'd1', n: 2, v: {}, partial: {}, entries: [{ ref: { t: 'c', id: 'a', f: 0 }, g: 120 }, { ref: { t: 'c', id: 'a', f: 0 }, g: 80 }] },
    { day: 'd2', n: 1, v: {}, partial: {}, entries: [{ ref: { t: 'c', id: 'a', f: 0 }, g: 113 }, { ref: { t: 'c', id: 'b', f: 0 }, g: 1 }] },
  ], resolve);
  const a = s.top.find((f) => f.name === 'A'), b = s.top.find((f) => f.name === 'B');
  assert.equal(a.usual, 105); // (120 + 80 + 113) / 3 = 104,3 → 105
  assert.equal(a.days, 2);
  assert.equal(b.usual, 1); // 1 g → 0'a yuvarlanmaz
});

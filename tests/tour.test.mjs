import test from 'node:test';
import assert from 'node:assert/strict';
import { TOUR_STEPS, nextStep, tourSeen, markTourSeen } from '../src/tour.js';

test('tur adımları sınırlı; sonda biter, başta geri gitmez; görüldü bilgisi kalıcı', () => {
  assert.equal(TOUR_STEPS.length, 3);
  assert.equal(nextStep(0, -1), 0);
  assert.equal(nextStep(1, 1), 2);
  assert.equal(nextStep(2, 1), null);
  const mem = new Map(); const st = { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v) };
  assert.equal(tourSeen(st), false); markTourSeen(st); assert.equal(tourSeen(st), true);
  const broken = { getItem() { throw new Error('x'); }, setItem() { throw new Error('x'); } };
  assert.equal(tourSeen(broken), true); // depolama yoksa tur zorla gösterilmez
  assert.equal(markTourSeen(broken), false);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greetingFor, newlyReached, celebrationText } from '../src/aion-moments.js';
test('Aion saate göre selamlar (B094)', () => {
  assert.match(greetingFor(8), /Günaydın/);
  assert.match(greetingFor(13), /İyi günler/);
  assert.match(greetingFor(19), /İyi akşamlar/);
  assert.match(greetingFor(23), /İyi geceler/);
  assert.match(greetingFor(3), /İyi geceler/);
  assert.match(greetingFor(5), /Günaydın/);
});
test('Aion yalnız yeni ulaşılan hedefi kutlar; ilk bakışta kutlamaz (B094)', () => {
  assert.deepEqual(newlyReached(null, ['protein']), []);
  assert.deepEqual(newlyReached([], ['protein']), ['protein']);
  assert.deepEqual(newlyReached(['protein'], ['protein', 'fiber']), ['fiber']);
  assert.deepEqual(newlyReached(['protein'], []), []);
  assert.match(celebrationText(['protein', 'fiber']), /protein, lif hedefine ulaştın/);
  assert.equal(celebrationText(['salt']), '');
});

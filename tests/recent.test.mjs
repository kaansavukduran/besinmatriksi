import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeRecent, pushRecent, MAX_RECENT } from '../src/store.js';

test('son bakılanlar: yalnız katalog kaydı, tekrarsız, en yeni önde, sınırlı', () => {
  let l = [];
  for (let i = 0; i < 12; i++) l = pushRecent(l, { t: 'c', id: 'f' + i, f: 0 });
  assert.equal(l.length, MAX_RECENT); assert.equal(l[0].id, 'f11');
  l = pushRecent(l, { t: 'c', id: 'f5', f: 0 });
  assert.equal(l[0].id, 'f5'); assert.equal(l.filter((r) => r.id === 'f5').length, 1);
  assert.deepEqual(normalizeRecent([{ t: 'u', id: 'x' }, { t: 'c', id: 'a', f: -1 }, null, 'x', { t: 'c', id: 'b', f: 1 }]), [{ t: 'c', id: 'b', f: 1 }]);
  assert.deepEqual(normalizeRecent([{ t: 'c', id: 'gone', f: 0 }], (r) => r.id !== 'gone'), []);
  assert.deepEqual(normalizeRecent('bozuk'), []);
});

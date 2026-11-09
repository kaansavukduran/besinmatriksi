import { test } from 'node:test';
import assert from 'node:assert/strict';
import { norm } from '../src/util.js';
import { searchKey, recentSearches } from '../src/search.js';
import { normalizeProfiles, exportPayload, parseImport } from '../src/store.js';
test('Türkçe arama İ/ı, ş ve diakritiklere duyarsızdır; eş anlamlıları bulur', () => {
  assert.equal(norm('İSPaNAK ışık Şeftâli'), 'ispanak isik seftali');
  assert.ok(searchKey({ id: 'salatalik', tr: 'Salatalık', en: 'Cucumber' }).includes(norm('hıyar')));
  assert.ok(searchKey({ id: 'ahududu', tr: 'Ahududu' }).includes('frambuaz'));
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

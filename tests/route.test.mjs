import test from 'node:test';
import assert from 'node:assert/strict';
import { routeOf, parseRoute } from '../src/route.js';

test('B205 hash yönlendirmesi: gidiş-dönüş, bilinmeyen bağlantı Keşfet’e düşer', () => {
  assert.equal(routeOf('kesfet', null), '#/');
  assert.equal(routeOf('kesfet', { t: 'c', id: 'nohut', f: 0 }), '#/food/nohut');
  assert.equal(routeOf('kesfet', { t: 'c', id: 'nohut', f: 1 }), '#/food/nohut/1');
  assert.equal(routeOf('kesfet', { t: 'x', n: '11090' }), '#/usda/11090');
  assert.equal(routeOf('kesfet', { t: 'u', id: 'abc' }), '#/'); // kendi besin: cihaza özel, bağlantı yok
  assert.equal(routeOf('karsilastir', null), '#/compare');
  assert.equal(routeOf('gunluk', { t: 'c', id: 'x', f: 0 }), '#/diary');
  for (const tab of ['kesfet', 'tarif', 'gunluk', 'karsilastir', 'hakkinda', 'ayarlar']) assert.equal(parseRoute(routeOf(tab, null)).tab, tab);
  const known = (id, f) => id === 'nohut' && f <= 2;
  assert.deepEqual(parseRoute('#/food/nohut/1', known), { tab: 'kesfet', sel: { t: 'c', id: 'nohut', f: 1 } });
  assert.deepEqual(parseRoute('#/food/nohut/9', known), { tab: 'kesfet', sel: { t: 'c', id: 'nohut', f: 0 } });
  assert.deepEqual(parseRoute('#/food/yok', known), { tab: 'kesfet', sel: null });
  assert.deepEqual(parseRoute('#/usda/abc'), { tab: 'kesfet', sel: null });
  assert.deepEqual(parseRoute('#/nereye'), { tab: 'kesfet', sel: null });
  assert.deepEqual(parseRoute(''), { tab: 'kesfet', sel: null });
  assert.deepEqual(parseRoute('#/food/%E0%A4%A'), { tab: 'kesfet', sel: { t: 'c', id: '%E0%A4%A', f: 0 } }); // bozuk kodlama çökmez
});

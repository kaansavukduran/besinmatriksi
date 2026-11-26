import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { checkBundle, BUDGETS_KB } from '../scripts/check-bundle.mjs';

// B270: paket bütçesi denetimi: bütçe içinde geçer, aşılınca ve ana parça eksikse yakalar; CI derlemeden sonra çalıştırır
function fixture(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bm-bundle-'));
  fs.mkdirSync(path.join(dir, 'assets'));
  for (const [name, bytes] of Object.entries(files)) fs.writeFileSync(path.join(dir, 'assets', name), bytes);
  return dir;
}
const random = (kb) => Buffer.from(Array.from({ length: kb * 1024 }, () => Math.floor(Math.random() * 256))); // sıkışmaz

test('B270 bütçe içindeki paket geçer; toplam ilk yük hesaplanır', () => {
  const r = checkBundle(fixture({ 'index-a.js': random(10), 'catalog-b.js': random(20), 'content-c.js': random(5), 'style-d.css': random(2), 'foods-ext-e.js': random(30) }));
  assert.deepEqual(r.over, []); assert.deepEqual(r.missing, []);
  assert.ok(Math.abs(r.sizes.initial - (r.sizes.index + r.sizes.catalog + r.sizes.content + r.sizes.style)) < 1e-9);
});

test('B270 bütçeyi aşan parça ve eksik ana parça raporlanır', () => {
  const r = checkBundle(fixture({ 'index-a.js': random(BUDGETS_KB.index + 5) }));
  assert.ok(r.over.some((x) => x.startsWith('index:')));
  assert.deepEqual(r.missing, ['catalog']);
});

test('B270 CI derlemeden hemen sonra bütçeyi denetler', () => {
  const ci = fs.readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8');
  assert.match(ci, /run: npm run build\n\s+- run: node scripts\/check-bundle\.mjs dist/);
});

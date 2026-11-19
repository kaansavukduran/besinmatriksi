import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { withSettingsToc } from '../src/settings-toc.js';

test('B214 styles.css yalnız sıralı @import dizini; her modül var ve boş değil', () => {
  const index = fs.readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
  const imports = [...index.matchAll(/@import '\.\/styles\/([a-z-]+)\.css';/g)].map((m) => m[1]);
  assert.deepEqual(imports, ['tokens', 'base', 'explore', 'matrix', 'views', 'responsive', 'forms-print', 'aion-collections', 'components', 'forge-fixes']);
  assert.equal(index.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@import [^;]+;/g, '').trim(), '');
  for (const name of imports) assert.ok(fs.readFileSync(new URL(`../src/styles/${name}.css`, import.meta.url), 'utf8').trim().length > 100, name);
  assert.match(fs.readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8'), /^\/\* =+ Tema belirteçleri/); // belirteçler en önde
});

test('B212/B214 ayar içindekiler: kartlara kimlik, bilinen başlıklar gruplara, bilinmeyen "Diğer"e', () => {
  const html = withSettingsToc('<div class="settings"><p class="hint" id="settings-none"></p><section class="card"><h2>🎨 Tema</h2></section><section class="card big"><h2>Yedekleme</h2></section><div class="card"><h2>Yeni bölüm</h2></div></div>');
  assert.match(html, /<section class="card" id="set-0">\s*<h2 tabindex="-1">🎨 Tema<\/h2>/);
  assert.match(html, /id="set-2"/);
  const groups = [...html.matchAll(/class="toc-group" role="group" aria-label="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(groups, ['Görünüm ve yazı', 'Veri ve matriks', 'Diğer']);
  assert.equal((html.match(/data-action="settings-jump"/g) || []).length, 3);
});

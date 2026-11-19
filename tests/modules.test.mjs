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

test('B218 görünüm modülleri: her çağrılan ad içe aktarılmış ya da tanımlı (yorum/metin dışı)', () => {
  const globals = new Set(['String', 'Number', 'Math', 'Object', 'Array', 'JSON', 'Map', 'Set', 'Boolean', 'Date', 'Intl', 'RegExp', 'Promise', 'window', 'document', 'structuredClone', 'matchMedia', 'encodeURIComponent', 'if', 'for', 'while', 'switch', 'return', 'typeof', 'catch', 'function']);
  for (const file of ['compare.js', 'amount.js', 'common.js']) {
    let src = fs.readFileSync(new URL(`../src/views/${file}`, import.meta.url), 'utf8');
    src = src.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    // şablon metnin düz kısmını at, ${…} ifadelerini koru
    src = src.replace(/`(?:[^`\\]|\\.)*`/gs, (m) => ' ' + [...m.matchAll(/\$\{((?:[^{}]|\{[^{}]*\})*)\}/g)].map((x) => x[1]).join(' ; ') + ' ').replace(/(["'])(?:\\.|(?!\1).)*\1/g, '""');
    const known = new Set([...src.matchAll(/import \{([^}]+)\}/g)].flatMap((m) => m[1].split(',').map((x) => x.trim().split(' as ').pop())));
    for (const m of src.matchAll(/(?:function|const|let|var)\s+([A-Za-z_$][\w$]*)/g)) known.add(m[1]);
    for (const m of src.matchAll(/\(([^()]*)\)\s*=>/g)) for (const x of m[1].split(/[,{}\s=[\]]+/)) if (x) known.add(x);
    const missing = [...src.matchAll(/(?<![.\w$])([A-Za-z_$][\w$]*)\s*\(/g)].map((m) => m[1]).filter((x) => !known.has(x) && !globals.has(x) && x !== 'L');
    assert.deepEqual([...new Set(missing)], [], file);
  }
});

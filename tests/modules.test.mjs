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

const TEXT_WORDS = new Set(['CSV', 'USDA', 'NDB', 'PHE', 'FNDDS', 'SR28', 'EFSA', 'WHO', 'FAO', 'UNU', 'PDCAAS', 'DIAAS']); // iç içe şablonlardaki düz metin kelimeleri
test('B218 görünüm modülleri: her çağrılan ad içe aktarılmış ya da tanımlı (yorum/metin dışı)', () => {
  const globals = new Set(['String', 'Number', 'Math', 'Object', 'Array', 'JSON', 'Map', 'Set', 'Boolean', 'Date', 'Intl', 'RegExp', 'Promise', 'window', 'document', 'structuredClone', 'matchMedia', 'encodeURIComponent', 'setTimeout', 'if', 'for', 'while', 'switch', 'return', 'typeof', 'catch', 'function']);
  for (const file of ['compare.js', 'amount.js', 'common.js', 'ui.js', 'recipe.js']) {
    let src = fs.readFileSync(new URL(`../src/views/${file}`, import.meta.url), 'utf8');
    src = src.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    // şablon metnin düz kısmını at, ${…} ifadelerini koru
    src = src.replace(/`(?:[^`\\]|\\.)*`/gs, (m) => ' ' + [...m.matchAll(/\$\{((?:[^{}]|\{[^{}]*\})*)\}/g)].map((x) => x[1]).join(' ; ') + ' ').replace(/(["'])(?:\\.|(?!\1).)*\1/g, '""');
    const known = new Set([...src.matchAll(/import \{([^}]+)\}/g)].flatMap((m) => m[1].split(',').map((x) => x.trim().split(' as ').pop())));
    for (const m of src.matchAll(/(?:function|const|let|var)\s+([A-Za-z_$][\w$]*)/g)) known.add(m[1]);
    for (const m of src.matchAll(/\(([^()]*)\)\s*=>/g)) for (const x of m[1].split(/[,{}\s=[\]]+/)) if (x) known.add(x);
    const missing = [...src.matchAll(/(?<![.\w$])([A-Za-z_$][\w$]*)\s*\(/g)].map((m) => m[1]).filter((x) => !known.has(x) && !globals.has(x) && x !== 'L');
    // B223: büyük harfli sabitler (NUTRIENTS, SECTIONS…) çağrı olmadan da kullanılır (NUTRIENTS.map); onlar da içe aktarılmış olmalı
    const consts = [...src.matchAll(/(?<![.\w$])([A-Z][A-Z0-9_]{2,})\b/g)].map((m) => m[1]).filter((x) => !known.has(x) && !TEXT_WORDS.has(x));
    assert.deepEqual([...new Set([...missing, ...consts])], [], file);
  }
});

// B230: Günlük + Geçmiş tıklama eylemleri src/actions/day.js'te; app.js'te aynı eylemin ikinci bir "case"i kalmaz
test('B230 Günlük eylemleri ayrı modülde ve app.js ile çakışmaz', () => {
  const day = fs.readFileSync(new URL('../src/actions/day.js', import.meta.url), 'utf8');
  const app = fs.readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
  const keys = [...day.matchAll(/^  '([a-z0-9-]+)': async \(b\) =>/gm)].map((m) => m[1]);
  for (const k of ['personal-goto-day', 'personal-save', 'personal-undo', 'personal-copy-day', 'rc-to-day', 'ex-add-day', 'hist-mode', 'hist-month', 'hist-csv', 'hist-add', 'hist-open', 'week-key']) assert.ok(keys.includes(k), k);
  for (const k of keys) assert.ok(!app.includes(`case '${k}'`), `app.js hâlâ ${k} içeriyor`);
  assert.match(app, /Object\.hasOwn\(DAY_ACTIONS, a\)/);
  assert.match(app, /bindDayActions\(\{ render, persistPersonal, uiDialog, selectFood, setSetting \}\)/);
});

// B232: koleksiyon eylemleri src/actions/collections.js'te
test('B232 koleksiyon eylemleri ayrı modülde ve app.js ile çakışmaz', () => {
  const col = fs.readFileSync(new URL('../src/actions/collections.js', import.meta.url), 'utf8');
  const app = fs.readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
  const keys = [...col.matchAll(/^  '([a-z0-9-]+)': async \(b\) =>/gm)].map((m) => m[1]);
  assert.deepEqual(keys, ['col-pick', 'col-pick-close', 'col-toggle', 'col-create-add', 'col-new', 'col-sub', 'col-rename', 'col-delete', 'col-move', 'col-remove-item']);
  for (const k of keys) assert.ok(!app.includes(`case '${k}'`), `app.js hâlâ ${k} içeriyor`);
  assert.match(app, /Object\.hasOwn\(COLLECTION_ACTIONS, a\)/);
  assert.match(app, /bindCollectionActions\(\{ render, uiDialog \}\)/);
  assert.ok(!/function (collectionError|persistCollections)\b/.test(app));
});

// B235: Tarif eylemleri src/actions/recipe.js'te
test('B235 Tarif eylemleri ayrı modülde ve app.js ile çakışmaz', () => {
  const rc = fs.readFileSync(new URL('../src/actions/recipe.js', import.meta.url), 'utf8');
  const app = fs.readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
  const keys = [...rc.matchAll(/^  '([a-z0-9-]+)': async \(b\) =>/gm)].map((m) => m[1]);
  assert.deepEqual(keys.sort(), ['daily-recipe-basis', 'rc-add', 'rc-basis', 'rc-cw', 'rc-cw-clear', 'rc-cw-set', 'rc-daily-total', 'rc-del-item', 'rc-delete', 'rc-dup', 'rc-move', 'rc-new', 'rc-open', 'rc-serv']);
  for (const k of keys) assert.ok(!app.includes(`case '${k}'`), `app.js hâlâ ${k} içeriyor`);
  assert.match(app, /Object\.hasOwn\(RECIPE_ACTIONS, a\)/);
  assert.match(app, /bindRecipeActions\(\{ render, uiDialog, setSetting \}\)/);
});

// B236: seçici (pk-) ve Kıyasla (cmp-) eylemleri src/actions/pick.js'te
test('B236 seçici ve Kıyasla eylemleri ayrı modülde ve app.js ile çakışmaz', () => {
  const pk = fs.readFileSync(new URL('../src/actions/pick.js', import.meta.url), 'utf8');
  const app = fs.readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
  const keys = [...pk.matchAll(/^  '([a-z0-9-]+)': async \((b)?\) =>/gm)].map((m) => m[1]);
  for (const k of ['cmp-pick', 'cmp-add', 'cmp-del', 'cmp-sec', 'cmp-same', 'pk-close', 'pk-cat', 'pk-pick', 'pk-form', 'pk-back', 'pk-confirm', 'pk-confirm-more', 'pk-full-search', 'pk-extpage']) assert.ok(keys.includes(k), k);
  assert.equal(keys.length, 18);
  for (const k of keys) assert.ok(!app.includes(`case '${k}'`), `app.js hâlâ ${k} içeriyor`);
  assert.match(app, /bindPickActions\(\{ render, selectFood, addToRecipe, addToCompare \}\)/);
});

// B238: Ayarlar eylemleri ve ön ayarlar src/actions/settings.js'te
test('B238 Ayarlar eylemleri ayrı modülde ve app.js ile çakışmaz', async () => {
  const st = fs.readFileSync(new URL('../src/actions/settings.js', import.meta.url), 'utf8');
  const app = fs.readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
  const keys = [...st.matchAll(/^  '([a-z0-9-]+)': async \(b\) =>/gm)].map((m) => m[1]);
  assert.equal(keys.length, 20);
  for (const k of ['theme-color-save', 'target-add', 'profile-save', 'profile-apply', 'section-move', 'reset-group', 'set', 'font', 'setstep', 'preset']) assert.ok(keys.includes(k), k);
  for (const k of keys) assert.ok(!app.includes(`case '${k}'`), `app.js hâlâ ${k} içeriyor`);
  assert.ok(!app.includes('PRESETS_UI'));
  assert.match(app, /bindSettingsActions\(\{ render, uiDialog, setSetting, applySettings \}\)/);
  assert.match(st, /export const PRESETS_UI = \{\n  dyslexia:/);
});

// B239: Keşfet eylemleri src/actions/explore.js'te
test('B239 Keşfet eylemleri ayrı modülde ve app.js ile çakışmaz', () => {
  const ex = fs.readFileSync(new URL('../src/actions/explore.js', import.meta.url), 'utf8');
  const app = fs.readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
  const keys = [...ex.matchAll(/^  '([a-z0-9-]+)': async \(b\) =>/gm)].map((m) => m[1]);
  assert.equal(keys.length, 31);
  for (const k of ['ex-cat', 'ex-pick', 'ex-back', 'multi-add', 'cu-save', 'cu-delete', 'cats-toggle', 'ex-add-recipe', 'ex-add-compare', 'recent-clear']) assert.ok(keys.includes(k), k);
  for (const k of keys) assert.ok(!app.includes(`case '${k}'`), `app.js hâlâ ${k} içeriyor`);
  assert.match(app, /bindExploreActions\(\{ render, selectFood, addToRecipe, addToCompare, uiDialog, saveCustomEdit \}\)/);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { UI_EN } from '../src/i18n-ui.js';
import { L, setLanguage } from '../src/i18n.js';
import { EN_FOODS, EN_CATEGORIES, EN_FORMS } from '../src/i18n-foods.js';
import { EN_NUTRIENTS } from '../src/i18n-nutrients.js';
import { NUTRIENTS, SECTIONS, ALLERGENS } from '../src/nutrients.js';
import { AA_REF } from '../src/calc.js';

const SRC = new URL('../src/', import.meta.url);
const files = fs.readdirSync(SRC).filter(f => f.endsWith('.js')).map(f => [f, fs.readFileSync(new URL(f, SRC), 'utf8')]);

test('kaynaktaki her L("…") metninin İngilizce karşılığı var', () => {
  const missing = [];
  for (const [file, text] of files) {
    for (const m of text.matchAll(/\bL\((["'])((?:\\.|(?!\1).)*)\1/g)) {
      const key = m[1] === '"' ? JSON.parse('"' + m[2] + '"') : m[2].replace(/\\'/g, "'");
      if (!UI_EN[key]) missing.push(`${file}: ${key}`);
    }
  }
  assert.deepEqual(missing, []);
});

test('veri tarafı sabit metinlerinin İngilizcesi tam', () => {
  const data = JSON.parse(fs.readFileSync(new URL('data/foods.json', SRC)));
  for (const f of data.foods) assert.ok(EN_FOODS[f.id], 'besin adı: ' + f.id);
  for (const [id] of data.categories) assert.ok(EN_CATEGORIES[id], 'kategori: ' + id);
  for (const f of data.foods) for (const fm of f.forms) assert.ok(EN_FORMS[fm.label], 'biçim: ' + fm.label);
  for (const n of NUTRIENTS) assert.ok(EN_NUTRIENTS[n.key], 'bileşen: ' + n.key);
  for (const s of SECTIONS) assert.ok(UI_EN[s.title], 'bölüm: ' + s.title);
  for (const n of NUTRIENTS) if (n.sub) assert.ok(UI_EN[n.sub], 'alt grup: ' + n.sub);
  for (const a of Object.values(ALLERGENS)) assert.ok(UI_EN[a], 'alerjen: ' + a);
  for (const a of AA_REF) assert.ok(UI_EN[a[1]], 'amino asit: ' + a[1]);
  for (const f of data.foods) { if (f.note) assert.ok(UI_EN[f.note], 'not: ' + f.id); for (const fm of f.forms) if (fm.unavailable) assert.ok(UI_EN[fm.unavailable]); }
});

test('L() dile göre çevirir ve yer tutucuları doldurur; eksik çeviride Türkçeye düşer', () => {
  setLanguage('en');
  assert.equal(L('Tümü'), 'All');
  assert.equal(L('{n} kayıt daha var; aramayla daralt.', { n: 7 }), '7 more records; narrow them down with search.');
  assert.equal(L('Sözlükte olmayan metin'), 'Sözlükte olmayan metin');
  setLanguage('tr');
  assert.equal(L('{n} kayıt daha var; aramayla daralt.', { n: 7 }), '7 kayıt daha var; aramayla daralt.');
});

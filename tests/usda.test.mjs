import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { USDA_NUTRIENTS, unitFactor } from '../data/usda-nutrients.mjs';
import { NUTRIENTS } from '../src/nutrients.js';
test('tüm USDA kimlikleri ve birimleri özgün bileşen sözlüğüyle eşleşir', () => {
  const defs = new Map(fs.readFileSync(new URL('../data/raw/NUTR_DEF.txt', import.meta.url), 'utf8').trim().split('\n').map(l => l.split('^').map(s => s.replace(/^~|~$/g, ''))).map(f => [f[0], f]));
  for (const [key, id] of Object.entries(USDA_NUTRIENTS)) {
    assert.ok(defs.has(id), key); const n = NUTRIENTS.find(n => n.key === key); assert.ok(n, key);
    assert.ok(Number.isFinite(unitFactor(defs.get(id)[1], n.unit)), key);
  }
  assert.equal(unitFactor('g', 'mg'), 1000); assert.equal(unitFactor('mg', 'µg'), 1000);
  assert.throws(() => unitFactor('IU', 'µg'));
});
test('izomer ayrımı olmayan yağlar ve MK-4, özel izomer/toplam K2 yerine atanmaz', () => {
  assert.equal(USDA_NUTRIENTS.f18d1, undefined); assert.equal(USDA_NUTRIENTS.f18d1_c, '674');
  assert.equal(USDA_NUTRIENTS.f22d1, undefined); assert.equal(USDA_NUTRIENTS.f22d1_c, '676');
  assert.equal(USDA_NUTRIENTS.k2, undefined); assert.equal(USDA_NUTRIENTS.mk4, '428');
});

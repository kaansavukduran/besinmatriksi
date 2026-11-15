import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aminoReference, AA_DAILY } from '../src/amino-daily.js';
import { renderMatrix } from '../src/matrix.js';
import { setLanguage } from '../src/i18n.js';

test('amino daily targets use mg/kg/day, separate from mg/g protein quality scoring', () => {
  assert.equal(Object.keys(AA_DAILY).length, 9);
  assert.equal(aminoReference('leu', { age: 30, weight: 80 }).value, 3120);
  assert.equal(aminoReference('his', { age: 30, weight: 80 }).value, 800);
  assert.equal(aminoReference('trp', { age: 30, weight: 80 }).value, 320);
  assert.equal(aminoReference('protein'), null);
  assert.equal(aminoReference('his').value, 700);
  assert.equal(aminoReference('his', { weight: 80 }).personal, false);
  assert.equal(aminoReference('his', { age: 17, weight: 80 }).unavailable, true);
  assert.equal(aminoReference('his', { age: 30, weight: 80, specialContext: true }).unavailable, true);
});
test('Met/Phe are labelled contributions to joint targets, not independent requirements', () => {
  assert.equal(aminoReference('met', { age: 30, weight: 80 }).value, 1200);
  assert.equal(aminoReference('phe', { age: 30, weight: 80 }).value, 2000);
  assert.match(aminoReference('met').joint, /sistein/);
  assert.match(aminoReference('phe').joint, /tirozin/);
});
test('matrix daily bars preserve protein, measured zero, partial lower bound, and custom settings', () => {
  setLanguage('tr');
  const r = { v: { protein: 50, his: 400, leu: 0, phe: 1000 }, s: {}, cov: { protein: 2, his: 1, leu: 2, phe: 2 }, n: 2, grams: 200 };
  const html = renderMatrix(r, {}, { recipe: {}, aminoProfile: { age: 30, weight: 80 } });
  assert.match(html, /≥%50/);
  assert.match(html, /data-nutrient="leu"[\s\S]*?width:0.0%/);
  assert.match(html, /data-nutrient="protein"[\s\S]*?%100/);
  assert.match(html, /data-nutrient="phe"[\s\S]*?%50/);
  const custom = renderMatrix(r, { referenceMode: 'custom', targets: { his: 400 } }, { recipe: {} });
  assert.match(custom, /data-nutrient="his"[\s\S]*?%100/);
  assert.doesNotMatch(custom, /aa-reference/);
  assert.doesNotMatch(renderMatrix(r, { showNrv: false }, { recipe: {} }), /aa-reference/);
  const missing = renderMatrix({ ...r, v: { protein: 50 } }, {}, { recipe: {} });
  assert.doesNotMatch(missing, /data-nutrient="his"/);
});

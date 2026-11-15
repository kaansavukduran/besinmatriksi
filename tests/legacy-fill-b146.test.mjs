import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
const csv = gunzipSync(fs.readFileSync(new URL('../data/raw/USDA_SR_LEGACY_2018_B146_FILL.csv.gz', import.meta.url)));
const meta = JSON.parse(fs.readFileSync(new URL('../data/raw/USDA_SR_LEGACY_B146_SOURCE.json', import.meta.url)));
const ext = JSON.parse(fs.readFileSync(new URL('../src/data/foods-ext.json', import.meta.url)));
test('B146 analytical fill is traceable and preserves amino units and measured zero', () => {
  assert.equal(createHash('sha256').update(csv).digest('hex'), meta.csv_sha256);
  const rows = csv.toString().trim().split('\n').slice(1).map(line => line.split(','));
  assert.equal(rows.length, 315);
  assert.equal(new Set(rows.map(r => r[0])).size, 72);
  const yogurt = ext.foods.find(f => f.n === '01275');
  assert.equal(yogurt.v.his, 259); // source 0.259 g → 259 mg/100 g
  assert.equal(yogurt.v.leu, 903);
  assert.equal(yogurt.fs.his, 'L');
  const zero = rows.find(r => r[0] === '18933' && r[1] === 't3_g');
  assert.equal(Number(zero[3]), 0);
  assert.equal(ext.foods.find(f => f.n === '18933').v.t3_g, 0);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { NUTRIENTS } from '../src/nutrients.js';
import { UI_EN } from '../src/i18n-ui.js';
import { EXT_CATALOG_EN } from '../src/i18n-ext-catalog.js';

const read = p => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const curated = JSON.parse(read('../src/data/foods.json'));
const extended = JSON.parse(read('../src/data/foods-ext.json'));
const source = read('../data/raw/FOOD_DES.txt').split(/\r?\n/).filter(Boolean).map(line => {
  const fields = line.split('^').map(value => value.replace(/^~|~$/g, ''));
  return { n: fields[0], g: fields[1], en: fields[2] };
});
const byId = new Map(extended.foods.map(f => [f.n, f]));
const sourceById = new Map(source.map(f => [f.n, f]));

test('SR28 kaynak kayıtlarının tamamı küratörlü veya geniş katalogdan erişilebilir; hiçbiri sessizce filtrelenmez', () => {
  const sourceIds = new Set(source.map(f => f.n));
  const curatedIds = new Set(curated.foods.flatMap(f => f.forms.map(fm => fm.usda?.ndb)).filter(n => sourceIds.has(n)));
  const extendedIds = new Set(extended.foods.map(f => f.n));
  assert.equal(sourceIds.size, 8789);
  assert.equal(extendedIds.size, extended.foods.length, 'geniş katalogda yinelenen kaynak kimliği');
  assert.equal([...extendedIds].filter(n => curatedIds.has(n)).length, 0, 'iki listede aynı kaynak kaydı');
  assert.deepEqual([...new Set([...curatedIds, ...extendedIds])].sort(), [...sourceIds].sort());
  assert.equal(extended.meta.sourceRecords, sourceIds.size);
  assert.equal(extended.meta.curatedSourceRecords, curatedIds.size);
  assert.equal(extended.meta.extendedRecords, extendedIds.size);
  assert.equal(extended.meta.coveredSourceRecords, sourceIds.size);
  assert.equal(extended.meta.excludedSourceRecords, 0);
  assert.equal(extended.meta.sourceYear, 2015);
  assert.equal(extended.meta.dataset, 'USDA SR28');
});

test('hazır yemek, unlu mamul, gevrek, çorba ve restoran grupları dahil 25 kaynak grubu korunur', () => {
  assert.deepEqual(Object.keys(extended.groups).sort(), [...new Set(source.map(f => f.g))].sort());
  for (const label of Object.values(extended.groups)) assert.ok(UI_EN[label] || EXT_CATALOG_EN[label], label + ' İngilizce grup adı');
  for (const f of extended.foods) {
    const raw = sourceById.get(f.n);
    assert.equal(f.g, raw.g, f.n);
    assert.equal(f.en, raw.en, f.n);
  }
  assert.equal(byId.get('06001').en, 'Soup, cream of asparagus, canned, condensed');
  assert.ok(extended.foods.some(f => f.g === '1800'));
  assert.ok(extended.foods.some(f => f.g === '0800'));
  assert.ok(extended.foods.some(f => f.g === '2100'));
  assert.ok(extended.foods.some(f => f.g === '3600'));
  // Önceki filtre "prime"/"imported"/"meatless" ve alkolü de tamamen çıkarıyordu.
  for (const pattern of [/\bprime\b/i, /imported/i, /meatless/i, /alcoholic/i]) {
    assert.ok(extended.foods.some(f => pattern.test(f.en)), String(pattern));
  }
});

test('hayvansal ve belirsiz içerik ayrı durumlardır; marka kaydı veri yılıyla tanımlanır', () => {
  for (const f of extended.foods) {
    assert.ok(['animal', 'plant', 'unknown'].includes(f.diet), f.n);
    assert.equal(Boolean(f.a), f.diet === 'animal', f.n);
    if (f.branded) assert.notEqual(f.diet, 'plant', f.n + ' markalı içerik doğrulanmış bitkisel sayılmamalı');
  }
  const bar = byId.get('03000');
  assert.equal(bar.en, 'Clif Z bar');
  assert.equal(bar.branded, true);
  assert.equal(bar.diet, 'unknown');
  assert.equal(bar.a, undefined);
  assert.equal(byId.get('06001').diet, 'animal', 'kremalı çorba');
  assert.equal(byId.get('16008').diet, 'animal', 'franks içeren kuru fasulye');
  for (const n of ['11658', '11656', '20093', '11672', '14204', '43401']) assert.equal(byId.get(n).diet, 'unknown', n + ' karma ürün');
  assert.ok(extended.foods.filter(f => f.diet === 'plant').every(f => !(f.v.cholesterol > 0)), 'pozitif ölçüm bitkisel uygunluk garantisi olamaz');
  assert.ok(extended.foods.filter(f => /meatless/i.test(f.en)).every(f => f.diet === 'unknown'));
  assert.ok(extended.foods.filter(f => /cream[- ]style/i.test(f.en)).every(f => f.diet !== 'animal'), 'cream-style mısır sütlü ürünle eşitlenmemeli');
});

test('katalog büyümesi kaynak değerlerini değiştirmez; ölçülmemiş mikro besin sıfır yazılmaz', () => {
  const keys = new Set(NUTRIENTS.map(n => n.key));
  const abbrev = new Map(read('../data/raw/ABBREV.txt').split(/\r?\n/).filter(Boolean).map(line => {
    const fields = line.split('^').map(value => value.replace(/^~|~$/g, ''));
    return [fields[0], fields];
  }));
  for (const n of ['03000', '06001', '08054', '21002']) {
    const f = byId.get(n);
    assert.equal(f.v.energy, Number(abbrev.get(n)[3]), n + ' enerji');
    assert.equal(f.v.protein, Number(abbrev.get(n)[4]), n + ' protein');
  }
  assert.equal(byId.get('03000').v.iodine, undefined, 'kaynakta olmayan iyot değeri üretilmemeli');
  assert.equal(byId.get('03000').v.b12, 0, 'kaynakta ölçülmüş sıfır korunmalı');
  for (const f of extended.foods) for (const [key, value] of Object.entries(f.v)) {
    assert.ok(keys.has(key), f.n + '/' + key);
    assert.ok(Number.isFinite(value) && value >= 0, f.n + '/' + key);
  }
});

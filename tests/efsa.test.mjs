import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildEfsa } from '../scripts/build-efsa.mjs';
import { EFSA_NUTRIENTS } from '../data/efsa-nutrients.mjs';
import { NUTRIENTS } from '../src/nutrients.js';
import { normalizeSettings, referenceFor, exportSettings, parseSettings, resetSettingGroup } from '../src/settings.js';
import { matrixCSV } from '../src/export.js';
import { renderMatrix } from '../src/matrix.js';

const built = buildEfsa();
const source = JSON.parse(fs.readFileSync(new URL('../data/references/EFSA_DRV_FINDER_2026-11-09.json', import.meta.url)));
const nutrient = key => NUTRIENTS.find(n => n.key === key);
const config = (options = {}) => normalizeSettings({ referenceMode: 'efsa', efsaSex: 'male', efsaAge: 25, ...options });
const ref = (key, options) => referenceFor(nutrient(key), config(options));

test('EFSA derlemesi özgün satır/birim/tür/yıl ve lisans özetiyle yeniden üretilir', () => {
  assert.deepEqual(JSON.parse(fs.readFileSync(new URL('../src/data/efsa.json', import.meta.url))), built);
  assert.equal(built.records.length, 169); assert.equal(built.meta.mappedNutrients, 23);
  for (const row of built.records) {
    const raw = source[row.row - 1], map = EFSA_NUTRIENTS[raw.Name], field = row.kind === 'PRI' ? 'PRIs' : 'AIs';
    assert.ok(['PRI', 'AI'].includes(row.kind));
    assert.ok(['Adults', 'Children'].includes(raw['Target population']));
    assert.equal(raw['Age Unit'], 'y'); assert.equal(row.sourceValue, raw[field]);
    assert.equal(row.sourceUnit, raw[field + ' Unit']); assert.equal(row.value, raw[field] * map[2]);
    assert.equal(row.unit, nutrient(row.key).unit); assert.equal(row.year, Number(row.doi.match(/efsa\.(\d{4})/)[1]));
    assert.ok(row.year >= 2010 && row.year <= 2026); assert.ok(!('UL' in row));
  }
});

test('EFSA yaş sınırları, cinsiyet grupları ve mikrogram dönüşümü kaynak değerleriyle eşleşir', () => {
  assert.equal(ref('ca', { efsaAge: 24 }).value, 1000);
  assert.equal(ref('ca', { efsaAge: 25 }).value, 950);
  assert.equal(ref('ca', { efsaAge: 10 }).value, 800);
  assert.equal(ref('ca', { efsaAge: 11 }).value, 1150);
  assert.equal(ref('mg').value, 350); assert.equal(ref('mg', { efsaSex: 'female' }).value, 300);
  assert.equal(ref('fe', { efsaAge: 17, efsaSex: 'female' }).value, 13);
  assert.equal(ref('fe', { efsaAge: 17 }).value, 11);
  assert.equal(ref('fluoride').value, 3400); assert.equal(ref('fluoride').sourceUnit, 'mg/day');
  assert.equal(ref('ca', { efsaAge: 99 }).value, 950);
});

test('PRI/AI, besin biçimleri ve kapsam dışı referanslar karıştırılmaz', () => {
  assert.equal(ref('ca').type, 'PRI'); assert.equal(ref('b12').type, 'AI');
  assert.equal(ref('b12').value, 4); assert.equal(ref('vitd').value, 15);
  assert.match(ref('vitd').note, /deri yoluyla/); assert.match(ref('vitk').note, /Yalnız filokinon/);
  assert.equal(ref('folate_dfe').value, 330); assert.equal(ref('folate').value, undefined);
  for (const key of ['energy', 'energy_kj', 'protein', 'water', 'na', 'salt', 'vita_rae', 'niacin', 'thiamin', 'k2', 'ala_fa']) assert.equal(ref(key).value, undefined, key);
  assert.equal(ref('vite').value, 13); assert.equal(ref('toc_g').value, undefined);
  assert.equal(ref('ca', { efsaSex: 'unspecified' }).value, undefined);
});

test('yetişkin demir ve çinko koşulları örtüşen yaşta bile otomatik varsayılmaz', () => {
  assert.equal(ref('zn').value, undefined);
  assert.deepEqual(['300', '600', '900', '1200'].map(efsaPhytate => ref('zn', { efsaPhytate }).value), [9.4, 11.7, 14, 16.3]);
  assert.equal(ref('zn', { efsaSex: 'female', efsaPhytate: '600' }).value, 9.3);
  assert.equal(ref('zn', { efsaAge: 10 }).value, 7.4);
  const female = { efsaSex: 'female', efsaAge: 45 };
  assert.equal(ref('fe', female).value, undefined);
  assert.equal(ref('fe', { ...female, efsaIronGroup: 'pre' }).value, 16);
  assert.equal(ref('fe', { ...female, efsaIronGroup: 'post' }).value, 11);
  assert.equal(ref('fe', { efsaSex: 'female', efsaAge: 25, efsaIronGroup: 'post' }).value, undefined);
  assert.equal(ref('fe', { efsaSex: 'female', efsaAge: 60, efsaIronGroup: 'pre' }).value, undefined);
});

test('eski ayarlara güvenli varsayılan eklenir; kişisel hedefler geçiş/yedek/sıfırlamada korunur', () => {
  const old = normalizeSettings({ targets: { protein: 80 }, referenceMode: 'custom' });
  assert.equal(old.efsaSex, 'unspecified'); assert.equal(old.efsaAge, 25);
  const selected = config({ targets: old.targets, efsaSex: 'female', efsaAge: 45, efsaPhytate: '900', efsaIronGroup: 'pre' });
  assert.deepEqual(parseSettings(exportSettings(selected)), selected);
  assert.equal(referenceFor(nutrient('protein'), { ...selected, referenceMode: 'custom' }).value, 80);
  assert.deepEqual(resetSettingGroup(selected, 'reading').targets, { protein: 80 });
  for (const efsaAge of [-1, 0, 100, Infinity, 1.2, '25']) assert.equal(config({ efsaAge }).efsaAge, 25);
  assert.equal(config({ efsaPhytate: '700', efsaIronGroup: '<script>', efsaSex: 'all' }).efsaPhytate, '');
});

test('EFSA matris ve CSV kaynak/tür/yılı taşır; eksik gıda veya referanstan yüzde üretilmez', () => {
  const cfg = config(), result = { v: { ca: 95, b12: 2, na: 20, folate_dfe: 33 }, s: { ca: 'u', b12: 'u', na: 'u', folate_dfe: 'u' }, n: 1, grams: 100 };
  const html = renderMatrix(result, cfg, { recipe: { name: 'Test' }, basisLabel: 'Toplam' });
  assert.match(html, /ref-kind">PRI/); assert.match(html, /ref-kind">AI/);
  assert.match(html, /EFSA 2015/); assert.match(html, /DRV Finder/);
  const csv = matrixCSV(result, 'Test', cfg);
  assert.match(csv, /%EFSA \(PRI\/AI\)/); assert.match(csv, /Kalsiyum \(Ca\);95;mg;10;USDA SR28;;PRI;950;mg\/gün;2015;/);
  assert.match(csv, /B12.*;2;µg;50;USDA SR28;;AI;4;µg\/gün;2015;/);
  assert.match(csv, /Sodyum \(Na\);20;mg;;USDA SR28;;;;;/);
  const absent = matrixCSV({ v: {}, s: {}, n: 1 }, 'Eksik', cfg);
  assert.match(absent, /Kalsiyum \(Ca\);veri yok;mg;;;;PRI;950/);
});

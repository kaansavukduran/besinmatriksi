import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { decodeDB } from '../src/foods-codec.js';
import { volumeDensity, amountUnitText } from '../src/amount-scale.js';
import { renderMatrix, sourceRecordId } from '../src/matrix.js';
import { scaleItem } from '../src/calc.js';
import { fmtNum } from '../src/util.js';
import { DEFAULT_SETTINGS } from '../src/store.js';

const DB = decodeDB(JSON.parse(fs.readFileSync(new URL('../src/data/foods.json', import.meta.url), 'utf8')));
function resolveLocal(id, fi = 0) {
  const food = DB.foods.find((f) => f.id === id);
  const form = food.forms[fi];
  const liquid = ['icecek', 'demleme', 'suyu', 'yag'].includes(form.key);
  return {
    food, form, name: food.tr, formLabel: form.label, cat: food.cat, liquid,
    density: liquid ? volumeDensity(form.portions) : null, customLiquid: false,
    v: form.v, s: form.s, alt: {}, sd: {}, portions: form.portions || [],
    allergens: food.allergens, usda: form.usda, cofid: form.cofid || null,
  };
}

test('B252-A: sıvılarda yoğunluk olmadan g ≈ mL varsayımı yapılmaz; yağ yoğunluğu USDA hacim ölçüsünden hesaplanır', () => {
  const oil = resolveLocal('zeytinyagi', 0);
  assert.ok(oil.density && oil.density.gPerMl > 0.88 && oil.density.gPerMl < 0.95, `zeytinyağı yoğunluğu: ${oil.density?.gPerMl}`);
  const oilUnit = amountUnitText(100, { density: oil.density, format: fmtNum });
  assert.doesNotMatch(oilUnit, /g ≈ mL/);
  assert.match(oilUnit, /≈ 109|≈ 110/); // 100 / 0.913 ≈ 109,5 mL

  // Yoğunluk ölçüsü olmayan sıvı (porsiyonsuz sıvı / pekmez) yalnız gram gösterir
  assert.equal(volumeDensity([]), null);
  assert.equal(amountUnitText(100, { density: null, format: fmtNum }), 'g');
  // Kullanıcının 100 mL etiketiyle girdiği özel besin doğrudan mL gösterir
  assert.equal(amountUnitText(100, { customLiquid: true, format: fmtNum }), 'mL');
  // Zeytinyağı kimlik kartında "yoğunluk ≈ 1" yazmaz
  const html = renderMatrix(scaleItem(oil, 100), DEFAULT_SETTINGS, { item: oil });
  assert.doesNotMatch(html, /yoğunluk ≈ 1/);
  assert.match(html, /g\/mL/);
});

test('B252-C: yalnız FDC Foundation kayıtlarında "NDB undefined" üretilmez; kaynak kimliği görünür metinde yer alır', () => {
  for (const id of ['aslan_yelesi', 'siyah_pirinc']) {
    const item = resolveLocal(id, 0);
    assert.ok(item && item.usda?.fdc, `${id} FDC kaydı olmalı`);
    assert.equal(sourceRecordId('F', item), `FDC ${item.usda.fdc}`);
    const html = renderMatrix(scaleItem(item, 100), DEFAULT_SETTINGS, { item });
    assert.doesNotMatch(html, /NDB undefined/);
    assert.match(html, new RegExp(`FDC ${item.usda.fdc}`));
  }
});

test('B252-D: meta gerçek tarif tahmini, varsayılan sıfır ve CoFID hücre sayılarını ayrı bildirir', () => {
  assert.equal(DB.meta.ifctLinked, 0);
  assert.equal(DB.meta.estimated, 0);
  assert.ok(DB.meta.recipeEstimatedForms >= 120, `recipeEstimatedForms=${DB.meta.recipeEstimatedForms}`);
  assert.ok(DB.meta.recipeEstimatedCells >= 7000, `recipeEstimatedCells=${DB.meta.recipeEstimatedCells}`);
  assert.ok(DB.meta.assumedZeroCells >= 5000, `assumedZeroCells=${DB.meta.assumedZeroCells}`);
  assert.ok(DB.meta.cofidFilledCells >= 120, `cofidFilledCells=${DB.meta.cofidFilledCells}`);
  assert.equal(DB.meta.unavailableForms, 33); // B266: Matvaretabellen beluga ve psyllium
});

test('B254: siyah pirinç USDA Foundation 2710825 ile, elma/domates/patates/kabak/yulaf/hurma UK CoFID 2021 ile doğrulandı', () => {
  const blackRice = DB.foods.find((f) => f.id === 'siyah_pirinc').forms[0];
  assert.equal(blackRice.unavailable, undefined);
  assert.equal(blackRice.usda.fdc, 2710825);
  assert.equal(blackRice.v.energy, 370);
  assert.equal(blackRice.v.protein, 7.57);
  assert.equal(blackRice.v.biotin, 4.88);
  assert.equal(blackRice.s.energy, 'F');

  const apple = DB.foods.find((f) => f.id === 'elma').forms[0];
  assert.equal(apple.v.biotin, 1.1);
  assert.equal(apple.s.biotin, 'B');
  assert.equal(apple.cofid, '14-319');

  const oats = DB.foods.find((f) => f.id === 'yulaf').forms[0];
  assert.equal(oats.v.biotin, 19);
  assert.equal(oats.s.biotin, 'B');

  const dates = DB.foods.find((f) => f.id === 'hurma').forms[0];
  assert.equal(dates.v.iodine, 17);
  assert.equal(dates.s.iodine, 'B');
});

test('B252-F: oksalat/kalsiyum hazırlama notu kesin emilim iddiası taşımaz', () => {
  const r = { n: 1, grams: 100, v: { ca: 100, oxalate: 500 }, s: { ca: 'u', oxalate: 'F' } };
  const html = renderMatrix(r, DEFAULT_SETTINGS, { item: { name: 'Ispanak', formLabel: 'Çiğ', cat: 'yesil' } });
  assert.doesNotMatch(html, /kalsiyumun emilimi düşüktür/);
  assert.match(html, /emilimini azaltabilir/);
});

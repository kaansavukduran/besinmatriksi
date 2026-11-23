import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { micronutrientSummary, renderMicronutrients } from '../src/micronutrients.js';
import { MICRO_EN } from '../src/i18n-micro.js';
import { UI_EN } from '../src/i18n-ui.js';
import { setLanguage, registerUiEn } from '../src/i18n.js';
import { configureFormatting } from '../src/util.js';

// Uygulama i18n-ui.js üzerinden bu sözlüğü kaydeder; izole bileşen testinde aynı kaynak kullanılır.
Object.assign(UI_EN, MICRO_EN);
registerUiEn(UI_EN);
afterEach(() => { setLanguage('tr'); configureFormatting({ decimalSeparator: 'comma', autoUnits: true }); });
const find = (summary, key) => summary.groups.flatMap(group => group.rows).find(row => row.key === key);

test('mikro görünüm eksik, kayıtlı sıfır ve referansı olmayan ölçümü ayrı tutar', () => {
  const r = { n: 1, v: { b12: 0, choline: 5, vitc: 40 }, s: { b12: 'u', choline: 'u', vitc: 'u' } };
  const before = structuredClone(r);
  const summary = micronutrientSummary(r);
  assert.equal(summary.total, 29); assert.equal(summary.known, 3); assert.equal(summary.missing, 26);
  assert.equal(find(summary, 'b12').reportedZero, true);
  assert.equal(find(summary, 'b12').percent, 0);
  assert.equal(find(summary, 'iodine').value, null); assert.equal(find(summary, 'iodine').percent, null);
  assert.equal(find(summary, 'choline').value, 5); assert.equal(find(summary, 'choline').referenceValue, null);
  assert.equal(find(summary, 'vitc').percent, 50);
  const html = renderMicronutrients(r);
  assert.match(html, /data-micro="b12"[^>]*>[\s\S]*?0 µg/);
  assert.match(html, /Kayıtlı değer 0/); assert.match(html, /3\/29 mikro besinde veri/);
  assert.match(html, /data-micro="iodine" data-micro-status="missing"/);
  assert.match(html, /Referans yok/);
  assert.deepEqual(r, before);
});

test('klorürün 800 mg etiket referansı ve USDA varsayılan sıfırı ayrı gösterilir', () => {
  const r = { n: 1, v: { chloride: 80, b12: 0 }, s: { chloride: 'B', b12: 'z' } };
  const row = find(micronutrientSummary(r), 'chloride');
  assert.equal(row.referenceValue, 800);
  assert.equal(row.percent, 10);
  const html = renderMicronutrients(r);
  assert.match(html, /Klorür/);
  assert.match(html, /Varsayılan 0/);
  assert.doesNotMatch(html, /Kayıtlı değer 0/);
});

test('mikro kısmi tarif bilinen toplamı ve yüzdeyi alt sınır olarak gösterir', () => {
  const r = { n: 3, v: { vitc: 40, fe: 14, b12: 0 }, s: { vitc: 'm', fe: 'u', b12: 'r' }, cov: { vitc: 2, fe: 3, b12: 1 } };
  const summary = micronutrientSummary(r);
  assert.equal(summary.partial, 2); assert.equal(summary.complete, 1);
  assert.equal(find(summary, 'vitc').contributors, 2);
  assert.equal(find(summary, 'fe').partial, false);
  const html = renderMicronutrients(r);
  assert.match(html, /≥ 40 mg/); assert.match(html, /≥ %50/);
  assert.match(html, /Kısmi toplam · 2\/3 malzemede veri/);
  assert.match(html, /data-micro="b12" data-micro-status="partial"/);
  assert.match(html, /≥ 0 µg/);
});

test('boş veya kapsamı doğrulanamayan tarif sıfır barı veya kesin yüzde üretmez', () => {
  const empty = micronutrientSummary({ n: 0, v: { vitc: 40 }, s: { vitc: 'u' } });
  assert.equal(empty.known, 0); assert.equal(find(empty, 'vitc').value, null);
  assert.doesNotMatch(renderMicronutrients({ n: 0, v: {} }), /class="micro-track"/);
  const unverified = micronutrientSummary({ n: 2, v: { vitc: 40 }, s: { vitc: 'u' } });
  assert.equal(find(unverified, 'vitc').status, 'unverified');
  assert.equal(find(unverified, 'vitc').percent, null);
  assert.match(renderMicronutrients({ n: 2, v: { vitc: 40 }, s: { vitc: 'u' } }), /Yüzde hesaplanmadı/);
  const invalid = micronutrientSummary({ n: 2, v: { vitc: 40, ca: Infinity, fe: -5 }, s: {}, cov: { vitc: 0, ca: 2, fe: 2 } });
  assert.equal(invalid.known, 0);
});

test('hedef ve görünüm aynı kaynak sahibini kullanır; µg ile mg karışmaz', () => {
  const r = { n: 1, v: { vitc: 40, b12: 5, vita_rae: 200, folate: 100, folate_dfe: 900, vitk: 3, k2: 700 }, s: {} };
  const custom = micronutrientSummary(r, { referenceMode: 'custom', targets: { vitc: 100, b12: 10, vita_rae: 400 } });
  assert.equal(find(custom, 'vitc').percent, 40);
  assert.equal(find(custom, 'b12').percent, 50);
  assert.equal(find(custom, 'folate').value, 100);
  assert.equal(find(custom, 'vitk').value, 3);
  assert.equal(find(custom, 'vita_rae').percent, 50, 'elle girilen RAE hedefi aynı birimdedir');
  assert.equal(find(micronutrientSummary(r), 'vita_rae').percent, null, 'AB RE referansı RAE ölçümüne eşitlenmez');
  assert.match(renderMicronutrients(r), /RAE, AB etiketindeki RE/);
  assert.equal(find(custom, 'folate_dfe'), undefined);
  assert.equal(find(custom, 'k2'), undefined);
  assert.equal(find(micronutrientSummary(r, { showNrv: false }), 'vitc').percent, null);
  const noReference = micronutrientSummary(r, { referenceMode: 'efsa', efsaSex: 'unspecified' });
  assert.equal(find(noReference, 'vitc').referenceValue, null);
  const tooSmall = micronutrientSummary(r, { referenceMode: 'custom', targets: { vitc: Number.MIN_VALUE } });
  assert.equal(find(tooSmall, 'vitc').percent, null);
  assert.doesNotMatch(renderMicronutrients(r, { referenceMode: 'custom', targets: { vitc: Number.MIN_VALUE } }), /Infinity|NaN/);
});

test('gizlenen mikro bölümler özette de gizlidir; kaynak etiketi veri türünü söyler', () => {
  const r = { n: 1, v: { b12: 5, vitc: 40, ca: 800 }, s: { b12: 'k', vitc: 'r', ca: 'u' } };
  const hidden = micronutrientSummary(r, { hiddenSections: ['vitamin'] });
  assert.equal(hidden.total, 15); assert.equal(hidden.groups.length, 1);
  assert.equal(find(hidden, 'b12'), undefined);
  assert.equal(renderMicronutrients(r, { hiddenSections: ['vitamin', 'mineral'] }), '');
  const html = renderMicronutrients(r, { hiddenSections: ['mineral'] }, { open: false });
  assert.match(html, /Kullanıcının ürün etiketi/); assert.match(html, /Tahmin \(tarif\)/);
  assert.doesNotMatch(html, /data-reference="true" open/);
});

test('mikro etiketler ve yüzde biçimi seçili dilde; bilinmeyen kaynak metni HTML olarak basılmaz', () => {
  setLanguage('en'); configureFormatting({ decimalSeparator: 'auto', autoUnits: true });
  const html = renderMicronutrients({ n: 1, v: { vitc: 40, ca: 400 }, s: { vitc: '<script>alert(1)</script>', ca: 'u' } });
  assert.match(html, /Vitamins and minerals/); assert.match(html, /Vitamin C/);
  assert.match(html, /50%/); assert.match(html, /2\/29 micronutrients with data/);
  assert.doesNotMatch(html, /<script>/);
});

test('katkı akışı yalnız tarif/günlük bağlamında gerçek düğme sunar; tek besinde salt okunur', () => {
  const r = { n: 1, v: { vitc: 40 }, s: { vitc: 'u' } };
  assert.doesNotMatch(renderMicronutrients(r), /data-action="micro-source"/);
  assert.doesNotMatch(renderMicronutrients(r, {}, { contributions: 'other' }), /data-action="micro-source"/);
  for (const contributions of ['recipe', 'day']) {
    const html = renderMicronutrients(r, {}, { contributions });
    assert.match(html, /<button type="button" class="micro-name" data-action="micro-source" data-key="vitc" aria-label="C vitamini \(askorbik asit\): katkı veren besinleri göster">/);
    assert.match(html, /data-key="iodine"/, 'eksik bileşenin de kaynak açıklaması açılabilir');
  }
  setLanguage('en');
  const english = renderMicronutrients(r, {}, { contributions: 'recipe' });
  assert.match(english, /Vitamin C \(ascorbic acid\): show contributing foods/);
});

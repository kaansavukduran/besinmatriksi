import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { NUTRIENTS } from '../src/nutrients.js';
import { scaleItem, aggregate, derive } from '../src/calc.js';

const DB = JSON.parse(fs.readFileSync(new URL('../src/data/foods.json', import.meta.url)));
const keys = new Set(NUTRIENTS.map((n) => n.key));
const form = (id, i = 0) => {
  const f = DB.foods.find((x) => x.id === id).forms[i];
  return { v: f.v, s: f.s, alt: f.alt || {}, sd: f.sd || {} };
};

test('her formun doğrulanmış değerleri veya açık kaynak boşluğu var', () => {
  for (const f of DB.foods) {
    assert.ok(f.forms.length > 0, f.id);
    for (const fm of f.forms) {
      if (fm.unavailable) assert.deepEqual(fm.v, {});
      else assert.ok(fm.v.energy != null && fm.v.protein != null, `${f.id}/${fm.key}`);
      for (const k of Object.keys(fm.v)) assert.ok(keys.has(k), `bilinmeyen anahtar ${k}`);
      for (const [k, s] of Object.entries(fm.s)) assert.ok(['u', 'f', 'y', 'F'].includes(s), `${f.id} ${k} ${s}`);
    }
  }
});

test('makro toplamı 100 g\'ı geçmez (ölçüm toleransı %3)', () => {
  for (const f of DB.foods) for (const fm of f.forms) {
    const { water = 0, protein = 0, fat = 0, carb = 0, ash = 0 } = fm.v;
    assert.ok(water + protein + fat + carb + ash < 103, `${f.id}/${fm.key}: ${water + protein + fat + carb + ash}`);
  }
});

test('USDA referans değerleri: çiğ muz (NDB 09040)', () => {
  const b = form('muz');
  assert.equal(b.v.energy, 89);
  assert.equal(b.v.k, 358);
  assert.equal(b.s.k, 'u');
});

test('USDA amino asit dönüşümü: kuru mercimekte lizin 1,720 g = 1720 mg', () => {
  const l = form('yesil_mercimek', 0);
  assert.equal(l.v.lys, 1720);
  assert.equal(l.s.lys, 'u');
});

test('pişmiş mercimeğin kendi USDA amino asit kaydı kullanılır; profil tahmini yok', () => {
  const cooked = form('yesil_mercimek', 1);
  assert.equal(cooked.s.lys, 'u'); assert.equal(cooked.v.lys, 630);
  assert.equal(cooked.v.phytate, undefined, 'fitat verisi uydurulmamalı');
});

test('ölçekleme doğrusal ve eksik veri 0 sayılmaz', () => {
  const s = scaleItem(form('muz'), 250);
  assert.ok(Math.abs(s.v.k - 895) < 1e-9);
  assert.equal(s.v.b12 === undefined || s.v.b12 === 0, true);
  assert.ok(Math.abs(s.v.salt - (s.v.na * 2.5) / 1000) < 1e-12);
});

test('tarif toplamı ve kısmi kapsam', () => {
  const a = scaleItem(form('yesil_mercimek', 0), 100);
  const b = scaleItem(form('yabanmersini', 1), 100);
  const agg = aggregate([a, b]);
  assert.ok(Math.abs(agg.v.energy - (a.v.energy + b.v.energy)) < 1e-9);
  assert.equal(agg.cov.lys, 1);
  assert.equal(agg.n, 2);
});

test('ölçülmeyen oksalat oranı üretilmez; USDA amino asit skoru hesaplanır', () => {
  const sp = derive(scaleItem(form('ispanak', 0), 100));
  assert.equal(sp.oxCa, undefined);
  const le = derive(scaleItem(form('yesil_mercimek', 0), 100));
  assert.ok(le.aas && le.aas.raw > 50 && le.aas.raw < 150);
  assert.equal(le.aas.limiting, 'Met + Sis');
});

test('hayvansal kayıtlar yalnız hayvansal kategorilerde ve işaretli; bitkisel kayıtlarda hayvansal USDA verisi yok', () => {
  const bad = /\b(milk|cheese|egg|honey|beef|chicken|fish|butter|ghee|yogurt|lamb|turkey|cream|shrimp|mussel|tuna|salmon)\b/i;
  const animalCats = new Set(DB.animalCategories);
  assert.deepEqual([...animalCats].sort(), ['balik', 'et', 'kumes', 'sut', 'yumurta']);
  let animals = 0;
  for (const f of DB.foods) {
    if (animalCats.has(f.cat)) assert.equal(f.animal, true, f.id);
    if (f.animal) { animals++; continue; }
    for (const fm of f.forms) if (fm.usda) assert.ok(!bad.test(fm.usda.desc.replace(/peanut butter|sesame butter|soymilk|almond milk|rice milk|coconut milk|coconut cream|cocoa butter|butternut|butterhead/gi, '')), fm.usda.desc);
  }
  assert.ok(animals >= 30);
  assert.equal(DB.foods.find((f) => f.id === 'bal').animal, true);
  assert.equal(DB.foods.find((f) => f.id === 'kirmizi_mercimek').animal, false);
});

test('dağıtımda IFCT değerleri, alternatifleri ve bunlardan tahminler bulunmaz', () => {
  assert.equal(DB.meta.ifctLinked, 0); assert.equal(DB.meta.estimated, 0);
  for (const food of DB.foods) for (const f of food.forms) {
    assert.equal(f.ifct, null); assert.equal(f.estFrom, null);
    assert.deepEqual(f.alt || {}, {}); assert.deepEqual(f.sd || {}, {});
    assert.ok(Object.values(f.s).every(s => ['u', 'f', 'y', 'F'].includes(s)));
  }
  assert.equal(fs.existsSync(new URL('../data/raw/IFCT2017.csv', import.meta.url)), false);
});

test('kategori içi yaygınlık sırası ve az bilinen besin işareti (B087)', async () => {
  const { POPULAR, NICHE } = await import('../data/popularity.mjs');
  const ids = (cat) => DB.foods.filter((f) => f.cat === cat).map((f) => f.id);
  assert.deepEqual(ids('meyve').slice(0, 4), ['elma', 'muz', 'portakal', 'mandalina']);
  assert.equal(ids('baklagil')[0], 'kirmizi_mercimek');
  assert.equal(ids('sebze')[0], 'domates');
  for (const [cat, list] of Object.entries(POPULAR)) for (const id of list) assert.equal(DB.foods.find((f) => f.id === id)?.cat, cat, id);
  for (const id of NICHE) assert.equal(DB.foods.find((f) => f.id === id)?.niche, true, id);
  assert.equal(DB.foods.find((f) => f.id === 'elma').niche, undefined);
});

test('Türk ölçüleri USDA hacim ölçüsünden hesaplanır ve işaretlidir (B092)', async () => {
  const form = (id) => DB.foods.find((f) => f.id === id).forms[0];
  const p = form('nohut').portions;
  const su = p.find((x) => x.d && x.label.startsWith('1 su bardağı (200 ml)'));
  const cup = p.find((x) => /^1 cup/.test(x.en));
  assert.ok(su && cup);
  assert.ok(Math.abs(su.g - cup.g * 200 / 236.6) < 0.2, `${su.g} vs ${cup.g}`);
  assert.equal(su.src, '1 cup');
  const water = form('su').portions.find((x) => x.d && x.label.startsWith('1 su bardağı'));
  assert.ok(water.g > 195 && water.g < 205);
  // ölçüsü olmayan besinde uydurma ölçü yok
  assert.ok(form('beyaz_ekmek').portions.every((x) => !x.d));
});

test('USDA flavonoid/izoflavon verisi aynı NDB kaydından gelir, etiketlidir ve ölçülmeyen yazılmaz (B100)', () => {
  const form = (id, key) => DB.foods.find((f) => f.id === id).forms.find((x) => x.key === key);
  const onion = form('sogan', 'cig');
  assert.equal(onion.v.quercetin, 20.3); assert.equal(onion.s.quercetin, 'f');
  const orange = form('portakal', 'cig');
  assert.ok(orange.v.hesperetin > 20); assert.equal(orange.s.hesperetin, 'f');
  assert.ok(!('cyanidin' in orange.v), 'portakalda ölçülmeyen antosiyanidin yazılmaz');
  for (const food of DB.foods) for (const f of food.forms) for (const [k, s] of Object.entries(f.s)) if (s !== 'u') assert.ok(f.usda?.ndb, `${food.id}/${f.key}/${k}: NDB olmadan flavonoid yok`);
  const src = JSON.parse(fs.readFileSync(new URL('../data/raw/USDA_FLAVONOID_SOURCES.json', import.meta.url)));
  assert.equal(src.datasets.length, 2); assert.match(src.datasets[0].license, /CC0/);
});
test('USDA FoodData Central Foundation Foods yalnız SR28 boşluklarını doldurur, F etiketli ve FDC kimliği taşır (B111)', () => {
  const form = (id, key) => DB.foods.find((f) => f.id === id).forms.find((x) => x.key === key);
  const oj = form('portakal', 'suyu');
  assert.equal(oj.s.citric, 'F'); assert.ok(oj.v.citric > 500); assert.ok(oj.usda.fdc > 0);
  // SR28'de ölçülmüş değerler ezilmez
  for (const f of DB.foods) for (const fm of f.forms) for (const [k, s] of Object.entries(fm.s)) if (s === 'F') assert.ok(fm.usda?.fdc, `${f.id}/${fm.key}/${k}`);
  assert.equal(oj.s.energy, 'u');
  const src = JSON.parse(fs.readFileSync(new URL('../data/raw/USDA_FDC_FOUNDATION_SOURCE.json', import.meta.url)));
  assert.match(src.license, /CC0/);
});

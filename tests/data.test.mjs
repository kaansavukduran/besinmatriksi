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
      else if (fm.computed) assert.ok(Object.values(fm.s).every((x) => x === 'd'), `${f.id}/${fm.key}`);
      else assert.ok(fm.v.energy != null && fm.v.protein != null, `${f.id}/${fm.key}`);
      for (const k of Object.keys(fm.v)) assert.ok(keys.has(k), `bilinmeyen anahtar ${k}`);
      for (const [k, s] of Object.entries(fm.s)) assert.ok(['u', 'f', 'y', 'F', 'N', 'd', 'r', 'L', 'I', 'C', 'P'].includes(s), `${f.id} ${k} ${s}`);
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
    for (const fm of f.forms) if (fm.usda) assert.ok(!bad.test(fm.usda.desc.replace(/peanut butter|sesame butter|soymilk|almond milk|rice milk|coconut milk|coconut cream|cocoa butter|butternut|butterhead|non-dairy milk|almond butter|cashew butter|sunflower seed butter|oat milk|yogurt, soy|yogurt, coconut milk|yogurt, almond milk/gi, '')), fm.usda.desc);
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
    assert.ok(Object.values(f.s).every(s => ['u', 'f', 'y', 'F', 'N', 'd', 'r', 'L', 'I', 'C', 'P'].includes(s)));
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
  for (const food of DB.foods) for (const f of food.forms) for (const [k, s] of Object.entries(f.s)) if (s !== 'u' && s !== 'd' && s !== 'r') assert.ok(f.usda?.ndb || f.usda?.fndds || f.usda?.fdc, `${food.id}/${f.key}/${k}: NDB olmadan flavonoid yok`);
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

test('USDA FNDDS hazır içecekler: Türk kahvesi ve bitkisel sütlü latte N etiketli, FNDDS kodlu (B117)', () => {
  const tk = DB.foods.find((f) => f.id === 'turk_kahvesi').forms[0];
  assert.equal(tk.usda.fndds, '92101600'); assert.equal(tk.s.energy, 'N'); assert.equal(tk.v.energy, 27);
  const am = DB.foods.find((f) => f.id === 'americano').forms[0];
  assert.deepEqual(am.v, {}); assert.match(am.unavailable, /espresso/);
});

test("yalnız FDC Foundation'da olan mantarlar (aslan yelesi vb.) F etiketli; Türkiye'ye özgü ölçümsüz besinler açık notla (B119)", () => {
  const lm = DB.foods.find((f) => f.id === 'aslan_yelesi').forms[0];
  assert.ok(lm.v.energy > 0 && lm.v.protein > 0); assert.equal(lm.s.protein, 'F'); assert.ok(lm.usda.fdc);
  for (const id of ['gemlik_zeytini', 'taflan', 'seylan_tarcini', 'kanlica', 'reishi']) {
    const f = DB.foods.find((x) => x.id === id); assert.ok(f, id); assert.deepEqual(f.forms[0].v, {}); assert.ok(f.forms[0].unavailable);
  }
  const pk = DB.foods.find((f) => f.id === 'patates_kizartmasi');
  assert.deepEqual(pk.forms.map((x) => x.key), ['pismis', 'firin', 'tava']);
  assert.ok(DB.foods.filter((f) => f.cat === 'balik').length >= 31);
});

test('protein tozları: whey izolat, soya tozu USDA; bitkisel/kazein/beef etiketten; kreatin formülden (B119)', () => {
  const get = (id) => DB.foods.find((f) => f.id === id);
  assert.ok(get('whey_izolat').forms[0].v.protein > 50); // USDA SR28 14058: 58,1 g assert.equal(get('whey_izolat').animal, true);
  assert.equal(get('soya_protein_tozu').cat, 'takviye'); assert.equal(get('soya_protein_tozu').animal, false);
  for (const id of ['bezelye_proteini', 'pirinc_proteini', 'kenevir_proteini', 'kazein', 'sigir_proteini']) assert.ok(get(id).forms[0].unavailable, id);
  assert.equal(get('sigir_proteini').animal, true); assert.equal(get('kazein').animal, true);
  const k = get('kreatin').forms[0]; assert.equal(k.v.creatine, 87.92); assert.equal(k.s.creatine, 'd'); assert.equal(k.v.energy, undefined);
});
test('lif türleri: beta-glukan, dirençli nişasta, HMWDF/LMWDF, çözünür lif FDC Foundation\'dan (B119)', () => {
  const v = (id, k) => DB.foods.find((f) => f.id === id).forms[0];
  const ms = v('shiitake'); assert.ok(ms.v.beta_glucan > 0); assert.equal(ms.s.beta_glucan, 'F');
  assert.ok(DB.foods.some((f) => f.forms.some((fm) => fm.v.fiber_hmw != null && fm.v.fiber_lmw != null)));
});

test('ayran ve kaju ayranı tarif hesabıdır: r etiketli, oranlı, ölçüm gibi sunulmaz (B124)', () => {
  const a = DB.foods.find((f) => f.id === 'ayran').forms[0];
  assert.deepEqual(a.recipeOf.map((x) => [x.ndb, x.pct]), [['01116', 60], ['14411', 39.5], ['02047', 0.5]]);
  assert.ok(Object.values(a.s).every((x) => x === 'r'));
  const y = DB.foods.find((f) => f.id === 'yogurt').forms[0];
  assert.ok(Math.abs(a.v.protein - y.v.protein * 0.6) < 0.01);
  assert.ok(a.v.na > 190 && a.v.na < 260, String(a.v.na)); // ≈ 0,5 g tuz + yoğurdun sodyumu; tuz (Na × 2,5) çalışma anında türetilir
  assert.equal(DB.foods.find((f) => f.id === 'ayran').animal, true);
  const k = DB.foods.find((f) => f.id === 'kaju_ayrani'); assert.equal(k.animal, false); assert.ok(k.forms[0].v.energy > 100 && k.forms[0].v.energy < 125);
});

test('USDA özel veri tabanları yalnız boş hücreyi doldurur, SR28 değişmez (B128)', () => {
  const egg = DB.foods.find((x) => x.id === 'yumurta').forms.find((f) => f.key === 'cig');
  assert.equal(egg.s.choline, 'u'); assert.equal(egg.v.choline, 293.8); // SR28 toplam kolin korunur
  assert.equal(egg.s.choline_ptdcho, 'C'); assert.equal(egg.v.choline_ptdcho, 240);
  const cocoa = DB.foods.find((x) => x.id === 'kakao').forms[0];
  assert.equal(cocoa.s.pa_polymer, 'P'); assert.ok(cocoa.v.pa_polymer > 1000);
  const boiled = DB.foods.find((x) => x.id === 'yumurta').forms.find((f) => f.key === 'haslanmis');
  assert.equal(boiled.s.iodine, 'I'); assert.equal(boiled.v.iodine, 61);
  const n = { L: 0, I: 0, C: 0, P: 0 };
  for (const f of DB.foods) for (const fm of f.forms) for (const t of Object.values(fm.s)) if (t in n) n[t]++;
  assert.ok(n.I >= 60 && n.C >= 600 && n.P >= 570 && n.L >= 100, JSON.stringify(n));
});

test('Tarif hesabında iyot inert malzemede 0 sayılmaz, yalnız tüm malzemeler ölçülmüşse yazılır (B128)', () => {
  // Kajunun iyodu ölçülmemiş → kaju ayranında iyot "veri yok" (su/tuz inert olsa da)
  assert.equal(DB.foods.find((x) => x.id === 'kaju_ayrani').forms[0].v.iodine, undefined);
  // Ayran: yoğurt, su ve iyotlu tuz ölçülmüş → hesap; tuz katkısı %0,5 × 5213,1 µg ≈ 26 µg
  const ay = DB.foods.find((x) => x.id === 'ayran').forms[0];
  assert.equal(ay.s.iodine, 'r'); assert.ok(ay.v.iodine > 40 && ay.v.iodine < 50, String(ay.v.iodine));
  assert.match(DB.foods.find((x) => x.id === 'ayran').note, /iyotlu sofra tuzu/);
});

test('B129 yeni USDA besinleri: çorba, ezmeler, bitkisel sütler; hayvansallar işaretli', () => {
  const g = (id) => DB.foods.find((x) => x.id === id);
  assert.ok(DB.foods.length >= 613);
  const soup = g('mercimek_corbasi'); assert.equal(soup.cat, 'yemek'); assert.equal(soup.animal, false);
  assert.ok(Object.values(soup.forms[0].s).every((s) => s === 'N' || s === 'L' || s === 'I' || s === 'C' || s === 'P'));
  for (const id of ['badem_ezmesi', 'kaju_ezmesi', 'yulaf_sutu', 'soya_yogurdu', 'tahin_helvasi']) assert.equal(g(id).animal, false, id);
  for (const id of ['menemen', 'musakka', 'sutlac', 'sade_yag']) assert.equal(g(id).animal, true, id);
  assert.equal(g('sutlu_cikolata').cat, 'sut');
});

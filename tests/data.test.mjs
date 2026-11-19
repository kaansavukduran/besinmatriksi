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
      for (const [k, s] of Object.entries(fm.s)) assert.ok(['u', 'f', 'y', 'F', 'N', 'd', 'r', 'L', 'I', 'C', 'P', 'U', 'z', 'B'].includes(s), `${f.id} ${k} ${s}`);
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
    for (const fm of f.forms) if (fm.usda) assert.ok(!bad.test(fm.usda.desc.replace(/peanut butter|sesame butter|soymilk|almond milk|rice milk|coconut milk|coconut cream|cocoa butter|butternut|butterhead|non-dairy milk|almond butter|cashew butter|sunflower seed butter|oat milk|yogurt, soy|yogurt, coconut milk|yogurt, almond milk|no cheese/gi, '')), fm.usda.desc);
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
    assert.ok(Object.values(f.s).every(s => ['u', 'f', 'y', 'F', 'N', 'd', 'r', 'L', 'I', 'C', 'P', 'U', 'z', 'B'].includes(s)));
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
  // B141: Americano artık espresso + su oranı açıkça verilen tarif hesabıdır.
  assert.equal(am.usda, null); assert.equal(am.s.caffeine, 'r');
  assert.deepEqual(am.recipeOf.map((p) => [p.ndb, p.pct]), [['14210', 20], ['14411', 80]]);
  assert.ok(Math.abs(am.v.caffeine - DB.foods.find((f) => f.id === 'espresso').forms[0].v.caffeine * 0.2) < 1e-10);
  assert.deepEqual(am.portions, [{ g: 150, label: '1 fincan (tarif)', en: '1 cup (recipe)', r: 1 }]);
  assert.ok(Math.abs(scaleItem(am, am.portions[0].g).v.caffeine - 63.6) < 1e-10);
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
  const ms = v('maitake'); assert.ok(ms.v.beta_glucan > 0); assert.equal(ms.s.beta_glucan, 'F');
  // B157: shiitake'nin FDC numunesindeki beta-glukan (2,92 g) SR28 toplam lifini (2,5 g) aştığı için gösterilmez
  assert.equal(v('shiitake').v.beta_glucan, undefined);
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

test('Türk tarif hesapları: mercimek köftesi ve etsiz çiğ köfte, "Tahmin (tarif)" (B130)', () => {
  for (const [id, lo, hi] of [['mercimek_koftesi', 100, 160], ['cig_kofte', 170, 240]]) {
    const f = DB.foods.find((x) => x.id === id); const fm = f.forms[0];
    assert.equal(f.animal, false, id);
    assert.ok(Object.values(fm.s).every((s) => s === 'r'), id);
    assert.ok(fm.v.energy > lo && fm.v.energy < hi, `${id} ${fm.v.energy}`);
    assert.ok(fm.recipeOf.length >= 8 && Math.abs(fm.recipeOf.reduce((a, x) => a + x.pct, 0) - 100) < 0.5, id);
    assert.match(f.note, /Ölçüm değil/);
  }
});

test('pişme verimli tarif: kütle dengesi 100 g, yalnız ısıya dayanıklı bileşenler (B131)', () => {
  for (const id of ['simit', 'lahmacun', 'gozleme_ispanakli', 'gozleme_patatesli']) {
    const f = DB.foods.find((x) => x.id === id); const fm = f.forms[0]; const v = fm.v;
    assert.ok(fm.recipeYield > 0 && fm.recipeYield < 100, id);
    const sum = v.water + v.protein + v.fat + v.carb + v.ash;
    assert.ok(Math.abs(sum - 100) < 0.5, `${id} kütle ${sum}`);
    for (const k of ['vitc', 'thiamin', 'folate', 'sugars', 'lys', 'la']) assert.equal(v[k], undefined, `${id} ${k}`);
    assert.ok(v.fe > 0 && v.fiber > 0, id);
  }
  assert.equal(DB.foods.find((x) => x.id === 'lahmacun').animal, true);
  // Pişme verimi olmayan tariflerde (ayran) vitaminler hesaplanmaya devam eder
  assert.ok(DB.foods.find((x) => x.id === 'ayran').forms[0].v.riboflavin > 0);
});

test('Pürin DB (ad eşlemesi, incelenmiş): kurutulmuş shiitake, maydanoz; toplam = kaynak sütunu (B132)', () => {
  const sh = DB.foods.find((x) => x.id === 'shiitake').forms.find((f) => f.key === 'kurutulmus');
  assert.equal(sh.s.purines_total, 'U'); assert.equal(sh.v.purines_total, 311.55);
  const pa = DB.foods.find((x) => x.id === 'maydanoz').forms[0];
  assert.equal(pa.s.purine_guanine, 'U');
  // Pişmiş shiitake ölçülmemiş → veri yok (0 değil)
  assert.equal(DB.foods.find((x) => x.id === 'shiitake').forms.find((f) => f.key === 'pismis').v.purines_total, undefined);
});

test('gözlemeler bitkisel, peynirsiz, 200-260 kcal (B135)', () => {
  for (const id of ['gozleme_ispanakli', 'gozleme_patatesli']) {
    const f = DB.foods.find((x) => x.id === id);
    assert.equal(f.animal, false); assert.equal(f.forms[0].recipeYield, 85);
    assert.ok(f.forms[0].v.energy > 200 && f.forms[0].v.energy < 260, id);
  }
});

test('vegan Türk tarifleri: kısır, piyaz, fava, ezogelin; bitkisel, tarif hesabı (B136)', () => {
  for (const [id, lo, hi] of [['kisir', 120, 190], ['piyaz', 120, 190], ['fava', 150, 230], ['ezogelin_corbasi', 50, 90]]) {
    const f = DB.foods.find((x) => x.id === id); const fm = f.forms[0];
    assert.equal(f.animal, false, id); assert.equal(f.cat, 'yemek', id);
    assert.ok(Object.values(fm.s).every((s) => s === 'r'), id);
    assert.ok(fm.v.energy > lo && fm.v.energy < hi, `${id} ${fm.v.energy}`);
    assert.ok(Math.abs(fm.recipeOf.reduce((a, x) => a + x.pct, 0) - 100) < 0.5, id);
  }
  assert.match(DB.foods.find((x) => x.id === 'fava').note, /Favizm/);
});

test('zeytinyağlılar ve bulgur pilavı: bitkisel tarif hesabı (B137)', () => {
  for (const [id, lo, hi] of [['zeytinyagli_fasulye_domatesli', 60, 120], ['imam_bayildi', 90, 160], ['zeytinyagli_enginar', 90, 160], ['bulgur_pilavi', 90, 160]]) {
    const f = DB.foods.find((x) => x.id === id); const fm = f.forms[0];
    assert.equal(f.animal, false, id);
    assert.ok(Object.values(fm.s).every((s) => s === 'r'), id);
    assert.ok(fm.v.energy > lo && fm.v.energy < hi, `${id} ${fm.v.energy}`);
  }
  assert.match(DB.foods.find((x) => x.id === 'imam_bayildi').note, /yağ emişi/);
});

test('her katalog kimliği kayıt kimliği kuralına uyar; eski "kudret_narı" kayıtları taşınır (B140)', async () => {
  const { validRef } = await import('../src/records.js');
  const bad = DB.foods.filter((f) => !/^[a-zA-Z0-9_-]{1,100}$/.test(f.id)).map((f) => f.id);
  assert.deepEqual(bad, []);
  assert.deepEqual(validRef({ t: 'c', id: 'kudret_narı', f: 0 }), { t: 'c', id: 'kudret_nari', f: 0 });
  const { normalizePersonal } = await import('../src/personal.js');
  const st = normalizePersonal({ schema: 1, entries: [{ id: 'e1', day: '2026-11-13', ref: { t: 'c', id: 'kudret_narı', f: 0 }, g: 100 }] });
  assert.equal(st.entries[0].ref.id, 'kudret_nari');
});

test('B141 fast food ve atıştırmalıklar hazırlama biçimine uygun USDA kaydına bağlıdır', () => {
  const get = (id) => DB.foods.find((f) => f.id === id);
  assert.equal(get('pizza_peynirli').forms[0].usda.ndb, '21299');
  assert.equal(get('pizza_peynirli').forms[0].v.energy, 266);
  const frozen = get('dondurulmus_pizza_peynirli');
  assert.equal(frozen.cat, 'fastfood'); assert.equal(frozen.animal, true);
  assert.deepEqual(frozen.forms.map((f) => f.usda.ndb), ['21224', '21225', '21505']);
  assert.ok(frozen.forms.every((f) => /frozen, cooked/.test(f.usda.desc) && /^Fırınlanmış/.test(f.label)));
  assert.equal(get('patates_cipsi').forms[0].v.energy, 532);
  assert.equal(get('sert_seker').forms[0].v.energy, 394);
  for (const id of ['hamburger', 'cheeseburger', 'tavuk_burger', 'tavuk_nugget', 'nacho_cipsi', 'beyaz_cikolata', 'marshmallow']) {
    assert.equal(get(id).animal, true, id);
    assert.ok(get(id).forms.every((f) => f.usda?.ndb && f.s.energy === 'u'), id);
  }
  for (const id of ['patates_cipsi', 'tortilla_cipsi', 'sert_seker']) assert.equal(get(id).animal, false, id);
});

test('B141 sütlü kahveler malzeme oranıyla tahmin edilir; ristretto/lungo için kafein uydurulmaz', () => {
  const get = (id) => DB.foods.find((f) => f.id === id);
  const espresso = get('espresso').forms[0];
  for (const [id, espressoRatio] of [['latte_sutlu', 1 / 6], ['cappuccino_sutlu', 1 / 4], ['flat_white', 1 / 3], ['cortado', 1 / 2], ['espresso_macchiato', 3 / 4], ['mocha', 1 / 5], ['buzlu_latte', 1 / 8]]) {
    const f = get(id); const fm = f.forms[0];
    assert.equal(f.cat, 'kahve', id); assert.equal(f.animal, true, id);
    assert.ok(f.allergens.includes('sut'), id); assert.match(f.note, /Ölçüm değil, tarif hesabı/);
    const cocoaCaffeine = id === 'mocha' ? get('kakao').forms[0].v.caffeine * 0.02 : 0;
    assert.ok(Math.abs(fm.v.caffeine - (espresso.v.caffeine * espressoRatio + cocoaCaffeine)) < 0.002, id);
    assert.ok(Object.values(fm.s).every((s) => s === 'r'), id);
  }
  for (const id of ['ristretto', 'lungo', 'turk_kahvesi_sade']) {
    const fm = get(id).forms[0];
    assert.deepEqual(fm.v, {}, id); assert.deepEqual(fm.s, {}, id);
    assert.match(fm.unavailable, /doğrulanmış ayrı bir bileşim ölçümü yoktur/, id);
  }
  assert.equal(get('kahve_kafeinsiz').forms[0].usda.ndb, '14201');
  assert.equal(get('espresso_kafeinsiz').forms[0].usda.ndb, '14202');
  assert.ok(get('kahve_kafeinsiz').forms[0].v.caffeine < get('kahve').forms[0].v.caffeine);
  assert.equal(get('latte_sutlu').forms[0].portions[0].g, 180);
  assert.equal(get('cortado').forms[0].portions[0].g, 60);
});

test('B156 fast food, atıştırmalık ve kahve eklemeleri: hayvansallar işaretli, bitkiseller değil', () => {
  const g = (id) => DB.foods.find((x) => x.id === id);
  for (const id of ['sosisli', 'corn_dog', 'taco_etli', 'nachos_peynirli', 'balik_sandvic', 'salamli_sandvic', 'citir_tavuk_sandvic', 'buzlu_mocha', 'dondurma_cikolata', 'bademli_sutlu_cikolata']) assert.equal(g(id).animal, true, id);
  for (const id of ['vegan_sosisli', 'fasulyeli_burrito', 'pretzel', 'mikrodalga_misir', 'pirinc_patlagi', 'sebzeli_susi', 'buzlu_mocha_bitkisel']) {
    assert.equal(g(id).animal, false, id);
    assert.ok(!(g(id).forms[0].v.cholesterol > 0), `${id} kolesterol`);
  }
  assert.ok(g('sosisli').forms[0].v.energy > 200);
});

test('B157 veri tutarlılık kapıları: amino asit > protein, farklı numune dolgusu, zenginleştirilmiş un, aykırı Mn, hayvansal izler', () => {
  const g = (id) => DB.foods.find((x) => x.id === id);
  const EAA = ['his', 'ile', 'leu', 'lys', 'met', 'phe', 'thr', 'trp', 'val'];
  for (const f of DB.foods) for (const fm of f.forms) {
    const v = fm.v; const eaa = EAA.reduce((a, k) => a + (v[k] ?? 0), 0) / 1000;
    if (v.protein != null) assert.ok(eaa <= 1.2 * v.protein + 0.05, `${f.id} EAA ${eaa} > protein ${v.protein}`);
    for (const [p, kids, k] of [['sugars', ['fructose', 'glucose', 'sucrose', 'maltose', 'lactose', 'galactose'], 1], ['pufa', ['la', 'ala_fa', 'f20d2', 'f20d3', 'aa_fa', 'epa', 'dpa', 'dha', 'f22d2'], 1000]]) {
      if (v[p] == null) continue;
      const sum = kids.reduce((a, x) => a + (v[x] ?? 0), 0) / k;
      const mixed = kids.some((x) => v[x] != null && (fm.s[x] || 'u') !== (fm.s[p] || 'u'));
      assert.ok(!(mixed && sum > v[p] * 1.1 + 0.05), `${f.id} ${p} ${sum} > ${v[p]}`);
    }
  }
  assert.equal(g('aslan_yelesi').forms[0].v.val, undefined);
  assert.equal(g('humus').forms[0].v.la, undefined); // FDC numunesi (yağ 17 g) SR28'den (9,6 g) sapıyor
  for (const id of ['simit', 'lahmacun', 'gozleme_ispanakli', 'gozleme_patatesli']) assert.equal(g(id).forms[0].recipeOf[0].ndb, '20481', id);
  assert.ok(g('simit').forms[0].v.fe < 3);
  assert.equal(g('nohut').forms[0].v.mn, undefined); assert.ok(g('nohut').forms[1].v.mn > 0);
  for (const id of ['peksimet', 'sebze_burger', 'pirinc_pilavi', 'vegan_mayonez']) assert.equal(g(id).animal, true, id);
});

test('B158 alkol bileşeni ve USDA varsayılan sıfırları (Src_Cd 7) ayrı etiket', () => {
  const g = (id) => DB.foods.find((x) => x.id === id);
  const w = g('kirmizi_sarap').forms[0].v;
  assert.ok(w.alcohol > 9 && w.alcohol < 12);
  assert.ok(Math.abs(w.water + w.protein + (w.fat ?? 0) + w.carb + (w.ash ?? 0) + w.alcohol - 100) < 1); // kütle dengesi alkolle kapanır
  assert.equal(g('nohut').forms[1].v.alcohol, undefined); // alkolsüz besinde "veri yok", 0 değil
  const st = g('seitan').forms[0];
  assert.equal(st.s.thiamin, 'z'); assert.equal(st.v.thiamin, 0); // ölçülmemiş varsayılan 0, ölçülmüş 0'dan ayrı
  const lentil = g('kirmizi_mercimek').forms[0];
  assert.equal(lentil.s.cholesterol, 'z'); assert.equal(lentil.s.protein, 'u');
});

test('B160 beyaz pide zenginleştirilmemiş USDA kaydından (Türkiye\'de un zenginleştirmesi zorunlu değil)', () => {
  const fm = DB.foods.find((x) => x.id === 'pide_lavas').forms[0];
  assert.equal(fm.usda.ndb, '18413');
  assert.ok(!(fm.v.folic_acid > 0));
});

test('B161 yinelenen kayıtlar: lor → lor_cottage göçü, çapatiler ayırt edilir, aynı TR adlı besin yok', async () => {
  const { validRef, normalizeRecipe } = await import('../src/records.js');
  assert.equal(DB.foods.find((x) => x.id === 'lor'), undefined);
  assert.deepEqual(validRef({ t: 'c', id: 'lor', f: 0 }), { t: 'c', id: 'lor_cottage', f: 0 });
  const r = normalizeRecipe({ id: 'r1', name: 'Eski', items: [{ id: 'i1', ref: { t: 'c', id: 'lor', f: 0 }, g: 100 }] });
  assert.equal(r.items[0].ref.id, 'lor_cottage');
  assert.equal(DB.foods.find((x) => x.id === 'lor_cottage').forms[0].usda.ndb, '01012');
  const names = DB.foods.map((f) => f.tr);
  assert.equal(new Set(names).size, names.length);
});

test('B191 UK CoFID 2021 dolgusu: yalnız elle eşlenen biçimlerde, yalnız sayısal ölçüm, etiket "B"; ölçülmüş USDA hücresinin üzerine yazmaz', async () => {
  const zlib = await import('node:zlib');
  const { COFID_MAP, COFID_KEYS, COFID_SUGARS } = await import('../data/cofid-map.mjs');
  const cof = JSON.parse(zlib.gunzipSync(fs.readFileSync(new URL('../data/raw/CoFID_2021_SUBSET.json.gz', import.meta.url))).toString('utf8'));
  const inv = { ...Object.fromEntries(Object.entries(COFID_KEYS).map(([c, k]) => [k, c])), ...Object.fromEntries(Object.entries(COFID_SUGARS).map(([c, k]) => [k, c])) };
  let n = 0;
  for (const f of DB.foods) for (const fm of f.forms) for (const [k, t] of Object.entries(fm.s || {})) {
    if (t !== 'B') continue; n++;
    const code = COFID_MAP[f.id]?.[fm.key];
    assert.ok(code, `${f.id}/${fm.key} eşlemesiz B`);
    assert.equal(fm.v[k], Number(cof[code].v[inv[k]]), `${f.id}/${fm.key}/${k}`);
    assert.ok(!f.animal, 'hayvansal besine CoFID dolgusu yok');
  }
  assert.ok(n >= 40, `B hücre ${n}`);
  const oj = DB.foods.find((f) => f.id === 'portakal').forms.find((x) => x.key === 'suyu');
  assert.equal(oj.s.iodine, 'B'); assert.equal(oj.v.iodine, Number(cof['14-369'].v.iodine));
  // eşlenen her biçimde ana bileşim USDA ile uyuşur (su ±5 g, protein ±%25 veya ±1 g)
  for (const [id, forms] of Object.entries(COFID_MAP)) for (const [key, code] of Object.entries(forms)) {
    const fm = DB.foods.find((f) => f.id === id)?.forms.find((x) => x.key === key);
    assert.ok(fm, `${id}/${key} katalogda yok`);
    const c = cof[code].v, w = Number(c.water), p = Number(c.protein);
    assert.ok(Math.abs(w - fm.v.water) <= 5, `${id} su ${fm.v.water}/${w}`);
    assert.ok(Math.abs(p - fm.v.protein) <= 1 || Math.abs(p - fm.v.protein) / fm.v.protein <= 0.25, `${id} protein ${fm.v.protein}/${p}`);
  }
});

test('B196 USDA 18:2 / 18:3 toplamları (618/619) gösterilir; çoklu doymamış toplamı aşmaz; boşluk küçüldü', () => {
  const plant = DB.foods.filter((f) => !f.animal).flatMap((f) => f.forms).filter((fm) => fm.v && Object.keys(fm.v).length);
  const miss = (k) => plant.filter((fm) => fm.v[k] == null).length / plant.length;
  assert.ok(miss('f18d2_t') < 0.15 && miss('f18d3_t') < 0.15, `${miss('f18d2_t')} ${miss('f18d3_t')}`);
  const walnut = DB.foods.find((f) => f.id === 'ceviz').forms[0];
  assert.equal(walnut.s.f18d2_t, 'u'); assert.ok(walnut.v.f18d2_t > 30000 && walnut.v.f18d3_t > 8000);
  for (const fm of plant) if (fm.v.pufa != null && fm.v.f18d2_t != null && fm.v.f18d3_t != null) assert.ok((fm.v.f18d2_t + fm.v.f18d3_t) / 1000 <= fm.v.pufa * 1.1 + 0.05, `${fm.label} ${fm.v.f18d2_t}+${fm.v.f18d3_t} > ${fm.v.pufa}`);
});

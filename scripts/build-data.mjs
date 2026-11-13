// Ham kaynaklardan (data/raw) uygulamanın çevrimdışı veri dosyalarını üretir.
//   src/data/foods.json      küratörlü Türkçe katalog (USDA SR28 tam bileşim)
//   src/data/foods-ext.json  geniş katalog (USDA SR28 bitkisel gruplar, İngilizce adlar)
// Kullanım: node scripts/build-data.mjs
import fs from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { USDA_NUTRIENTS, unitFactor } from '../data/usda-nutrients.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NUTRIENTS } from '../src/nutrients.js';
import { FOODS, CATEGORIES, FORM_LABELS, ANIMAL_CATS } from '../data/catalog.mjs';
import { POPULAR, NICHE } from '../data/popularity.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const raw = (f) => fs.readFileSync(path.join(root, 'data/raw', f), 'utf8');

// ---------- USDA SR28 ----------
const unq = (s) => s.replace(/^~|~$/g, '');
const des = new Map();
for (const line of raw('FOOD_DES.txt').split(/\r?\n/)) {
  if (!line.trim()) continue;
  const f = line.split('^').map(unq);
  des.set(f[0], { grp: f[1], long: f[2], refDesc: f[7], refuse: f[8] === '' ? null : Number(f[8]), sci: f[9] });
}
const abbrev = new Map();
for (const line of raw('ABBREV.txt').split(/\r?\n/)) {
  if (!line.trim()) continue;
  const f = line.split('^').map(unq);
  if (f.length !== 53) throw new Error('ABBREV sütun sayısı beklenmedik: ' + f.length);
  abbrev.set(f[0], f);
}

// ---------- USDA tam bileşen tablosu ----------
const definitions = new Map(raw('NUTR_DEF.txt').split(/\r?\n/).filter(Boolean).map(line => {
  const fields = line.split('^').map(unq); return [fields[0], { unit: fields[1], description: fields[3] }];
}));
const mappings = new Map();
for (const n of NUTRIENTS) {
  const id = USDA_NUTRIENTS[n.key];
  if (id) {
    if (!definitions.has(id)) throw new Error('USDA bileşen tanımı yok: ' + id);
    mappings.set(id, { key: n.key, factor: unitFactor(definitions.get(id).unit, n.unit) });
  }
}
const fullValues = new Map();
const nutrientText = gunzipSync(fs.readFileSync(path.join(root, 'data/raw/NUT_DATA.txt.gz'))).toString('utf8');
for (const line of nutrientText.split('\n')) {
  if (!line) continue;
  const fields = line.split('^').map(unq);
  const mapping = mappings.get(fields[1]);
  if (!mapping || fields[2] === '') continue;
  const value = Number(fields[2]);
  if (!Number.isFinite(value) || value < 0) throw new Error('USDA miktarı geçersiz: ' + fields[0] + '/' + fields[1]);
  if (!fullValues.has(fields[0])) fullValues.set(fields[0], {});
  fullValues.get(fields[0])[mapping.key] = Number((value * mapping.factor).toPrecision(12));
}

// ---------- USDA flavonoid (3.3) ve izoflavon (2.1) veri tabanları (aynı NDB numaraları) ----------
// Kaynak/lisans: data/raw/USDA_FLAVONOID_SOURCES.json. Ölçülmeyen bileşen yazılmaz ("veri yok" ≠ 0).
const FLAV_MAP = { 749: 'catechin', 750: 'egc', 751: 'epicatechin', 752: 'ecg', 753: 'egcg', 794: 'gc', 756: 'thearubigins',
  758: 'eriodictyol', 759: 'hesperetin', 762: 'naringenin', 770: 'apigenin', 773: 'luteolin',
  785: 'isorhamnetin', 786: 'kaempferol', 788: 'myricetin', 789: 'quercetin',
  731: 'cyanidin', 741: 'delphinidin', 742: 'malvidin', 743: 'pelargonidin', 745: 'peonidin', 740: 'petunidin' };
const THEAFLAVINS = ['755', '791', '792', '793'];
const ISFL_MAP = { 710: 'daidzein', 711: 'genistein', 712: 'glycitein' };
function readCsvGz(file) {
  const text = gunzipSync(fs.readFileSync(path.join(root, 'data/raw', file))).toString('utf8');
  const [head, ...lines] = text.split(/\r?\n/).filter(Boolean);
  const cols = head.split(',');
  return lines.map((line) => { const f = line.split(',').map((x) => x.replace(/^"|"$/g, '')); return Object.fromEntries(cols.map((c, i) => [c, f[i]])); });
}
const flavValues = new Map(); // ndb -> { v: {key: mg}, s: 'f'|'y' }
function putFlav(ndb, key, val, tag) {
  const x = Number(val);
  if (val === '' || val == null || !Number.isFinite(x) || x < 0) return;
  if (!flavValues.has(ndb)) flavValues.set(ndb, { v: {}, s: {} });
  const e = flavValues.get(ndb); e.v[key] = Number(x.toPrecision(6)); e.s[key] = tag;
}
const theaf = new Map();
for (const r of readCsvGz('USDA_FLAV_R3.3_FLAV_DAT.csv.gz')) {
  if (FLAV_MAP[r.Nutr_no]) putFlav(r.NDB_No, FLAV_MAP[r.Nutr_no], r.Flav_Val, 'f');
  if (THEAFLAVINS.includes(r.Nutr_no) && r.Flav_Val !== '') { if (!theaf.has(r.NDB_No)) theaf.set(r.NDB_No, {}); theaf.get(r.NDB_No)[r.Nutr_no] = Number(r.Flav_Val); }
}
// Toplam teaflavin yalnız dört bileşenin hepsi ölçülmüşse (eksik toplam yazılmaz)
for (const [ndb, o] of theaf) if (THEAFLAVINS.every((k) => Number.isFinite(o[k]))) putFlav(ndb, 'theaflavins', String(THEAFLAVINS.reduce((a, k) => a + o[k], 0)), 'f');
for (const r of readCsvGz('USDA_ISOFLAV_R2.1_ISFL_DAT.csv.gz')) if (ISFL_MAP[r.Nutr_No]) putFlav(r.NDB_No, ISFL_MAP[r.Nutr_No], r.Isfl_Val, 'y');

// ---------- USDA FoodData Central Foundation Foods (2026-10-29, CC0) ----------
// Yalnız SR28'de ölçümü olmayan bileşenleri aynı NDB kaydının daha yeni analiziyle doldurur (SR28'i asla ezmez); etiket 'F'.
const FF_EXTRA = { '416': 'biotin', '316': 'mo', '314': 'iodine', '269.3': 'sugars', '526': 'cys', '236': 'citric', '243': 'malic',
  '248': 'quinic', '245': 'oxalate', '295': 'fiber_sol', '297': 'fiber_insol', '283': 'resistant_starch', '293.3': 'fiber_hmw', '293.4': 'fiber_lmw', '338.1': 'lutein', '338.2': 'zeaxanthin', '332': 'gcarotene', '288': 'raffinose', '289': 'stachyose' };
const FF_NAME = { 'Beta-glucan': 'beta_glucan', Verbascose: 'verbascose' }; // FDC'de numarasız bileşenler
const FF_UNIT = { G: 'g', MG: 'mg', UG: 'µg', 'µg': 'µg', g: 'g', mg: 'mg' };
const ffByNdb = new Map();
{
  const numToKey = new Map(Object.entries(USDA_NUTRIENTS).map(([k, v]) => [v, k]));
  for (const [num, key] of Object.entries(FF_EXTRA)) numToKey.set(num, key);
  const unitOf = new Map(NUTRIENTS.map((n) => [n.key, n.unit]));
  const ff = JSON.parse(gunzipSync(fs.readFileSync(path.join(root, 'data/raw/USDA_FDC_FOUNDATION_2026-10-29.min.json.gz'))).toString('utf8'));
  for (const f of ff) {
    const v = {};
    for (const [num, name, unit, amount] of f.n) {
      const key = numToKey.get(num) || FF_NAME[name];
      if (!key || !unitOf.has(key) || !Number.isFinite(amount) || amount < 0) continue;
      const u = FF_UNIT[unit]; if (!u) continue;
      v[key] = Number((amount * unitFactor(u, unitOf.get(key))).toPrecision(8));
    }
    // Enerji: 208 yoksa Atwater genel faktörleri (957), o da yoksa özgül faktörler (958)
    if (v.energy == null) { for (const num of ['957', '958']) { const e = f.n.find((x) => x[0] === num && Number.isFinite(x[3])); if (e) { v.energy = e[3]; break; } } }
    if (Object.keys(v).length) ffByNdb.set(f.ndb, { v, fdcId: f.fdcId, desc: f.desc });
  }
}
// ---------- USDA FNDDS 2021-2023 (CC0): SR28'de kaydı olmayan hazır içecekler (Türk kahvesi, bitkisel sütlü latte...) ----------
const fndds = new Map(JSON.parse(gunzipSync(fs.readFileSync(path.join(root, 'data/raw/USDA_FNDDS_2021-2023_SUBSET.json.gz'))).toString('utf8')).map((f) => [f.code, f]));
function fnddsForm(code) {
  const f = fndds.get(code);
  if (!f) throw new Error('FNDDS kodu yok: ' + code);
  const numToKey = new Map(Object.entries(USDA_NUTRIENTS).map(([k, v]) => [v, k]));
  const unitOf = new Map(NUTRIENTS.map((n) => [n.key, n.unit]));
  const v = {}, s = {};
  for (const [num, , unit, amount] of f.n) {
    const key = numToKey.get(num);
    if (!key || !unitOf.has(key) || !Number.isFinite(amount) || amount < 0) continue;
    const u = FF_UNIT[unit] || unit; if (!['g', 'mg', 'µg', 'kcal', 'kJ'].includes(u)) continue;
    v[key] = u === unitOf.get(key) ? amount : Number((amount * unitFactor(u, unitOf.get(key))).toPrecision(8));
    s[key] = 'N';
  }
  const base = f.p.filter(([d, g]) => d && g > 0 && g <= 1000 && !/not specified/i.test(d)).map(([d, g]) => ({ g, label: trPortion(d), en: d }));
  return { v, s, portions: [...turkishMeasures(base), ...base], usda: { fndds: code, fdc: f.fdcId, desc: f.desc, ingredients: f.in } };
}

function fillFromFoundation(ndb, v, s) {
  const ff = ffByNdb.get(ndb);
  if (!ff) return null;
  let n = 0;
  for (const [k, x] of Object.entries(ff.v)) if (v[k] == null) { v[k] = x; if (s) s[k] = 'F'; n++; }
  return n ? ff.fdcId : null;
}

// ---------- yardımcılar ----------
const round = (x) => {
  if (x === 0) return 0;
  const a = Math.abs(x);
  const digits = a >= 100 ? 1 : a >= 1 ? 3 : a >= 0.01 ? 4 : 6;
  return Number(x.toFixed(digits));
};

function usdaValues(ndb) {
  const row = abbrev.get(ndb);
  if (!row) throw new Error('USDA kodu bulunamadı: ' + ndb);
  const v = {};
  for (const n of NUTRIENTS) {
    if (n.u == null) continue;
    const s = row[n.u];
    if (s === '' || s == null) continue;
    v[n.key] = Number(s);
  }
  Object.assign(v, fullValues.get(ndb) || {});
  return v;
}

// Porsiyon açıklamalarını Türkçeleştir (bilinmeyen kısım İngilizce kalır).
const PORTION_WORDS = [
  [/\bNLEA serving\b/g, 'NLEA porsiyonu'],
  [/\bcups?\b/g, 'su bardağı (ABD cup)'],
  [/\btbsp\b|\btablespoons?\b/g, 'yemek kaşığı'],
  [/\btsp\b|\bteaspoons?\b/g, 'çay kaşığı'],
  [/\bfl oz\b/g, 'sıvı ons'],
  [/\boz\b/g, 'ons'],
  [/\blbs?\b/g, 'libre'],
  [/\bextra large\b/g, 'çok büyük'],
  [/\blarge\b/g, 'büyük'],
  [/\bmedium\b/g, 'orta'],
  [/\bsmall\b/g, 'küçük'],
  [/\bfruits?\b/g, 'meyve'],
  [/\bslices?\b/g, 'dilim'],
  [/\bpieces?\b/g, 'parça'],
  [/\bcloves?\b/g, 'diş'],
  [/\bleaf\b|\bleaves\b/g, 'yaprak'],
  [/\bstalks?\b/g, 'sap'],
  [/\bspears?\b/g, 'filiz'],
  [/\bpods?\b/g, 'kabuk/bakla'],
  [/\bnuts?\b/g, 'tane'],
  [/\bkernels?\b/g, 'tane'],
  [/\bseeds?\b/g, 'tohum'],
  [/\bberr(y|ies)\b/g, 'tane'],
  [/\bear\b/g, 'koçan'],
  [/\bhead\b/g, 'baş'],
  [/\bbunch\b/g, 'demet'],
  [/\bsprigs?\b/g, 'dal'],
  [/\bpackages?\b/g, 'paket'],
  [/\bcan\b/g, 'kutu'],
  [/\bbottle\b/g, 'şişe'],
  [/\bservings?\b/g, 'porsiyon'],
  [/\bchopped\b/g, 'doğranmış'],
  [/\bsliced\b/g, 'dilimlenmiş'],
  [/\bdiced\b/g, 'küp doğranmış'],
  [/\bshredded\b/g, 'rendelenmiş'],
  [/\bcubes\b/g, 'küp'],
  [/\bwhole\b/g, 'bütün'],
  [/\bpacked\b/g, 'bastırılmış'],
  [/\bground\b/g, 'öğütülmüş'],
  [/\bpitted\b/g, 'çekirdeksiz'],
  [/\bhalves\b/g, 'yarım'],
  [/\bmashed\b/g, 'ezilmiş'],
  [/\bpuree\b/g, 'püre'],
  [/\bjuice\b/g, 'suyu'],
  [/\bwedge\b/g, 'dilim'],
  [/\bstick\b/g, 'çubuk'],
  [/\bbar\b/g, 'tablet'],
  [/\bsquare\b/g, 'kare'],
  [/\bcontainer\b/g, 'kap'],
  [/\bblock\b/g, 'kalıp'],
  [/\bitem\b/g, 'adet'],
  [/\bsheets?\b/g, 'yaprak'],
  [/\bpeppers?\b/g, 'biber'],
  [/\bpotato\b/g, 'patates'],
  [/\bwithout\b/g, 'olmadan'],
  [/\bwith\b/g, 'ile'],
  [/\bskin\b/g, 'kabuk'],
  [/\bdia\b/g, 'çap'],
  [/\blong\b/g, 'uzun'],
  [/\bor\b/g, 'veya'],
  [/\band\b/g, 've'],
  [/\braw\b/g, 'çiğ'],
  [/\bcooked\b/g, 'pişmiş'],
  [/\bdrained\b/g, 'süzülmüş'],
  [/\bunprepared\b/g, 'hazırlanmamış'],
];
function trPortion(desc) {
  let s = desc.replace(/^\./, '0.').replace(/(\d)\.(\d)/g, '$1,$2');
  for (const [re, t] of PORTION_WORDS) s = s.replace(re, t);
  return s;
}
function usdaPortions(ndb) {
  const f = abbrev.get(ndb);
  const out = [];
  for (const [w, d] of [[f[48], f[49]], [f[50], f[51]]]) {
    if (!w || !d) continue;
    const g = Number(w);
    if (!(g > 0) || g > 1000) continue;
    out.push({ g: round(g), label: trPortion(d), en: d });
  }
  return [...turkishMeasures(out), ...out];
}
// Türk mutfak ölçüleri: USDA hacim ölçüsünden (cup 236,6 ml, tbsp 14,79 ml, tsp 4,93 ml) ml başına gram bulunup
// su bardağı 200 ml, yemek kaşığı 15 ml, çay kaşığı 5 ml için hesaplanır. Yaklaşıktır (d: 1 ile işaretli).
export function turkishMeasures(portions) {
  const ML = { cup: 236.6, tbsp: 14.79, tablespoon: 14.79, tsp: 4.93, teaspoon: 4.93, 'fl oz': 29.57 };
  let perMl = null, from = null;
  for (const p of portions) {
    const m = /^(\d*\.?\d+)\s*(cup|tbsp|tablespoon|tsp|teaspoon|fl oz)s?\b/i.exec(String(p.en).trim());
    if (!m) continue;
    const qty = Number(m[1]), unit = m[2].toLowerCase();
    if (!(qty > 0)) continue;
    perMl = p.g / (qty * ML[unit]); from = m[0];
    if (unit === 'cup') break; // en güvenilir: bardak ölçüsü
  }
  if (!(perMl > 0)) return [];
  const make = (ml, label, en) => ({ g: Math.round(perMl * ml * 10) / 10, label, en, d: 1, src: from });
  const out = [make(200, '1 su bardağı (200 ml)', '1 Turkish cup (200 ml)'), make(15, '1 yemek kaşığı (15 ml)', '1 tablespoon (15 ml)'), make(5, '1 çay kaşığı (5 ml)', '1 teaspoon (5 ml)')];
  return out.filter((p) => p.g > 0 && p.g <= 1000);
}


// ---------- küratörlü katalog ----------
const catIds = new Set(CATEGORIES.map((c) => c[0]));
const ids = new Set();
const foods = [];
let ifctLinked = 0, estimated = 0;
for (const food of FOODS) {
  if (ids.has(food.id)) throw new Error('Yinelenen id: ' + food.id);
  ids.add(food.id);
  if (!catIds.has(food.cat)) throw new Error('Bilinmeyen kategori: ' + food.cat);
  const forms = food.forms.map(([key, ndb, ifc, custom]) => {
    if (!FORM_LABELS[key]) throw new Error('Bilinmeyen form: ' + key);
    const v = {}, s = {}, alt = {}, sd = {};
    let usda = null, ic = null;
    if (ndb && ndb.startsWith('F')) {
      // Yalnız FDC Foundation'da olan besin (ör. aslan yelesi mantarı): tüm değerler FDC'den, etiket 'F'
      const ff = ffByNdb.get(ndb.slice(1));
      if (!ff) throw new Error('FDC Foundation kaydı yok: ' + ndb);
      const fs2 = Object.fromEntries(Object.keys(ff.v).map((k) => [k, 'F']));
      return { key, label: custom || FORM_LABELS[key], usda: { fdc: ff.fdcId, ffNdb: ndb.slice(1), desc: ff.desc }, ifct: null, estFrom: null, portions: [], v: { ...ff.v }, s: fs2 };
    }
    if (ndb && ndb.startsWith('N')) {
      const r = fnddsForm(ndb.slice(1));
      return { key, label: custom || FORM_LABELS[key], usda: r.usda, ifct: null, estFrom: null, portions: r.portions, v: r.v, s: r.s };
    }
    if (ndb) {
      const d = des.get(ndb);
      if (!d) throw new Error('FOOD_DES kodu yok: ' + ndb);
      Object.assign(v, usdaValues(ndb));
      for (const k of Object.keys(v)) s[k] = 'u';
      const fl = flavValues.get(ndb);
      if (fl) { Object.assign(v, fl.v); Object.assign(s, fl.s); }
      const ffId = fillFromFoundation(ndb, v, s);
      usda = { ndb, desc: d.long, refuse: d.refuse, refDesc: d.refDesc || null, sci: d.sci || null, ...(ffId ? { fdc: ffId } : {}) };
    }
    if (!ndb && food.fixed) {
      // Kimyasal formülden hesaplanan değer (ör. kreatin monohidrattaki kreatin); kaynak 'd' (hesap)
      const v = { ...food.fixed.v }, s = Object.fromEntries(Object.keys(v).map((k) => [k, 'd']));
      return { key, label: custom || FORM_LABELS[key], usda: null, ifct: null, estFrom: null, computed: true, portions: [{ g: 5, label: '1 ölçek (5 g)', en: '1 scoop (5 g)' }], v, s };
    }
    const unavailable = !ndb ? food.unavailable || 'Bu besin için dağıtıma uygun doğrulanmış bileşim kaydı henüz yok. Önceki IFCT verileri NIN yazılı izni doğrulanmadığı için bu sürüme dahil edilmedi.' : null;
    const portions = ndb ? usdaPortions(ndb) : [];
    return {
      key,
      label: custom || FORM_LABELS[key],
      usda,
      ifct: ic,
      estFrom: null,
      ...(unavailable ? { unavailable } : {}),
      portions,
      v, s,
      ...(Object.keys(alt).length ? { alt } : {}),
      ...(Object.keys(sd).length ? { sd } : {}),
    };
  });
  foods.push({
    id: food.id, tr: food.tr, en: food.en, cat: food.cat,
    sci: forms.find((f) => f.usda?.sci)?.usda.sci || forms.find((f) => f.ifct?.sci)?.ifct.sci || null,
    allergens: food.allergens || [],
    animal: !!food.animal || ANIMAL_CATS.includes(food.cat),
    ...(NICHE.has(food.id) ? { niche: true } : {}),
    note: food.note || null,
    forms,
  });
}

// Kategori içi yaygınlık sırası (data/popularity.mjs); listede olmayanlar katalog sırasıyla sona
{
  const catIdx = Object.fromEntries(CATEGORIES.map(([id], i) => [id, i]));
  const pos = new Map(foods.map((f, i) => [f.id, i]));
  const rank = (f) => { const r = (POPULAR[f.cat] || []).indexOf(f.id); return r < 0 ? 1e6 + pos.get(f.id) : r; };
  for (const [cat, ids] of Object.entries(POPULAR)) for (const id of ids) if (!foods.some((f) => f.id === id && f.cat === cat)) throw new Error('popularity: bilinmeyen/yanlış kategori ' + cat + '/' + id);
  foods.sort((a, b) => catIdx[a.cat] - catIdx[b.cat] || rank(a) - rank(b));
}

// ---------- geniş katalog (USDA bitkisel gruplar) ----------
const EXT_GROUPS = {
  '0200': 'Baharat ve otlar', '0900': 'Meyveler ve meyve suları', '1100': 'Sebzeler ve sebze ürünleri',
  '1200': 'Kuruyemiş ve tohumlar', '1600': 'Baklagiller ve ürünleri', '2000': 'Tahıllar ve makarna',
  '0400': 'Yağlar', '1400': 'İçecekler',
  // Hayvansal gruplar (2026-11-12 kullanıcı kararı); kayıtlar `a: 1` taşır ve arayüzde gizlenebilir
  '0100': 'Süt ürünleri ve yumurta (hayvansal)', '0500': 'Kümes hayvanları (hayvansal)', '1300': 'Sığır eti (hayvansal)',
  '1700': 'Kuzu, dana ve av eti (hayvansal)', '1000': 'Domuz eti (hayvansal)', '1500': 'Balık ve kabuklular (hayvansal)',
};
const ANIMAL_GROUPS = new Set(['0100', '0500', '1300', '1700', '1000', '1500']);
const ANIMAL = /\b(milk|cheese|butter|eggs?|chicken|beef|pork|ham|bacon|fish|tuna|salmon|shrimp|crab|lard|tallow|gelatin|honey|whey|casein|cream|creamed|yogurt|meat|turkey|lamb|veal|anchov\w*|clam|sardine|cod|oyster|mayonnaise|ghee|sausage|frankfurter|bologna|cod liver|herring|menhaden|whale|seal|egg|mutton|goose|duck|poultry|buttermilk|lactose|nonfat dry milk|sour cream|ensure|formula|gravy|broth|chowder)\b/i;
const PLANT_OK = /\b(soymilk|soy milk|almond milk|rice milk|coconut milk|coconut cream|oat milk|peanut butter|sesame butter|cashew butter|almond butter|nut butter|butternut|butterhead|butterbur|cocoa butter|shea|butter beans|milk substitute|coconut water|milkfish)\b/i;
const curatedNdb = new Set(FOODS.flatMap((f) => f.forms.map((fm) => fm[1]).filter(Boolean)));
const ext = [];
for (const [ndb, d] of des) {
  if (!EXT_GROUPS[d.grp] || curatedNdb.has(ndb)) continue;
  const name = d.long;
  const animalGroup = ANIMAL_GROUPS.has(d.grp);
  // Bitkisel gruplarda hayvansal içerikli karışık ürünler yine ayıklanır (yanlış grupta durmasınlar)
  if (!animalGroup && ANIMAL.test(name.replace(PLANT_OK, ''))) continue;
  // Et gruplarında aynı parçanın yağlı/kaliteli tekrarları ayıklanır: yalnız "yağsız kısım" ve tek kalite (choice/all grades) tutulur
  if (['1300', '1700', '1000'].includes(d.grp) && (/separable lean and fat|separable fat|\b(select|prime)\b|trimmed to 1\/4"|imported|New Zealand|Australian/i.test(name))) continue;
  // Marka ürünleri (büyük harfli marka adları) içerik doğrulanamadığı için dışarıda
  if (/[A-Z]{4,}/.test(name) || /\bmeatless\b/i.test(name)) continue;
  if (d.grp === '1400' && /\b(beer|wine|liqueur|whiskey|vodka|rum|gin|alcoholic|cocktail|distilled|daiquiri|martini)\b/i.test(name)) continue;
  const v = usdaValues(ndb);
  const fl = flavValues.get(ndb);
  if (fl) Object.assign(v, fl.v);
  const fsTags = fl ? { ...fl.s } : {};
  fillFromFoundation(ndb, v, fsTags);
  // fs: SR28 dışı kaynak etiketleri (f: USDA Flavonoid, y: USDA İzoflavon)
  ext.push({ n: ndb, g: d.grp, en: name, sci: d.sci || null, r: d.refuse, rd: d.refDesc || null, p: usdaPortions(ndb), v, ...(Object.keys(fsTags).length ? { fs: fsTags } : {}), ...(animalGroup ? { a: 1 } : {}) });
}
ext.sort((a, b) => a.en.localeCompare(b.en));

const outDir = path.join(root, 'src/data');
fs.mkdirSync(outDir, { recursive: true });
const meta = {
  sources: 'USDA SR28 (2015) tam ASCII; USDA FoodData Central Foundation Foods (2026); USDA Flavonoid 3.3 (2018); USDA İzoflavon 2.1 (2015)',
  dataPolicy: 'USDA public domain / CC0; IFCT ve IFCT tabanlı tahminler dağıtıma dahil değil',
  unavailableForms: foods.flatMap(f => f.forms).filter(f => f.unavailable).length,
  curated: foods.length,
  forms: foods.reduce((a, f) => a + f.forms.length, 0),
  ifctLinked, estimated, ext: ext.length,
};
fs.writeFileSync(path.join(outDir, 'foods.json'), JSON.stringify({ meta, categories: CATEGORIES, animalCategories: ANIMAL_CATS, foods }));
fs.writeFileSync(path.join(outDir, 'foods-ext.json'), JSON.stringify({ groups: EXT_GROUPS, foods: ext }));
console.log(meta, 'foods.json', (fs.statSync(path.join(outDir, 'foods.json')).size / 1024).toFixed(0) + ' KB', 'ext', (fs.statSync(path.join(outDir, 'foods-ext.json')).size / 1024).toFixed(0) + ' KB');

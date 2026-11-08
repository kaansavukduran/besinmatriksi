// Ham kaynaklardan (data/raw) uygulamanın çevrimdışı veri dosyalarını üretir.
//   src/data/foods.json      küratörlü Türkçe katalog (USDA SR28 + IFCT 2017 birleşik)
//   src/data/foods-ext.json  geniş katalog (USDA SR28 bitkisel gruplar, İngilizce adlar)
// Kullanım: node scripts/build-data.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NUTRIENTS, UNIT_FROM_G } from '../src/nutrients.js';
import { FOODS, CATEGORIES, FORM_LABELS } from '../data/catalog.mjs';

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

// ---------- IFCT 2017 ----------
function parseCSV(text) {
  const rows = [];
  let row = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (c !== '\r') cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows;
}
const ifctRows = parseCSV(raw('IFCT2017.csv'));
const ifctHead = ifctRows[0].map((h) => h.split('; ')[1]);
const ifct = new Map();
for (const r of ifctRows.slice(1)) {
  if (r.length < 5) continue;
  const o = {};
  ifctHead.forEach((k, idx) => (o[k] = r[idx]));
  ifct.set(o.code, o);
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
  if (v.energy != null) v.energy_kj = Math.round(v.energy * 4.184);
  return v;
}

function ifctValues(code) {
  const o = ifct.get(code);
  if (!o) throw new Error('IFCT kodu bulunamadı: ' + code);
  const v = {}, sd = {};
  for (const n of NUTRIENTS) {
    if (!n.i) continue;
    const s = o[n.i];
    if (s === '' || s == null) continue;
    const factor = n.unit === 'kJ' ? 1 : UNIT_FROM_G[n.unit];
    v[n.key] = round(Number(s) * factor);
    const e = o[n.i + '_e'];
    if (e !== '' && e != null && Number(e) > 0) sd[n.key] = round(Number(e) * factor);
  }
  if (v.energy_kj != null) v.energy = Math.round(v.energy_kj / 4.184);
  return { v, sd, name: o.name, sci: o.scie, group: o.grup, regions: Number(o.regn) || null };
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
  return out;
}

const COOKED = new Set(['haslanmis', 'pismis', 'konserve', 'firin']);

// ---------- küratörlü katalog ----------
const catIds = new Set(CATEGORIES.map((c) => c[0]));
const ids = new Set();
const foods = [];
let ifctLinked = 0, estimated = 0;
for (const food of FOODS) {
  if (ids.has(food.id)) throw new Error('Yinelenen id: ' + food.id);
  ids.add(food.id);
  if (!catIds.has(food.cat)) throw new Error('Bilinmeyen kategori: ' + food.cat);
  // Aynı besinin IFCT ölçümlü (çiğ/kuru) formu: pişmiş formlar için profil tahmini kaynağı
  const refIfct = food.forms.find((fm) => fm[2])?.[2] ?? null;
  const refData = refIfct ? ifctValues(refIfct) : null;
  const forms = food.forms.map(([key, ndb, ifc, custom]) => {
    if (!FORM_LABELS[key]) throw new Error('Bilinmeyen form: ' + key);
    const v = {}, s = {}, alt = {}, sd = {};
    let usda = null, ic = null;
    if (ndb) {
      const d = des.get(ndb);
      if (!d) throw new Error('FOOD_DES kodu yok: ' + ndb);
      Object.assign(v, usdaValues(ndb));
      for (const k of Object.keys(v)) s[k] = 'u';
      usda = { ndb, desc: d.long, refuse: d.refuse, refDesc: d.refDesc || null, sci: d.sci || null };
    }
    if (ifc) {
      ifctLinked++;
      const d = ifctValues(ifc);
      for (const [k, val] of Object.entries(d.v)) {
        if (v[k] == null) { v[k] = val; s[k] = 'i'; if (d.sd[k] != null) sd[k] = d.sd[k]; }
        else alt[k] = val;
      }
      ic = { code: ifc, name: d.name, sci: d.sci || null, regions: d.regions };
    } else if (refData && ndb && (COOKED.has(key) || key !== food.forms.find((fm) => fm[2])[0])) {
      // Amino asit profili proteine, yağ asidi profili toplam yağa oranlanarak tahmin edilir.
      const rp = refData.v.protein, rf = refData.v.fat;
      for (const n of NUTRIENTS) {
        const rv = refData.v[n.key];
        if (rv == null || v[n.key] != null) continue;
        let est = null;
        if (n.aa && rp > 0 && v.protein != null) est = (rv / rp) * v.protein;
        else if ((n.fa || ['n3', 'n6', 'n9', 'trans'].includes(n.key)) && rf > 0 && v.fat != null) {
          // rf g, rv birimi n.unit (mg veya g) -> oran aynı birimde kalır
          est = (rv / rf) * v.fat;
        }
        if (est != null) { v[n.key] = round(est); s[n.key] = 'e'; estimated++; }
      }
    }
    if (!ndb && !ifc) throw new Error('Formun kaynağı yok: ' + food.id);
    const portions = ndb ? usdaPortions(ndb) : [];
    return {
      key,
      label: custom || FORM_LABELS[key],
      usda,
      ifct: ic,
      estFrom: Object.values(s).includes('e') ? refIfct : null,
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
    note: food.note || null,
    forms,
  });
}

// ---------- geniş katalog (USDA bitkisel gruplar) ----------
const EXT_GROUPS = {
  '0200': 'Baharat ve otlar', '0900': 'Meyveler ve meyve suları', '1100': 'Sebzeler ve sebze ürünleri',
  '1200': 'Kuruyemiş ve tohumlar', '1600': 'Baklagiller ve ürünleri', '2000': 'Tahıllar ve makarna',
  '0400': 'Yağlar', '1400': 'İçecekler',
};
const ANIMAL = /\b(milk|cheese|butter|eggs?|chicken|beef|pork|ham|bacon|fish|tuna|salmon|shrimp|crab|lard|tallow|gelatin|honey|whey|casein|cream|creamed|yogurt|meat|turkey|lamb|veal|anchov\w*|clam|sardine|cod|oyster|mayonnaise|ghee|sausage|frankfurter|bologna|cod liver|herring|menhaden|whale|seal|egg|mutton|goose|duck|poultry|buttermilk|lactose|nonfat dry milk|sour cream|ensure|formula|gravy|broth|chowder)\b/i;
const PLANT_OK = /\b(soymilk|soy milk|almond milk|rice milk|coconut milk|coconut cream|oat milk|peanut butter|sesame butter|cashew butter|almond butter|nut butter|butternut|butterhead|butterbur|cocoa butter|shea|butter beans|milk substitute|coconut water|milkfish)\b/i;
const curatedNdb = new Set(FOODS.flatMap((f) => f.forms.map((fm) => fm[1]).filter(Boolean)));
const ext = [];
for (const [ndb, d] of des) {
  if (!EXT_GROUPS[d.grp] || curatedNdb.has(ndb)) continue;
  const name = d.long;
  const animal = ANIMAL.test(name.replace(PLANT_OK, ''));
  if (animal) continue;
  // Marka ürünleri (büyük harfli marka adları) içerik doğrulanamadığı için dışarıda
  if (/[A-Z]{4,}/.test(name) || /\bmeatless\b/i.test(name)) continue;
  if (d.grp === '1400' && /\b(beer|wine|liqueur|whiskey|vodka|rum|gin|alcoholic|cocktail|distilled|daiquiri|martini)\b/i.test(name)) continue;
  const v = usdaValues(ndb);
  ext.push({ n: ndb, g: d.grp, en: name, sci: d.sci || null, r: d.refuse, rd: d.refDesc || null, p: usdaPortions(ndb), v });
}
ext.sort((a, b) => a.en.localeCompare(b.en));

const outDir = path.join(root, 'src/data');
fs.mkdirSync(outDir, { recursive: true });
const meta = {
  sources: 'USDA SR28 (2015) + IFCT 2017',
  curated: foods.length,
  forms: foods.reduce((a, f) => a + f.forms.length, 0),
  ifctLinked, estimated, ext: ext.length,
};
fs.writeFileSync(path.join(outDir, 'foods.json'), JSON.stringify({ meta, categories: CATEGORIES, foods }));
fs.writeFileSync(path.join(outDir, 'foods-ext.json'), JSON.stringify({ groups: EXT_GROUPS, foods: ext }));
console.log(meta, 'foods.json', (fs.statSync(path.join(outDir, 'foods.json')).size / 1024).toFixed(0) + ' KB', 'ext', (fs.statSync(path.join(outDir, 'foods-ext.json')).size / 1024).toFixed(0) + ' KB');

// Miktar ölçekleme, tarif toplamı ve hesaplanan göstergeler
import { NUTRIENTS } from './nutrients.js';

const AA_KEYS = NUTRIENTS.filter((n) => n.aa).map((n) => n.key);

// Tek besin, g gram için. Döner: { v, s, alt, sd, cov } (cov: tek besinde hep 1/1)
export function scaleItem(item, grams) {
  const f = grams / 100;
  const v = {}, s = {}, alt = {}, sd = {};
  for (const [k, x] of Object.entries(item.v)) { v[k] = x * f; s[k] = item.s[k]; }
  for (const [k, x] of Object.entries(item.alt || {})) alt[k] = x * f;
  for (const [k, x] of Object.entries(item.sd || {})) sd[k] = x * f;
  addDerived(v, s);
  // Amino asit skoru için protein tabanı: amino asitlerle aynı kaynaktaki protein
  if (v.lys != null) {
    const basis = s.lys === 'i' && alt.protein != null ? alt.protein : v.protein;
    v._aaProtein = basis;
  }
  return { v, s, alt, sd, grams, n: 1 };
}

function addDerived(v, s) {
  if (v.na != null) { v.salt = (v.na * 2.5) / 1000; s.salt = 'd'; }
  if (v.energy_kj == null && v.energy != null) { v.energy_kj = v.energy * 4.184; s.energy_kj = 'd'; }
  if (v.carb_avail == null && v.carb != null && v.fiber != null) { v.carb_avail = Math.max(0, v.carb - v.fiber); s.carb_avail = 'd'; }
}

// Tarif: malzemelerin toplamı. Her bileşen için kaç malzemede veri olduğu (cov) tutulur.
export function aggregate(scaledItems) {
  const v = {}, s = {}, cov = {};
  let grams = 0, aaProt = 0, aaHas = false;
  for (const it of scaledItems) {
    grams += it.grams;
    for (const [k, x] of Object.entries(it.v)) {
      if (k.startsWith('_')) continue;
      v[k] = (v[k] || 0) + x;
      cov[k] = (cov[k] || 0) + 1;
      const src = it.s[k];
      s[k] = s[k] == null ? src : s[k] === src ? src : 'm';
    }
    if (it.v._aaProtein != null) { aaProt += it.v._aaProtein; aaHas = true; }
  }
  if (aaHas) v._aaProtein = aaProt;
  return { v, s, alt: {}, sd: {}, cov, grams, n: scaledItems.length };
}

export function scaleAggregate(agg, factor) {
  const v = {};
  for (const [k, x] of Object.entries(agg.v)) v[k] = x * factor;
  return { ...agg, v, grams: agg.grams * factor };
}

// WHO/FAO/UNU 2007 yetişkin referans amino asit örüntüsü (mg / g protein)
export const AA_REF = [
  ['his', 'Histidin', ['his'], 15],
  ['ile', 'İzolösin', ['ile'], 30],
  ['leu', 'Lösin', ['leu'], 59],
  ['lys', 'Lizin', ['lys'], 45],
  ['saa', 'Met + Sis', ['met', 'cys'], 22],
  ['aaa', 'Phe + Tir', ['phe', 'tyr'], 38],
  ['thr', 'Treonin', ['thr'], 23],
  ['trp', 'Triptofan', ['trp'], 6],
  ['val', 'Valin', ['val'], 39],
];

export function derive(r) {
  const v = r.v;
  const out = {};
  // Enerji dağılımı (Atwater genel faktörleri, yaklaşık)
  const p = v.protein, f = v.fat, fib = v.fiber ?? 0;
  const c = v.carb_avail ?? (v.carb != null ? Math.max(0, v.carb - fib) : null);
  if (p != null && f != null && c != null) {
    const kp = p * 4, kf = f * 9, kc = c * 4, kfi = fib * 2;
    const tot = kp + kf + kc + kfi;
    if (tot > 0) out.energySplit = { p: (kp / tot) * 100, f: (kf / tot) * 100, c: (kc / tot) * 100, fib: (kfi / tot) * 100, total: tot };
  }
  if (p != null && v.energy > 0) out.protDensity = (p / v.energy) * 100; // g / 100 kcal
  // PRAL (Remer & Manz 1995) — seçilen miktar için mEq
  if ([v.protein, v.p, v.k, v.mg, v.ca].every((x) => x != null)) {
    out.pral = 0.49 * v.protein + 0.037 * v.p - 0.021 * v.k - 0.026 * v.mg - 0.013 * v.ca;
  }
  // Omega-6 : omega-3
  const n6 = v.n6 ?? (v.la != null ? v.la / 1000 : null);
  const n3 = v.n3 ?? (v.ala_fa != null ? v.ala_fa / 1000 : null);
  if (n6 != null && n3 > 0) out.n6n3 = n6 / n3;
  // Na : K molar
  if (v.na != null && v.k > 0) out.naK = (v.na / 22.99) / (v.k / 39.098);
  // Molar oranlar (fitat 660,04 g/mol; oksalat 88,02 g/mol)
  if (v.phytate != null) {
    if (v.zn > 0) out.phyZn = (v.phytate / 660.04) / (v.zn / 65.38);
    if (v.fe > 0) out.phyFe = (v.phytate / 660.04) / (v.fe / 55.845);
    if (v.ca > 0) out.phyCa = (v.phytate / 660.04) / (v.ca / 40.078);
  }
  if (v.oxalate != null && v.ca > 0) out.oxCa = (v.oxalate / 88.02) / (v.ca / 40.078);
  // Amino asit skoru (sindirilebilirlik düzeltmesi yok)
  const basis = v._aaProtein;
  if (basis > 0 && AA_KEYS.some((k) => v[k] != null)) {
    const rows = [];
    for (const [id, label, keys, ref] of AA_REF) {
      if (keys.some((k) => v[k] == null)) { rows.push({ id, label, ref, mgPerG: null, ratio: null }); continue; }
      const mg = keys.reduce((a, k) => a + v[k], 0) / basis;
      rows.push({ id, label, ref, mgPerG: mg, ratio: mg / ref });
    }
    const valid = rows.filter((x) => x.ratio != null);
    if (valid.length) {
      const lim = valid.reduce((a, b) => (b.ratio < a.ratio ? b : a));
      out.aas = { rows, score: Math.min(1, lim.ratio) * 100, raw: lim.ratio * 100, limiting: lim.label, complete: valid.length === rows.length };
    }
  }
  return out;
}

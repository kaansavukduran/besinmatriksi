// Miktar ölçekleme, tarif toplamı ve hesaplanan göstergeler

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
  return { v, s, alt, sd, grams, n: 1, name: item.name };
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
  const aaGaps = scaledItems.flatMap((it, index) => {
    const keys = ['protein', ...new Set(AA_REF.flatMap(row => row[2]))].filter(k => it.v[k] == null);
    return keys.length ? [{ name: it.name, index: index + 1, keys }] : [];
  });
  return { v, s, alt: {}, sd: {}, cov, grams, n: scaledItems.length, aaGaps };
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

// Quality is a ratio to TOTAL recipe protein, never protein from only measured-AA ingredients.
// Missing AA measurements give lower bounds; missing protein prevents a trustworthy ratio.
export function assessAmino(r) {
  const n = r.n || 1;
  const covered = k => r.v[k] != null && (!r.cov || r.cov[k] === n);
  const allAA = AA_REF.every(row => row[2].every(covered));
  const proteinComplete = covered('protein');
  const basis = proteinComplete ? (allAA && r.v._aaProtein > 0 ? r.v._aaProtein : r.v.protein) : null;
  const rows = AA_REF.map(([id, label, keys, ref]) => {
    const known = keys.filter(k => r.v[k] != null);
    const amount = known.length ? known.reduce((sum, k) => sum + r.v[k], 0) : null;
    const complete = keys.every(covered);
    const mgPerG = amount != null && basis > 0 ? amount / basis : null;
    return { id, label, ref, amount, complete, mgPerG, ratio: mgPerG == null ? null : mgPerG / ref };
  });
  const valid = rows.filter(row => row.ratio != null);
  const weakest = valid.length ? valid.reduce((a, b) => a.ratio <= b.ratio ? a : b) : null;
  const complete = allAA && basis > 0;
  const raw = valid.length === rows.length ? weakest.ratio * 100 : null;
  return { rows, basis, proteinComplete, complete, raw, score: raw == null ? null : Math.min(100, raw),
    limiting: complete ? weakest.label : null, observedWeakest: weakest?.label, gaps: r.aaGaps || [] };
}

export function derive(r) {
  // Kısmi tarif toplamları oranlara ve skorlara tam ölçüm gibi giremez.
  const v = Object.fromEntries(Object.entries(r.v).filter(([k]) => !r.cov || r.n <= 1 || r.cov[k] === r.n || k === '_aaProtein'));
  const out = {};
  // Enerji dağılımı (Atwater genel faktörleri, yaklaşık)
  const p = v.protein, f = v.fat, fib = v.fiber;
  const c = v.carb_avail ?? (v.carb != null && fib != null ? Math.max(0, v.carb - fib) : null);
  if (p != null && f != null && c != null && fib != null) {
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
  if (AA_REF.some(row => row[2].some(k => r.v[k] != null))) out.aas = assessAmino(r);
  return out;
}

// Aynı kategoride makro profili (100 g, ilk biçim) en yakın besinler. Veri olmayan bileşen karşılaştırmaya girmez (0 sayılmaz).
export const SIM_KEYS = ['energy', 'protein', 'carb_avail', 'fat', 'fiber'];

export function profileDistance(a, b) {
  let sum = 0, n = 0;
  for (const k of SIM_KEYS) {
    const x = a[k], y = b[k];
    if (x == null || y == null) continue;
    sum += Math.abs(x - y) / Math.max(Math.abs(x), Math.abs(y), 1);
    n++;
  }
  return n >= 3 ? sum / n : null;
}

export function similarFoods(food, foods, { count = 6, formIndex = 0 } = {}) {
  const base = food.forms[formIndex]?.v || food.forms[0].v;
  return foods
    .filter((f) => f.id !== food.id && f.cat === food.cat)
    .map((f) => ({ f, d: profileDistance(base, f.forms[0].v) }))
    .filter((x) => x.d != null)
    .sort((a, b) => a.d - b.d || a.f.id.localeCompare(b.f.id))
    .slice(0, count)
    .map((x) => x.f);
}

// Tarifin günlük referansa en uzak kaldığı besin bileşenleri ve onları 100 g'da en çok veren katalog besinleri.
// Saf fonksiyon: referans, besin listesi ve katalog dışarıdan verilir. "veri yok" bir açık sayılmaz (0 değildir).
export const GAP_EXCLUDE = new Set(['energy', 'energy_kj', 'carb_avail', 'sugars', 'fat', 'sfa', 'salt']);
// Bitkisel besinlerde güvenilir doğal kaynağı olmayanlar: not gösterilir; bitkisel besin önerilmez, yalnız (görünürse) hayvansal kaynaklar listelenir.
export const NO_PLANT_SOURCE = new Set(['b12', 'vitd']);

// Baharat ve taze otlar 100 g'da yüksek görünür ama bu miktarda yenmez; öneriye alınmaz.
export const GAP_SKIP_CATS = new Set(['baharat', 'taze_ot']);

export function recipeGaps(r, nutrients, foods, refFor, { count = 3, perGap = 3 } = {}) {
  const gaps = [];
  for (const n of nutrients) {
    if (GAP_EXCLUDE.has(n.key)) continue;
    const ref = refFor(n);
    const x = r.v[n.key];
    if (!ref || !(ref.value > 0) || x == null) continue;
    const pct = (x / ref.value) * 100;
    if (pct >= 100) continue;
    gaps.push({ n, pct, partial: (r.cov?.[n.key] || 0) < r.n });
  }
  gaps.sort((a, b) => a.pct - b.pct);
  return gaps.slice(0, count).map((g) => {
    const noPlant = NO_PLANT_SOURCE.has(g.n.key);
    const best = foods
      .filter((f) => !noPlant || f.animal)
      .filter((f) => !GAP_SKIP_CATS.has(f.cat))
      .map((f) => ({ f, v: f.forms[0]?.v?.[g.n.key] }))
      .filter((x) => x.v != null && x.v > 0)
      .sort((a, b) => b.v - a.v)
      .slice(0, perGap);
    return { ...g, foods: best, noPlant };
  });
}

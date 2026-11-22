// Tarifin günlük referansa en uzak kaldığı besin bileşenleri ve onları 100 g'da en çok veren katalog besinleri.
// Saf fonksiyon: referans, besin listesi ve katalog dışarıdan verilir. "veri yok" bir açık sayılmaz (0 değildir).
export const GAP_EXCLUDE = new Set(['energy', 'energy_kj', 'carb_avail', 'sugars', 'fat', 'sfa', 'salt']);
// B12 doğal bitkisel besinlerde güvenilir değildir; yalnız hayvansal ya da B12 eklenmiş (zenginleştirilmiş) bitkisel ürünler önerilir.
// D vitamininde UV ışığına maruz mantarlar ve zenginleştirilmiş bitkisel içecekler geçerli kaynaklardır.
export const NO_PLANT_SOURCE = new Set(['b12']);
export const FORTIFIED_OR_MUSHROOM_NOTE = new Set(['b12', 'vitd']);

// Baharat ve taze otlar 100 g'da yüksek görünür ama bu miktarda yenmez; öneriye alınmaz.
export const GAP_SKIP_CATS = new Set(['baharat', 'taze_ot']);

const FORTIFIED_RE = /\b(eklenmiş|zenginleştirilmiş|fortified|added|b12|nutritional yeast|besin mayası)\b/i;
const PLANT_DAIRY_RE = /\b(süt|sütü|milk|soymilk|yoğurt|yoğurdu|yogurt)\b/i;
const UNRELIABLE_B12_RE = /\b(tempeh|miso|natto|kimchi|sauerkraut|lahana turşusu)\b/i;

export function isReliableGapSource(food, form, nutrientKey) {
  const val = form?.v?.[nutrientKey];
  if (!(val > 0)) return false;
  if (food.animal) return true;
  if (nutrientKey === 'b12') {
    if (['mantar', 'alg', 'ekmek', 'yag', 'tahil'].includes(food.cat)) return false;
    const text = `${food.id || ''} ${food.tr || ''} ${food.en || ''} ${form.usda?.desc || ''}`;
    if (UNRELIABLE_B12_RE.test(text)) return false;
    return val >= 0.4 && (FORTIFIED_RE.test(text) || (['soya', 'icecek', 'diger'].includes(food.cat) && PLANT_DAIRY_RE.test(text)));
  }
  if (nutrientKey === 'vitd') {
    if (food.cat === 'mantar') return val >= 0.5;
    const text = `${food.id || ''} ${food.tr || ''} ${food.en || ''} ${form.usda?.desc || ''}`;
    return val >= 0.5 && (FORTIFIED_RE.test(text) || (['soya', 'icecek'].includes(food.cat) && PLANT_DAIRY_RE.test(text)));
  }
  return true;
}

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
    const sourceNote = FORTIFIED_OR_MUSHROOM_NOTE.has(g.n.key) ? g.n.key : null;
    const best = foods
      .filter((f) => !GAP_SKIP_CATS.has(f.cat))
      .map((f) => {
        let pick = null;
        for (let fi = 0; fi < (f.forms || []).length; fi++) {
          const fm = f.forms[fi];
          if (!isReliableGapSource(f, fm, g.n.key)) continue;
          const v = fm.v[g.n.key];
          if (!pick || v > pick.v) pick = { f, fi, fm, v };
        }
        return pick;
      })
      .filter(Boolean)
      .sort((a, b) => b.v - a.v)
      .slice(0, perGap);
    return { ...g, foods: best, noPlant, sourceNote };
  });
}

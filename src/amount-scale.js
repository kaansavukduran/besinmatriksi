// Gram kaydırıcısı ölçeği.
// B168: doğrusal 1–1000 g telefonda ~3,8 g/piksel ediyordu → karekök ölçek.
// B197 (Kaan: en fazla 10 kg): üst sınır 10 000 g; küp ölçek küçük miktarlara yine geniş alan bırakır
// (10 g ≈ %10, 100 g ≈ %22, 1 kg ≈ %46, 10 kg sağ uç). Konum 0–1000 tamsayıdır; gram değeri yuvarlanır.
export const MAX_GRAMS = 10000;
export const SLIDER_STEPS = 1000;
const EXP = 3;
const stepFor = (g) => (g < 100 ? 1 : g < 500 ? 5 : g < 2000 ? 10 : g < 5000 ? 50 : 100);
export function sliderToGrams(pos, max = MAX_GRAMS) {
  const t = Math.min(1, Math.max(0, Number(pos) / SLIDER_STEPS));
  const g = 1 + (max - 1) * t ** EXP;
  const step = stepFor(g);
  return Math.min(max, Math.max(1, Math.round(g / step) * step));
}
export function gramsToSlider(g, max = MAX_GRAMS) {
  const x = Math.min(max, Math.max(1, Number(g) || 1));
  return Math.round(SLIDER_STEPS * ((x - 1) / (max - 1)) ** (1 / EXP));
}
// Kısa gösterim: 1000 g ve üstü kg (ör. 2,5 kg); altı g
export const kgLabel = (g) => (g >= 1000 ? `${String(g / 1000).replace('.', ',')} kg` : `${g} g`);

// B252: doğrulanmış USDA hacim porsiyonlarından (cup/fl oz/tbsp/tsp; türetilmiş/tarif porsiyonu hariç) özgül yoğunluk (g/mL)
const VOL_ML = { cup: 236.588, 'fl oz': 29.5735, tbsp: 14.7868, tablespoon: 14.7868, tsp: 4.9289, teaspoon: 4.9289 };
export function volumeDensity(portions) {
  let best = null;
  for (const p of portions || []) {
    if (p.d || p.r || !p.en || !(p.g > 0)) continue;
    const m = /^(\d*\.?\d+)\s*(cup|fl oz|tbsp|tablespoon|tsp|teaspoon)s?\b/i.exec(String(p.en).trim());
    if (!m) continue;
    const qty = Number(m[1]), unit = m[2].toLowerCase();
    if (!(qty > 0) || !VOL_ML[unit]) continue;
    const gPerMl = p.g / (qty * VOL_ML[unit]);
    if (!(gPerMl >= 0.3 && gPerMl <= 2.5)) continue;
    const prio = unit === 'cup' ? 3 : unit === 'fl oz' ? 2 : 1;
    if (!best || prio > best.prio) best = { gPerMl: Math.round(gPerMl * 1000) / 1000, src: m[0], prio };
  }
  return best ? { gPerMl: best.gPerMl, src: best.src } : null;
}

export function amountUnitText(g, { oz = false, density = null, customLiquid = false, format = (x) => String(Math.round(x)) } = {}) {
  if (customLiquid) return 'mL';
  if (oz) return `oz (≈ ${format(g)} g)`;
  if (density?.gPerMl > 0) return `g (≈ ${format(g / density.gPerMl, 'low')} mL)`;
  return 'g';
}

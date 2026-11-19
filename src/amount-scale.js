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

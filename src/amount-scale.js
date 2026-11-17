// B168: gram kaydırıcısı karekök ölçekli. Doğrusal 1–1000 g telefonda ~3,8 g/piksel ediyordu (10 g ≈ 3 piksel);
// karekök ölçekte kaydırıcının sol yarısı 1–250 g'ı kapsar. Konum 0–1000 tamsayıdır; gram değeri yuvarlanır.
export const SLIDER_STEPS = 1000;
export function sliderToGrams(pos, max = 1000) {
  const t = Math.min(1, Math.max(0, Number(pos) / SLIDER_STEPS));
  const g = 1 + (max - 1) * t * t;
  const step = g < 100 ? 1 : g < 500 ? 5 : 10;
  return Math.min(max, Math.max(1, Math.round(g / step) * step));
}
export function gramsToSlider(g, max = 1000) {
  const x = Math.min(max, Math.max(1, Number(g) || 1));
  return Math.round(SLIDER_STEPS * Math.sqrt((x - 1) / (max - 1)));
}

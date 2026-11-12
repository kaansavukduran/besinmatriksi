// Aion anları: günün saatine göre selam ve Günlük hedeflerine ulaşma kutlaması (saf yardımcılar; test edilebilir).
import { L } from './i18n.js';

// Saat (0–23, yerel) → selam. Gece geç saatte uykuyu hatırlatır; tıbbi öneri değildir.
export function greetingFor(hour) {
  if (hour >= 5 && hour < 11) return L("Günaydın! Kahvaltıda ne var, bakalım mı?");
  if (hour >= 11 && hour < 17) return L("İyi günler! Bugün neyi keşfediyoruz?");
  if (hour >= 17 && hour < 22) return L("İyi akşamlar! Günün nasıl geçti?");
  return L("İyi geceler! Geç oldu; uyku da sağlığın parçası.");
}

const GOAL_NAMES = { energy: "kalori", protein: "protein", fiber: "lif" };
// Önceki ve şimdiki ulaşılan hedefler → yeni ulaşılanlar. prev == null ise ilk bakıştır: kutlama yok.
export function newlyReached(prev, now) {
  if (!prev) return [];
  return now.filter((k) => !prev.includes(k));
}
export function celebrationText(keys) {
  const names = keys.filter((k) => GOAL_NAMES[k]).map((k) => L(GOAL_NAMES[k]));
  if (!names.length) return '';
  return L("Bugünkü {n} hedefine ulaştın! 🎉", { n: names.join(', ') });
}

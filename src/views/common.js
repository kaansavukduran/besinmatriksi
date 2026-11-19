// B218: görünümlerin ortak küçük yardımcıları (app.js'ten ayrıldı; davranış aynı)
import { S } from '../state.js';
import { CATEGORIES } from '../data.js';
import { foodArt } from '../food-art.js';
import { FOOD_ICONS } from '../food-icons.js';
import { energyEstimate } from '../personal.js';

export const catIcon = (id) => (S.settings.emoji ? CATEGORIES.find((c) => c.id === id)?.icon || '📦' : '');
// Besinin kendi simgesi; yoksa kategori simgesi
export const foodIcon = (f, size = 28) => (S.settings.emoji ? foodArt(f?.id, size) || FOOD_ICONS[f?.id] || catIcon(f?.cat) : '');
// Temel değer yüzdeleri için kişi: profilde cinsiyet ve enerji tahmini varsa onlar, yoksa ortalama kadın/erkek
export function persona() {
  const p = S.personal?.profile || {};
  let energy = null; try { const e = energyEstimate(p); if (e.status === 'ready') energy = e.daily; } catch {}
  return { sex: ['female', 'male'].includes(p.sex) ? p.sex : null, energy };
}
export const isPhone = () => !!window.matchMedia?.('(max-width: 700px)').matches;

// B217: Günlük geçmişi (takip). Saf hesaplar: aralık özeti, ortalamalar, en çok yenenler, ay takvimi ızgarası.
// Kural: kayıtsız gün 0 değildir; ortalamalar yalnız değeri bilinen günlerden alınır. Bazı kayıtlarda ölçüm yoksa değer alt sınırdır (≥).
import { dayResult, shiftDay } from './personal.js';

export const HISTORY_KEYS = [['energy', 'kcal'], ['protein', 'g'], ['fiber', 'g']];
// Grafikte seçilebilen değerler (B201): [anahtar, birim, başlık]
export const WEEK_KEYS = [['energy', 'kcal', "Enerji"], ['protein', 'g', "Protein"], ['fiber', 'g', "Lif"]];

export function daySummary(state, day, resolve, consumedOnly = false) {
  const { entries, result } = dayResult(state, day, resolve, consumedOnly);
  const v = {}, partial = {};
  for (const [key] of HISTORY_KEYS) {
    const known = result.cov?.[key] || 0;
    v[key] = entries.length && known ? result.v[key] : null;
    partial[key] = entries.length > 0 && known < entries.length;
  }
  return { day, n: entries.length, entries, v, partial };
}

// endDay dahil geriye doğru `days` gün (eskiden yeniye)
export function rangeSummary(state, endDay, days, resolve, consumedOnly = false) {
  const list = [];
  for (let i = days - 1; i >= 0; i--) list.push(daySummary(state, shiftDay(endDay, -i), resolve, consumedOnly));
  return summarize(list, resolve);
}

export function summarize(list, resolve) {
  const logged = list.filter((d) => d.n > 0);
  const avg = {};
  for (const [key] of HISTORY_KEYS) {
    const known = logged.filter((d) => d.v[key] != null);
    avg[key] = known.length
      ? { value: known.reduce((a, d) => a + d.v[key], 0) / known.length, days: known.length, partial: known.some((d) => d.partial[key]) }
      : { value: null, days: 0, partial: false };
  }
  // En çok yenenler: aynı besin/biçim birleşir; önce kaç günde yendiği, sonra toplam gram
  const foods = new Map();
  for (const d of logged) for (const e of d.entries) {
    const k = JSON.stringify(e.ref);
    const f = foods.get(k) || { ref: e.ref, g: 0, days: new Set() };
    f.g += Number(e.g) || 0; f.days.add(d.day); foods.set(k, f);
  }
  const top = [...foods.values()]
    .map((f) => ({ ref: f.ref, name: resolve(f.ref)?.name || null, g: f.g, days: f.days.size }))
    .sort((a, b) => b.days - a.days || b.g - a.g)
    .slice(0, 5);
  return { days: list, logged: logged.length, total: list.length, avg, top };
}

// Pazartesi başlangıçlı ay ızgarası: haftalar × 7 hücre; ay dışı hücreler null
export function monthGrid(year, month) {
  const first = new Date(year, month, 1, 12);
  const lead = (first.getDay() + 6) % 7; // Pzt = 0
  const count = new Date(year, month + 1, 0, 12).getDate();
  const cells = [...Array(lead).fill(null)];
  for (let d = 1; d <= count; d++) cells.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  while (cells.length % 7) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export function shiftMonth(ym, delta) {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1, 12);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

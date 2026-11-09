import { norm } from './util.js';
export const SEARCH_ALIASES = {
  salatalik: ['hıyar'], yabanmersini: ['yabanmersini', 'blueberry'],
  ahududu: ['frambuaz'], karabugday: ['greçka'], brokoli: ['brokkoli'],
  keten: ['flaxseed'], kirmizi_fasulye: ['meksika fasulyesi'],
  soya_sutu: ['soya içeceği'], soya_sutu_z: ['soya içeceği'],
  badem_sutu: ['badem içeceği'], pirinc_sutu: ['pirinç içeceği'],
  aci_bakla: ['tirmis'], taro: ['kolokas'], yerfistigi: ['araşit'],
};
export function searchKey(food) {
  return norm(`${food.tr} ${food.en} ${food.sci || ''} ${(SEARCH_ALIASES[food.id] || []).join(' ')}`);
}
export function recentSearches(list, query = '') {
  const clean = (Array.isArray(list) ? list : []).filter(x => typeof x === 'string').map(x => x.trim().slice(0, 80)).filter(x => norm(x));
  const q = String(query).trim().slice(0, 80);
  const all = norm(q) ? [q, ...clean] : clean;
  const seen = new Set();
  return all.filter(x => { const k = norm(x); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 8);
}

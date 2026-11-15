import { norm } from './util.js';
export const SEARCH_ALIASES = {
  salatalik: ['hıyar'], yabanmersini: ['yabanmersini', 'blueberry'],
  ahududu: ['frambuaz'], karabugday: ['greçka'], brokoli: ['brokkoli'],
  keten: ['flaxseed'], kirmizi_fasulye: ['meksika fasulyesi'],
  soya_sutu: ['soya içeceği'], soya_sutu_z: ['soya içeceği'],
  badem_sutu: ['badem içeceği'], pirinc_sutu: ['pirinç içeceği'],
  aci_bakla: ['tirmis'], taro: ['kolokas'], yerfistigi: ['araşit'],
  kahve: ['filtre kahve', 'filter coffee'], espresso: ['doppio', 'double espresso', 'kahve'],
  americano: ['kahve'], turk_kahvesi: ['kahve'], turk_kahvesi_sade: ['kahve'],
  latte_sutlu: ['kahve', 'latte'], cappuccino_sutlu: ['kahve', 'kapuçino'],
  latte_bitkisel: ['kahve'], cappuccino_bitkisel: ['kahve', 'kapuçino'],
  flat_white: ['kahve'], cortado: ['kahve'], espresso_macchiato: ['kahve', 'makyato'],
  mocha: ['kahve', 'moka'], buzlu_latte: ['kahve', 'iced latte'],
  ristretto: ['kahve'], lungo: ['kahve'], hazir_kahve: ['neskafe', 'nescafe', 'granül kahve'],
  dondurulmus_pizza_peynirli: ['donmuş pizza', 'dondurulmus pizza', 'frozen pizza'],
  dondurulmus_pizza_pepperoni: ['donmuş pizza', 'dondurulmus pizza', 'frozen pizza'],
  patates_cipsi: ['cips', 'chips', 'crisps'], tortilla_cipsi: ['cips', 'mısır cipsi'],
  nacho_cipsi: ['cips', 'peynirli cips'], sert_seker: ['şekerleme', 'bonbon'],
  damla_cikolatali_kurabiye: ['cookie', 'çikolatalı bisküvi'],
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

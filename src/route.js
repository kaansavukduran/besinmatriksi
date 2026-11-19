// B205: Hafif hash yönlendirmesi (çevrimdışı, file:// ve paketli uygulamalarda da çalışır).
// #/food/<id>[/<biçim>] · #/usda/<ndb> · #/recipes · #/diary · #/compare · #/about · #/settings · #/ (Keşfet)
export const TAB_ROUTES = { kesfet: '', tarif: 'recipes', gunluk: 'diary', karsilastir: 'compare', hakkinda: 'about', ayarlar: 'settings' };
const ROUTE_TABS = Object.fromEntries(Object.entries(TAB_ROUTES).map(([tab, r]) => [r, tab]));

export function routeOf(tab, sel) {
  if (tab === 'kesfet' && sel) {
    if (sel.t === 'c') return `#/food/${encodeURIComponent(sel.id)}${sel.f ? '/' + sel.f : ''}`;
    if (sel.t === 'x') return `#/usda/${encodeURIComponent(sel.n)}`;
  }
  return `#/${TAB_ROUTES[tab] ?? ''}`;
}

// knownFood(id, f) → bu biçim katalogda var mı; bilinmeyen bağlantı Keşfet'e düşer (hata yok)
export function parseRoute(hash, knownFood = () => true) {
  const parts = String(hash || '').replace(/^#\/?/, '').split('/').filter(Boolean).map((p) => { try { return decodeURIComponent(p); } catch { return p; } });
  if (!parts.length) return { tab: 'kesfet', sel: null };
  if (parts[0] === 'food' && parts[1]) {
    const f = Number.isInteger(+parts[2]) && +parts[2] >= 0 ? +parts[2] : 0;
    if (knownFood(parts[1], f)) return { tab: 'kesfet', sel: { t: 'c', id: parts[1], f } };
    if (f && knownFood(parts[1], 0)) return { tab: 'kesfet', sel: { t: 'c', id: parts[1], f: 0 } };
    return { tab: 'kesfet', sel: null };
  }
  if (parts[0] === 'usda' && /^\d{4,6}$/.test(parts[1] || '')) return { tab: 'kesfet', sel: { t: 'x', n: parts[1] } };
  if (parts[0] in ROUTE_TABS) return { tab: ROUTE_TABS[parts[0]], sel: null };
  return { tab: 'kesfet', sel: null };
}

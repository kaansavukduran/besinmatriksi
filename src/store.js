// Ayarlar ve tarifler cihazda (localStorage) saklanır; hiçbir şey ağa gönderilmez.
import { uid } from './util.js';
import { DEFAULT_SETTINGS, SETTINGS_VERSION, normalizeSettings } from './settings.js';
import { normalizeCollections, remapCustomRefs } from './collections.js';
import { normalizeRecipe, normalizeCustom } from './records.js';
import { recentSearches } from './search.js';
export { DEFAULT_SETTINGS } from './settings.js';

const KEY_SETTINGS = 'bm.settings.v2';
const KEY_RECIPES = 'bm.recipes.v1';
const KEY_CUSTOM = 'bm.custom.v1';

export const THEMES = [
  { id: 'light', name: 'Gün ışığı', bg: '#f7f7fb', fg: '#1e2233', ac: '#6b4de6' },
  { id: 'dark', name: 'Gece', bg: '#14161f', fg: '#e7e9f3', ac: '#a58bff' },
  { id: 'oled', name: 'Siyah (OLED)', bg: '#000000', fg: '#f2f2f2', ac: '#8ad1ff' },
  { id: 'sepia', name: 'Sepya / kâğıt', bg: '#f6efe0', fg: '#3b2f22', ac: '#a8572a' },
  { id: 'pastel', name: 'Pastel', bg: '#fff5fb', fg: '#3a2a43', ac: '#e0569b' },
  { id: 'ocean', name: 'Okyanus', bg: '#eef7fb', fg: '#0f2a3a', ac: '#0c7fb0' },
  { id: 'forest', name: 'Orman', bg: '#eff6ef', fg: '#1c2f1f', ac: '#2e8a4a' },
  { id: 'contrast', name: 'Yüksek kontrast', bg: '#ffffff', fg: '#000000', ac: '#0040ff' },
  { id: 'contrast-dark', name: 'Yüksek kontrast (koyu)', bg: '#000000', fg: '#ffffff', ac: '#ffd400' },
];

export const ACCENTS = ['auto', '#6b4de6', '#e0569b', '#e2603a', '#d99a00', '#2e8a4a', '#0c7fb0', '#3557d6', '#8a2be2', '#111111'];

function read(key, fallback) {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : fallback;
  } catch {
    return fallback;
  }
}
function write(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch { return false; }
}

export function loadSettings() {
  const saved = read(KEY_SETTINGS, null);
  if (saved?.version === SETTINGS_VERSION) return normalizeSettings(saved.settings);
  const migrated = normalizeSettings(read('bm.settings.v1', null));
  saveSettings(migrated); // Eski kopya korunur; depolama kapalıysa bellekte çalışır.
  return migrated;
}
export function saveSettings(s) { return write(KEY_SETTINGS, { version: SETTINGS_VERSION, settings: normalizeSettings(s) }); }
export function loadSearches() { return recentSearches(read('bm.searches.v1', [])); }
export function saveSearches(list) { return write('bm.searches.v1', recentSearches(list)); }

export function normalizeProfiles(list) {
  return (Array.isArray(list) ? list : []).filter(p => p && typeof p.name === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(p.id)).slice(0, 12)
    .map(p => ({ id: p.id, name: p.name.trim().slice(0, 40) || 'Adsız profil', settings: normalizeSettings(p.settings) }));
}
export function loadProfiles() { return normalizeProfiles(read('bm.profiles.v1', [])); }
export function saveProfiles(profiles) { return write('bm.profiles.v1', normalizeProfiles(profiles)); }

export function newRecipe(name = 'Yeni tarif') {
  return { id: uid(), name, items: [], cookedWeight: null, servings: 1, created: Date.now(), updated: Date.now() };
}
export function loadRecipes() {
  const r = read(KEY_RECIPES, null);
  if (Array.isArray(r) && r.length) return r.map(x => normalizeRecipe(x)).filter(Boolean);
  return [];
}
export function saveRecipes(r) { return write(KEY_RECIPES, r); }

export function loadCustom() { const c = read(KEY_CUSTOM, []); return Array.isArray(c) ? c.map(normalizeCustom).filter(Boolean) : []; }
export function saveCustom(c) { return write(KEY_CUSTOM, c); }

export function loadCollections() { return normalizeCollections(read('bm.collections.v1', [])); }
export function saveCollections(list) { return write('bm.collections.v1', normalizeCollections(list)); }

// Dışa/içe aktarma biçimi
export function exportPayload(recipes, settings, custom = [], profiles = [], collections = []) {
  return JSON.stringify({ app: 'besin-matriksi', version: 1, exported: new Date().toISOString(), recipes, settings, custom, profiles, collections }, null, 2);
}
export function parseImport(text) {
  const o = JSON.parse(text);
  if (!o || o.app !== 'besin-matriksi' || !Array.isArray(o.recipes)) throw new Error('Bu dosya Besin Matriksi yedeği değil.');
  if (o.version !== 1) throw new Error('Bu yedek sürümü desteklenmiyor.');
  const recipes = o.recipes.map(r => normalizeRecipe(r, { freshIds: true })).filter(Boolean);
  const custom = Array.isArray(o.custom) ? o.custom.map(normalizeCustom).filter(Boolean) : [];
  const ids = new Map();
  for (const f of custom) { const original = f.id; f.id = uid(); ids.set(original, f.id); }
  for (const r of recipes) for (const it of r.items) if (it.ref.t === 'u' && ids.has(it.ref.id)) it.ref.id = ids.get(it.ref.id);
  const profiles = normalizeProfiles(o.profiles).map(p => ({ ...p, id: uid() }));
  // Koleksiyonlar yeni kimlik alır; alt kategori bağları ve kendi besin eşlemesi korunur.
  const colIds = new Map();
  const rawCols = normalizeCollections(o.collections);
  for (const c of rawCols) colIds.set(c.id, uid());
  const collections = remapCustomRefs(rawCols.map(c => ({ ...c, id: colIds.get(c.id), parent: c.parent ? colIds.get(c.parent) : null })), Object.fromEntries(ids));
  return { recipes, settings: o.settings && typeof o.settings === 'object' ? normalizeSettings(o.settings) : null, custom, profiles, collections };
}

// Aynı yedeği ikinci kez içe aktarınca kopya oluşmasın: kimlik ve zaman damgaları dışında içerik olarak aynı olan
// kendi besin, tarif, profil ve koleksiyonlar atlanır; atlanan kendi besine verilen bağlar mevcut kayda yönlendirilir.
const omit = (o, keys) => Object.fromEntries(Object.entries(o).filter(([k]) => !keys.includes(k)));
// Bellekteki kayıtlar normalize edilmemiş alanlar taşıyabilir (`_k` arama anahtarı, eksik pricePerKg): imzadan önce eşitle
const plain = (o) => Object.fromEntries(Object.entries(o).filter(([k]) => !k.startsWith('_')));
const recipeSig = (r) => JSON.stringify({ name: r.name, servings: r.servings ?? 1, cookedWeight: r.cookedWeight ?? null, items: r.items.map((it) => ({ ref: it.ref, g: it.g, pricePerKg: it.pricePerKg ?? null })) });
export function mergeImport(cur, imp) {
  const customSig = (f) => JSON.stringify(omit(plain(f), ['id']));
  const haveCustom = new Map(cur.custom.map((f) => [customSig(f), f.id]));
  const idMap = {}; const custom = [];
  for (const f of imp.custom) { const hit = haveCustom.get(customSig(f)); if (hit) idMap[f.id] = hit; else { custom.push(f); haveCustom.set(customSig(f), f.id); } }
  const remapItem = (it) => (it.ref.t === 'u' && idMap[it.ref.id] ? { ...it, ref: { ...it.ref, id: idMap[it.ref.id] } } : it);
  const haveRecipe = new Set(cur.recipes.map(recipeSig)); const recipes = [];
  for (const r0 of imp.recipes) { const r = { ...r0, items: r0.items.map(remapItem) }; const k = recipeSig(r); if (!haveRecipe.has(k)) { recipes.push(r); haveRecipe.add(k); } }
  const profileSig = (p) => JSON.stringify(omit(p, ['id']));
  const haveProfile = new Set(cur.profiles.map(profileSig)); const profiles = [];
  for (const p of imp.profiles) { const k = profileSig(p); if (!haveProfile.has(k)) { profiles.push(p); haveProfile.add(k); } }
  // Koleksiyon: üst koleksiyonu da eşleşen (aynı yolda) aynı ad + aynı öğeler kopya sayılır
  const colMap = {}; const curById = new Map(cur.collections.map((c) => [c.id, c]));
  const colSig = (c, parentSig) => JSON.stringify({ ...omit(c, ['id', 'parent']), parent: parentSig });
  const curSig = new Map(); const sigOf = (c) => colSig(c, c.parent ? sigOf(curById.get(c.parent) || {}) : null);
  for (const c of cur.collections) curSig.set(sigOf(c), c.id);
  const remapped = remapCustomRefs(imp.collections, idMap);
  const impById = new Map(remapped.map((c) => [c.id, c])); const impSigCache = new Map();
  const impSig = (c) => { if (impSigCache.has(c.id)) return impSigCache.get(c.id); const x = colSig(c, c.parent && impById.get(c.parent) ? impSig(impById.get(c.parent)) : null); impSigCache.set(c.id, x); return x; };
  const collections = [];
  for (const c0 of remapped) {
    const hit = curSig.get(impSig(c0));
    if (hit) colMap[c0.id] = hit; else collections.push(c0);
  }
  for (const c of collections) if (c.parent && colMap[c.parent]) c.parent = colMap[c.parent];
  const skipped = imp.custom.length - custom.length + imp.recipes.length - recipes.length + imp.profiles.length - profiles.length + imp.collections.length - collections.length;
  return { custom, recipes, profiles, collections, skipped };
}

// Son bakılan katalog besinleri (yalnız cihazda, en fazla 8)
export const MAX_RECENT = 8;
export function normalizeRecent(list, known = () => true) {
  const out = [], seen = new Set();
  for (const r of Array.isArray(list) ? list : []) {
    if (!r || r.t !== 'c' || typeof r.id !== 'string' || !Number.isInteger(r.f) || r.f < 0 || !known(r)) continue;
    const k = `${r.id}:${r.f}`; if (seen.has(k)) continue; seen.add(k);
    out.push({ t: 'c', id: r.id, f: r.f }); if (out.length >= MAX_RECENT) break;
  }
  return out;
}
export const pushRecent = (list, ref, known) => normalizeRecent([ref, ...list], known);
export function loadRecent(known) { return normalizeRecent(read('bm.recent.v1', []), known); }
export function saveRecent(list) { return write('bm.recent.v1', normalizeRecent(list)); }

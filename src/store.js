// Ayarlar ve tarifler cihazda (localStorage) saklanır; hiçbir şey ağa gönderilmez.
import { uid } from './util.js';

const KEY_SETTINGS = 'bm.settings.v1';
const KEY_RECIPES = 'bm.recipes.v1';
const KEY_CUSTOM = 'bm.custom.v1';

export const DEFAULT_SETTINGS = {
  theme: 'light',
  accent: 'auto',
  font: 'atkinson',
  fontSize: 17,
  lineHeight: 1.55,
  letterSpacing: 0,
  wordSpacing: 0,
  density: 'comfy',
  radius: 14,
  bold: false,
  reduceMotion: false,
  ruler: false,
  showNrv: true,
  showSource: true,
  showSd: false,
  showAlt: true,
  showMissing: false,
  precision: 'normal',
  showExt: false,
  emoji: true,
  defaultAmount: 100,
};

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
  return { ...DEFAULT_SETTINGS, ...read(KEY_SETTINGS, {}) };
}
export function saveSettings(s) { return write(KEY_SETTINGS, s); }

export function newRecipe(name = 'Yeni tarif') {
  return { id: uid(), name, items: [], cookedWeight: null, servings: 1, created: Date.now(), updated: Date.now() };
}
export function loadRecipes() {
  const r = read(KEY_RECIPES, null);
  if (Array.isArray(r) && r.length) return r;
  return [];
}
export function saveRecipes(r) { return write(KEY_RECIPES, r); }

export function loadCustom() { const c = read(KEY_CUSTOM, []); return Array.isArray(c) ? c : []; }
export function saveCustom(c) { return write(KEY_CUSTOM, c); }

// Dışa/içe aktarma biçimi
export function exportPayload(recipes, settings, custom = []) {
  return JSON.stringify({ app: 'besin-matriksi', version: 1, exported: new Date().toISOString(), recipes, settings, custom }, null, 2);
}
export function parseImport(text) {
  const o = JSON.parse(text);
  if (!o || o.app !== 'besin-matriksi' || !Array.isArray(o.recipes)) throw new Error('Bu dosya Besin Matriksi yedeği değil.');
  const recipes = o.recipes.filter((r) => r && typeof r.name === 'string' && Array.isArray(r.items)).map((r) => ({
    ...newRecipe(r.name), ...r, id: uid(),
    items: r.items.filter((it) => it && it.ref && Number(it.g) > 0).map((it) => ({ id: uid(), ref: it.ref, g: Math.min(1000, Number(it.g)) })),
  }));
  const custom = Array.isArray(o.custom) ? o.custom.filter((f) => f && typeof f.name === 'string' && f.id && f.v && typeof f.v === 'object') : [];
  return { recipes, settings: o.settings && typeof o.settings === 'object' ? o.settings : null, custom };
}

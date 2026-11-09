// Sürüm 2: yalnızca tanımlı ve doğrulanmış ayarlar saklanır.
import { SECTIONS, NUTRIENTS } from './nutrients.js';
export const MATRIX_SECTIONS = [...SECTIONS, { id: 'hesap', title: 'Hesaplanan göstergeler' }, { id: 'tolerans', title: 'Alerji, intolerans ve uyarılar' }, { id: 'kalinti', title: 'Kalıntılar ve kapsam dışı' }, { id: 'hazirlik', title: 'Hazırlama ve emilim' }];
export const SETTINGS_VERSION = 2;
export const DEFAULT_SETTINGS = {
  theme: 'light', accent: 'auto', font: 'atkinson', fontSize: 17,
  lineHeight: 1.55, letterSpacing: 0, wordSpacing: 0, density: 'comfy',
  radius: 14, bold: false, reduceMotion: false, ruler: false,
  showNrv: true, showSource: true, showSd: false, showAlt: true,
  showMissing: false, precision: 'normal', showExt: false, emoji: true,
  defaultAmount: 100,
  sectionOrder: MATRIX_SECTIONS.map(s => s.id), hiddenSections: [], pinnedNutrients: [],
};
export const SETTING_GROUPS = {
  appearance: ['theme', 'accent', 'radius'],
  reading: ['font', 'fontSize', 'lineHeight', 'letterSpacing', 'wordSpacing', 'bold'],
  accessibility: ['density', 'ruler', 'reduceMotion', 'emoji'],
  matrix: ['showNrv', 'showSource', 'showSd', 'showAlt', 'showMissing', 'precision', 'defaultAmount', 'showExt', 'sectionOrder', 'hiddenSections', 'pinnedNutrients'],
};
const enums = {
  theme: ['light', 'dark', 'oled', 'sepia', 'pastel', 'ocean', 'forest', 'contrast', 'contrast-dark'],
  font: ['atkinson', 'opendyslexic', 'lexend', 'andika', 'nunito', 'inter', 'literata', 'mono', 'system'],
  density: ['comfy', 'compact', 'large'], precision: ['low', 'normal', 'high'],
};
const ranges = { fontSize: [13, 28], lineHeight: [1.2, 2.4], letterSpacing: [0, .2], wordSpacing: [0, .5], radius: [0, 24], defaultAmount: [1, 1000] };
export function normalizeSettings(input) {
  const out = structuredClone(DEFAULT_SETTINGS);
  if (!input || typeof input !== 'object' || Array.isArray(input)) return out;
  for (const k of Object.keys(out)) {
    const v = input[k];
    if (['sectionOrder', 'hiddenSections', 'pinnedNutrients'].includes(k)) {
      const allowed = k === 'pinnedNutrients' ? NUTRIENTS.filter(n => !['energy', 'energy_kj'].includes(n.key)).map(n => n.key) : MATRIX_SECTIONS.map(s => s.id);
      const selected = Array.isArray(v) ? [...new Set(v.filter(x => allowed.includes(x)))] : [];
      out[k] = k === 'sectionOrder' ? [...selected, ...allowed.filter(x => !selected.includes(x))] : selected.slice(0, k === 'pinnedNutrients' ? 24 : allowed.length);
    } else if (enums[k]) { if (enums[k].includes(v)) out[k] = v; }
    else if (ranges[k]) {
      if (typeof v === 'number' && Number.isFinite(v)) out[k] = Math.min(ranges[k][1], Math.max(ranges[k][0], v));
    } else if (k === 'accent') {
      if (v === 'auto' || (typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v))) out[k] = v;
    } else if (typeof out[k] === 'boolean' && typeof v === 'boolean') out[k] = v;
  }
  return out;
}
export function moveSection(settings, id, direction) {
  const next = normalizeSettings(settings), order = next.sectionOrder;
  const i = order.indexOf(id), j = i + direction;
  if (i >= 0 && j >= 0 && j < order.length) [order[i], order[j]] = [order[j], order[i]];
  return next;
}
export function resetSettingGroup(settings, group) {
  const next = normalizeSettings(settings);
  for (const k of SETTING_GROUPS[group] || []) next[k] = structuredClone(DEFAULT_SETTINGS[k]);
  return next;
}
export function exportSettings(settings) {
  return JSON.stringify({ app: 'besin-matriksi-ayarlar', version: SETTINGS_VERSION, settings: normalizeSettings(settings) }, null, 2);
}
export function parseSettings(text) {
  const p = JSON.parse(text);
  if (p?.app !== 'besin-matriksi-ayarlar' || p.version !== SETTINGS_VERSION || !p.settings || typeof p.settings !== 'object' || Array.isArray(p.settings))
    throw new Error('Bu dosya desteklenen bir Besin Matriksi ayar dosyası değil.');
  return normalizeSettings(p.settings);
}

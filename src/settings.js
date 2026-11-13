// Sürüm 2: yalnızca tanımlı ve doğrulanmış ayarlar saklanır.
import { SECTIONS, NUTRIENTS } from './nutrients.js';
import { DEFAULT_COLORS, normalizeColors } from './theme.js';
import { efsaReference } from './references.js';
import { L } from './i18n.js';
const OLD_SECTION_ORDER = ['enerji', 'protein', 'karb', 'lif', 'yag', 'vitamin', 'mineral', 'organik', 'fito', 'anti', 'toksik', 'hesap', 'tolerans', 'kalinti', 'hazirlik'];
export const MATRIX_SECTIONS = [...SECTIONS, { id: 'hesap', title: 'Hesaplanan göstergeler' }, { id: 'tolerans', title: 'Alerji, intolerans ve uyarılar' }, { id: 'kalinti', title: 'Kalıntılar ve kapsam dışı' }, { id: 'hazirlik', title: 'Hazırlama ve emilim' }];
export const SETTINGS_VERSION = 2;
export const SHORTCUT_ACTIONS = { kesfet: 'Keşfet', tarif: 'Tarif oluştur', karsilastir: 'Karşılaştır', ayarlar: 'Ayarlar', hakkinda: 'Hakkında', gunluk: 'Günlük ve profil' };
export const DEFAULT_SETTINGS = {
  theme: 'dark', accent: 'auto', font: 'inter', fontSize: 17,
  lineHeight: 1.55, letterSpacing: 0, wordSpacing: 0, density: 'comfy',
  radius: 14, bold: false, reduceMotion: false, ruler: false,
  showNrv: true, showSource: true, showSd: false, showAlt: true,
  showMissing: false, precision: 'normal', showExt: false, emoji: true,
  defaultAmount: 100,
  language: 'auto', uiScale: 100, progressEnabled: false, progressAnimations: true,
  sectionOrder: MATRIX_SECTIONS.map(s => s.id), hiddenSections: [], pinnedNutrients: [],
  customTheme: DEFAULT_COLORS, referenceMode: 'eu', targets: {},
  efsaAge: 25, efsaSex: 'unspecified', efsaPhytate: '', efsaIronGroup: 'unspecified',
  energyUnit: 'both', amountUnit: 'g', autoUnits: true, decimalSeparator: 'auto',
  shortcuts: { kesfet: 'Alt+1', tarif: 'Alt+2', karsilastir: 'Alt+3', ayarlar: 'Alt+4', hakkinda: 'Alt+5', gunluk: 'Alt+6' }, focusWidth: 3, largeCursor: false,
  cardFacts: true, recipeGaps: true, showRecent: true, showSimilar: true, showAnimal: true, catGrid: false, showNiche: false, aionEnabled: false, aionMotion: 'auto', aionSize: 'm', aionSide: 'right', aionTips: true,
};
export const SETTING_GROUPS = {
  appearance: ['theme', 'accent', 'radius', 'customTheme', 'uiScale'],
  reading: ['font', 'fontSize', 'lineHeight', 'letterSpacing', 'wordSpacing', 'bold'],
  aion: ['aionEnabled', 'aionMotion', 'aionSize', 'aionSide', 'aionTips'],
  accessibility: ['density', 'ruler', 'reduceMotion', 'emoji', 'shortcuts', 'focusWidth', 'largeCursor'],
  matrix: ['cardFacts', 'recipeGaps', 'showRecent', 'showSimilar', 'showAnimal', 'catGrid', 'showNiche', 'showNrv', 'showSource', 'showSd', 'showAlt', 'showMissing', 'precision', 'defaultAmount', 'showExt', 'sectionOrder', 'hiddenSections', 'pinnedNutrients', 'referenceMode', 'targets', 'efsaAge', 'efsaSex', 'efsaPhytate', 'efsaIronGroup', 'energyUnit', 'amountUnit', 'autoUnits', 'decimalSeparator'],
};
const enums = {
  theme: ['light', 'dark', 'oled', 'sepia', 'pastel', 'ocean', 'forest', 'contrast', 'contrast-dark', 'custom', 'system'], language: ['auto', 'tr', 'en'],
  font: ['atkinson', 'opendyslexic', 'lexend', 'andika', 'nunito', 'inter', 'literata', 'mono', 'system'],
  density: ['comfy', 'compact', 'large'], precision: ['low', 'normal', 'high'],
  referenceMode: ['eu', 'custom', 'efsa'], efsaSex: ['unspecified', 'female', 'male'], efsaPhytate: ['', '300', '600', '900', '1200'], efsaIronGroup: ['unspecified', 'pre', 'post'], energyUnit: ['both', 'kcal', 'kj'], amountUnit: ['g', 'oz'], decimalSeparator: ['auto', 'comma', 'dot'],
  aionMotion: ['auto', 'animate', 'still'], aionSize: ['s', 'm', 'l'], aionSide: ['right', 'left'],
};
const ranges = { fontSize: [13, 28], lineHeight: [1.2, 2.4], letterSpacing: [0, .2], wordSpacing: [0, .5], radius: [0, 24], defaultAmount: [1, 1000], focusWidth: [2, 6] };
export function normalizeSettings(input) {
  const out = structuredClone(DEFAULT_SETTINGS);
  if (!input || typeof input !== 'object' || Array.isArray(input)) return out;
  for (const k of Object.keys(out)) {
    const v = input[k];
    if (k === 'shortcuts') {
      const used = new Set();
      for (const action of Object.keys(SHORTCUT_ACTIONS)) {
        const key = v?.[action] ?? DEFAULT_SETTINGS.shortcuts[action];
        out[k][action] = typeof key === 'string' && /^(Alt\+[1-9])?$/.test(key) && !used.has(key) ? key : '';
        if (key) used.add(key);
      }
    } else if (k === 'customTheme') out[k] = normalizeColors(v);
    else if (k === 'uiScale') { if (Number.isInteger(v) && v >= 80 && v <= 200 && v % 5 === 0) out[k] = v; }
    else if (k === 'efsaAge') { if (Number.isInteger(v) && v >= 1 && v <= 99) out[k] = v; }
    else if (k === 'targets') {
      for (const n of NUTRIENTS) if (typeof v?.[n.key] === 'number' && Number.isFinite(v[n.key]) && v[n.key] > 0) out[k][n.key] = v[n.key];
    } else if (['sectionOrder', 'hiddenSections', 'pinnedNutrients'].includes(k)) {
      const allowed = k === 'pinnedNutrients' ? NUTRIENTS.filter(n => !['energy', 'energy_kj'].includes(n.key)).map(n => n.key) : MATRIX_SECTIONS.map(s => s.id);
      const selected = Array.isArray(v) ? [...new Set(v.filter(x => allowed.includes(x)))] : [];
      out[k] = k === 'sectionOrder' ? [...selected, ...allowed.filter(x => !selected.includes(x))] : selected.slice(0, k === 'pinnedNutrients' ? 24 : allowed.length);
      // 2026-11-13 (Kaan): Lifler, Vitaminler'in altına taşındı. Kullanıcı sırayı hiç değiştirmediyse (eski varsayılan) yeni varsayılana geç.
      if (k === 'sectionOrder' && out[k].join() === OLD_SECTION_ORDER.join()) out[k] = MATRIX_SECTIONS.map((x) => x.id);
    } else if (enums[k]) { if (enums[k].includes(v)) out[k] = v; }
    else if (ranges[k]) {
      if (typeof v === 'number' && Number.isFinite(v)) out[k] = Math.min(ranges[k][1], Math.max(ranges[k][0], v));
    } else if (k === 'accent') {
      if (v === 'auto' || (typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v))) out[k] = v;
    } else if (typeof out[k] === 'boolean' && typeof v === 'boolean') out[k] = v;
  }
  if (input.language == null) out.language = 'tr'; // Preserve the language of existing Turkish installations.
  return out;
}
export function referenceFor(nutrient, settings) {
  if (settings.referenceMode === 'efsa') return efsaReference(nutrient, settings);
  const custom = settings.referenceMode === 'custom';
  return { value: custom ? settings.targets?.[nutrient.key] : nutrient.nrv, label: custom ? L("%hedef") : L("%BRD"), title: custom ? L("Elle girilen hedef; kişisel gereksinim veya tıbbi öneri değildir") : L("AB 1169/2011 yetişkin etiket referansı (2011), TGK; kişisel ihtiyaç değildir") };
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

// 2026-11-12 (Kaan): yuvarlak/çocuksu görünen yazılar yerine ciddi, net Inter. Bir kerelik geçiş:
// varsayılan sistem yazısı ve yuvarlak yazılar (Nunito, Andika, Lexend) Inter'e taşınır; erişilebilirlik yazıları
// (Atkinson, OpenDyslexic) ve sonradan yapılan seçimler korunur. Bayrak: bm.fontV2
export const FONT_V2_KEY = 'bm.fontV2';
export function migrateFontV2(settings, storage) {
  try {
    storage ??= globalThis.localStorage;
    if (storage.getItem(FONT_V2_KEY)) return settings;
    storage.setItem(FONT_V2_KEY, '1');
    if (['system', 'nunito', 'andika', 'lexend'].includes(settings.font)) return { ...settings, font: 'inter' };
  } catch {}
  return settings;
}

// 2026-11-12 (Kaan): sağ alttaki Aion kaldırılsın → varsayılan kapalı; mevcut kurulumlarda bir kez kapatılır (Ayarlar → Aion'dan açılabilir). Bayrak: bm.aionOffV1
export const AION_OFF_KEY = 'bm.aionOffV1';
export function migrateAionOff(settings, storage) {
  try {
    storage ??= globalThis.localStorage;
    if (storage.getItem(AION_OFF_KEY)) return settings;
    storage.setItem(AION_OFF_KEY, '1');
    if (settings.aionEnabled) return { ...settings, aionEnabled: false };
  } catch {}
  return settings;
}

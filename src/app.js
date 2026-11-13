import { setNicheVisible, extAnimalGroup, setAnimalVisible, visibleFoods, ANIMAL_CATS, foodName, categoryName, formName, CATEGORIES, FOODS, META, resolve, refKey, search, loadExt, extLoaded, extGroups, extFoods, setCustomFoods, customFoods } from './data.js';
import { NUTRIENTS, SECTIONS, SOURCES } from './nutrients.js';
import { scaleItem, aggregate, scaleAggregate } from './calc.js';
import { renderMatrix, basicCard, BASIC_KEYS, macroPie } from './matrix.js';
import NOTICES from './data/notices.json';
import { createPrintController } from './print.js';
import { FONTS, fontStack, ensureFont } from './fonts.js';
import { loadSettings, saveSettings, DEFAULT_SETTINGS, THEMES, ACCENTS, loadRecipes, saveRecipes, newRecipe, exportPayload, parseImport, loadCustom, saveCustom, loadSearches, saveSearches, loadProfiles, saveProfiles, loadCollections, saveCollections, loadRecent, saveRecent, pushRecent } from './store.js';
import { esc, fmtNum, fmtAmount, clamp, download, uid, configureFormatting, norm, pctText, fmtPct } from './util.js';
import { matrixCSV } from './export.js';
import { contrastRatio, accentText, exportTheme, parseTheme, COLOR_LABELS, validColor, themeTextContrast } from './theme.js';
import { renderThemeEditor, themePreview } from './theme-editor.js';
import { focusSelector, syncModalFocus, trapModalTab } from './accessibility.js';
import { recentSearches } from './search.js';
import { normalizeCustom } from './records.js';
import { renderRecipeSources, renderRecipeSourceRows } from './recipe-sources.js';
import { renderEfsaSettings } from './efsa-ui.js';
import { t as tr, setLanguage, preferredLanguage, L } from './i18n.js';
import { renderAppearance, settingSlider } from './appearance.js';
import { energyEstimate, recipeToEntries, dayToRecipeItems, loadPersonal, savePersonal, emptyProfile, normalizeProfile, mergePersonalFoods, localDay, validDay, dayResult, PERSONAL_KEY } from './personal.js';
import { renderPersonal, renderEnergy, renderDaySources } from './personal-view.js';
import { nutrientLabel } from './i18n-nutrients.js';
import { getLanguage } from './i18n.js';
import { normalizeCollections, createCollection, renameCollection, deleteCollection, toggleRef, removeRef, collectionTree, collectionRefs, hasRef, moveRef, moveIndex } from './collections.js';
import { mountAion, configureAion, aionMood, aionPlay, aionSay } from './aion.js';
import { greetingFor, newlyReached, celebrationText } from './aion-moments.js';
import { dailyRefs } from './daily-ref.js';
import { recipeGaps } from './gaps.js';
import { similarFoods } from './similar.js';
import { FOOD_ICONS } from './food-icons.js';
import { foodArt } from './food-art.js';
import { referenceFor, normalizeSettings, resetSettingGroup, exportSettings, parseSettings, MATRIX_SECTIONS, moveSection, SHORTCUT_ACTIONS, migrateFontV2, migrateAionOff } from './settings.js';

const PRESETS = [1, 5, 10, 25, 50, 100, 150, 200, 250, 500, 750, 1000];
const MAX_G = 1000;

const S = {
  tab: 'kesfet',
  searches: loadSearches(),
  profiles: loadProfiles(),
  collections: loadCollections(), colPicker: false, sort: 'default', multi: false, picked: [], ingOpen: new Set(), settingsQ: '', rcQ: '', rcSort: 'manual', recent: loadRecent((r) => !!FOODS.find((f) => f.id === r.id)?.forms[r.f]),
  cat: null,
  extGroup: null,
  q: '',
  sel: null, // ref
  amount: 100,
  closed: new Set(),
  settings: loadSettings(),
  recipes: loadRecipes(),
  activeRecipe: null,
  basis: 'total',
  recipeSource: 'energy',
  recipeSourcesOpen: false,
  compare: [],
  cmpSection: 'all',
  picker: null, // { target, cat, q, sel, amount }
  customEdit: null, // { id?, name, liquid, portion, v: {} }
  themeEditor: null,
  efsaTableOpen: false,
  personal: null, personalDraft: null, personalReadError: false, personalDay: localDay(), consumedOnly: false, personalSource: 'energy', personalSourceOpen: false, personalUndo: null,
};
const personalLoaded = loadPersonal();
S.personal = personalLoaded.state; S.personalDraft = structuredClone(S.personal.profile); S.personalReadError = personalLoaded.error;
setCustomFoods(loadCustom());
{ const m = migrateAionOff(migrateFontV2(S.settings)); if (m !== S.settings) { S.settings = m; saveSettings(S.settings); } }
S.amount = S.settings.defaultAmount;
setLanguage(preferredLanguage(S.settings.language)); // varsayılan metinler doğru dilde oluşsun
if (!S.recipes.length) S.recipes = [newRecipe(L("İlk tarifim"))];
S.activeRecipe = S.recipes[0].id;

const $ = (sel, el = document) => el.querySelector(sel);
const app = () => $('#app');
let modalOpener = null;
let printController;

// ---------------------------------------------------------------- ayarlar
function applySettings() {
  setAnimalVisible(S.settings.showAnimal); setNicheVisible(S.settings.showNiche);
  const s = S.settings, r = document.documentElement;
  setLanguage(preferredLanguage(s.language)); r.lang = preferredLanguage(s.language);
  r.style.zoom = String(s.uiScale / 100); r.style.setProperty('--ui-zoom', s.uiScale / 100);
  r.dataset.uiScaled = String(s.uiScale !== 100);
  r.dataset.uiNarrow = String(window.innerWidth / (s.uiScale / 100) < 900);
  configureFormatting(s);
  for (const key of ['bg', 'fg', 'card', 'card2', 'muted', 'line', 'ac0', 'ac-fg', 'ok', 'warn', 'bad', 'okbg', 'warnbg', 'badbg']) r.style.removeProperty('--' + key);
  const effectiveTheme = s.theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : s.theme;
  r.dataset.theme = effectiveTheme;
  if (s.theme === 'custom') {
    const c = s.customTheme;
    for (const [k, v] of Object.entries({ bg: c.bg, fg: c.fg, card: c.card, card2: c.card2, muted: c.muted, line: c.line, ac0: c.accent, ok: c.fg, warn: c.fg, bad: c.fg, okbg: c.card, warnbg: c.card, badbg: c.card })) r.style.setProperty('--' + k, v);
  }
  r.dataset.density = s.density;
  r.dataset.cursor = s.largeCursor ? 'large' : 'normal';
  r.style.setProperty('--focus-width', s.focusWidth + 'px');
  r.dataset.bold = s.bold ? '1' : '0';
  r.dataset.motion = s.reduceMotion ? 'reduce' : 'full';
  r.style.setProperty('--fs', s.fontSize + 'px');
  r.style.setProperty('--lh', String(s.lineHeight));
  r.style.setProperty('--ls', s.letterSpacing + 'em');
  r.style.setProperty('--ws', s.wordSpacing + 'em');
  r.style.setProperty('--radius', s.radius + 'px');
  r.style.setProperty('--font', fontStack(s.font));
  if (s.accent && s.accent !== 'auto') r.style.setProperty('--ac', s.accent);
  else r.style.removeProperty('--ac');
  const accent = s.accent === 'auto' ? (s.theme === 'custom' ? s.customTheme.accent : THEMES.find(t => t.id === effectiveTheme)?.ac) : s.accent;
  if (accent) r.style.setProperty('--ac-fg', accentText(accent));
  ensureFont(s.font);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = getComputedStyle(r).getPropertyValue('--bg').trim() || '#ffffff';
  $('#ruler')?.classList.toggle('on', !!s.ruler);
  configureAion(s);
}
function setSetting(k, v) {
  S.settings = normalizeSettings({ ...S.settings, [k]: v });
  if (!saveSettings(S.settings)) toast(tr('storageError'));
  applySettings();
  if (k === 'showExt' && v) loadExt().then(render);
}

// ---------------------------------------------------------------- yardımcı bileşenler
function toast(msg) {
  document.querySelectorAll('.toast').forEach((x) => x.remove());
  const t = document.createElement('div');
  t.className = 'toast';
  t.setAttribute('role', 'status');
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('out'), 1800);
  setTimeout(() => t.remove(), 2300);
}

function catName(id) {
  if (id?.startsWith('ext:')) return 'USDA: ' + L(extGroups()[id.slice(4)] || '');
  const c = CATEGORIES.find((c) => c.id === id);
  return c ? categoryName(c) : id === 'custom' ? L("Kendi besinlerim") : '';
}
const catIcon = (id) => (S.settings.emoji ? CATEGORIES.find((c) => c.id === id)?.icon || '📦' : '');
// Besinin kendi simgesi; yoksa kategori simgesi
const foodIcon = (f, size = 28) => (S.settings.emoji ? foodArt(f?.id, size) || FOOD_ICONS[f?.id] || catIcon(f?.cat) : '');

function amountControls(target, g, portions = [], { compact = false, liquid = false } = {}) {
  const oz = S.settings.amountUnit === 'oz';
  const unit = oz ? `oz (≈ ${fmtNum(g)} g)` : liquid ? 'g ≈ mL' : 'g';
  const presets = compact ? [10, 25, 50, 100, 200, 500, 1000] : PRESETS;
  return `<div class="amount ${compact ? 'compact' : ''}" data-amount="${esc(target)}">
    <div class="amt-main">
      <button class="nudge" data-action="nudge" data-target="${esc(target)}" data-delta="-10" aria-label="${L("10 gram azalt")}">−10</button>
      <button class="nudge" data-action="nudge" data-target="${esc(target)}" data-delta="-1" aria-label="${L("1 gram azalt")}">−1</button>
      <output class="amt-val" data-amtval="${esc(target)}"><b>${fmtNum(oz ? g / 28.349523125 : g)}</b> <span class="amount-unit">${unit}</span></output>
      <button class="nudge" data-action="nudge" data-target="${esc(target)}" data-delta="1" aria-label="${L("1 gram artır")}">+1</button>
      <button class="nudge" data-action="nudge" data-target="${esc(target)}" data-delta="10" aria-label="${L("10 gram artır")}">+10</button>
    </div>
    <input type="range" class="slider" min="1" max="${MAX_G}" step="1" value="${g}" style="--fill:${((g - 1) / (MAX_G - 1)) * 100}%" data-slider="${esc(target)}" aria-valuetext="${fmtNum(g)} g" aria-label="${L("Miktar (gram)")}">
    ${compact ? '' : `<div class="slider-scale" aria-hidden="true"><span>1 g</span><span>250</span><span>500</span><span>750</span><span>1 kg</span></div>`}
    <div class="presets">${presets.map((p) => `<button class="pchip ${p === g ? 'on' : ''}" data-action="amt" data-target="${esc(target)}" data-val="${p}">${p >= 1000 ? '1 kg' : p + ' g'}</button>`).join('')}</div>
    ${portions.length ? `<div class="portions">${portions.map((p) => `<button class="pchip por ${Math.abs(p.g - g) < 0.01 ? 'on' : ''}" data-action="amt" data-target="${esc(target)}" data-val="${p.g}" title="${esc(p.d ? L("USDA “{u}” ölçüsünden hacimle hesaplandı; yaklaşık", { u: p.src }) : p.en + ' (USDA)')}">${esc(getLanguage() === 'en' && p.en ? p.en : p.label)} · ${p.d ? '≈ ' : ''}${fmtNum(p.g)} g</button>`).join('')}</div>` : ''}
  </div>`;
}

// Tarif malzemesi kapalıyken tek satır: −10 · gram · +10 · porsiyon başı · Ayarla
function perServing(g, servings) {
  return servings > 1 ? `<span class="per-serv" data-perserv="${servings}">${L("porsiyon başı {g} g", { g: fmtNum(g / servings) })}</span>` : '';
}
function miniAmount(target, g, servings, id, name) {
  return `<div class="amount mini" data-amount="${esc(target)}">
    <button class="nudge" data-action="nudge" data-target="${esc(target)}" data-delta="-10" aria-label="${esc(L("{n}: 10 gram azalt", { n: name }))}">−10</button>
    <output class="amt-val"><b>${fmtNum(g)}</b> <span class="amount-unit">g</span></output>
    <button class="nudge" data-action="nudge" data-target="${esc(target)}" data-delta="10" aria-label="${esc(L("{n}: 10 gram artır", { n: name }))}">+10</button>
    ${perServing(g, servings)}
    <button class="btn ghost ing-adjust" data-action="ing-open" data-id="${esc(id)}" aria-expanded="false">⚙ ${L("Ayarla")}</button>
  </div>`;
}

function foodButton(f, action, extra = '') {
  const multi = S.multi && action === 'ex-pick', on = multi && S.picked.includes(f.id);
  if (multi) { action = 'multi-pick'; extra += ` aria-pressed="${on}"`; }
  return `<button class="food ${on ? 'picked' : ''}" data-action="${action}" data-id="${esc(f.id)}" ${extra}>
    <span class="fi" aria-hidden="true">${on ? '✓' : foodIcon(f)}</span>
    <span class="fn">${esc(foodName(f))}${f.animal ? ` <span class="tag-animal">${L("Hayvansal")}</span>` : ''}</span>
    <span class="ff">${f.forms.length > 1 ? L("{n} biçim", { n: f.forms.length }) : esc(formName(f.forms[0].label))}${quickFacts(f.forms[0].v)}</span>
  </button>`;
}
// Kartta tek bakışta: 100 g ilk biçim için enerji, protein, lif (veri yoksa yazılmaz)
function quickFacts(v) {
  if (!S.settings.cardFacts) return '';
  const parts = [];
  if (v.energy != null) parts.push(`${fmtNum(v.energy, 'low')} kcal`);
  if (v.protein != null) parts.push(`${fmtNum(v.protein, 'low')} g ${L("prot.")}`);
  if (v.fiber != null) parts.push(`${fmtNum(v.fiber, 'low')} g ${L("lif")}`);
  return parts.length ? `<span class="facts"> · ${parts.join(' · ')}</span>` : '';
}
const SORTS = { default: () => 0, name: (a, b) => foodName(a).localeCompare(foodName(b), getLanguage() === 'en' ? 'en' : 'tr'),
  energy: (a, b) => (b.forms[0].v.energy ?? -1) - (a.forms[0].v.energy ?? -1), protein: (a, b) => (b.forms[0].v.protein ?? -1) - (a.forms[0].v.protein ?? -1), fiber: (a, b) => (b.forms[0].v.fiber ?? -1) - (a.forms[0].v.fiber ?? -1) };
const sortFoods = (list) => (S.sort === 'default' ? list : list.slice().sort(SORTS[S.sort] || SORTS.default));
function sortBar(prefix) {
  if (prefix !== 'ex') return '';
  const opts = [['default', L("Önerilen")], ['name', L("A–Z")], ['energy', L("Enerji")], ['protein', L("Protein")], ['fiber', L("Lif")]];
  const multiBtn = `<button class="pchip ${S.multi ? 'on' : ''}" aria-pressed="${S.multi}" data-action="multi-toggle">☑ ${L("Çoklu seç")}</button>`;
  const multiBar = S.multi ? `<div class="multibar" role="status"><span>${S.picked.length ? L("{n} besin seçildi", { n: S.picked.length }) : L("Tarife eklemek istediğin besinlere dokun.")}</span>
    <button class="btn primary" data-action="multi-add" ${S.picked.length ? '' : 'disabled'}>＋ ${L("Tarife ekle (her biri 100 g)")}</button><button class="btn ghost" data-action="multi-toggle">${L("Vazgeç")}</button></div>` : '';
  return multiBar + `<div class="sortbar" role="group" aria-label="${L("Sırala")}"><span class="hint">${L("Sırala:")}</span>${opts.map(([id, label]) => `<button class="pchip ${S.sort === id ? 'on' : ''}" aria-pressed="${S.sort === id}" data-action="sort" data-s="${id}">${label}</button>`).join('')}${multiBtn}</div>${S.sort === 'energy' || S.sort === 'protein' || S.sort === 'fiber' ? `<p class="hint">${L("100 g ve ilk biçime göre, en yüksekten. Veri olmayanlar sonda.")}</p>` : ''}`;
}
function extButton(f, action) {
  return `<button class="food ext" data-action="${action}" data-ndb="${esc(f.n)}"><span class="fi">${S.settings.emoji ? '🇺🇸' : ''}</span><span class="fn">${esc(f.en)}</span><span class="ff">USDA ${esc(f.n)}</span></button>`;
}

// ---------------------------------------------------------------- KEŞFET
function categoryNav(prefix, current, withExt) {
  const vis = visibleFoods();
  const all = `<button class="cat ${!current ? 'on' : ''}" data-action="${prefix}-cat" data-cat=""><span class="cat-i">${S.settings.emoji ? '✨' : ''}</span><span class="cat-l">${L("Tümü")}</span> <span class="cnt">${vis.length}</span></button>`;
  const cats = CATEGORIES.filter((c) => S.settings.showAnimal || !ANIMAL_CATS.has(c.id)).map((c) => {
    const n = vis.filter((f) => f.cat === c.id).length;
    return `<button class="cat ${current === c.id ? 'on' : ''}" data-action="${prefix}-cat" data-cat="${c.id}"><span class="cat-i">${S.settings.emoji ? c.icon : ''}</span><span class="cat-l">${esc(categoryName(c))}</span> <span class="cnt">${n}</span></button>`;
  }).join('');
  const ext = withExt ? `<button class="cat ${current === 'ext' ? 'on' : ''}" data-action="${prefix}-cat" data-cat="ext"><span class="cat-i">${S.settings.emoji ? '🗂️' : ''}</span><span class="cat-l">${L("Geniş katalog (USDA, İngilizce)")}</span></button>` : '';
  const cu = `<button class="cat ${current === 'custom' ? 'on' : ''}" data-action="${prefix}-cat" data-cat="custom"><span class="cat-i">${S.settings.emoji ? '🏷️' : ''}</span><span class="cat-l">${L("Kendi besinlerim")}</span> <span class="cnt">${customFoods().length}</span></button>`;
  const colBtn = (c, sub) => {
    const n = sub ? c.items.length : collectionRefs(S.collections, c.id).length;
    return `<button class="cat ${sub ? 'sub' : ''} ${current === 'col:' + c.id ? 'on' : ''}" data-action="${prefix}-cat" data-cat="col:${c.id}"><span class="cat-i">${sub ? '↳' : S.settings.emoji ? '📁' : ''}</span><span class="cat-l">${esc(c.name)}</span> <span class="cnt">${n}</span></button>`;
  };
  const tree = collectionTree(S.collections);
  const cols = `<div class="cat-group" role="presentation">${L("Koleksiyonlarım")}</div>${tree.map((c) => colBtn(c, false) + c.children.map((ch) => colBtn(ch, true)).join('')).join('')}${prefix === 'ex' ? `<button class="cat add" data-action="col-new">＋ ${L("Yeni koleksiyon")}</button>` : ''}`;
  return all + cats + cu + ext + cols;
}

function refButton(ref, prefix, colId, index = -1, count = 0) {
  const item = resolve(ref);
  const nm = item ? item.name : refKey(ref);
  const moves = colId && prefix === 'ex' && index >= 0 ? `<span class="move"><button class="btn ghost" data-action="col-move" data-id="${esc(colId)}" data-i="${index}" data-d="-1" ${index === 0 ? 'disabled' : ''} aria-label="${esc(L("{n} yukarı taşı", { n: nm }))}">↑</button><button class="btn ghost" data-action="col-move" data-id="${esc(colId)}" data-i="${index}" data-d="1" ${index === count - 1 ? 'disabled' : ''} aria-label="${esc(L("{n} aşağı taşı", { n: nm }))}">↓</button></span>` : '';
  const remove = moves + (colId && prefix === 'ex' ? `<button class="btn ghost danger item-remove" data-action="col-remove-item" data-id="${esc(colId)}" data-ref="${esc(JSON.stringify(ref))}" aria-label="${esc(L("{n} koleksiyondan çıkar", { n: nm }))}">✕</button>` : '');
  if (!item) return `<div class="food missing-ref"><span class="fi">❔</span><span class="fn">${L("Kayıt bulunamadı")}</span><span class="ff">${esc(refKey(ref))}</span>${remove}</div>`;
  return `<div class="food-wrap"><button class="food" data-action="${prefix}-pick-ref" data-ref="${esc(JSON.stringify(ref))}"><span class="fi" aria-hidden="true">${item.food ? foodIcon(item.food) : item.custom ? '🏷️' : '🇺🇸'}</span><span class="fn">${esc(item.name)}</span><span class="ff">${esc(item.formLabel)}</span></button>${remove}</div>`;
}

function collectionList(prefix, cat, q) {
  const c = S.collections.find((x) => 'col:' + x.id === cat);
  if (!c) return `<p class="empty">${L("Koleksiyon bulunamadı.")}</p>`;
  const parent = c.parent ? S.collections.find((x) => x.id === c.parent) : null;
  const manage = prefix === 'ex' ? `<div class="col-head"><h3>${parent ? esc(parent.name) + ' › ' : ''}${esc(c.name)}</h3><div class="presets">
      <button class="btn" data-action="col-rename" data-id="${c.id}">✎ ${L("Yeniden adlandır")}</button>
      ${c.parent ? '' : `<button class="btn" data-action="col-sub" data-id="${c.id}">＋ ${L("Alt kategori")}</button>`}
      <button class="btn ghost danger" data-action="col-delete" data-id="${c.id}">${L("Sil")}</button></div></div>` : '';
  const k = norm(q || '');
  const sections = [{ col: c, refs: c.items }, ...S.collections.filter((x) => x.parent === c.id).map((ch) => ({ col: ch, refs: ch.items }))];
  let html = '';
  for (const { col, refs } of sections) {
    const shown = refs.filter((r) => { if (!k) return true; const it = resolve(r); return it && norm(it.name).includes(k); });
    if (col !== c) html += `<h3 class="grp">↳ ${esc(col.name)}</h3>`;
    html += shown.length ? `<div class="foods">${shown.map((r) => refButton(r, prefix, col.id, k ? -1 : refs.indexOf(r), refs.length)).join('')}</div>` : (col === c && sections.length > 1 ? '' : `<p class="empty">${L("Bu koleksiyon boş. Bir besin seç ve “Koleksiyona ekle”ye dokun.")}</p>`);
  }
  return manage + html;
}

function customButton(f, action) {
  return `<button class="food" data-action="${action}" data-cid="${esc(f.id)}"><span class="fi">${S.settings.emoji ? '🏷️' : ''}</span><span class="fn">${esc(f.name)}</span><span class="ff">${L("Etiketten")} · ${f.v.energy != null ? fmtNum(f.v.energy) + ' kcal/100 g' : L("enerji yok")}</span></button>`;
}

const knownFood = (r) => !!FOODS.find((f) => f.id === r.id)?.forms[r.f];
// Son bakılanlar: aramasız, kategorisiz Keşfet görünümünde tek satır
function recentRow(prefix) {
  if (prefix !== 'ex' || S.multi || !S.settings.showRecent) return '';
  const items = S.recent.map((r) => ({ r, f: FOODS.find((x) => x.id === r.id) })).filter((x) => x.f);
  if (!items.length) return '';
  return `<div class="recent-row"><h3 class="grp">🕘 ${L("Son bakılanlar")}</h3><button class="btn ghost" data-action="recent-clear" aria-label="${L("Son bakılanları temizle")}">${L("Temizle")}</button></div>
    <div class="presets recent">${items.map(({ r, f }) => `<button class="pchip" data-action="ex-pick-ref" data-ref='${esc(JSON.stringify(r))}'>${S.settings.emoji ? foodIcon(f) + ' ' : ''}${esc(foodName(f))}${f.forms.length > 1 ? ` <span class="muted">${esc(formName(f.forms[r.f].label))}</span>` : ''}</button>`).join('')}</div>`;
}

function foodList(prefix, cat, q, extGroup) {
  if (cat?.startsWith('col:')) return collectionList(prefix, cat, q);
  if (cat === 'custom') {
    const list = q ? search(q).custom : customFoods();
    return `<button class="btn primary block" data-action="cu-new">＋ ${L("Etiketten yeni besin ekle")}</button>
      <p class="hint">${L("Markalı ürünler (bitkisel süt, protein tozu, hazır gıda…) için etiketteki 100 g değerlerini gir. Cihazda saklanır, yedeğe dahil edilir.")}</p>
      <div class="foods">${list.map((f) => customButton(f, prefix + '-pick-custom')).join('') || `<p class="empty">${L("Henüz kendi besinin yok.")}</p>`}</div>`;
  }
  if (cat === 'ext') {
    if (!extLoaded()) { loadExt().then(render); return `<p class="empty">${L("Geniş katalog yükleniyor…")}</p>`; }
    const groups = extGroups();
    const chips = Object.entries(groups).filter(([g]) => S.settings.showAnimal || !extAnimalGroup(g)).map(([g, n]) => `<button class="pchip ${extGroup === g ? 'on' : ''}" data-action="${prefix}-extgroup" data-g="${g}">${esc(L(n))}</button>`).join('');
    let list = extFoods();
    if (extGroup) list = list.filter((f) => f.g === extGroup);
    if (q) list = search(q, { ext: true, extGroup }).ext;
    const shown = list.slice(0, 400);
    return `<div class="presets extgroups">${chips}</div>
      <p class="hint">${S.settings.showAnimal ? L("USDA SR28'den bitkisel ve hayvansal gruplar (hayvansal gruplar adlarında belirtilir); marka ürünler ayıklandı. Bitkisel gruplarda vegan uygunluğu ürün bazında doğrulanmalıdır.") : L("USDA SR28'den bitkisel gruplar; hayvansal içerikli ve marka ürünler otomatik ayıklandı, yine de vegan uygunluğu ürün bazında doğrulanmalıdır.")}</p>
      <div class="foods">${shown.map((f) => extButton(f, prefix + '-pick-ext')).join('')}</div>
      ${list.length > shown.length ? `<p class="hint">${L("{n} kayıt daha var; aramayla daralt.", { n: list.length - shown.length })}</p>` : ''}`;
  }
  const res = search(q, { cat, ext: S.settings.showExt && extLoaded() && !!q });
  if (!res.curated.length && !res.ext.length && !res.custom.length) return `<p class="empty">${L("Eşleşen besin yok. Aramayı kısalt veya “Tümü”ne dön.")}</p>`;
  let html = (!q && !cat ? recentRow(prefix) : '') + sortBar(prefix);
  if (!q && !cat && S.sort === 'default') {
    for (const c of CATEGORIES) {
      const fs = res.curated.filter((f) => f.cat === c.id);
      if (!fs.length) continue;
      html += `<h3 class="grp">${S.settings.emoji ? c.icon + ' ' : ''}${esc(categoryName(c))}</h3><div class="foods">${fs.map((f) => foodButton(f, prefix + '-pick')).join('')}</div>`;
    }
  } else {
    html += `<div class="foods">${(q ? res.curated : sortFoods(res.curated)).map((f) => foodButton(f, prefix + '-pick')).join('')}</div>`;
  }
  if (res.custom.length) html += `<h3 class="grp">${L("Kendi besinlerim")}</h3><div class="foods">${res.custom.map((f) => customButton(f, prefix + '-pick-custom')).join('')}</div>`;
  if (res.ext.length) html += `<h3 class="grp">${L("Geniş katalog (USDA)")}</h3><div class="foods">${res.ext.map((f) => extButton(f, prefix + '-pick-ext')).join('')}</div>`;
  return html;
}

function formChips(prefix, ref) {
  if (ref.t !== 'c') return '';
  const food = FOODS.find((f) => f.id === ref.id);
  if (food.forms.length < 2) return `<div class="forms"><span class="pchip on static">${esc(formName(food.forms[0].label))}</span></div>`;
  return `<div class="forms" role="group" aria-label="${L("Tüketim biçimi")}">${food.forms.map((fm, i) => `<button aria-pressed="${i === ref.f}" class="pchip ${i === ref.f ? 'on' : ''}" data-action="${prefix}-form" data-f="${i}">${esc(formName(fm.label))}</button>`).join('')}</div>`;
}

// Aynı kategoride makro profili en yakın besinler (alternatif bulmak için; "eşdeğer" iddiası değil)
function similarRow(item) {
  if (!S.settings.showSimilar || !item.food) return '';
  const list = similarFoods(item.food, visibleFoods(), { formIndex: S.sel.f });
  if (!list.length) return '';
  return `<div class="similar"><span class="hint" title="${esc(L("Aynı kategoride 100 g'daki enerji, protein, karbonhidrat, yağ ve lif profili en yakın besinler. Vitamin ve mineraller farklı olabilir."))}">${L("Benzer besinler:")}</span>
    <div class="presets">${list.map((f) => `<button class="pchip" data-action="ex-pick" data-id="${esc(f.id)}">${esc(foodName(f))}</button>`).join('')}</div></div>`;
}

// İlk kullanım turu: listenin başında akışta duran küçük kart (hiçbir şeyin üstünü örtmez), hedefi vurgular

function renderExplore() {
  const item = S.sel ? resolve(S.sel) : null;
  const detail = item
    ? `<div class="dhead">
        <button class="back" data-action="ex-back" aria-label="${L("Listeye dön")}">← ${L("Liste")}</button>
        <div class="dtitle"><h2>${S.settings.emoji && item.food ? foodIcon(item.food, 40) + ' ' : ''}${esc(item.name)}</h2>
          <div class="dsub">${item.animal ? `<span class="tag-animal">${L("Hayvansal")}</span> ` : ''}${esc(catName(item.cat))}${item.sci ? ` · <i>${esc(item.sci)}</i>` : ''}</div></div>
      </div>
      ${formChips('ex', S.sel)}
      ${amountControls('ex', S.amount, item.portions, { liquid: item.liquid })}
      <div class="dact" role="toolbar" aria-label="${L("Besin eylemleri")}">
        <button class="btn primary" data-action="ex-add-recipe">＋ ${tr('addRecipe')}</button>
        <button class="btn" data-action="ex-add-day">＋ ${tr('addDay')}</button>
        <span class="dact-more">
          <button class="btn icon" data-action="ex-add-compare" title="${tr('addCompare')}" aria-label="${tr('addCompare')}">⇄<span class="lbl-opt"> ${tr('addCompare')}</span></button>
          <button class="btn icon ${S.collections.some((c) => hasRef(c, S.sel)) ? 'starred' : ''}" data-action="col-pick" title="${L("Koleksiyona ekle")}" aria-label="${L("Koleksiyona ekle")}">${S.collections.some((c) => hasRef(c, S.sel)) ? '★' : '☆'}<span class="lbl-opt"> ${L("Koleksiyon")}</span></button>
          ${item.custom ? `<button class="btn icon" data-action="cu-edit" title="${L("Düzenle")}" aria-label="${L("Düzenle")}">✎<span class="lbl-opt"> ${L("Düzenle")}</span></button>` : ''}
          <button class="btn icon ghost" data-action="csv" title="${L("Matriksi tablo (CSV) olarak indir")}" aria-label="${L("Matriksi tablo (CSV) olarak indir")}">⬇<span class="lbl-opt"> CSV</span></button>
          <button class="btn icon ghost" data-action="print" title="${L("Yazdır veya PDF olarak kaydet")}" aria-label="${L("Yazdır veya PDF olarak kaydet")}">🖨<span class="lbl-opt"> ${L("Yazdır")}</span></button>
        </span>
      </div>
      ${item.food && !Object.keys(item.v || {}).length ? `<div class="card unavail"><p>${esc(item.note || '')}</p><button class="btn primary" data-action="cu-new" data-name="${esc(item.name)}">＋ ${L("Etiketten kendi besinim olarak ekle")}</button></div>` : ''}
      ${similarRow(item)}
      <div id="matrix" class="matrix">${matrixForExplore(item)}</div>`
    : welcome() + periodicGrid();
  return `<div class="explore ${item ? 'has-sel' : ''}">
    <nav class="cats ${S.settings.catGrid ? 'cats-grid' : ''}" aria-label="${L("Kategoriler")}">${categoryNav('ex', S.cat, S.settings.showExt)}</nav>
    <section class="list" aria-label="${L("Besinler")}">
      <div class="searchbar"><input type="search" id="q" placeholder="${L("Ara (isteğe bağlı): muz, mercimek, lentil…")}" value="${esc(S.q)}" autocomplete="off" aria-label="${L("Besin ara")}">
      ${S.q ? `<button class="btn ghost" data-action="ex-clear">${L("Temizle")}</button>` : ''}</div>
      ${S.searches.length ? `<div class="recent-searches" aria-label="${L("Son aramalar")}"><span class="hint">${L("Son aramalar")}</span><div class="presets">${S.searches.map(q => `<button class="pchip" data-action="search-recent" data-q="${esc(q)}">${esc(q)}</button>`).join('')}<button class="btn ghost" data-action="search-clear">${L("Geçmişi temizle")}</button></div></div>` : ''}
      <div id="foodlist">${foodList('ex', S.cat, S.q, S.extGroup)}</div>
    </section>
    <section class="detail" aria-label="${L("Besin matriksi")}">${detail}</section>
  </div>`;
}

// Seçim yokken sağ panel: seçili kategorinin (veya aramanın) besinleri periyodik tablo gibi kare ızgara
function welcome() {
  return `<div class="welcome">
    <h2>${S.settings.emoji ? '🌱 ' : ''}${L("Besin matriksine hoş geldin")}</h2>
    <ol class="welcome-steps">
      <li>${L("Soldan bir kategori seç (ör. Baklagiller).")}</li>
      <li>${L("Bir besine tıkla (ör. Yeşil mercimek).")}</li>
      <li>${L("Biçimi (çiğ / haşlanmış…) seç, kaydırıcıyı sağa sola çekerek miktarı (1 g – 1 kg) ayarla.")}</li>
      <li>${L("“Tarife ekle” ile birden çok besinin toplam matriksini gör.")}</li>
    </ol>
    <p class="hint">${L("{foods} besin, {forms} biçim, USDA tam bileşim tablosu · tamamen çevrimdışı · klavye gerekmez.", { foods: META.curated, forms: META.forms })}</p>
  </div>`;
}

function periodicGrid() {
  const special = S.cat && (S.cat.startsWith('col:') || S.cat === 'custom' || S.cat === 'ext');
  const res = search(S.q, { cat: special ? null : S.cat });
  const foods = res.curated;
  if (!foods.length) return `<p class="empty">${L("Eşleşen besin yok. Aramayı kısalt veya “Tümü”ne dön.")}</p>`;
  const tile = (f, i) => {
    const v = f.forms[0].v;
    return `<button class="pt" data-action="ex-pick" data-id="${esc(f.id)}" title="${esc(foodName(f))}">
      <span class="pt-n">${i + 1}</span><span class="pt-k">${v.energy != null ? fmtNum(v.energy) : '–'}<small>kcal</small></span>
      <span class="pt-i" aria-hidden="true">${foodIcon(f, 40)}</span>
      <b class="pt-name">${esc(foodName(f))}</b>
      <span class="pt-m">${v.protein != null ? `P ${fmtNum(v.protein)}` : ''}${v.fiber != null ? ` · ${L("Lif")} ${fmtNum(v.fiber)}` : ''}</span></button>`;
  };
  const grid = (list) => `<div class="ptable">${list.map(tile).join('')}</div>`;
  let body = '';
  if (!S.q && !S.cat) {
    let n = 0;
    for (const c of CATEGORIES) {
      const fs = foods.filter((f) => f.cat === c.id);
      if (!fs.length) continue;
      body += `<h3 class="pt-h">${S.settings.emoji ? c.icon + ' ' : ''}${esc(categoryName(c))} <span class="cnt">${fs.length}</span></h3><div class="ptable">${fs.map((f) => tile(f, n++)).join('')}</div>`;
    }
  } else body = grid(foods);
  const title = S.q ? L("“{q}” için sonuçlar", { q: S.q }) : S.cat && !special ? categoryName(CATEGORIES.find((c) => c.id === S.cat) || { id: S.cat }) : L("Tüm besinler");
  return `<div class="periodic"><h2>${esc(title)} <span class="cnt">${foods.length}</span></h2><p class="hint">${L("100 g için kcal; P: protein (g), Lif (g). Bir kareye dokun, matriksi açılsın.")}</p>${body}</div>`;
}

function matrixForExplore(item) {
  const r = scaleItem(item, S.amount);
  return renderMatrix(r, S.settings, { item, closed: S.closed, persona: persona() });
}

// ---------------------------------------------------------------- TARİF
const activeRecipe = () => S.recipes.find((r) => r.id === S.activeRecipe) || S.recipes[0];
function persistRecipes() {
  const rc = activeRecipe();
  if (rc) rc.updated = Date.now();
  if (!saveRecipes(S.recipes)) toast(L("Kaydedilemedi: cihaz depolaması kullanılamıyor"));
}

// Temel değer yüzdeleri için kişi: profilde cinsiyet ve enerji tahmini varsa onlar, yoksa ortalama kadın/erkek
function persona() {
  const p = S.personal?.profile || {};
  let energy = null; try { const e = energyEstimate(p); if (e.status === 'ready') energy = e.daily; } catch {}
  return { sex: ['female', 'male'].includes(p.sex) ? p.sex : null, energy };
}

function recipeResult(rc) {
  const scaled = rc.items.map((it) => { const item = resolve(it.ref); return item ? scaleItem(item, it.g) : { v: {}, s: {}, grams: it.g }; });
  const agg = aggregate(scaled);
  let factor = 1, r = agg, basisLabel = L("Toplam tarif ({g} g malzeme)", { g: fmtNum(agg.grams) });
  if (S.basis === 'serving') { factor = 1 / rc.servings; r = scaleAggregate(agg, factor); basisLabel = L("1 porsiyon ({n} porsiyondan biri, ≈ {g} g malzeme)", { n: rc.servings, g: fmtNum(agg.grams / rc.servings) }); }
  if (S.basis === 'per100') {
    const finalW = rc.cookedWeight || agg.grams;
    if (finalW > 0) { factor = 100 / finalW; r = scaleAggregate(agg, factor); basisLabel = rc.cookedWeight ? L("Son ürünün 100 g'ı (pişmiş ağırlık {g} g)", { g: fmtNum(rc.cookedWeight) }) : L("Son ürünün 100 g'ı (pişmiş ağırlık girilmedi; çiğ toplam kullanıldı)"); }
  }
  return { r, basisLabel, agg, factor };
}

function renderRecipe() {
  const rc = activeRecipe();
  const kcalOf = new Map(S.recipes.map((r) => [r.id, servingKcal(r)]));
  const ordered = S.rcSort === 'name' ? S.recipes.slice().sort((x, y) => x.name.localeCompare(y.name, getLanguage() === 'en' ? 'en' : 'tr'))
    : S.rcSort === 'kcal' ? S.recipes.slice().sort((x, y) => (kcalOf.get(x.id)?.v ?? Infinity) - (kcalOf.get(y.id)?.v ?? Infinity)) : S.recipes;
  const sortChip = (id, label) => `<button class="pchip ${S.rcSort === id ? 'on' : ''}" aria-pressed="${S.rcSort === id}" data-action="rc-sort" data-s="${id}">${label}</button>`;
  const tools = S.recipes.length > 3 ? `<label class="field"><span class="sr">${L("Tariflerde ara")}</span><input id="rc-q" type="search" value="${esc(S.rcQ)}" placeholder="🔎 ${L("Tariflerde ara")}" autocomplete="off"></label>
      <div class="presets" role="group" aria-label="${L("Sırala")}">${sortChip('manual', L("Eklenme"))}${sortChip('name', L("A–Z"))}${sortChip('kcal', L("kcal/porsiyon"))}</div>` : '';
  const list = tools + ordered.map((r) => { const k = kcalOf.get(r.id); return `<div class="rlist-item ${r.id === rc.id ? 'on' : ''}" data-rname="${esc(norm(r.name))}">
      <button class="rname" data-action="rc-open" data-id="${r.id}">${S.settings.emoji ? '📒 ' : ''}${esc(r.name)} <span class="cnt">${r.items.length}</span>${k ? `<small class="rkcal">${k.partial ? '≥ ' : ''}${fmtNum(k.v)} kcal/${L("porsiyon")}</small>` : ''}</button>
    </div>`; }).join('') + `<p class="hint" id="rc-none" hidden>${L("Bu aramaya uyan tarif yok.")}</p>`;
  const items = rc.items.map((it, idx) => {
    const item = resolve(it.ref);
    if (!item) return `<div class="ing missing"><span>${L("Bulunamayan kayıt ({key})", { key: esc(refKey(it.ref)) })} ${it.ref.t === 'x' ? '— ' + L("geniş katalog açık olmalı") : ''}</span><button class="btn ghost" data-action="rc-del-item" data-id="${it.id}">${L("Kaldır")}</button></div>`;
    return `<div class="ing">
      <div class="ing-h"><span class="fi">${item.food ? foodIcon(item.food) : ''}</span><b>${esc(item.name)}</b> <span class="muted">${esc(item.formLabel)}</span>
      <span class="ing-kcal">${item.v.energy != null ? fmtNum((item.v.energy * it.g) / 100) + ' kcal' : ''}</span>
      <span class="move"><button class="btn ghost" data-action="rc-move" data-id="${it.id}" data-d="-1" ${idx === 0 ? 'disabled' : ''} aria-label="${esc(L("{n} yukarı taşı", { n: item.name }))}">↑</button><button class="btn ghost" data-action="rc-move" data-id="${it.id}" data-d="1" ${idx === rc.items.length - 1 ? 'disabled' : ''} aria-label="${esc(L("{n} aşağı taşı", { n: item.name }))}">↓</button></span>
      <button class="btn ghost danger" data-action="rc-del-item" data-id="${it.id}" aria-label="${L("Malzemeyi kaldır")}">✕</button></div>
      ${S.ingOpen.has(it.id) ? `${amountControls('rc:' + it.id, it.g, item.portions, { compact: true, liquid: item.liquid })}${perServing(it.g, rc.servings)}
      <button class="btn ghost" data-action="ing-open" data-id="${it.id}" aria-expanded="true">${L("Kapat")}</button>`
      : miniAmount('rc:' + it.id, it.g, rc.servings, it.id, item.name)}
    </div>`;
  }).join('');
  const { r, basisLabel, agg, factor } = recipeResult(rc);
  const basisBtn = (id, label) => `<button class="pchip ${S.basis === id ? 'on' : ''}" data-action="rc-basis" data-b="${id}">${label}</button>`;
  return `<div class="recipe">
    <aside class="rlist" aria-label="${L("Tarifler")}">
      <button class="btn primary block" data-action="rc-new">＋ ${L("Yeni tarif")}</button>
      ${list}
      <div class="rtools">
        <button class="btn" data-action="rc-dup">${L("Kopyala")}</button>
        <button class="btn danger" data-action="rc-delete">${L("Sil")}</button>
      </div>
    </aside>
    <section class="rmain">
      <div class="rhead"><label class="rtitle"><span class="sr">${L("Tarif adı")}</span><input id="rc-name" value="${esc(rc.name)}" aria-label="${L("Tarif adı")}"></label>
        <button class="btn primary" data-action="rc-add">＋ ${L("Malzeme ekle")}</button>
        ${rc.items.length ? `<button class="btn" data-action="rc-to-day">📒 ${L("Günlüğe ekle")}</button><button class="btn ghost" data-action="csv">⬇ CSV</button><button class="btn ghost" data-action="print">🖨 ${L("Yazdır")}</button>` : ''}</div>
      <div class="ings">${items || `<p class="empty">${L("Henüz malzeme yok. “Malzeme ekle”ye tıkla veya Keşfet'te bir besinde “Tarife ekle”yi kullan. Ör: muz + yaban mersini.")}</p>`}</div>
      ${rc.items.length ? `<div class="ropts">
        <div class="kv"><span>${L("Porsiyon sayısı")}</span><span class="stepper"><button class="nudge" data-action="rc-serv" data-d="-1" aria-label="${L("Porsiyon sayısını azalt")}">−</button><b>${rc.servings}</b><button class="nudge" data-action="rc-serv" data-d="1" aria-label="${L("Porsiyon sayısını artır")}">+</button></span></div>
        <div class="kv"><span>${L("Pişmiş son ağırlık")} <span class="help" title="${L("Pişirmede su kaybı/kazancı olur. Son ürünü tartıp girersen 100 g son ürün değeri doğru hesaplanır. Pişirme kayıpları (vitamin vb.) hesaba katılmaz.")}">?</span></span>
          <span class="stepper"><button class="nudge" data-action="rc-cw" data-d="-50">−50</button><button class="nudge" data-action="rc-cw" data-d="-10">−10</button>
          <b>${rc.cookedWeight ? fmtNum(rc.cookedWeight) + ' g' : L("girilmedi")}</b>
          <button class="nudge" data-action="rc-cw" data-d="10">+10</button><button class="nudge" data-action="rc-cw" data-d="50">+50</button>
          ${rc.cookedWeight ? `<button class="btn ghost" data-action="rc-cw-clear">${L("Sıfırla")}</button>` : `<button class="btn ghost" data-action="rc-cw-set">${L("= çiğ toplam ({g} g)", { g: fmtNum(agg.grams) })}</button>`}</span></div>
        <div class="presets">${basisBtn('total', L("Toplam"))}${basisBtn('serving', L("1 porsiyon"))}${basisBtn('per100', L("Son ürün 100 g"))}</div>
      </div>
      <div id="recipe-summary">${renderRecipeSummary(rc, r)}</div>
      <div id="recipe-gaps">${renderRecipeGaps(r)}</div>
      <div id="matrix" class="matrix">${renderMatrix(r, S.settings, { recipe: rc, basisLabel, closed: S.closed })}</div>
      <div id="recipe-sources">${renderRecipeSources(rc, resolve, { key: S.recipeSource, factor, basisLabel, open: S.recipeSourcesOpen, precision: S.settings.precision })}</div>` : ''}
    </section>
  </div>`;
}

function renderRecipeSummary(rc, r) {
  const missing = rc.items.filter(it => !resolve(it.ref)).length;
  const title = S.basis === 'serving' ? L("1 porsiyon") : S.basis === 'per100' ? L("Son ürün 100 g") : L("Toplam tarif");
  return basicCard(r, S.settings, title, { persona: persona(), pie: true }) +
    (missing ? `<p class="note" role="status">${L("{n} malzemenin kaydı bulunamadı. Bu malzemelerin ağırlığı toplamda, besin değerleri eksik kapsamda tutuldu.", { n: missing })}</p>` : '');
}

// Hedefe en uzak 3 bileşen ve onları 100 g'da en çok veren katalog besinleri (öneri değil, yön gösterir)
function renderRecipeGaps(r) {
  if (!S.settings.recipeGaps || S.basis === 'per100') return '';
  const gaps = recipeGaps(r, NUTRIENTS, visibleFoods(), (n) => referenceFor(n, S.settings));
  if (!gaps.length) return '';
  const rows = gaps.map((g) => `<li><div class="gap-h"><b>${esc(nutrientLabel(g.n))}</b> <span class="muted">${pctText(fmtNum(g.pct, 'low'))}${g.partial ? ' · ' + L("kısmi veri, gerçek değer daha yüksek olabilir") : ''}</span></div>
    ${g.noPlant ? `<p class="hint">${L("Bitkisel besinlerde güvenilir doğal kaynağı yok; zenginleştirilmiş ürün veya takviye gerekir.")}</p>` : ''}
    ${!g.foods.length ? '' : `<div class="presets">${g.foods.map((x) => `<button class="pchip" data-action="gap-open" data-id="${esc(x.f.id)}">${esc(foodName(x.f))} <span class="muted">${fmtNum(x.v, 'low')} ${esc(g.n.unit)}/100 g</span></button>`).join('')}</div>`}</li>`).join('');
  return `<section class="card recipe-gaps" aria-label="${L("En düşük kalan besinler")}">
    <h3>${L("En düşük kalan besinler")}</h3>
    <p class="hint">${L("Referansa göre en düşük yüzdeler ve bunları 100 g'da en çok veren besinler. Kişisel ihtiyaç veya emilim değildir; veri olmayan bileşenler burada sayılmaz.")}</p>
    <ul class="gaps">${rows}</ul></section>`;
}

// ---------------------------------------------------------------- KARŞILAŞTIR
function renderCompare() {
  const items = S.compare.map((c) => ({ c, item: resolve(c.ref) })).filter((x) => x.item);
  const cols = items.map(({ c, item }, i) => `<div class="cmp-col">
      <div class="cmp-h"><b>${esc(item.name)}</b><span class="muted">${esc(item.formLabel)}</span>
      <button class="btn ghost danger" data-action="cmp-del" data-i="${i}" aria-label="${L("Çıkar")}">✕</button></div>
      ${S.ingOpen.has('cmp:' + i) ? `${amountControls('cmp:' + i, c.g, item.portions || [], { compact: true, liquid: item.liquid })}<button class="btn ghost" data-action="ing-open" data-id="cmp:${i}" aria-expanded="true">${L("Kapat")}</button>` : miniAmount('cmp:' + i, c.g, 1, 'cmp:' + i, item.name)}
    </div>`).join('');
  const addBtn = S.compare.length < 4 ? `<button class="cmp-add" data-action="cmp-add">＋ ${L("Besin ekle")}<br><span class="muted">${S.compare.length}/4</span></button>` : '';
  let table = '';
  if (items.length) {
    const rs = items.map(({ c, item }) => scaleItem(item, c.g));
    const secChips = [['all', L("Tümü")], ['temel', L("Temel besin değerleri")], ...SECTIONS.filter((s) => s.id !== 'enerji').map((s) => [s.id, L(s.title)])].map(([id, t]) => `<button class="pchip ${S.cmpSection === id ? 'on' : ''}" data-action="cmp-sec" data-s="${id}">${esc(t)}</button>`).join('');
    const rows = [];
    let lastSec = null;
    const pr = persona();
    const cmpRow = (n, vals, basic = false) => {
      const max = Math.max(...vals.filter((x) => x != null));
      const refs = basic && S.settings.showNrv ? dailyRefs(n.key, { ...pr, custom: S.settings.referenceMode === 'custom' ? S.settings.targets : null }) : [];
      const pcts = (x) => refs.length ? `<small class="cpct">${refs.map((ref) => `${refs.length > 1 ? L(ref.who === 'female' ? "K" : "E") + ' ' : ''}${fmtPct((x / ref.value) * 100)}`).join(' · ')}</small>` : '';
      return `<tr><th scope="row">${esc(nutrientLabel(n))} <span class="unit">${esc(n.unit)}</span></th>${vals.map((x) => {
        if (x == null) return `<td class="miss">${L("veri yok")}</td>`;
        const w = max > 0 ? (x / max) * 100 : 0;
        return `<td class="${x === max && items.length > 1 && max > 0 ? 'best' : ''}"><span class="cbar"><i style="width:${w.toFixed(1)}%"></i></span>${fmtAmount(x, n.unit, S.settings.precision).n}${fmtAmount(x, n.unit).u !== n.unit ? ' ' + fmtAmount(x, n.unit).u : ''}${pcts(x)}</td>`;
      }).join('')}</tr>`;
    };
    // Önce temel değerler (kalori, protein, karbonhidrat, şeker, yağ, doymuş yağ, lif, tuz), sonra ayrıntılı bölümler
    const showBasic = S.cmpSection === 'all' || S.cmpSection === 'temel';
    if (showBasic) {
      rows.push(`<tr class="secrow basic"><th colspan="${items.length + 1}">${L("Temel besin değerleri")}${S.settings.showNrv ? ` <small class="muted">${pr.sex || S.settings.referenceMode === 'custom' ? L("% günlük referans") : L("% günlük referans · K: ortalama kadın, E: ortalama erkek")}</small>` : ''}</th></tr>`);
      for (const k of BASIC_KEYS) { const n = NUTRIENTS.find((x) => x.key === k); if (n) rows.push(cmpRow(n, rs.map((r) => r.v[k]), true)); }
    }
    const secIdx = new Map(SECTIONS.map((x, i) => [x.id, i]));
    const cmpNutrients = NUTRIENTS.slice().sort((a, b) => secIdx.get(a.section) - secIdx.get(b.section)); // bölüm sırası matrisle aynı
    for (const n of S.cmpSection === 'temel' ? [] : cmpNutrients) {
      // Kalori kutusu yalnız kaloriyi gösterir (su, kül, ayrıca kJ satırı yok; kJ seçiliyse kcal yerine kJ)
      if (['ash', 'water'].includes(n.key)) continue;
      if (n.section === 'enerji') continue; // kalori Temel besin değerleri satırında
      if (n.key === 'energy_kj' && S.settings.energyUnit !== 'kj') continue;
      if (n.key === 'energy_kj' && S.settings.energyUnit === 'kcal') continue;
      if (n.key === 'energy' && S.settings.energyUnit === 'kj') continue;
      if (S.cmpSection !== 'all' && n.section !== S.cmpSection) continue;
      if (S.cmpSection === 'all' && BASIC_KEYS.includes(n.key)) continue;
      const vals = rs.map((r) => r.v[n.key]);
      if (vals.every((x) => x == null)) continue;
      if (n.section !== lastSec) { lastSec = n.section; rows.push(`<tr class="secrow"><th colspan="${items.length + 1}">${esc(L(SECTIONS.find((s) => s.id === n.section).title))}</th></tr>`); }
      rows.push(cmpRow(n, vals));
    }
    const pies = `<section class="card cmp-pies" aria-label="${L("Kalori nereden geliyor?")}"><h3>${L("Kalori nereden geliyor?")}</h3><div class="cmp-pie-row">${items.map(({ c, item }, i) => macroPie(rs[i], S.settings, { compact: true, title: `${item.name} · ${fmtNum(c.g)} g` })).join('')}</div><p class="hint">${L("Kalorinin yüzde kaçının protein, karbonhidrat, yağ ve liften geldiği (Atwater genel faktörleri 4 / 4 / 9 / 2 kcal/g; yaklaşık).")}</p></section>`;
    table = pies + `<div class="presets cmp-secs" role="group" aria-label="${L("Bölüm")}">${secChips}</div>
      <div class="tablewrap" tabindex="0" role="region" aria-label="${L("Karşılaştırma tablosu (yana kaydırılabilir)")}"><table class="cmp" style="--cmp-n:${items.length}"><thead><tr><th>${L("Bileşen")}</th>${items.map(({ c, item }) => `<th class="cmp-food">${esc(item.name)}<br><span class="muted">${esc(item.formLabel)} · ${fmtNum(c.g)} g</span></th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>
      <p class="hint">${L("Aynı miktar ve biçimde karşılaştırmak için miktarları eşitle:")} <button class="btn ghost" data-action="cmp-same" data-g="100">${L("Hepsi 100 g")}</button> <button class="btn ghost" data-action="cmp-same" data-g="50">${L("Hepsi 50 g")}</button>. ${L("Satırdaki en yüksek değer vurgulanır; “yüksek = iyi” anlamına gelmez (sodyum, toksik mineraller, antinutrientler).")}</p>
      <p class="hint basic-src">${L("Temel değer yüzdeleri: PHE Government Dietary Recommendations (2016, 19–64 yaş); şeker için AB 1169/2011. Kişisel ihtiyaç veya tıbbi öneri değildir.")}</p>`;
  } else {
    table = `<p class="empty">${L("İki ile dört besini yan yana koy. Keşfet'te “Karşılaştır”a tıklayarak da ekleyebilirsin.")}</p>`;
  }
  return `<div class="compare"><div class="cmp-cols">${cols}${addBtn}</div>${table}</div>`;
}

// ---------------------------------------------------------------- AYARLAR
function renderSettings() {
  const s = S.settings;
  const opt = (k, v, label) => `<button class="pchip ${s[k] === v ? 'on' : ''}" data-action="set" data-k="${k}" data-v="${esc(JSON.stringify(v))}">${label}</button>`;
  const tog = (k, label, help = '') => `<label class="toggle"><input type="checkbox" data-setbool="${k}" ${s[k] ? 'checked' : ''}><span class="sw"></span><span>${label}${help ? ` <span class="help" title="${esc(help)}">?</span>` : ''}</span></label>`;
  const step = (k, label, min, max, st, unit) => settingSlider(k, s[k], min, max, st, unit);
  return `<div class="settings">
    <div class="settings-search"><label class="field"><span>🔎 ${L("Ayarlarda ara")}</span><input id="settings-q" type="search" value="${esc(S.settingsQ)}" placeholder="${L("ör. yazı, tema, Aion, yedek")}" autocomplete="off"></label>
      <p class="hint" id="settings-none" role="status" hidden>${L("Bu aramaya uyan ayar yok.")}</p></div>
    <section class="card lang-card" aria-label="Dil / Language"><h2>🌐 ${L("Dil")} / Language</h2>
      <div class="presets lang-pick" role="group" aria-label="Dil / Language">${[['tr', '🇹🇷 Türkçe'], ['en', '🇬🇧 English'], ['auto', L("Cihaz dili")]].map(([v, name]) => `<button class="pchip ${s.language === v ? 'on' : ''}" aria-pressed="${s.language === v}" data-action="set" data-k="language" data-v='"${v}"' lang="${v === 'auto' ? '' : v}">${name}</button>`).join('')}</div>
      <p class="hint">${L("Şimdilik Türkçe ve İngilizce. Besin adları, matriks, tarif ve dışa aktarma seçilen dile geçer.")}</p></section>
    ${renderAppearance(s)}
    <section class="card aion-settings"><h2>${tr('aionTitle')}</h2>
      <p class="hint">${tr('aionHint')}</p>
      ${tog('aionEnabled', tr('aionShow'))}
      <div class="kv"><span>${tr('aionMotionLabel')}</span><span class="presets">${opt('aionMotion', 'auto', tr('aionMotionAuto'))}${opt('aionMotion', 'animate', tr('aionMotionAnimate'))}${opt('aionMotion', 'still', tr('aionMotionStill'))}</span></div>
      <div class="kv"><span>${tr('aionSizeLabel')}</span><span class="presets">${opt('aionSize', 's', tr('sizeS'))}${opt('aionSize', 'm', tr('sizeM'))}${opt('aionSize', 'l', tr('sizeL'))}</span></div>
      <div class="kv"><span>${tr('aionSideLabel')}</span><span class="presets">${opt('aionSide', 'left', tr('sideLeft'))}${opt('aionSide', 'right', tr('sideRight'))}</span></div>
      ${tog('aionTips', tr('aionTipsLabel'))}
      <div class="presets"><button class="btn" data-action="aion-demo" data-anim="celebrate">${tr('aionTry')}</button><button class="btn ghost" data-action="reset-group" data-group="aion">${tr('aionReset')}</button></div>
    </section>
    <section class="card"><h2>${tr('quickPresets')}</h2><div class="presets">
      <button class="btn" data-action="preset" data-p="dyslexia">${tr('dyslexiaPreset')}</button>
      <button class="btn" data-action="preset" data-p="lowvision">${tr('lowVisionPreset')}</button>
      <button class="btn" data-action="preset" data-p="calm">${tr('calmPreset')}</button>
      <button class="btn" data-action="preset" data-p="cute">${tr('pastelPreset')}</button>
      <button class="btn ghost" data-action="preset" data-p="reset">${L("Varsayılana dön")}</button></div></section>

    <section class="card"><h2>${tr('themes')}</h2><button class="btn ghost" data-action="reset-group" data-group="appearance">${tr('resetTheme')}</button><div class="themes">${THEMES.map((t) => `<button class="theme ${s.theme === t.id ? 'on' : ''}" data-action="set" data-k="theme" data-v='"${t.id}"' style="--tbg:${t.bg};--tfg:${t.fg};--tac:${t.ac}"><span class="tprev"><i></i><b>Aa</b></span>${tr('theme_' + t.id)}</button>`).join('')}</div>
      <h3>${tr('color_accent')}</h3><div class="swatches">${ACCENTS.map((a) => `<button class="sw-btn ${s.accent === a ? 'on' : ''}" data-action="set" data-k="accent" data-v='"${a}"' style="${a === 'auto' ? '' : `--sw:${a}`}" aria-label="${a === 'auto' ? tr('themeColor') : a}">${a === 'auto' ? tr('themes') : ''}</button>`).join('')}</div></section>

    <section class="card"><h2>${tr('fontTitle')}</h2><button class="btn ghost" data-action="reset-group" data-group="reading">${tr('resetReading')}</button><div class="fonts">${FONTS.map((f) => `<button class="fontbtn ${s.font === f.id ? 'on' : ''}" data-action="font" data-v="${f.id}" style="font-family:${esc(fontStack(f.id))}"><b>${f.id === 'system' ? tr('systemFont') : esc(f.name)}</b><span>${tr('fontSample')}</span><small>${tr('font_' + f.id)}</small></button>`).join('')}</div>
      ${step('fontSize', 'Yazı boyutu', 13, 28, 1, ' px')}
      ${step('lineHeight', 'Satır aralığı', 1.2, 2.4, 0.1, '', (x) => fmtNum(x))}
      ${step('letterSpacing', 'Harf aralığı', 0, 0.2, 0.01, ' em', (x) => fmtNum(x))}
      ${step('wordSpacing', 'Sözcük aralığı', 0, 0.5, 0.04, ' em', (x) => fmtNum(x))}
      ${tog('bold', tr('bold'))}
    </section>

    <section class="card"><h2>${L("Düzen ve erişilebilirlik")}</h2><button class="btn ghost" data-action="reset-group" data-group="accessibility">${L("Erişilebilirlik ayarlarını sıfırla")}</button>
      <div class="kv"><span>${L("Yoğunluk")}</span><span class="presets">${opt('density', 'comfy', L("Rahat"))}${opt('density', 'compact', L("Sıkı"))}${opt('density', 'large', L("Büyük dokunma"))}</span></div>
      ${step('radius', 'Köşe yuvarlaklığı', 0, 24, 2, ' px')}
      ${tog('ruler', L("Okuma cetveli"), L("İmlecin olduğu satırı vurgulayan yatay şerit; satır takibini kolaylaştırır."))}
      ${tog('reduceMotion', L("Animasyonları azalt"))}
      ${tog('emoji', L("Simgeleri / emojileri göster"))}
      ${tog('largeCursor', L("Büyük fare imleci"))}
      ${step('focusWidth', 'Odak halkası kalınlığı', 2, 6, 1, ' px')}
      <h3>${L("Klavye kısayolları")}</h3><p class="hint">${L("Metin yazarken ve pencereler açıkken sekme kısayolları devre dışıdır. Tab ile gez, Enter / Boşluk ile seç, Escape ile pencereyi kapat. Kısayolları yeniden ata veya kapat.")}</p>
      ${Object.entries(SHORTCUT_ACTIONS).map(([id, name]) => `<label class="field"><span>${tr(id)}</span><select data-shortcut="${id}"><option value="" ${!s.shortcuts[id] ? 'selected' : ''}>${L("Kapalı")}</option>${Array.from({ length: 9 }, (_, i) => `Alt+${i + 1}`).map(key => `<option value="${key}" ${s.shortcuts[id] === key ? 'selected' : ''}>${key}</option>`).join('')}</select></label>`).join('')}
    </section>

    <section class="card"><h2>${L("Matriks gösterimi")}</h2><button class="btn ghost" data-action="reset-group" data-group="matrix">${L("Matriks ayarlarını sıfırla")}</button>
      ${tog('showNrv', L("Yüzde referansı çubukları"), L("Seçili BRD, elle girilen hedef veya EFSA PRI/AI referansıyla karşılaştırma; kişisel ihtiyaç veya emilim ölçümü değildir."))}
      ${tog('showSource', L("Kaynak etiketleri (USDA / Hesap / Etiket)"))}
      ${tog('showAlt', L("Varsa ikinci kaynağı göster (bu sürümde ikinci veri seti yok)"))}
      ${tog('showSd', L("Varsa kaynak standart sapmasını göster"))}
      ${tog('showNiche', L("Az bilinen besinleri de listele (ör. jackfruit, teff); kapalıyken yalnız aramada çıkar"))}
      ${tog('catGrid', L("Keşfet'te kategorileri eşit kutulu ızgara olarak göster"))}
      ${tog('showAnimal', L("Hayvansal besinleri göster (süt, yumurta, et, balık, bal)"))}
      ${tog('showSimilar', L("Besin ayrıntısında benzer besinleri göster"))}
      ${tog('showRecent', L("Keşfet'te son bakılan besinleri göster"))}
      ${tog('recipeGaps', L("Tarifte en düşük kalan besinleri ve kaynaklarını göster"))}
      ${tog('cardFacts', L("Besin kartlarında kısa özet (kcal, protein, lif)"))}
      ${tog('showMissing', L("“Veri yok” satırlarını listele"))}
      <div class="kv"><span>${L("Ondalık hassasiyeti")}</span><span class="presets">${opt('precision', 'low', L("Az"))}${opt('precision', 'normal', L("Normal"))}${opt('precision', 'high', L("Çok"))}</span></div>
      <div class="kv"><span>${L("Varsayılan miktar")}</span><span class="presets">${[50, 100, 250, 1000].map((g) => opt('defaultAmount', g, g === 1000 ? '1 kg' : g + ' g')).join('')}</span></div>
      ${tog('showExt', L("Geniş katalog (USDA, {n} kayıt, İngilizce adlar)", { n: META.ext }))}
    </section>

    <section class="card"><h2>${L("Matriks bölümleri")}</h2>
      <p class="hint">${L("Görünür bölümleri seç, oklarla sırala. Kimlik ve kapsam özeti her zaman görünür.")}</p>
      <div class="section-settings">${s.sectionOrder.map((id, i) => `<div class="section-option">
        <label><input type="checkbox" data-section-visible="${id}" ${s.hiddenSections.includes(id) ? '' : 'checked'}> ${esc(L(MATRIX_SECTIONS.find(x => x.id === id).title))}</label>
        <span class="presets"><button class="btn ghost" data-action="section-move" data-id="${id}" data-d="-1" ${i === 0 ? 'disabled' : ''} aria-label="${L("{s} yukarı", { s: esc(L(MATRIX_SECTIONS.find(x => x.id === id).title)) })}">↑</button><button class="btn ghost" data-action="section-move" data-id="${id}" data-d="1" ${i === s.sectionOrder.length - 1 ? 'disabled' : ''} aria-label="${L("{s} aşağı", { s: esc(L(MATRIX_SECTIONS.find(x => x.id === id).title)) })}">↓</button></span>
      </div>`).join('')}</div>
      <h3>${L("Sabitlenen besin öğeleri")}</h3><p class="hint">${L("En fazla 24 öğeyi matriksin en üstünde izle.")}</p>
      <label class="field"><span>${L("Öğe sabitle")}</span><select id="pin-nutrient"><option value="">${L("Bir bileşen seç")}</option>${NUTRIENTS.filter(n => !['energy', 'energy_kj'].includes(n.key) && !s.pinnedNutrients.includes(n.key)).map(n => `<option value="${n.key}">${esc(nutrientLabel(n))} (${esc(n.unit)})</option>`).join('')}</select></label>
      <div class="presets">${s.pinnedNutrients.map(k => `<button class="pchip on" data-action="unpin" data-key="${k}" aria-label="${L("{n} sabitlemesini kaldır", { n: esc(nutrientLabel(NUTRIENTS.find(n => n.key === k))) })}">${esc(nutrientLabel(NUTRIENTS.find(n => n.key === k)))} ×</button>`).join('')}</div>
    </section>
    <section class="card"><h2>${L("Birim ve sayı tercihleri")}</h2>
      <div class="kv"><span>${L("Enerji (matriks)")}</span><div class="presets">${opt('energyUnit', 'both', 'kcal + kJ')}${opt('energyUnit', 'kcal', 'kcal')}${opt('energyUnit', 'kj', 'kJ')}</div></div>
      <div class="kv"><span>${L("Miktar göstergesi")}</span><div class="presets">${opt('amountUnit', 'g', L("Gram"))}${opt('amountUnit', 'oz', L("Ons (oz)"))}</div></div>
      <p class="hint">${L("1 oz = 28,349523125 g. Seçim düğmeleri ve hesap tabanı 1–1000 g aralığında kalır. Sıvılarda yaklaşık mL, yoğunluk 1 varsayımıdır.")}</p>
      <div class="kv"><span>${tr('numberSeparator')}</span><div class="presets">${opt('decimalSeparator', 'auto', tr('followLanguage'))}${opt('decimalSeparator', 'comma', tr('comma') + ': 1,5')}${opt('decimalSeparator', 'dot', tr('dot') + ': 1.5')}</div></div>
      ${tog('autoUnits', L("Büyük miktarlarda birimi yükselt (µg → mg → g)"))}
      <p class="hint">${L("CSV her zaman Türkçe Excel uyumlu ondalık virgül ve tanımlı besin birimlerini kullanır.")}</p>
    </section>
    <section class="card"><h2>${L("Yüzde referansı")}</h2>
      <div class="presets">${opt('referenceMode', 'eu', L("AB / TGK BRD"))}${opt('referenceMode', 'custom', L("Kendi hedeflerim"))}${opt('referenceMode', 'efsa', L("EFSA grup referansı"))}</div>
      <p class="hint">${L("AB 1169/2011 (2011) yetişkin etiket referansıdır. Kişisel hedeflerin elle girilir; yaşa veya sağlık durumuna göre otomatik öneri yapılmaz. Eksik hedefe BRD değeri atanmaz.")}</p>
      ${s.referenceMode === 'efsa' ? renderEfsaSettings(s, S.efsaTableOpen) : ''}
      ${s.referenceMode === 'custom' ? `<label class="field"><span>${L("Hedef eklenecek bileşen")}</span><select id="target-nutrient"><option value="">${L("Bileşen seç")}</option>${NUTRIENTS.filter(n => n.key !== 'energy_kj' && s.targets[n.key] == null).map(n => `<option value="${n.key}">${esc(nutrientLabel(n))} (${esc(n.unit)})</option>`).join('')}</select></label><label class="field"><span>${L("Yeni hedef miktarı (seçili bileşenin biriminde)")}</span><input type="number" min="0" step="any" id="target-new-value"></label><button class="btn" data-action="target-add">${L("Hedef ekle")}</button>
      ${Object.entries(s.targets).map(([k, value]) => { const n = NUTRIENTS.find(n => n.key === k); return `<label class="field"><span>${L("{n} hedefi ({u})", { n: esc(nutrientLabel(n)), u: esc(n.unit) })}</span><input type="number" min="0" step="any" data-target-value="${k}" value="${value}"></label><button class="btn ghost" data-action="target-remove" data-key="${k}">${L("{n} hedefini kaldır", { n: esc(nutrientLabel(n)) })}</button>`; }).join('')}` : ''}
    </section>
    <section class="card"><h2>${tr('customTheme')}</h2>
      <div class="cu-grid">${Object.entries(COLOR_LABELS).map(([k, label]) => `<button class="btn color-field" data-action="theme-color-open" data-key="${k}" aria-label="${tr('colorOpen', { name: tr('color_' + k) })}"><span class="color-dot" style="background:${s.customTheme[k]}" aria-hidden="true"></span><span>${tr('color_' + k)}<small>${s.customTheme[k]}</small></span></button>`).join('')}</div>
      ${themePreview(s.customTheme)}
      <p class="hint" role="status">${tr('themeContrast', { ratio: fmtNum(themeTextContrast(s.customTheme)) })} ${tr(themeTextContrast(s.customTheme) < 4.5 ? 'contrastLow' : 'contrastGood')} ${tr('contrastAccent')}: ${fmtNum(contrastRatio(s.customTheme.accent, s.customTheme.card))}:1.</p>
      <div class="presets"><button class="btn" data-action="theme-apply">${tr('themeApply')}</button><button class="btn" data-action="theme-export">${tr('themeExport')}</button><button class="btn" data-action="open-file" data-id="theme-file">${tr('themeImport')}</button><input type="file" id="theme-file" accept="application/json,.json" hidden></div>
    </section>
    <section class="card"><h2>${L("Görünüm profilleri")}</h2>
      <p class="hint">${L("Okuma, sunum veya gece için en fazla 12 görünüm kaydet. Profiller üst çubuktan uygulanabilir ve tam yedeğe dahildir.")}</p>
      <div class="presets"><input id="profile-name" aria-label="${L("Yeni profil adı")}" placeholder="${L("Ör. Gece okuması")}" maxlength="40"><button class="btn" data-action="profile-save">${L("Görünümü kaydet")}</button></div>
      ${S.profiles.map(p => `<div class="section-option"><b>${esc(p.name)}</b><span class="presets"><button class="btn" data-action="profile-apply" data-id="${p.id}">${L("Uygula")}</button><button class="btn" data-action="profile-update" data-id="${p.id}" aria-label="${L("{p} profilini güncelle", { p: esc(p.name) })}">${L("Güncelle")}</button><button class="btn danger" data-action="profile-delete" data-id="${p.id}" aria-label="${L("{p} profilini sil", { p: esc(p.name) })}">${L("Sil")}</button></span></div>`).join('')}
    </section>
    <section class="card"><h2>${L("Yalnızca ayarları taşı")}</h2>
      <p class="hint">${L("Görünümünü başka cihaza taşı. Tarifler ve kendi besinlerin bu işlemden etkilenmez.")}</p>
      <div class="presets"><button class="btn" data-action="settings-export">${L("Ayarları indir")}</button>
      <button class="btn" data-action="open-file" data-id="settings-file">${L("Ayar dosyası aç")}</button><input type="file" accept="application/json,.json" id="settings-file" hidden></div>
    </section>
    <section class="card updates"><h2>${L("Güncellemeler")}</h2>
      <div class="kv"><span>${L("Yüklü sürüm")}</span><span><b>${esc(window.__APP_VERSION__ || '')}</b></span></div>
      <p class="hint">${L("Uygulama kendiliğinden internete bağlanmaz. Yeni sürümü indirmek için sürüm sayfasını aç: GitHub hesabınla giriş yapmışken cihazına uygun dosyayı indir ve eskisinin üzerine kur. Tarifler, koleksiyonlar, ayarlar ve kendi besinlerin cihazda kalır; emin olmak için önce yedek al.")}</p>
      <div class="presets"><a class="btn primary" data-action="open-releases" href="${RELEASES_URL}" target="_blank" rel="noopener noreferrer">⬇ ${L("Sürüm sayfasını aç")}</a>
      <button class="btn" data-action="copy-releases">${L("Bağlantıyı kopyala")}</button>
      <button class="btn ghost" data-action="exp-file">${L("Önce yedek al (.json)")}</button></div>
      <p class="hint mono-url">${RELEASES_URL}</p>
    </section>
    <section class="card"><h2>${L("Yedekleme")}</h2>
      <p class="hint">${L("Tarifler ve ayarlar yalnızca bu cihazda saklanır. Başka cihaza taşımak veya yedeklemek için dışa aktar.")}</p>
      <div class="presets"><button class="btn" data-action="exp-file">${L("Dosyaya kaydet (.json)")}</button>
      <button class="btn" data-action="exp-copy">${L("Panoya kopyala")}</button>
      <button class="btn" data-action="open-file" data-id="imp-file">${L("Dosyadan içe aktar")}</button><input type="file" accept="application/json,.json" id="imp-file" hidden>
      <button class="btn" data-action="imp-paste">${L("Yapıştırarak içe aktar")}</button></div>
    </section>
  </div>`;
}

function renderAbout() {
  return `<div class="about card">
    <h2>Besin Matriksi</h2>
    <p>${L("Çevrimdışı çalışan, ayrıntılı besin bileşimi gezgini ve tarif hesaplayıcı. Bitkisel besinler ağırlıklı; hayvansal besinler ayrı kategorilerde ve etiketli (Ayarlar'dan gizlenebilir). İnternet bağlantısı gerekmez; hiçbir veri cihazdan çıkmaz.")}</p>
    <h3>${L("Veri kaynakları")}</h3>
    <ul>
      <li><b>${esc(SOURCES.u.short)}</b>: ${esc(L(SOURCES.u.long))}. ${L("Su, enerji, makrolar, lif, şeker, vitaminler, mineraller, yağ sınıfları; pişmiş formlar dahil.")}</li>
      <li><b>${L("USDA tam bileşim tablosu:")}</b> ${L("Ölçümü bulunan amino asitler, şeker türleri, yağ asitleri, D2/D3, tokoferoller, fitosteroller, kafein ve betain. Eksik değerler sıfıra çevrilmez.")}</li>
      <li><b>${esc(SOURCES.F.short)}</b>: ${esc(L(SOURCES.F.long))}. ${L("Aynı USDA kaydında SR28'de ölçülmeyen değerler (ör. biyotin, molibden, iyot, sitrik ve malik asit, şeker türleri) daha yeni analizden doldurulur; SR28 değerleri değiştirilmez.")}</li>
      <li><b>${esc(SOURCES.N.short)}</b>: ${esc(L(SOURCES.N.long))}. ${L("Türk kahvesi, bitkisel sütlü latte ve cappuccino gibi SR28'de olmayan hazır içecekler.")}</li>
      <li><b>${esc(SOURCES.f.short)}</b>: ${esc(L(SOURCES.f.long))}. ${L("Flavonoller (kuersetin, kaempferol…), flavonlar, flavanonlar (hesperetin, naringenin), flavan-3-oller (kateşinler, EGCG) ve antosiyanidinler; aynı USDA kayıt numarasıyla eşleşen besinlerde.")}</li>
      <li><b>${esc(L(SOURCES.y.short))}</b>: ${esc(L(SOURCES.y.long))}. ${L("Daidzein, genistein, glisitein.")}</li>
      <li><b>IFCT 2017:</b> ${L("NIN ürün kullanım izni doğrulanmadığı için veri ve bu veriye dayanan tahminler bu sürümde dağıtılmıyor.")}</li>
    </ul>
    <h3>${L("Veri dürüstlüğü")}</h3>
    <ul>
      <li>${L("Ölçülmemiş bileşen <b>“veri yok”</b> olarak gösterilir, asla 0 yazılmaz. 0 yalnızca kaynak 0 bildirdiğinde görünür.")}</li>
      <li>${L("Veriler kaynakta tanımlanan besin ve hazırlama biçimine aittir; çeşit, toprak, olgunluk ve yöntem değerleri değiştirebilir. Bu sürümde ikinci veri seti yoktur.")}</li>
      <li>${L("Varlık ≠ ölçülen miktar ≠ emilen miktar ≠ sağlık etkisi. Göstergeler eğitim amaçlıdır, tıbbi tavsiye değildir.")}</li>
      <li>${L("%BRD, AB/TGK etiket referansıdır; kişisel ihtiyacın yaşa, cinsiyete, sağlık durumuna göre değişir.")}</li>
      <li>${L("EFSA seçeneği, çocuk/yetişkin grup referanslarındaki PRI ve AI türlerini ayırır; üst sınır veya kişisel hedef önermez. Kaynak koşulları ve görüş yılı Ayarlar'daki referans tablosunda okunur.")}</li>
    </ul>
    <section class="license-notices" aria-label="${L("Lisanslar ve telif bildirimleri")}"><h3>${L("Lisanslar ve telif bildirimleri")}</h3>
      <p>${L("Kod MIT lisanslıdır. Veriler, yazı tipleri ve diğer yazılımlar kendi koşullarına tabidir. Aşağıdaki özgün bildirimler internetsiz okunabilir.")}</p>
      ${NOTICES.map(n => `<details class="notice"><summary>${esc(n.name)} · ${esc(n.license)} · ${esc(n.version)}</summary><pre>${esc(n.text)}</pre></details>`).join('')}
    </section>
    <p class="hint">${L("Sürüm {v} · veri: {src} · {n} küratörlü besin / {f} biçim.", { v: esc(window.__APP_VERSION__ || ''), src: esc(L(META.sources)), n: META.curated, f: META.forms })}</p>
  </div>`;
}

// ---------------------------------------------------------------- SEÇİCİ (modal)
function renderPicker() {
  const P = S.picker;
  if (!P) return '';
  const item = P.sel ? resolve(P.sel) : null;
  return `<div class="modal" role="dialog" aria-modal="true" aria-label="${L("Besin seç")}">
    <div class="modal-box">
      <div class="modal-h"><h2>${P.target === 'recipe' ? L("Tarife malzeme ekle") : L("Karşılaştırmaya besin ekle")}</h2>
        <button class="btn ghost" data-action="pk-close" aria-label="${L("Kapat")}">✕ ${L("Kapat")}</button></div>
      ${item ? `<div class="pk-sel"><button class="back show" data-action="pk-back">← ${L("Geri")}</button><h3>${esc(item.name)}</h3>
          ${formChips('pk', P.sel)}
          ${amountControls('pk', P.amount, item.portions, { liquid: item.liquid })}
          <div class="pk-prev">${item.v.energy != null ? `${fmtNum((item.v.energy * P.amount) / 100)} kcal · ` : ''}${item.v.protein != null ? `${fmtNum((item.v.protein * P.amount) / 100)} g protein · ` : ''}${item.v.fiber != null ? `${fmtNum((item.v.fiber * P.amount) / 100)} g ${L("lif")}` : ''}</div>
          <button class="btn primary big" data-action="pk-confirm">${P.target === 'recipe' ? '＋ ' + L("Tarife ekle") : '＋ ' + L("Karşılaştırmaya ekle")}</button>
          ${P.target === 'recipe' ? `<button class="btn" data-action="pk-confirm-more">＋ ${L("Ekle ve başka seç")}</button>` : ''}</div>`
      : `<nav class="cats cats-grid">${categoryNav('pk', P.cat, S.settings.showExt)}</nav>
        <div class="searchbar"><input type="search" id="pq" placeholder="${L("Ara (isteğe bağlı)")}" value="${esc(P.q)}" autocomplete="off" aria-label="${L("Besin ara")}"></div>
        <div class="pk-list">${foodList('pk', P.cat, P.q, P.extGroup)}</div>`}
    </div></div>`;
}

// ---------------------------------------------------------------- KOLEKSİYONA EKLE (modal)
function renderColPicker() {
  if (!S.colPicker || !S.sel) return '';
  const item = resolve(S.sel);
  const btn = (c, sub) => {
    const on = hasRef(c, S.sel);
    return `<button class="col-toggle ${sub ? 'sub' : ''} ${on ? 'on' : ''}" aria-pressed="${on}" data-action="col-toggle" data-id="${c.id}"><span class="tick" aria-hidden="true">${on ? '✓' : '+'}</span>${sub ? '↳ ' : ''}${esc(c.name)}<span class="cnt">${c.items.length}</span></button>`;
  };
  const tree = collectionTree(S.collections);
  return `<div class="modal" role="dialog" aria-modal="true" aria-label="${L("Koleksiyona ekle")}">
    <div class="modal-box small"><div class="modal-h"><h2>${esc(item?.name || '')}</h2><button class="btn ghost" data-action="col-pick-close" aria-label="${L("Kapat")}">✕</button></div>
      <p class="hint">${L("Dokunarak ekle ya da çıkar. Bir besin birden çok koleksiyonda olabilir.")}</p>
      <div class="col-toggles">${tree.map((c) => btn(c, false) + c.children.map((ch) => btn(ch, true)).join('')).join('') || `<p class="empty">${L("Henüz koleksiyonun yok.")}</p>`}</div>
      <div class="presets"><input id="col-new-name" maxlength="40" placeholder="${L("Yeni koleksiyon adı (ör. Kahvaltılıklar)")}" aria-label="${L("Yeni koleksiyon adı")}"><button class="btn primary" data-action="col-create-add">＋ ${L("Oluştur ve ekle")}</button></div>
      <div class="presets end"><button class="btn" data-action="col-pick-close">${L("Bitti")}</button></div>
    </div></div>`;
}
function persistCollections() { if (!saveCollections(S.collections)) toast(L("Kaydedilemedi: cihaz depolaması kullanılamıyor")); }

// ---------------------------------------------------------------- KENDİ BESİNİM (etiket girişi)
const CUSTOM_FIELDS = [
  ['energy', 'Enerji', 'kcal'], ['fat', 'Yağ', 'g'], ['sfa', '  Doymuş yağ', 'g'], ['mufa', '  Tekli doymamış', 'g'], ['pufa', '  Çoklu doymamış', 'g'], ['trans', '  Trans yağ', 'g'],
  ['carb_avail', 'Karbonhidrat (etiketteki, lif hariç)', 'g'], ['sugars', '  Şekerler', 'g'], ['starch', '  Nişasta', 'g'], ['fiber', 'Lif', 'g'], ['protein', 'Protein', 'g'],
  ['salt', 'Tuz', 'g'], ['ca', 'Kalsiyum', 'mg'], ['fe', 'Demir', 'mg'], ['mg', 'Magnezyum', 'mg'], ['k', 'Potasyum', 'mg'], ['zn', 'Çinko', 'mg'], ['p', 'Fosfor', 'mg'],
  ['vitc', 'C vitamini', 'mg'], ['vitd', 'D vitamini', 'µg'], ['b12', 'B12', 'µg'], ['folate', 'Folat', 'µg'], ['riboflavin', 'B2 (riboflavin)', 'mg'], ['vite', 'E vitamini', 'mg'], ['vitk', 'K vitamini', 'µg'], ['vita_rae', 'A vitamini', 'µg'], ['se', 'Selenyum', 'µg'], ['ala_fa', 'ALA (omega-3)', 'mg'], ['dha', 'DHA', 'mg'],
];
function renderCustomEditor() {
  const E = S.customEdit;
  if (!E) return '';
  const val = (k) => (k === 'salt' ? (E.v.na != null ? Math.round((E.v.na * 2.5) / 10) / 100 : '') : E.v[k] ?? '');
  return `<div class="modal" role="dialog" aria-modal="true" aria-label="${L("Kendi besinim")}">
    <div class="modal-box"><div class="modal-h"><h2>${E.id ? L("Besini düzenle") : L("Etiketten yeni besin")}</h2><button class="btn ghost" data-action="cu-close">✕ ${L("Kapat")}</button></div>
      <label class="field"><span>${L("Ad")}</span><input id="cu-name" value="${esc(E.name)}" placeholder="${L("ör. Alpro soya içeceği (şekersiz)")}"></label>
      <div class="kv"><span>${L("Değerler")}</span><span class="presets">${['100 g', '100 mL'].map((t, i) => `<button class="pchip ${!!E.liquid === !!i ? 'on' : ''}" data-action="cu-liquid" data-v="${i}">${L("{t} başına", { t })}</button>`).join('')}</span></div>
      <label class="field"><span>${L("Etiketteki porsiyon (g, isteğe bağlı)")}</span><input id="cu-portion" type="number" inputmode="decimal" min="1" max="1000" value="${E.portion ?? ''}"></label>
      <p class="hint">${L("Boş bıraktığın bileşenler “veri yok” sayılır (0 değil). Etikette “&lt;0,5 g” yazıyorsa boş bırakmak daha dürüsttür.")}</p>
      <div class="cu-grid">${CUSTOM_FIELDS.map(([k, l, u]) => `<label class="field ${l.startsWith('  ') ? 'indent' : ''}"><span>${esc(L(l.trim()))} <em>${u}</em></span><input type="number" inputmode="decimal" min="0" step="any" data-cu="${k}" value="${val(k)}"></label>`).join('')}</div>
      <div class="presets end">${E.id ? `<button class="btn danger" data-action="cu-delete">${L("Sil")}</button>` : ''}<button class="btn" data-action="cu-close">${L("Vazgeç")}</button><button class="btn primary" data-action="cu-save">${L("Kaydet")}</button></div>
    </div></div>`;
}
function saveCustomEdit() {
  const E = S.customEdit;
  if (!E.name.trim()) { toast(L("Bir ad gir")); return false; }
  const list = customFoods().slice();
  if (Object.values(E.v).some(v => !Number.isFinite(v) || v < 0)) { toast(L("Besin değerleri sıfır veya pozitif sonlu sayılar olmalı")); return false; }
  const rec = normalizeCustom({ ...E, id: E.id || uid() });
  const i = list.findIndex((x) => x.id === rec.id);
  if (i >= 0) list[i] = rec; else list.push(rec);
  setCustomFoods(list);
  if (!saveCustom(list)) toast(L("Kaydedilemedi: cihaz depolaması kullanılamıyor"));
  S.customEdit = null;
  S.cat = 'custom';
  S.sel = { t: 'u', id: rec.id };
  return true;
}

// ---------------------------------------------------------------- render
const RELEASES_URL = 'https://github.com/kaansavukduran/besinmatriksi/releases';
const TAB_SHORT = { kesfet: () => L("Keşfet"), tarif: () => L("Tarif"), gunluk: () => L("Günlük"), karsilastir: () => L("Kıyasla"), hakkinda: () => L("Bilgi"), ayarlar: () => L("Ayarlar") };
const TABS = [['kesfet', '🔎'], ['tarif', '🥣'], ['gunluk', '📒'], ['karsilastir', '⚖️'], ['hakkinda', 'ℹ️'], ['ayarlar', '🎨']];

export function render() {
  const keep = {};
  document.querySelectorAll('[data-keep-scroll]').forEach((el) => (keep[el.dataset.keepScroll] = el.scrollTop));
  const winY = window.scrollY;
  const focusedId = document.activeElement?.id;
  const focusedSelector = focusSelector(document.activeElement);
  const wasModal = !!document.querySelector('.modal');
  const selStart = document.activeElement?.selectionStart;
  let view = '';
  if (S.tab === 'kesfet') view = renderExplore();
  else if (S.tab === 'gunluk') view = renderPersonal(S.personal, S.personalDraft, S.personalDay, S.consumedOnly, S.settings, resolve, S.personalSource, S.personalSourceOpen, S.personalUndo, S.personalReadError);
  else if (S.tab === 'tarif') view = renderRecipe();
  else if (S.tab === 'karsilastir') view = renderCompare();
  else if (S.tab === 'ayarlar') view = renderSettings();
  else view = renderAbout();
  app().innerHTML = `
    <header class="top">
      <div class="brand">${S.settings.emoji ? '<span class="logo" aria-hidden="true">🫐</span>' : ''}<b>Besin Matriksi</b></div>
      <nav class="tabs" aria-label="${tr('navigation')}">${TABS.map(([id, ic]) => `<button class="tab ${S.tab === id ? 'on' : ''}" data-action="tab" data-tab="${id}" ${S.tab === id ? 'aria-current="page"' : ''}><span class="ti" aria-hidden="true">${S.settings.emoji ? ic : ''}</span><span class="tt">${tr(id)}</span><span class="tt-short">${TAB_SHORT[id]()}</span>${id === 'tarif' && activeRecipe()?.items.length ? `<span class="badge">${activeRecipe().items.length}</span>` : ''}${id === 'karsilastir' && S.compare.length ? `<span class="badge">${S.compare.length}</span>` : ''}</button>`).join('')}</nav>
    </header>
    ${S.profiles.length ? `<div class="profile-bar" role="group" aria-label="${L("Görünüm profilleri")}"><span class="hint">${L("Görünüm:")}</span>${S.profiles.map(p => `<button class="pchip" data-action="profile-apply" data-id="${p.id}">${esc(p.name)}</button>`).join('')}</div>` : ''}
    <main class="view view-${S.tab}">${view}</main>
    ${renderPicker()}${renderColPicker()}${renderCustomEditor()}${renderThemeEditor(S.themeEditor, S.settings.customTheme)}`;
  aionMood(aionMoodFor());
  celebrateGoals();
  if (S.tab === 'ayarlar') applySettingsFilter();
  if (S.tab === 'tarif') applyRecipeFilter();
  document.querySelectorAll('.list, .detail, .pk-list, .cats').forEach((el, i) => (el.dataset.keepScroll = el.className.split(' ')[0] + i));
  document.querySelectorAll('[data-keep-scroll]').forEach((el) => { if (keep[el.dataset.keepScroll] != null) el.scrollTop = keep[el.dataset.keepScroll]; });
  window.scrollTo(0, winY);
  syncModalFocus(!document.querySelector('.modal') && wasModal ? modalOpener : focusedSelector);
  if (focusedId) {
    const el = document.getElementById(focusedId);
    if (el) { el.focus(); if (selStart != null && el.setSelectionRange) try { el.setSelectionRange(selStart, selStart); } catch {} }
  }
}

function refreshMatrix() {
  const m = $('#matrix');
  if (!m) return render();
  if (S.tab === 'kesfet' && S.sel) m.innerHTML = matrixForExplore(resolve(S.sel));
  else if (S.tab === 'tarif') {
    const rc = activeRecipe();
    const { r, basisLabel, factor } = recipeResult(rc);
    m.innerHTML = renderMatrix(r, S.settings, { recipe: rc, basisLabel, closed: S.closed });
    const summary = $('#recipe-summary'); if (summary) summary.innerHTML = renderRecipeSummary(rc, r);
    const gapsEl = $('#recipe-gaps'); if (gapsEl) gapsEl.innerHTML = renderRecipeGaps(r);
    const sources = $('#recipe-sources'); if (sources) sources.innerHTML = renderRecipeSources(rc, resolve, { key: S.recipeSource, factor, basisLabel, open: S.recipeSourcesOpen, precision: S.settings.precision });
    rc.items.forEach((it) => {
      const item = resolve(it.ref);
      const el = document.querySelector(`[data-amount="rc:${it.id}"]`)?.closest('.ing')?.querySelector('.ing-kcal');
      if (el && item?.v.energy != null) el.textContent = fmtNum((item.v.energy * it.g) / 100) + ' kcal';
    });
  }
}

// ---------------------------------------------------------------- miktar
function getAmount(target) {
  if (target === 'ex') return S.amount;
  if (target === 'pk') return S.picker?.amount;
  if (target.startsWith('rc:')) return activeRecipe().items.find((i) => i.id === target.slice(3))?.g;
  if (target.startsWith('cmp:')) return S.compare[+target.slice(4)]?.g;
  return null;
}
function setAmount(target, g, { fromSlider = false } = {}) {
  g = clamp(Math.round(g * 100) / 100, 1, MAX_G);
  if (target === 'ex') S.amount = g;
  else if (target === 'pk') S.picker.amount = g;
  else if (target.startsWith('rc:')) { const it = activeRecipe().items.find((i) => i.id === target.slice(3)); if (it) it.g = g; persistRecipes(); }
  else if (target.startsWith('cmp:')) { const c = S.compare[+target.slice(4)]; if (c) c.g = g; }
  // Yerinde güncelle (kaydırıcı sürüklenirken odak kaybolmasın)
  const box = document.querySelector(`[data-amount="${CSS.escape(target)}"]`);
  if (box) {
    const out = box.querySelector('.amt-val b');
    if (out) out.textContent = fmtNum(S.settings.amountUnit === 'oz' ? g / 28.349523125 : g);
    if (S.settings.amountUnit === 'oz') box.querySelector('.amount-unit').textContent = `oz (≈ ${fmtNum(g)} g)`;
    const sl = box.querySelector('.slider');
    if (sl && !fromSlider) sl.value = String(Math.round(g));
    if (sl) { sl.style.setProperty('--fill', ((g - 1) / (MAX_G - 1)) * 100 + '%'); sl.setAttribute('aria-valuetext', fmtNum(g) + ' g'); }
    box.querySelectorAll('.pchip').forEach((b) => b.classList.toggle('on', Math.abs(Number(b.dataset.val) - g) < 0.01));
    const ps = box.querySelector('.per-serv') || box.parentElement?.querySelector('.per-serv');
    if (ps) ps.textContent = L("porsiyon başı {g} g", { g: fmtNum(g / Number(ps.dataset.perserv)) });
  }
  if (target === 'pk') {
    const item = resolve(S.picker.sel);
    const pv = $('.pk-prev');
    if (pv && item) pv.textContent = [item.v.energy != null ? `${fmtNum((item.v.energy * g) / 100)} kcal` : null, item.v.protein != null ? `${fmtNum((item.v.protein * g) / 100)} g protein` : null, item.v.fiber != null ? `${fmtNum((item.v.fiber * g) / 100)} g lif` : null].filter(Boolean).join(' · ');
  } else if (target.startsWith('cmp:')) render();
  else refreshMatrix();
}

// Uygulama içi diyalog (masaüstü/mobil web görünümlerinde alert/confirm/prompt güvenilir değil)
function uiDialog(message, { input = null, ok = L("Tamam"), cancel = null, line = false } = {}) {
  return new Promise((resolveP) => {
    const wrap = document.createElement('div');
    wrap.className = 'modal dlg';
    wrap.innerHTML = `<div class="modal-box small" role="alertdialog" aria-modal="true" aria-label="${L("Onay")}"><p>${esc(message)}</p>
      ${input != null ? (line ? `<input class="dlg-line" type="text" maxlength="40" aria-label="${esc(message)}" value="${esc(input)}">` : `<textarea rows="6" aria-label="${L("Metin")}">${esc(input)}</textarea>`) : ''}
      <div class="presets end">${cancel ? `<button class="btn" data-r="0">${esc(cancel)}</button>` : ''}<button class="btn primary" data-r="1">${esc(ok)}</button></div></div>`;
    const previousFocus = focusSelector(document.activeElement);
    document.body.appendChild(wrap);
    syncModalFocus();
    const ta = wrap.querySelector('textarea, .dlg-line');
    (ta || wrap.querySelector('[data-r="1"]')).focus();
    if (ta && input) ta.select();
    const finish = yes => {
      wrap.remove(); syncModalFocus(previousFocus);
      resolveP(input != null ? (yes ? ta.value : null) : yes);
    };
    wrap.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finish(!cancel); }
      else if (e.key === 'Enter' && line) { e.preventDefault(); finish(true); }
    });
    wrap.addEventListener('click', (e) => {
      const r = e.target.closest('[data-r]');
      if (!r) return;
      e.stopPropagation();
      const yes = r.dataset.r === '1';
      finish(yes);
    });
  });
}

// ---------------------------------------------------------------- olaylar
function selectFood(prefix, ref) {
  const q = prefix === 'ex' ? S.q : S.picker?.q;
  if (q?.trim()) { S.searches = recentSearches(S.searches, q); saveSearches(S.searches); }

  if (prefix === 'ex' && ref?.t === 'c') { S.recent = pushRecent(S.recent, ref, knownFood); saveRecent(S.recent); }
  if (prefix === 'ex') { S.sel = ref; S.amount = S.settings.defaultAmount; render(); const d = $('.detail'); if (d) d.scrollTop = 0; if (window.innerWidth < 900) window.scrollTo(0, 0); }
  else { S.picker.sel = ref; S.picker.amount = S.settings.defaultAmount; render(); }
}

// Günlük hedeflerine ulaşıldıysa Aion o gün için bir kez kutlar (cihazda hatırlanır; yeniden açılışta tekrar etmez)
function celebrateGoals() {
  if (S.tab !== 'gunluk') return;
  const keys = [...document.querySelectorAll('.basic-card.goals .basic-tile.goal.done')].map((e) => e.dataset.basic);
  let seen = {}; try { seen = JSON.parse(localStorage.getItem('bm.aion.goals') || '{}') || {}; } catch {}
  const prev = seen.day === S.personalDay && Array.isArray(seen.keys) ? seen.keys : [];
  const fresh = newlyReached(prev, keys);
  if (!fresh.length) return;
  try { localStorage.setItem('bm.aion.goals', JSON.stringify({ day: S.personalDay, keys: [...new Set([...prev, ...keys])] })); } catch {}
  aionPlay('celebrate');
  if (S.settings.aionTips) aionSay(celebrationText(fresh), 6000);
}

// Aion'un ekrana göre ruh hali: karşılama, inceleme, çalışma
function aionMoodFor() {
  if (S.tab === 'kesfet') {
    if (!S.sel) return S.q && !document.querySelector('.foods .food') ? 'sad' : 'wave';
    return 'read';
  }
  if (S.tab === 'karsilastir' || S.tab === 'hakkinda') return 'read';
  return 'idle';
}

function addToRecipe(ref, g, quiet = false) {
  const rc = activeRecipe();
  const existing = rc.items.find((i) => refKey(i.ref) === refKey(ref));
  if (existing) existing.g = clamp(existing.g + g, 1, MAX_G);
  else rc.items.push({ id: Math.random().toString(36).slice(2, 9), ref: { ...ref }, g });
  persistRecipes();
  if (quiet) return;
  toast(`“${resolve(ref).name}” → ${rc.name} (${fmtNum(g)} g)`);
  aionPlay('celebrate');
}
function addToCompare(ref, g) {
  if (S.compare.length >= 4) { toast(L("En fazla 4 besin karşılaştırılabilir")); return false; }
  S.compare.push({ ref: { ...ref }, g });
  toast(L("Karşılaştırmaya eklendi: {n}", { n: resolve(ref).name }));
  return true;
}

const PRESETS_UI = {
  dyslexia: { font: 'opendyslexic', fontSize: 19, lineHeight: 1.8, letterSpacing: 0.05, wordSpacing: 0.16, theme: 'sepia', ruler: true, density: 'comfy' },
  lowvision: { font: 'atkinson', fontSize: 22, lineHeight: 1.6, theme: 'contrast', bold: true, density: 'large' },
  calm: { theme: 'light', emoji: false, reduceMotion: true, accent: '#3557d6', font: 'inter', showSd: false, showAlt: false },
  cute: { theme: 'pastel', font: 'nunito', emoji: true, radius: 20, accent: 'auto' },
};

function persistPersonal() {
  if (S.personalReadError || !savePersonal(S.personal)) { toast(tr(S.personalReadError ? 'corruptPersonal' : 'storageError')); return false; }
  return true;
}
function updatePersonalDraft(input) {
  const key = input.dataset.personalField;
  if (!Object.hasOwn(S.personalDraft, key)) return;
  S.personalDraft[key] = key === 'specialContext' ? input.checked : ['sex', 'energySource', 'note', 'measuredOn'].includes(key) ? input.value : input.value === '' ? null : Number(input.value);
  $('#personal-preview').innerHTML = renderEnergy(S.personalDraft, true);
  $('#personal-save-status').textContent = tr('unsaved');
}
function updateNumericSetting(input) {
  if (!input.value || !input.checkValidity()) { input.setAttribute('aria-invalid', 'true'); return; }
  input.removeAttribute('aria-invalid');
  const key = input.dataset.settingRange || input.dataset.settingNumber;
  if (!['uiScale', 'fontSize', 'lineHeight', 'letterSpacing', 'wordSpacing', 'radius', 'focusWidth'].includes(key)) return;
  setSetting(key, Number(input.value));
  document.querySelectorAll(`[data-setting-output="${key}"]`).forEach(el => el.textContent = fmtNum(S.settings[key]) + (key === 'uiScale' ? '%' : ['fontSize', 'radius', 'focusWidth'].includes(key) ? ' px' : ['letterSpacing', 'wordSpacing'].includes(key) ? ' em' : ''));
  document.querySelectorAll(`[data-setting-range="${key}"], [data-setting-number="${key}"]`).forEach(el => { if (el !== input) el.value = S.settings[key]; });
}
async function importPersonalFile(file) {
  try {
    const payload = JSON.parse(await file.text());
    if (payload.app !== 'besin-matriksi-personal' || payload.version !== 1 || !Array.isArray(payload.custom)) throw Error('invalid');
    const imported = mergePersonalFoods(S.personal, payload.personal, customFoods(), payload.custom), merged = imported.state, list = imported.custom;
    if (!saveCustom(list)) throw Error('storage');
    if (S.personalReadError) localStorage.setItem(PERSONAL_KEY + '.recovery', localStorage.getItem(PERSONAL_KEY) || '');
    setCustomFoods(list); S.personal = merged; S.personalDraft = structuredClone(merged.profile); S.personalReadError = false;
    if (merged.entries.some(e => e.ref.t === 'x')) await loadExt();
    const saved = persistPersonal(); render(); if (saved) toast(tr('importDone'));
  } catch { await uiDialog(tr('personal.importError'), { ok: tr('ok') }); }
}
async function onClick(e) {
  const b = e.target.closest('[data-action]');
  if (!b) return;
  const a = b.dataset.action;
  if (!document.querySelector('.modal')) modalOpener = focusSelector(b);
  switch (a) {
    case 'aion-demo': aionPlay(b.dataset.anim || 'celebrate'); aionSay(tr('aionHello'), 4000); break;
    case 'personal-goto-day': if (validDay(b.dataset.day)) { S.personalDay = b.dataset.day; render(); } break;
    case 'personal-to-recipe': {
      const { items, capped } = dayToRecipeItems(S.personal.entries, S.personalDay, { consumedOnly: S.consumedOnly, maxG: MAX_G });
      if (!items.length) break;
      const r = newRecipe(L("Günlük {d}", { d: S.personalDay })); r.items = items;
      S.recipes.push(r); S.activeRecipe = r.id; persistRecipes(); S.tab = 'tarif'; render();
      toast(L("{n} malzemeli tarif oluşturuldu", { n: items.length }) + (capped ? ' · ' + L("{n} besin 1 kg sınırında kesildi", { n: capped }) : ''));
      aionPlay('celebrate'); break;
    }
    case 'rc-to-day': {
      const rc = activeRecipe(); if (!rc.items.length) break;
      const ans = await uiDialog(L("“{r}” tarifinden kaç porsiyon? (Tarif {s} porsiyon; ölçü bugünün günlüğüne malzeme malzeme eklenir.)", { r: rc.name, s: rc.servings }), { input: '1', line: true, ok: L("Günlüğe ekle"), cancel: L("Vazgeç") });
      if (ans == null) break;
      const portions = Number(String(ans).replace(',', '.'));
      if (!(portions > 0 && portions <= 50)) { toast(L("Porsiyon 0'dan büyük ve en fazla 50 olmalı.")); break; }
      const day = localDay();
      const { entries, skipped } = recipeToEntries(rc.items, portions, rc.servings, day, (ref) => !!resolve(ref));
      if (!entries.length) { toast(L("Eklenecek malzeme yok.")); break; }
      S.personal.entries.push(...entries); S.personal.milestones.food = true; persistPersonal();
      toast(L("{n} kayıt bugünün günlüğüne eklendi", { n: entries.length }) + (skipped ? ' · ' + L("{n} malzeme atlandı (bulunamadı veya 1 g altı)", { n: skipped }) : ''));
      aionPlay('celebrate'); break;
    }
    case 'ex-add-day': {
      if (!S.sel || !resolve(S.sel)) break;
      S.personal.entries.push({ id: uid(), day: S.personalDay, ref: { ...S.sel }, g: S.amount, consumed: false });
      S.personal.milestones.food = true; persistPersonal(); toast(tr('dayAdded')); aionPlay('celebrate'); break;
    }
    case 'personal-save': {
      if ([...document.querySelectorAll('[data-personal-field]')].some(el => !el.checkValidity())) { toast(tr('profile.invalid')); break; }
      try {
        S.personal.profile = normalizeProfile(S.personalDraft);
        if (S.personal.profile.age && S.personal.profile.height && S.personal.profile.weight && S.personal.profile.sex !== 'unspecified') S.personal.milestones.profile = true;
        const saved = persistPersonal(); render(); if (saved) $('#personal-save-status').textContent = tr('saved');
      } catch { toast(tr('profile.invalid')); }
      break;
    }
    case 'personal-clear': {
      if (!await uiDialog(tr('confirmClear'), { ok: tr('clearProfile'), cancel: tr('cancel') })) break;
      S.personalUndo = { type: 'profile', profile: structuredClone(S.personal.profile) };
      S.personal.profile = emptyProfile(); S.personalDraft = emptyProfile(); persistPersonal(); render(); break;
    }
    case 'personal-mode': S.consumedOnly = b.dataset.mode === 'consumed'; render(); break;
    case 'personal-consumed': { const entry = S.personal.entries.find(e => e.id === b.dataset.id); if (entry) entry.consumed = !entry.consumed; persistPersonal(); render(); break; }
    case 'personal-remove': { const entry = S.personal.entries.find(e => e.id === b.dataset.id); if (entry) { S.personalUndo = { type: 'entry', entry: { ...entry } }; S.personal.entries = S.personal.entries.filter(e => e.id !== entry.id); persistPersonal(); render(); } break; }
    case 'personal-undo': {
      const undo = S.personalUndo;
      if (undo?.type === 'entry' && !S.personal.entries.some(e => e.id === undo.entry.id)) S.personal.entries.push(undo.entry);
      if (undo?.type === 'profile') { S.personal.profile = undo.profile; S.personalDraft = structuredClone(undo.profile); }
      S.personalUndo = null; persistPersonal(); render(); break;
    }
    case 'personal-efsa': {
      const p = S.personal.profile;
      if (!(p.age >= 1 && p.age <= 99) || !['male', 'female'].includes(p.sex)) { toast(tr('saveProfileFirst')); break; }
      setSetting('referenceMode', 'efsa'); setSetting('efsaAge', p.age); setSetting('efsaSex', p.sex); setSetting('efsaPhytate', ''); setSetting('efsaIronGroup', 'unspecified'); render(); break;
    }
    case 'personal-export': {
      const refs = new Set(S.personal.entries.filter(e => e.ref.t === 'u').map(e => e.ref.id));
      download('besin-matriksi-personal.json', JSON.stringify({ app: 'besin-matriksi-personal', version: 1, personal: S.personal, custom: customFoods().filter(f => refs.has(f.id)).map(normalizeCustom) }, null, 2)); break;
    }
    case 'personal-raw': try { download('besin-matriksi-personal-raw.txt', localStorage.getItem(PERSONAL_KEY) || '', 'text/plain'); } catch { await uiDialog(tr('storageError'), { ok: tr('ok') }); } break;
    case 'setting-reset': if (Object.hasOwn(DEFAULT_SETTINGS, b.dataset.key)) { setSetting(b.dataset.key, DEFAULT_SETTINGS[b.dataset.key]); render(); } break;
    case 'tab': S.tab = b.dataset.tab; render(); window.scrollTo(0, 0); break;
    // keşfet
    case 'ex-cat': S.sel = null; S.cat = b.dataset.cat || null; S.extGroup = null; render(); $('.list') && ($('.list').scrollTop = 0); break;
    case 'ex-extgroup': S.extGroup = S.extGroup === b.dataset.g ? null : b.dataset.g; render(); break;
    case 'ex-pick': selectFood('ex', { t: 'c', id: b.dataset.id, f: 0 }); break;
    case 'gap-open': S.tab = 'kesfet'; selectFood('ex', { t: 'c', id: b.dataset.id, f: 0 }); break;
    case 'ex-pick-ext': selectFood('ex', { t: 'x', n: b.dataset.ndb }); break;
    case 'ex-pick-custom': selectFood('ex', { t: 'u', id: b.dataset.cid }); break;
    case 'ex-pick-ref': selectFood('ex', JSON.parse(b.dataset.ref)); break;
    case 'pk-pick-ref': selectFood('pk', JSON.parse(b.dataset.ref)); break;
    case 'sort': S.sort = b.dataset.s; render(); break;
    case 'rc-sort': S.rcSort = b.dataset.s; render(); break;
    case 'recent-clear': S.recent = []; saveRecent([]); render(); break;
    case 'ing-open': { const id = b.dataset.id; if (S.ingOpen.has(id)) S.ingOpen.delete(id); else S.ingOpen.add(id); render(); document.querySelector(`[data-action="ing-open"][data-id="${CSS.escape(id)}"]`)?.focus(); break; }
    case 'multi-toggle': S.multi = !S.multi; S.picked = []; render(); break;
    case 'multi-pick': { const id = b.dataset.id; S.picked = S.picked.includes(id) ? S.picked.filter((x) => x !== id) : [...S.picked, id]; render(); break; }
    case 'multi-add': {
      const n = S.picked.length; if (!n) break;
      for (const id of S.picked) addToRecipe({ t: 'c', id, f: 0 }, 100, true);
      toast(L("{n} besin → {r} (her biri 100 g)", { n, r: activeRecipe().name })); aionPlay('celebrate');
      S.multi = false; S.picked = []; render(); break;
    }
    case 'col-pick': S.colPicker = true; render(); break;
    case 'col-pick-close': S.colPicker = false; render(); break;
    case 'col-toggle': {
      const before = S.collections.find((c) => c.id === b.dataset.id);
      const added = before && !hasRef(before, S.sel);
      S.collections = toggleRef(S.collections, b.dataset.id, S.sel); persistCollections(); render();
      if (added) aionPlay('celebrate');
      break;
    }
    case 'col-create-add': {
      const name = $('#col-new-name')?.value || '';
      try { const r = createCollection(S.collections, name); S.collections = toggleRef(r.list, r.created.id, S.sel); persistCollections(); render(); aionPlay('celebrate'); }
      catch { toast(L("Koleksiyon için bir ad yaz")); }
      break;
    }
    case 'col-new': {
      const name = await uiDialog(L("Yeni koleksiyonun adı:"), { input: '', line: true, ok: L("Oluştur"), cancel: L("Vazgeç") });
      if (name == null) break;
      try { const r = createCollection(S.collections, name); S.collections = r.list; S.cat = 'col:' + r.created.id; persistCollections(); render(); }
      catch (err) { toast(err.message === 'too-many' ? L("En fazla 60 koleksiyon olabilir") : L("Koleksiyon için bir ad yaz")); }
      break;
    }
    case 'col-sub': {
      const name = await uiDialog(L("Alt kategorinin adı:"), { input: '', line: true, ok: L("Oluştur"), cancel: L("Vazgeç") });
      if (name == null) break;
      try { const r = createCollection(S.collections, name, b.dataset.id); S.collections = r.list; S.cat = 'col:' + r.created.id; persistCollections(); render(); }
      catch { toast(L("Koleksiyon için bir ad yaz")); }
      break;
    }
    case 'col-rename': {
      const c = S.collections.find((x) => x.id === b.dataset.id);
      const name = c && await uiDialog(L("Yeni ad:"), { input: c.name, line: true, ok: L("Kaydet"), cancel: L("Vazgeç") });
      if (name) { S.collections = renameCollection(S.collections, c.id, name); persistCollections(); render(); }
      break;
    }
    case 'col-delete': {
      const c = S.collections.find((x) => x.id === b.dataset.id);
      if (!c) break;
      const subs = S.collections.filter((x) => x.parent === c.id).length;
      const msg = subs ? L("“{n}” ve {s} alt kategorisi silinsin mi? Besinlerin kendisi silinmez.", { n: c.name, s: subs }) : L("“{n}” silinsin mi? Besinlerin kendisi silinmez.", { n: c.name });
      if (!(await uiDialog(msg, { ok: L("Sil"), cancel: L("Vazgeç") }))) break;
      S.collections = deleteCollection(S.collections, c.id); S.cat = null; persistCollections(); render(); break;
    }
    case 'col-move': S.collections = moveRef(S.collections, b.dataset.id, +b.dataset.i, +b.dataset.d); persistCollections(); render(); break;
    case 'rc-move': { const rc = activeRecipe(); const i = rc.items.findIndex((x) => x.id === b.dataset.id); rc.items = moveIndex(rc.items, i, +b.dataset.d); persistRecipes(); render(); break; }
    case 'col-remove-item': S.collections = removeRef(S.collections, b.dataset.id, JSON.parse(b.dataset.ref)); persistCollections(); render(); break;
    case 'pk-pick-custom': selectFood('pk', { t: 'u', id: b.dataset.cid }); break;
    case 'cu-new': S.customEdit = { name: b.dataset.name || '', liquid: false, portion: null, v: {} }; render(); break;
    case 'cu-edit': { const f = customFoods().find((x) => x.id === S.sel?.id); if (f) { S.customEdit = JSON.parse(JSON.stringify(f)); render(); } break; }
    case 'cu-close': S.customEdit = null; render(); break;
    case 'cu-liquid': S.customEdit.liquid = b.dataset.v === '1'; render(); break;
    case 'cu-save': if (saveCustomEdit()) { S.tab = 'kesfet'; render(); toast(L("Kaydedildi")); } break;
    case 'cu-delete': {
      const E = S.customEdit;
      if (!(await uiDialog(L("“{n}” silinsin mi? Tariflerdeki kullanımları “bulunamadı” olarak kalır.", { n: E.name }), { ok: L("Sil"), cancel: L("Vazgeç") }))) break;
      const list = customFoods().filter((x) => x.id !== E.id);
      setCustomFoods(list); saveCustom(list); S.customEdit = null; if (S.sel?.t === 'u') S.sel = null; render(); break;
    }
    case 'csv': exportCSV(); break;
    case 'print': try { printController.print(); } catch { toast(L("Yazdırma bu ortamda kullanılamıyor; CSV olarak indirebilirsin")); } break;
    case 'ex-form': S.sel = { ...S.sel, f: +b.dataset.f }; render(); break;
    case 'ex-back': S.sel = null; render(); break;
    case 'search-recent': S.q = b.dataset.q; S.cat = null; render(); break;
    case 'search-clear': S.searches = []; saveSearches([]); render(); break;
    case 'ex-clear': S.q = ''; render(); break;
    case 'ex-add-recipe': addToRecipe(S.sel, S.amount); render(); break;
    case 'ex-add-compare': addToCompare(S.sel, S.amount); render(); break;
    // miktar
    case 'amt': setAmount(b.dataset.target, Number(b.dataset.val)); break;
    case 'nudge': if (b.dataset.target) setAmount(b.dataset.target, (getAmount(b.dataset.target) || 0) + Number(b.dataset.delta)); break;
    // tarif
    case 'rc-new': { const r = newRecipe(`Tarif ${S.recipes.length + 1}`); S.recipes.push(r); S.activeRecipe = r.id; persistRecipes(); render(); break; }
    case 'rc-open': S.activeRecipe = b.dataset.id; render(); break;
    case 'rc-dup': { const src = activeRecipe(); const r = { ...JSON.parse(JSON.stringify(src)), id: Math.random().toString(36).slice(2, 10), name: src.name + ' (kopya)' }; S.recipes.push(r); S.activeRecipe = r.id; persistRecipes(); render(); break; }
    case 'rc-delete': {
      const rc = activeRecipe();
      if (!(await uiDialog(L("“{n}” silinsin mi?", { n: rc.name }), { ok: L("Sil"), cancel: L("Vazgeç") }))) break;
      S.recipes = S.recipes.filter((r) => r.id !== rc.id);
      if (!S.recipes.length) S.recipes.push(newRecipe('Yeni tarif'));
      S.activeRecipe = S.recipes[0].id; persistRecipes(); render(); break;
    }
    case 'rc-del-item': { const rc = activeRecipe(); rc.items = rc.items.filter((i) => i.id !== b.dataset.id); persistRecipes(); render(); break; }
    case 'rc-add': S.picker = { target: 'recipe', cat: null, q: '', sel: null, amount: S.settings.defaultAmount }; render(); break;
    case 'rc-basis': S.basis = b.dataset.b; render(); break;
    case 'rc-serv': { const rc = activeRecipe(); rc.servings = clamp((rc.servings || 1) + Number(b.dataset.d), 1, 50); persistRecipes(); render(); break; }
    case 'rc-cw': { const rc = activeRecipe(); const base = rc.cookedWeight || rc.items.reduce((acc, i) => acc + i.g, 0); rc.cookedWeight = clamp(Math.round(base + Number(b.dataset.d)), 1, 50000); persistRecipes(); render(); break; }
    case 'rc-cw-set': { const rc = activeRecipe(); rc.cookedWeight = rc.items.reduce((a, i) => a + i.g, 0); persistRecipes(); render(); break; }
    case 'rc-cw-clear': { const rc = activeRecipe(); rc.cookedWeight = null; persistRecipes(); render(); break; }
    // karşılaştır
    case 'cmp-add': S.picker = { target: 'compare', cat: null, q: '', sel: null, amount: S.settings.defaultAmount }; render(); break;
    case 'cmp-del': S.compare.splice(+b.dataset.i, 1); [...S.ingOpen].filter((k) => k.startsWith('cmp:')).forEach((k) => S.ingOpen.delete(k)); render(); break;
    case 'cmp-sec': S.cmpSection = b.dataset.s; render(); break;
    case 'cmp-same': S.compare.forEach((c) => (c.g = Number(b.dataset.g))); render(); break;
    // seçici
    case 'pk-close': S.picker = null; render(); break;
    case 'pk-cat': S.picker.cat = b.dataset.cat || null; S.picker.extGroup = null; render(); break;
    case 'pk-extgroup': S.picker.extGroup = S.picker.extGroup === b.dataset.g ? null : b.dataset.g; render(); break;
    case 'pk-pick': selectFood('pk', { t: 'c', id: b.dataset.id, f: 0 }); break;
    case 'pk-pick-ext': selectFood('pk', { t: 'x', n: b.dataset.ndb }); break;
    case 'pk-form': S.picker.sel = { ...S.picker.sel, f: +b.dataset.f }; render(); break;
    case 'pk-back': S.picker.sel = null; render(); break;
    case 'pk-confirm':
    case 'pk-confirm-more': {
      const P = S.picker;
      if (P.target === 'recipe') addToRecipe(P.sel, P.amount);
      else addToCompare(P.sel, P.amount);
      if (a === 'pk-confirm-more') { P.sel = null; } else S.picker = null;
      render(); break;
    }
    // ayarlar
    case 'theme-apply': setSetting('accent', 'auto'); setSetting('theme', 'custom'); render(); break;
    case 'theme-color-open': S.themeEditor = { key: b.dataset.key, color: S.settings.customTheme[b.dataset.key] }; render(); break;
    case 'theme-color-close': S.themeEditor = null; render(); break;
    case 'theme-color-preset': S.themeEditor.color = b.dataset.color; render(); break;
    case 'theme-color-save': {
      const input = $('#theme-color-hex');
      if (!validColor(input.value)) { input.setAttribute('aria-invalid', 'true'); input.reportValidity(); input.focus(); break; }
      if (S.themeEditor.key === 'accent' && S.settings.theme === 'custom') setSetting('accent', 'auto');
      setSetting('customTheme', { ...S.settings.customTheme, [S.themeEditor.key]: input.value });
      S.themeEditor = null; render(); break;
    }
    case 'theme-export': download('besin-matriksi-tema.json', exportTheme(S.settings.customTheme)); break;
    case 'target-add': {
      const key = $('#target-nutrient')?.value, value = Number($('#target-new-value')?.value);
      if (!key || !Number.isFinite(value) || value <= 0) { toast(L("Bir bileşen ve sıfırdan büyük hedef miktarı gir")); break; }
      setSetting('targets', { ...S.settings.targets, [key]: value }); render(); break;
    }
    case 'target-remove': { const targets = { ...S.settings.targets }; delete targets[b.dataset.key]; setSetting('targets', targets); render(); break; }
    case 'open-file': document.getElementById(b.dataset.id)?.click(); break;
    case 'profile-save': {
      const name = $('#profile-name')?.value.trim();
      if (!name) { toast(L("Bir profil adı gir")); break; }
      if (S.profiles.length >= 12) { toast('En fazla 12 profil kaydedilebilir'); break; }
      S.profiles.push({ id: uid(), name: name.slice(0, 40), settings: normalizeSettings(S.settings) });
      if (!saveProfiles(S.profiles)) toast(L("Profil cihaz depolamasına yazılamadı")); else toast(L("Görünüm kaydedildi")); render(); break;
    }
    case 'profile-apply': {
      const p = S.profiles.find(p => p.id === b.dataset.id);
      if (p) { S.settings = normalizeSettings(p.settings); saveSettings(S.settings); applySettings(); if (S.settings.showExt) loadExt().then(render); render(); toast(L("Görünüm: {n}", { n: p.name })); } break;
    }
    case 'profile-update': {
      const p = S.profiles.find(p => p.id === b.dataset.id);
      if (p && await uiDialog(L("“{n}” geçerli görünümle güncellensin mi?", { n: p.name }), { ok: L("Güncelle"), cancel: L("Vazgeç") })) { p.settings = normalizeSettings(S.settings); saveProfiles(S.profiles); toast(L("Profil güncellendi")); } break;
    }
    case 'profile-delete': {
      const p = S.profiles.find(p => p.id === b.dataset.id);
      if (p && await uiDialog(L("“{n}” görünüm profili silinsin mi?", { n: p.name }), { ok: L("Sil"), cancel: L("Vazgeç") })) { S.profiles = S.profiles.filter(x => x.id !== p.id); saveProfiles(S.profiles); render(); } break;
    }
    case 'section-move': S.settings = moveSection(S.settings, b.dataset.id, Number(b.dataset.d)); saveSettings(S.settings); render(); break;
    case 'unpin': setSetting('pinnedNutrients', S.settings.pinnedNutrients.filter(k => k !== b.dataset.key)); render(); break;
    case 'reset-group': S.settings = resetSettingGroup(S.settings, b.dataset.group); saveSettings(S.settings); applySettings(); render(); toast(L("Bölüm ayarları sıfırlandı")); break;
    case 'settings-export': download('besin-matriksi-ayarlar.json', exportSettings(S.settings)); break;
    case 'set': setSetting(b.dataset.k, JSON.parse(b.dataset.v)); render(); break;
    case 'font': setSetting('font', b.dataset.v); render(); break;
    case 'setstep': {
      const k = b.dataset.k, st = Number(b.dataset.d);
      const v = clamp(Math.round((S.settings[k] + st) * 1000) / 1000, Number(b.dataset.min), Number(b.dataset.max));
      setSetting(k, v); render(); break;
    }
    case 'preset': {
      if (b.dataset.p === 'reset') S.settings = { ...DEFAULT_SETTINGS };
      else Object.assign(S.settings, PRESETS_UI[b.dataset.p]);
      saveSettings(S.settings); applySettings(); render(); toast(L("Ön ayar uygulandı")); break;
    }
    case 'toggle-missing': setSetting('showMissing', true); refreshMatrix(); break;
    case 'exp-file': download(`besin-matriksi-yedek-${new Date().toISOString().slice(0, 10)}.json`, exportPayload(S.recipes, S.settings, customFoods(), S.profiles, S.collections)); toast(L("Yedek dosyası hazırlandı")); break;
    case 'open-releases': {
      // Masaüstü (Tauri): web görünümü dış bağlantı açmaz; resmî opener eklentisiyle sistem tarayıcısında aç.
      const tauri = window.__TAURI_INTERNALS__;
      if (tauri?.invoke) { e.preventDefault(); tauri.invoke('plugin:opener|open_url', { url: RELEASES_URL }).catch(() => toast(L("Bağlantı açılamadı; kopyalayıp tarayıcına yapıştır."))); }
      break;
    }
    case 'copy-releases':
      try { await navigator.clipboard.writeText(RELEASES_URL); toast(L("Bağlantı kopyalandı")); }
      catch { await uiDialog(L("Pano kullanılamadı. Bağlantıyı seçip kopyala:"), { input: RELEASES_URL, line: true, ok: L("Tamam") }); }
      break;
    case 'exp-copy':
      try { await navigator.clipboard.writeText(exportPayload(S.recipes, S.settings, customFoods(), S.profiles, S.collections)); toast(L("Panoya kopyalandı")); }
      catch { await uiDialog(L("Pano kullanılamadı. Metni seçip kopyala:"), { input: exportPayload(S.recipes, S.settings, customFoods(), S.profiles, S.collections), ok: L("Tamam") }); }
      break;
    case 'imp-paste': {
      const t = await uiDialog(L("Yedek metnini yapıştır:"), { input: '', ok: L("İçe aktar"), cancel: L("Vazgeç") });
      if (t) importText(t);
      break;
    }
  }
}

async function importText(t) {
  try {
    const { recipes, settings, custom, profiles, collections } = parseImport(t);
    S.recipes.push(...recipes);
    if (collections.length) { S.collections = normalizeCollections([...S.collections, ...collections]); persistCollections(); }
    if (profiles.length) { S.profiles = [...S.profiles, ...profiles].slice(0, 12); saveProfiles(S.profiles); }
    if (custom.length) {
      const have = new Set(customFoods().map((f) => f.id));
      const merged = [...customFoods(), ...custom.filter((f) => !have.has(f.id))];
      setCustomFoods(merged); saveCustom(merged);
    }
    if (S.recipes.some(r => r.items.some(it => it.ref.t === 'x'))) await loadExt();
    if (settings && (await uiDialog(L("Yedekteki ayarlar da uygulansın mı?"), { ok: L("Evet"), cancel: L("Hayır") }))) { S.settings = normalizeSettings(settings); saveSettings(S.settings); applySettings(); }
    persistRecipes();
    toast(L("{n} tarif içe aktarıldı", { n: recipes.length }));
    render();
  } catch (err) {
    uiDialog(L("İçe aktarılamadı:") + ' ' + err.message, { ok: L("Tamam") });
  }
}

function exportCSV() {
  let r, title;
  if (S.tab === 'tarif') { const rc = activeRecipe(); const x = recipeResult(rc); r = x.r; title = `${rc.name} – ${x.basisLabel}`; }
  else if (S.sel) { const item = resolve(S.sel); r = scaleItem(item, S.amount); title = `${item.name} – ${item.formLabel} – ${fmtNum(S.amount)} g`; }
  else return;
  const safe = title.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 60);
  download(`besin-matriksi-${safe}.csv`, matrixCSV(r, title, S.settings), 'text/csv;charset=utf-8');
  toast(L("CSV hazırlandı"));
}

// Porsiyon başı enerji: bilinen malzemelerden; eksik varsa alt sınır (≥), hiç yoksa gösterilmez (0 yazılmaz)
function servingKcal(r) {
  let sum = 0, known = 0;
  for (const it of r.items) { const item = resolve(it.ref); if (item?.v?.energy != null) { sum += (item.v.energy * it.g) / 100; known++; } }
  if (!known) return null;
  return { v: sum / (r.servings || 1), partial: known < r.items.length };
}
function applyRecipeFilter() {
  const q = norm(S.rcQ || '').trim(); let shown = 0;
  document.querySelectorAll('.rlist-item').forEach((el) => { const hit = !q || el.dataset.rname.includes(q); el.hidden = !hit; if (hit) shown++; });
  const none = document.getElementById('rc-none'); if (none) none.hidden = shown > 0 || !q;
}

// Ayarlar araması: kartları başlık ve içerik metnine göre süzer (yeniden çizmeden, odak kaybolmaz)
function applySettingsFilter() {
  const root = document.querySelector('.settings'); if (!root) return;
  const q = norm(S.settingsQ || '').trim();
  let shown = 0;
  for (const el of root.children) {
    if (el.classList.contains('settings-search')) continue;
    const hit = !q || norm(el.textContent || '').includes(q);
    el.hidden = !hit; if (hit) shown++;
  }
  const none = document.getElementById('settings-none'); if (none) none.hidden = shown > 0;
}

function onInput(e) {
  const t = e.target;
  if (t.id === 'rc-q') { S.rcQ = t.value; applyRecipeFilter(); return; }
  if (t.id === 'settings-q') { S.settingsQ = t.value; applySettingsFilter(); return; }
  if (t.dataset.personalField) { updatePersonalDraft(t); return; }
  if (t.dataset.settingRange || t.dataset.settingNumber) { updateNumericSetting(t); return; }
  if (S.themeEditor && ['theme-color-picker', 'theme-color-hex'].includes(t.id)) {
    const valid = validColor(t.value);
    t.setAttribute('aria-invalid', String(!valid));
    if (valid) {
      S.themeEditor.color = t.value;
      const other = $(t.id === 'theme-color-picker' ? '#theme-color-hex' : '#theme-color-picker');
      other.value = t.value; other.setAttribute('aria-invalid', 'false');
      const fresh = document.createElement('div'); fresh.innerHTML = renderThemeEditor(S.themeEditor, S.settings.customTheme);
      $('#theme-editor-preview').innerHTML = fresh.querySelector('#theme-editor-preview').innerHTML;
      $('#theme-editor-contrast').textContent = fresh.querySelector('#theme-editor-contrast').textContent;
    }
    return;
  }
  if (t.dataset.targetValue) {
    const targets = { ...S.settings.targets }, value = Number(t.value);
    if (t.value !== '' && Number.isFinite(value) && value > 0) targets[t.dataset.targetValue] = value;
    else delete targets[t.dataset.targetValue];
    setSetting('targets', targets); return;
  }
  if (t.dataset.price) {
    const it = activeRecipe().items.find(i => i.id === t.dataset.price);
    const x = t.value === '' ? null : Number(t.value);
    if (it) { it.pricePerKg = x != null && Number.isFinite(x) && x >= 0 ? x : null; persistRecipes(); refreshMatrix(); }
    return;
  }
  if (t.dataset.cu && S.customEdit) {
    const k = t.dataset.cu, x = t.value === '' ? null : Number(String(t.value).replace(',', '.'));
    if (k === 'salt') { if (x == null || Number.isNaN(x)) delete S.customEdit.v.na; else S.customEdit.v.na = (x / 2.5) * 1000; }
    else if (x == null || Number.isNaN(x)) delete S.customEdit.v[k]; else S.customEdit.v[k] = x;
    return;
  }
  if (t.id === 'cu-name' && S.customEdit) { S.customEdit.name = t.value; return; }
  if (t.id === 'cu-portion' && S.customEdit) { S.customEdit.portion = t.value === '' ? null : Number(t.value); return; }
  if (t.dataset.slider) { setAmount(t.dataset.slider, Number(t.value), { fromSlider: true }); return; }
  if (t.id === 'q') { S.q = t.value; $('#foodlist').innerHTML = foodList('ex', S.cat, S.q, S.extGroup); return; }
  if (t.id === 'pq') { S.picker.q = t.value; $('.pk-list').innerHTML = foodList('pk', S.picker.cat, S.picker.q, S.picker.extGroup); return; }
  if (t.id === 'rc-name') { activeRecipe().name = t.value.slice(0, 80) || L("Adsız tarif"); persistRecipes(); return; }
}
function onChange(e) {
  const t = e.target;
  if (t.dataset.personalField) { updatePersonalDraft(t); return; }
  if (t.dataset.settingNumber) { if (!t.checkValidity()) toast(tr('settingInvalid')); return; }
  if (t.id === 'personal-day') { if (validDay(t.value)) { S.personalDay = t.value; render(); } else { toast(tr('dateInvalid')); t.value = S.personalDay; } return; }
  if (t.id === 'personal-source-key' && NUTRIENTS.some(n => n.key === t.value)) {
    S.personalSource = t.value; const data = dayResult(S.personal, S.personalDay, resolve, S.consumedOnly);
    $('#personal-sources-content').innerHTML = renderDaySources(data.entries, resolve, t.value); return;
  }
  if (t.id === 'personal-file' && t.files?.[0]) { importPersonalFile(t.files[0]); return; }
  if (['efsaAge', 'efsaSex', 'efsaPhytate', 'efsaIronGroup'].includes(t.dataset.efsa)) {
    setSetting(t.dataset.efsa, t.dataset.efsa === 'efsaAge' ? Number(t.value) : t.value); render(); return;
  }
  if (t.id === 'recipe-source-nutrient') {
    S.recipeSource = t.value;
    $('#recipe-source-rows').innerHTML = renderRecipeSourceRows(activeRecipe(), resolve, S.recipeSource, recipeResult(activeRecipe()).factor, S.settings.precision);
    return;
  }
  if (t.dataset.shortcut) {
    if (t.value && Object.entries(S.settings.shortcuts).some(([id, key]) => id !== t.dataset.shortcut && key === t.value)) { toast(L("Bu kısayol başka bölüme atanmış; önce onu kapat")); render(); return; }
    setSetting('shortcuts', { ...S.settings.shortcuts, [t.dataset.shortcut]: t.value }); return;
  }
  if (t.dataset.themeColor) { setSetting('customTheme', { ...S.settings.customTheme, [t.dataset.themeColor]: t.value }); render(); return; }
  if (t.id === 'theme-file' && t.files?.[0]) {
    t.files[0].text().then(text => { setSetting('customTheme', parseTheme(text)); setSetting('accent', 'auto'); setSetting('theme', 'custom'); render(); toast(tr('themeImportDone')); }).catch(() => uiDialog(tr('themeImportError'), { ok: tr('ok') })); return;
  }
  if (t.dataset.sectionVisible) { setSetting('hiddenSections', t.checked ? S.settings.hiddenSections.filter(id => id !== t.dataset.sectionVisible) : [...S.settings.hiddenSections, t.dataset.sectionVisible]); render(); return; }
  if (t.id === 'pin-nutrient' && t.value) { setSetting('pinnedNutrients', [...S.settings.pinnedNutrients, t.value]); render(); return; }
  if (t.dataset.setbool) { setSetting(t.dataset.setbool, t.checked); render(); return; }
  if (t.id === 'settings-file' && t.files?.[0]) {
    t.files[0].text().then((text) => {
      S.settings = parseSettings(text); saveSettings(S.settings); applySettings();
      if (S.settings.showExt || S.recipes.some(r => r.items.some(it => it.ref.t === 'x'))) loadExt().then(render);
      render(); toast(L("Ayarlar içe aktarıldı"));
    }).catch((err) => uiDialog(L("Ayarlar içe aktarılamadı:") + ' ' + err.message));
    return;
  }
  if (t.id === 'imp-file' && t.files?.[0]) { t.files[0].text().then(importText); return; }
  if (t.id === 'rc-name') render();
}

export function start() {
  printController = createPrintController(document, window);
  applySettings();
  if (S.settings.showExt || S.recipes.some(r => r.items.some(it => it.ref.t === 'x'))) loadExt().then(render);
  if (S.personal.entries.some(e => e.ref.t === 'x')) loadExt().then(render);
  window.addEventListener('resize', () => { document.documentElement.dataset.uiNarrow = String(window.innerWidth / (S.settings.uiScale / 100) < 900); });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (S.settings.theme === 'system') applySettings(); });
  mountAion();
  configureAion(S.settings);
  render();
  // İlk açılış selamı; depolama yoksa (gizli pencere, about:blank) sessizce atla
  let greeted = true;
  try { greeted = !!localStorage.getItem('bm.aion.greeted'); if (!greeted) localStorage.setItem('bm.aion.greeted', '1'); } catch {}
  if (S.settings.aionTips && !greeted) setTimeout(() => aionSay(tr('aionHello'), 7000, { ifIdle: true }), 600);
  else if (S.settings.aionTips) {
    // Günde bir kez, saate göre selam
    const today = new Date().toDateString();
    let last = null; try { last = localStorage.getItem('bm.aion.greetDay'); localStorage.setItem('bm.aion.greetDay', today); } catch {}
    if (last !== today) setTimeout(() => aionSay(greetingFor(new Date().getHours()), 6000, { ifIdle: true }), 600);
  }
  document.addEventListener('click', onClick);
  document.addEventListener('input', onInput);
  document.addEventListener('change', onChange);
  // Bölümlerin açık/kapalı durumunu hatırla
  document.addEventListener('toggle', (e) => {
    const d = e.target;
    if (d.isConnected && d.matches?.('details.recipe-sources')) S.recipeSourcesOpen = d.open;
    if (d.isConnected && d.matches?.('details.efsa-table')) S.efsaTableOpen = d.open;
    if (d.isConnected && d.matches?.('details.personal-sources')) {
      S.personalSourceOpen = d.open;
      if (d.open && !S.personal.milestones.source) {
        S.personal.milestones.source = true; persistPersonal();
        const done = Object.values(S.personal.milestones).filter(Boolean).length, progress = $('.exploration-progress progress');
        if (progress) { progress.value = done; progress.setAttribute('aria-label', tr('progressCount', { done })); $('.exploration-progress p').textContent = tr('progressCount', { done }); }
      }
    }
    if (!printController.active && d.matches?.('details.sec')) { if (d.open) S.closed.delete(d.dataset.sec); else S.closed.add(d.dataset.sec); }
  }, true);
  document.addEventListener('keydown', (e) => {
    if (!document.querySelector('.modal') && !e.target.closest('input, textarea, select, [contenteditable="true"]') && e.altKey && !e.ctrlKey && !e.metaKey) {
      const target = Object.keys(SHORTCUT_ACTIONS).find(id => S.settings.shortcuts[id] === `Alt+${e.key}`);
      if (target) { e.preventDefault(); S.tab = target; render(); window.scrollTo(0, 0); document.querySelector(`[data-tab="${target}"]`)?.focus(); return; }
    }
    trapModalTab(e); if (!e.defaultPrevented && e.key === 'Escape' && (S.picker || S.customEdit || S.themeEditor || S.colPicker)) { if (S.themeEditor) S.themeEditor = null; else if (S.customEdit) S.customEdit = null; else if (S.colPicker) S.colPicker = false; else S.picker = null; render(); } });
  // Modal arka planına tıklayınca kapat
  document.addEventListener('mousedown', (e) => { if (e.target.classList?.contains('modal') && !e.target.classList.contains('dlg') && !S.customEdit) { S.picker = null; S.colPicker = false; render(); } });
  const ruler = $('#ruler');
  document.addEventListener('pointermove', (e) => { if (S.settings.ruler && ruler) ruler.style.transform = `translateY(${e.clientY - 22}px)`; }, { passive: true });
}

import NOTICES from './data/notices.json'; // B209 değerlendirmesi: tembel yükleme ilk açılıştan hemen sonra çevrimdışı kalınca Bilgi sayfasını kırıyordu; gömülü kalır
import { catalogGroup, categoryContains, catalogSections, DRINK_GROUPS } from './catalog-tree.js';
import { DIET_KEYS, dietActive } from './diet.js';
import { renderDietFilter } from './diet-view.js';
import { setDietSettings, eligibleFood, eligibleRef, setNicheVisible, extAnimalGroup, setAnimalVisible, visibleFoods, ANIMAL_CATS, foodName, categoryName, formName, CATEGORIES, NAV_CATEGORIES, FOODS, META, resolve, refKey, search, loadExt, extLoaded, isLite, extGroups, extMeta, extFoods, setCustomFoods, customFoods } from './data.js';
import { NUTRIENTS, NUTRIENT_BY_KEY, SECTIONS, SOURCES } from './nutrients.js';
import { scaleItem, aggregate, scaleAggregate, assessAmino } from './calc.js';
import { combineRecipes } from './recipe-total.js';
import { renderRecipeTotal } from './recipe-total-view.js';
import { renderMatrix, basicCard, BASIC_KEYS, macroPie } from './matrix.js';
import { createPrintController } from './print.js';
import { FONTS, fontStack, ensureFont, headingFont, ensureHeadingFont } from './fonts.js';
import { loadSettings, saveSettings, DEFAULT_SETTINGS, THEMES, ACCENTS, loadRecipes, saveRecipes, newRecipe, exportPayload, parseImport, mergeImport, saveImportState, loadCustom, saveCustom, loadSearches, saveSearches, loadProfiles, saveProfiles, loadCollections, loadRecent, saveRecent, pushRecent } from './store.js';
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
import { energyEstimate, loadPersonal, savePersonal, mergePersonalFoods, localDay, validDay, dayResult, PERSONAL_KEY } from './personal.js';
import { renderPersonal, renderEnergy, renderDaySources } from './personal-view.js';
import { nutrientLabel } from './i18n-nutrients.js';
import { getLanguage } from './i18n.js';
import { SLIDER_STEPS, sliderToGrams, gramsToSlider, MAX_GRAMS, kgLabel } from './amount-scale.js';
import { normalizeCollections, collectionTree, collectionRefs, hasRef, transferRef, MAX_ITEMS } from './collections.js';
import { mountAion, configureAion, aionMood, aionPlay, aionSay } from './aion.js';
import { greetingFor, newlyReached, celebrationText } from './aion-moments.js';
import { dailyRefs } from './daily-ref.js';
import { recipeGaps } from './gaps.js';
import { similarFoods } from './similar.js';
import { FOOD_ICONS } from './food-icons.js';
import { foodArt } from './food-art.js';
import { morphHtml } from './morph.js';
import { routeOf, parseRoute } from './route.js';
import { withSettingsToc } from './settings-toc.js';
import { compareChart, compareAminoChart } from './compare-chart.js';
import { brandMark, plateIllustration } from './kitchen-art.js';
import { referenceFor, normalizeSettings, resetSettingGroup, exportSettings, parseSettings, MATRIX_SECTIONS, moveSection, SHORTCUT_ACTIONS, shortcutKey, migrateFontV2, migrateAionOff, applyProfileSettings } from './settings.js';
import { S } from './state.js';
import { catIcon, foodIcon, persona, isPhone } from './views/common.js';
import { PRESETS, MAX_G, amountControls, perServing, miniAmount } from './views/amount.js';
import { compareResults, renderCompare } from './views/compare.js';
import { setRenderer, toast, requestExtCatalog, catalogPending, activeRecipe, recipeItemCount, persistRecipes, servingKcal } from './views/ui.js';
import { renderSettings, renderAbout, RELEASES_URL } from './views/settings.js';
import { catName, foodCategoryPath, foodButton, quickFacts, SORTS, sortFoods, sortBar, extButton, categoryNav, refButton, collectionList, customButton, knownFood, recentRow, LIST_CHUNK, listLimit, moreButton, foodList, fullCatalogSearch, formChips, similarRow, renderExplore, welcome, visibleCurated, catalogHeading, matrixForExplore } from './views/explore.js';
import { recipeResult, recipeTotalModel, selectedRecipeResult, renderRecipe, renderRecipeSummary, renderRecipeGaps } from './views/recipe.js';
import { DAY_ACTIONS, bindDayActions } from './actions/day.js';
import { PICK_ACTIONS, bindPickActions } from './actions/pick.js';
import { RECIPE_ACTIONS, bindRecipeActions } from './actions/recipe.js';
import { COLLECTION_ACTIONS, bindCollectionActions, persistCollections } from './actions/collections.js';
// B215: en son içe aktarılır; durum, diğer modüller değerlendirildikten sonra kurulur (eski sıra)


let lastSavedPersonal = structuredClone(S.personal); // B215: durum src/state.js'te

const $ = (sel, el = document) => el.querySelector(sel);
const app = () => $('#app');
let modalOpener = null;
let printController;

// ---------------------------------------------------------------- ayarlar
function applySettings() {
  setDietSettings(S.settings);
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
  r.style.setProperty('--heading-font', headingFont(s.font));
  if (s.accent && s.accent !== 'auto') r.style.setProperty('--ac', s.accent);
  else r.style.removeProperty('--ac');
  const accent = s.accent === 'auto' ? (s.theme === 'custom' ? s.customTheme.accent : THEMES.find(t => t.id === effectiveTheme)?.ac) : s.accent;
  if (accent) r.style.setProperty('--ac-fg', accentText(accent));
  ensureFont(s.font); ensureHeadingFont(s.font);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = getComputedStyle(r).getPropertyValue('--bg').trim() || '#ffffff';
  $('#ruler')?.classList.toggle('on', !!s.ruler);
  configureAion(s);
}
function setSetting(k, v) {
  S.settings = normalizeSettings({ ...S.settings, [k]: v });
  if (!saveSettings(S.settings)) toast(tr('storageError'));
  applySettings();
  if (k === 'showExt' && v) requestExtCatalog();
}

function updateDiet(patch) {
  const next = normalizeSettings({...S.settings,...patch});
  if (!saveSettings(next)) { toast(tr('storageError')); render(); return; }
  S.settings = next; setDietSettings(next);
  S.extPage = 0; if(S.picker)S.picker.extPage=0;
  S.picked = S.picked.filter(id=>eligibleFood(FOODS.find(f=>f.id===id)));
  render();
}

// ---------------------------------------------------------------- yardımcı bileşenler



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
      : `${renderDietFilter(S.settings,'pk',S.dietOpen.pk)}<nav class="cats cats-grid">${categoryNav('pk', P.cat)}</nav>
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
  if (!saveCustom(list)) { toast(L("Kaydedilemedi: cihaz depolaması kullanılamıyor")); return false; }
  setCustomFoods(list);
  S.customEdit = null;
  S.cat = 'custom';
  S.sel = { t: 'u', id: rec.id };
  return true;
}

// ---------------------------------------------------------------- render
const TAB_SHORT = { kesfet: () => L("Keşfet"), tarif: () => L("Tarif"), gunluk: () => L("Günlük"), karsilastir: () => L("Kıyasla"), hakkinda: () => L("Bilgi"), ayarlar: () => L("Ayarlar") };
const TABS = [['kesfet', '🔎'], ['tarif', '🥣'], ['gunluk', '📒'], ['karsilastir', '⚖️'], ['hakkinda', 'ℹ️'], ['ayarlar', '🎨']];

// B233: açık/kapalı durumu kaydedilen <details> bölümleri. "toggle" olayı ayrı bir görev olarak sonradan gelir;
// EFSA tablosunda açılıştan hemen sonra ayar değişince (yeniden çizim) durum kayboluyordu: render() onu çizmeden önce DOM'dan okur.
// Yalnız tekil bölüm: recipe-sources sayfada birden çok kez bulunabilir, DOM'dan toplu okumak birinin durumunu ötekine yazar.
const REMEMBERED_DETAILS = 'details.efsa-table';
function rememberDetails(d) {
  if (!d.isConnected) return;
  if (d.matches?.('details.recipe-sources')) S.recipeSourcesOpen = d.open;
  if (d.matches?.('details.efsa-table')) S.efsaTableOpen = d.open;
  if (d.matches?.('details.cmp-amino')) S.cmpAminoOpen = d.open;
  if (d.matches?.('details.personal-section')) { S.daySecOpen ||= {}; S.daySecOpen[d.dataset.psec] = d.open; }
}

export function render() {
  if (S.personalDayAuto && S.personalDay !== localDay()) S.personalDay = localDay();
  document.querySelectorAll('[data-diet-details]').forEach(el=>S.dietOpen[el.dataset.dietDetails]=el.open);
  document.querySelectorAll(REMEMBERED_DETAILS).forEach(rememberDetails);
  const keep = {};
  document.querySelectorAll('[data-keep-scroll]').forEach((el) => (keep[el.dataset.keepScroll] = {top:el.scrollTop,left:el.scrollLeft}));
  const winY = window.scrollY;
  const focusedId = document.activeElement?.id;
  const focusedSelector = focusSelector(document.activeElement);
  const wasModal = !!document.querySelector('.modal');
  const selStart = document.activeElement?.selectionStart;
  let view = '';
  if (S.tab === 'kesfet') view = renderExplore();
  else if (S.tab === 'gunluk') view = renderPersonal(S.personal, S.personalDraft, S.personalDay, S.consumedOnly, S.settings, resolve, S.personalSource, S.personalSourceOpen, S.personalUndo, S.personalReadError, isPhone() ? (S.dayMicroOpen ?? false) : !S.closed.has('micro'), S.daySecOpen, isPhone(), S.weekKey, S.hist || {});
  else if (S.tab === 'tarif') view = renderRecipe();
  else if (S.tab === 'karsilastir') view = renderCompare();
  else if (S.tab === 'ayarlar') view = renderSettings();
  else view = renderAbout();
  app().innerHTML = `
    <header class="top">
      <button type="button" class="brand" data-action="ex-home" aria-label="${L("Besin Matriksi: Keşfet'e dön")}">${S.settings.emoji ? `<span class="logo">${brandMark}</span>` : ''}<b>Besin Matriksi</b></button>
      <nav class="tabs" aria-label="${tr('navigation')}">${TABS.map(([id, ic]) => `<button class="tab ${S.tab === id ? 'on' : ''}" data-action="tab" data-tab="${id}" ${S.tab === id ? 'aria-current="page"' : ''}><span class="ti" aria-hidden="true">${S.settings.emoji ? ic : ''}</span><span class="tt">${tr(id)}</span><span class="tt-short">${TAB_SHORT[id]()}</span>${id === 'tarif' && recipeItemCount() ? `<span class="badge">${recipeItemCount()}</span>` : ''}${id === 'karsilastir' && S.compare.length ? `<span class="badge">${S.compare.length}</span>` : ''}</button>`).join('')}</nav>
    </header>
    ${S.profiles.length ? `<div class="profile-bar" role="group" aria-label="${L("Görünüm profilleri")}"><span class="hint">${L("Görünüm:")}</span>${S.profiles.map(p => `<button class="pchip" data-action="profile-apply" data-id="${p.id}">${esc(p.name)}</button>`).join('')}</div>` : ''}
    <main class="view view-${S.tab}">${view}</main>
    ${renderPicker()}${renderColPicker()}${renderCustomEditor()}${renderThemeEditor(S.themeEditor, S.settings.customTheme)}`;
  aionMood(aionMoodFor());
  celebrateGoals();
  if (S.tab === 'ayarlar') applySettingsFilter();
  if (S.tab === 'tarif') applyRecipeFilter();
  document.querySelectorAll('.list, .detail, .pk-list, .cats').forEach((el, i) => (el.dataset.keepScroll = el.className.split(' ')[0] + i));
  document.querySelectorAll('[data-keep-scroll]').forEach((el) => { if (keep[el.dataset.keepScroll] != null) el.scrollTop = keep[el.dataset.keepScroll].top; el.scrollLeft = keep[el.dataset.keepScroll]?.left || 0; });
  window.scrollTo(0, winY);
  syncModalFocus(!document.querySelector('.modal') && wasModal ? modalOpener : focusedSelector);
  if (focusedId) {
    const el = document.getElementById(focusedId);
    if (el) { el.focus(); if (selStart != null && el.setSelectionRange) try { el.setSelectionRange(selStart, selStart); } catch {} }
  }
  syncRoute();
  // B207: şeritte seçili kategori görünür kalsın (yalnız şeridi kaydırır, sayfayı değil)
  const strip = document.querySelector('.explore > .cats[data-strip="true"]'), onCat = strip?.querySelector('.cat.on');
  if (onCat) { const a = strip.getBoundingClientRect(), b = onCat.getBoundingClientRect(); if (b.right > a.right - 48) strip.scrollLeft += b.left - a.left - 48; }
  // B198: "daha göster" düğmesi görünür alana yaklaşınca kendiliğinden yükle (düğme klavye/ekran okuyucu için de kalır)
  if ('IntersectionObserver' in window) document.querySelectorAll('.list-more').forEach((btn) => {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); btn.click(); } }, { rootMargin: '600px 0px' });
    io.observe(btn);
  });
}


// B206: hızlı klavye: "/" aramaya, ↑/↓ sonuçlarda gezin, Esc aramayı temizler ya da besin detayını kapatır (Enter = düğmeyi aç)
function quickKeys(e) {
  if (document.querySelector('.modal') || e.altKey || e.ctrlKey || e.metaKey || e.defaultPrevented) return false;
  const t = e.target, typing = !!t.closest?.('input, textarea, select, [contenteditable="true"]');
  if (e.key === '/' && !typing) {
    e.preventDefault();
    if (S.tab !== 'kesfet') { S.tab = 'kesfet'; render(); }
    $('#q')?.focus(); $('#q')?.select(); return true;
  }
  if (S.tab !== 'kesfet') return false;
  const cards = () => [...document.querySelectorAll('#foodlist button.food')].filter((b) => b.offsetParent);
  if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && (t.id === 'q' || t.matches?.('#foodlist button.food'))) {
    const list = cards(); if (!list.length) return false;
    const i = list.indexOf(t);
    const next = t.id === 'q' ? (e.key === 'ArrowDown' ? list[0] : null) : e.key === 'ArrowDown' ? list[Math.min(list.length - 1, i + 1)] : i <= 0 ? $('#q') : list[i - 1];
    if (!next) return false;
    e.preventDefault(); next.focus(); next.scrollIntoView?.({ block: 'nearest' }); return true;
  }
  if (e.key === 'Escape') {
    if (t.id === 'q' && t.value) { e.preventDefault(); t.value = ''; t.dispatchEvent(new Event('input', { bubbles: true })); return true; }
    if (S.sel && !typing) { e.preventDefault(); const id = S.sel.id; S.sel = null; render(); (document.querySelector(`#foodlist [data-id="${CSS.escape(id || '')}"]`) || $('#q'))?.focus(); return true; }
  }
  return false;
}

// B205: adres çubuğu durumu izler (Geri/İleri, paylaşılabilir besin bağlantısı)
let routeReady = false;
function applyRoute(hash) {
  const r = parseRoute(hash, (id, f) => !!FOODS.find((x) => x.id === id)?.forms[f]);
  S.tab = r.tab;
  if (r.tab === 'kesfet') {
    const same = r.sel && S.sel && refKey(r.sel) === refKey(S.sel);
    S.sel = r.sel;
    if (r.sel && !same) S.amount = S.settings.defaultAmount;
    if (r.sel?.t === 'x') requestExtCatalog();
  }
}
function syncRoute() {
  const want = routeOf(S.tab, S.sel?.t === 'u' ? null : S.sel);
  const cur = location.hash || '#/';
  if (want !== cur) try { history[routeReady ? 'pushState' : 'replaceState'](null, '', want); } catch {}
  routeReady = true;
}
function refreshMatrix() {
  const m = $('#matrix');
  if (!m) return render();
  if (S.tab === 'kesfet' && S.sel) morphHtml(m, matrixForExplore(resolve(S.sel)));
  else if (S.tab === 'tarif') {
    if (S.recipeDaily) return render();
    const rc = activeRecipe();
    const { r, basisLabel, factor } = recipeResult(rc);
    morphHtml(m, renderMatrix(r, S.settings, { recipe: rc, basisLabel, closed: S.closed, aminoProfile: S.personal.profile }));
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
// Kaydırıcı her adımda localStorage'a yazmasın ve matrisi kare başına en çok bir kez yenilesin
let rafId = 0, saveT = 0;
function scheduleRefresh() { if (!rafId) rafId = requestAnimationFrame(() => { rafId = 0; refreshMatrix(); }); }
function scheduleSave() { clearTimeout(saveT); saveT = setTimeout(() => { saveT = 0; persistRecipes(); }, 300); }
function flushSave() { if (saveT) { clearTimeout(saveT); saveT = 0; persistRecipes(); } }
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
  else if (target.startsWith('rc:')) { const it = activeRecipe().items.find((i) => i.id === target.slice(3)); if (it) it.g = g; scheduleSave(); }
  else if (target.startsWith('cmp:')) { const c = S.compare[+target.slice(4)]; if (c) c.g = g; }
  // Yerinde güncelle (kaydırıcı sürüklenirken odak kaybolmasın)
  const box = document.querySelector(`[data-amount="${CSS.escape(target)}"]`);
  if (box) {
    const out = box.querySelector('.amt-val b');
    if (out) out.textContent = fmtNum(S.settings.amountUnit === 'oz' ? g / 28.349523125 : g);
    if (S.settings.amountUnit === 'oz') box.querySelector('.amount-unit').textContent = `oz (≈ ${fmtNum(g)} g)`;
    const sl = box.querySelector('.slider');
    if (sl && !fromSlider) sl.value = String(gramsToSlider(g, MAX_G));
    if (sl) { sl.style.setProperty('--fill', gramsToSlider(g, MAX_G) / SLIDER_STEPS * 100 + '%'); sl.setAttribute('aria-valuetext', fmtNum(g) + ' g'); }
    box.querySelectorAll('.pchip').forEach((b) => b.classList.toggle('on', Math.abs(Number(b.dataset.val) - g) < 0.01));
    const ps = box.querySelector('.per-serv') || box.parentElement?.querySelector('.per-serv');
    if (ps) ps.textContent = L("porsiyon başı {g} g", { g: fmtNum(g / Number(ps.dataset.perserv)) });
  }
  if (target === 'pk') {
    const item = resolve(S.picker.sel);
    const pv = $('.pk-prev');
    if (pv && item) pv.textContent = [item.v.energy != null ? `${fmtNum((item.v.energy * g) / 100)} kcal` : null, item.v.protein != null ? `${fmtNum((item.v.protein * g) / 100)} g protein` : null, item.v.fiber != null ? `${fmtNum((item.v.fiber * g) / 100)} g ${L("lif")}` : null].filter(Boolean).join(' · ');
  } else if (target.startsWith('cmp:')) {
    // Sürüklenen kaydırıcı DOM'dan silinmesin: yalnız pasta + tablo bölümü yenilenir
    const t = $('#cmp-table');
    if (t) { const tmp = document.createElement('div'); tmp.innerHTML = renderCompare(); t.replaceWith(tmp.querySelector('#cmp-table')); } else render();
  } else scheduleRefresh();
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
  S.recipeDaily = false;
  const rc = activeRecipe();
  const previous = quiet ? null : structuredClone(rc.items);
  const existing = rc.items.find((i) => refKey(i.ref) === refKey(ref));
  const capped = !!existing && existing.g + g > MAX_G; // B164: sınır sessizce kırpılmaz
  if (existing) existing.g = clamp(existing.g + g, 1, MAX_G);
  else rc.items.push({ id: Math.random().toString(36).slice(2, 9), ref: { ...ref }, g });
  if (quiet) return true;
  if (!persistRecipes()) { rc.items = previous; return false; }
  toast(capped ? L("“{n}” zaten tarifte; toplam en fazla {m} g olabilir, {m} g'da kaldı.", { n: resolve(ref).name, m: fmtNum(MAX_G) }) : `“${resolve(ref).name}” → ${rc.name} (${fmtNum(g)} g)`);
  aionPlay('celebrate');
  return true;
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
  if (S.personalReadError || !savePersonal(S.personal)) { S.personal = structuredClone(lastSavedPersonal); toast(tr(S.personalReadError ? 'corruptPersonal' : 'storageError')); return false; }
  lastSavedPersonal = structuredClone(S.personal);
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
    if (!savePersonal(merged)) throw Error('storage');
    setCustomFoods(list); S.personal = merged; S.personalDraft = structuredClone(merged.profile); S.personalReadError = false;
    lastSavedPersonal = structuredClone(merged);
    if (merged.entries.some(e => e.ref.t === 'x')) requestExtCatalog();
    render(); toast(tr('importDone'));
  } catch { await uiDialog(tr('personal.importError'), { ok: tr('ok') }); }
}
async function onClick(e) {
  const b = e.target.closest('[data-action]');
  if (!b) return;
  const a = b.dataset.action;
  if (!document.querySelector('.modal')) modalOpener = focusSelector(b);
  if (Object.hasOwn(PICK_ACTIONS, a)) return PICK_ACTIONS[a](b); // B236: src/actions/pick.js
  if (Object.hasOwn(RECIPE_ACTIONS, a)) return RECIPE_ACTIONS[a](b); // B235: src/actions/recipe.js
  if (Object.hasOwn(COLLECTION_ACTIONS, a)) return COLLECTION_ACTIONS[a](b); // B232: src/actions/collections.js
  if (Object.hasOwn(DAY_ACTIONS, a)) return DAY_ACTIONS[a](b); // B230: Günlük + Geçmiş eylemleri src/actions/day.js
  switch (a) {
    case 'settings-jump': { const el = document.getElementById(b.dataset.id); if (el) { el.scrollIntoView({ block: 'start' }); el.querySelector('h2')?.focus({ preventScroll: true }); } break; }
    case 'aion-demo': aionPlay(b.dataset.anim || 'celebrate'); aionSay(tr('aionHello'), 4000); break;
    case 'setting-reset': if (Object.hasOwn(DEFAULT_SETTINGS, b.dataset.key)) { setSetting(b.dataset.key, DEFAULT_SETTINGS[b.dataset.key]); render(); } break;
    case 'tab':
      // B177: etkin Keşfet sekmesine yeniden dokunmak (telefonda besin ayrıntısındayken) listeye döner; kategori ve arama korunur
      if (S.tab === 'kesfet' && b.dataset.tab === 'kesfet' && S.sel) S.sel = null;
      S.tab = b.dataset.tab; render(); window.scrollTo(0, 0); break;
    // keşfet
    case 'ex-home': S.tab = 'kesfet'; S.sel = null; S.cat = null; S.q = ''; S.extGroup = null; S.extPage = 0; render(); window.scrollTo(0, 0); break;
    case 'diet-reset': updateDiet(Object.fromEntries(DIET_KEYS.map(k=>[k,DEFAULT_SETTINGS[k]]))); break;
    case 'ex-cat': S.sel = null; S.cat = b.dataset.cat || null; S.extGroup = null; S.extPage = 0; render(); $('.list') && ($('.list').scrollTop = 0); break;
    case 'ext-reload': location.reload(); break;
    case 'ex-full-search': S.sel = null; S.cat = 'ext'; S.extGroup = null; S.extPage = 0; render(); break;
    case 'ex-extpage': S.extPage = Math.max(0, Number(b.dataset.page) || 0); render(); $('#foodlist .catalog-heading h2')?.focus(); $('#foodlist .catalog-heading')?.scrollIntoView({ block: 'start' }); break;
    case 'ex-extgroup': S.extGroup = S.extGroup === b.dataset.g ? null : b.dataset.g; render(); break;
    case 'ex-pick': selectFood('ex', { t: 'c', id: b.dataset.id, f: 0 }); break;
    case 'gap-open': S.tab = 'kesfet'; selectFood('ex', { t: 'c', id: b.dataset.id, f: 0 }); break;
    case 'ex-pick-ext': selectFood('ex', { t: 'x', n: b.dataset.ndb }); break;
    case 'ex-pick-custom': selectFood('ex', { t: 'u', id: b.dataset.cid }); break;
    case 'ex-pick-ref': selectFood('ex', JSON.parse(b.dataset.ref)); break;
    case 'sort': S.sort = b.dataset.s; render(); break;
    case 'rc-sort': S.rcSort = b.dataset.s; render(); break;
    case 'recent-clear': S.recent = []; saveRecent([]); render(); break;
    case 'ing-open': { const id = b.dataset.id; if (S.ingOpen.has(id)) S.ingOpen.delete(id); else S.ingOpen.add(id); render(); document.querySelector(`[data-action="ing-open"][data-id="${CSS.escape(id)}"]`)?.focus(); break; }
    case 'multi-toggle': S.multi = !S.multi; S.picked = []; render(); break;
    case 'multi-pick': { const id = b.dataset.id; S.picked = S.picked.includes(id) ? S.picked.filter((x) => x !== id) : [...S.picked, id]; render(); break; }
    case 'multi-add': {
      const n = S.picked.length; if (!n) break;
      const rc = activeRecipe(), previous = structuredClone(rc.items);
      for (const id of S.picked) addToRecipe({ t: 'c', id, f: 0 }, 100, true);
      if (!persistRecipes()) { rc.items = previous; render(); break; }
      toast(L("{n} besin → {r} (her biri 100 g)", { n, r: activeRecipe().name })); aionPlay('celebrate');
      S.multi = false; S.picked = []; render(); break;
    }
    case 'cu-new': S.customEdit = { name: b.dataset.name || '', liquid: false, portion: null, v: {} }; render(); break;
    case 'cu-edit': { const f = customFoods().find((x) => x.id === S.sel?.id); if (f) { S.customEdit = JSON.parse(JSON.stringify(f)); render(); } break; }
    case 'cu-close': S.customEdit = null; render(); break;
    case 'cu-liquid': S.customEdit.liquid = b.dataset.v === '1'; render(); break;
    case 'cu-save': if (saveCustomEdit()) { S.tab = 'kesfet'; render(); toast(L("Kaydedildi")); } break;
    case 'cu-delete': {
      const E = S.customEdit;
      if (!(await uiDialog(L("“{n}” silinsin mi? Tariflerdeki kullanımları “bulunamadı” olarak kalır.", { n: E.name }), { ok: L("Sil"), cancel: L("Vazgeç") }))) break;
      const list = customFoods().filter((x) => x.id !== E.id);
      if (!saveCustom(list)) { toast(L("Kaydedilemedi: cihaz depolaması kullanılamıyor")); break; }
      setCustomFoods(list); S.customEdit = null; if (S.sel?.t === 'u') S.sel = null; render(); break;
    }
    case 'csv': exportCSV(); break;
    case 'print': try { printController.print(); } catch { toast(L("Yazdırma bu ortamda kullanılamıyor; CSV olarak indirebilirsin")); } break;
    case 'ex-form': S.sel = { ...S.sel, f: +b.dataset.f }; render(); break;
    case 'ex-back': S.sel = null; render(); break;
    case 'cats-toggle': S.catsOpen = !S.catsOpen; render(); $('.cats-toggle')?.focus(); break;
    case 'copy-link': { const url = location.href; (navigator.clipboard?.writeText(url) || Promise.reject()).then(() => toast(L("Bağlantı kopyalandı"))).catch(() => uiDialog(L("Bağlantıyı kopyala:"), { input: url, line: true })); break; }
    case 'search-recent': S.q = b.dataset.q; S.cat = null; render(); break;
    case 'search-clear': S.searches = []; saveSearches([]); render(); break;
    case 'ex-clear': S.q = ''; render(); break;
    case 'ex-add-recipe': addToRecipe(S.sel, S.amount); render(); break;
    case 'ex-add-compare': addToCompare(S.sel, S.amount); render(); break;
    // miktar
    case 'amt': setAmount(b.dataset.target, Number(b.dataset.val)); break;
    case 'nudge': {
      if (!b.dataset.target) break;
      const want = (getAmount(b.dataset.target) || 0) + Number(b.dataset.delta);
      if (want > MAX_G) toast(L("En fazla {m} g (10 kg) seçilebilir.", { m: fmtNum(MAX_G) }));
      setAmount(b.dataset.target, want); break;
    }
    case 'list-more': {
      const pre = b.dataset.prefix; if (S.listLimit?.[pre]) S.listLimit[pre].n += 180;
      const y = window.scrollY; render(); window.scrollTo(0, y); break;
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
      if (S.profiles.length >= 12) { toast(L("En fazla 12 profil kaydedilebilir")); break; }
      const next = [...S.profiles, { id: uid(), name: name.slice(0, 40), settings: normalizeSettings(S.settings) }];
      if (!saveProfiles(next)) { toast(L("Profil cihaz depolamasına yazılamadı")); break; }
      S.profiles = next; render(); toast(L("Görünüm kaydedildi")); break;
    }
    case 'profile-apply': {
      const p = S.profiles.find(p => p.id === b.dataset.id);
      if (p) {
        const next = applyProfileSettings(S.settings, p.settings);
        if (!saveSettings(next)) { toast(L("Kaydedilemedi: cihaz depolaması kullanılamıyor")); break; }
        S.settings = next; applySettings(); if (S.settings.showExt) requestExtCatalog(); render(); toast(L("Görünüm: {n}", { n: p.name }));
      } break;
    }
    case 'profile-update': {
      const p = S.profiles.find(p => p.id === b.dataset.id);
      if (p && await uiDialog(L("“{n}” geçerli görünümle güncellensin mi?", { n: p.name }), { ok: L("Güncelle"), cancel: L("Vazgeç") })) {
        const next = S.profiles.map(x => x.id === p.id ? { ...x, settings: normalizeSettings(S.settings) } : x);
        if (!saveProfiles(next)) { toast(L("Profil cihaz depolamasına yazılamadı")); break; }
        S.profiles = next; toast(L("Profil güncellendi"));
      } break;
    }
    case 'profile-delete': {
      const p = S.profiles.find(p => p.id === b.dataset.id);
      if (p && await uiDialog(L("“{n}” görünüm profili silinsin mi?", { n: p.name }), { ok: L("Sil"), cancel: L("Vazgeç") })) {
        const next = S.profiles.filter(x => x.id !== p.id);
        if (!saveProfiles(next)) { toast(L("Profil cihaz depolamasına yazılamadı")); break; }
        S.profiles = next; render();
      } break;
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
      if (b.dataset.p === 'reset') {
        // Tüm görünüm/matriks ayarları ve hedefler sıfırlanır: geri alınamaz, onay ister (B163)
        if (!(await uiDialog(L("Tüm ayarlar varsayılana dönsün mü? Kişisel hedefler ve görünüm seçimleri sıfırlanır; tarif ve günlük kayıtları korunur."), { ok: L("Varsayılana dön"), cancel: L("Vazgeç") }))) break;
        S.settings = { ...DEFAULT_SETTINGS };
      } else Object.assign(S.settings, PRESETS_UI[b.dataset.p]);
      saveSettings(S.settings); applySettings(); render(); toast(L("Ön ayar uygulandı")); break;
    }
    case 'micro-source': {
      const key = b.dataset.key; if (!NUTRIENT_BY_KEY[key]) break;
      if (S.tab === 'tarif') { S.recipeSource = key; S.recipeSourcesOpen = true; }
      else if (S.tab === 'gunluk') { S.personalSource = key; S.personalSourceOpen = true; }
      else break;
      render();
      const sourceSelect = S.tab === 'tarif' ? $('#recipe-source-nutrient') : $('#personal-source-key');
      sourceSelect?.focus(); sourceSelect?.scrollIntoView({ block: 'center' });
      break;
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
    const parsed = parseImport(t);
    const { recipes, custom, profiles, collections, skipped } = mergeImport({ recipes: S.recipes, custom: customFoods(), profiles: S.profiles, collections: S.collections }, parsed);
    const { settings } = parsed;
    const next = { recipes: [...S.recipes, ...recipes], custom: [...customFoods(), ...custom], profiles: [...S.profiles, ...profiles].slice(0, 12), collections: normalizeCollections([...S.collections, ...collections]) };
    if (settings && await uiDialog(L("Yedekteki ayarlar da uygulansın mı?"), { ok: L("Evet"), cancel: L("Hayır") })) next.settings = normalizeSettings(settings);
    const saved = saveImportState(next);
    if (!saved.ok) throw new Error(saved.rollbackFailed ? L("Yedek tam kaydedilemedi ve önceki kayıtların tamamı geri yüklenemedi. Açık verilerini dışa aktar; depolamayı kontrol et.") : L("Kaydedilemedi: cihaz depolaması kullanılamıyor"));
    S.recipes = next.recipes; S.collections = next.collections; S.profiles = next.profiles; setCustomFoods(next.custom);
    if (next.settings) { S.settings = next.settings; applySettings(); }
    if (S.recipes.some(r => r.items.some(it => it.ref.t === 'x')) || S.collections.some(c => c.items.some(r => r.t === 'x'))) requestExtCatalog();
    toast(L("{n} tarif içe aktarıldı", { n: recipes.length }) + (skipped ? ' · ' + L("{n} kopya atlandı", { n: skipped }) : ''));
    render();
  } catch (err) {
    uiDialog(L("İçe aktarılamadı:") + ' ' + L(err.message), { ok: L("Tamam") });
  }
}

function exportCSV() {
  let r, title;
  if (S.tab === 'tarif') { const x = selectedRecipeResult(); const rc = x.rc; r = x.r; title = `${rc.name} – ${x.basisLabel}`; }
  else if (S.sel) { const item = resolve(S.sel); r = scaleItem(item, S.amount); title = `${item.name} – ${item.formLabel} – ${fmtNum(S.amount)} g`; }
  else return;
  const safe = title.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 60);
  download(`besin-matriksi-${safe}.csv`, matrixCSV(r, title, S.settings), 'text/csv;charset=utf-8');
  toast(L("CSV hazırlandı"));
}

// Porsiyon başı enerji: bilinen malzemelerden; eksik varsa alt sınır (≥), hiç yoksa gösterilmez (0 yazılmaz)
function applyRecipeFilter() {
  const q = norm(S.rcQ || '').trim(); let shown = 0;
  document.querySelectorAll('.rlist-item[data-rname]').forEach((el) => { const hit = !q || el.dataset.rname.includes(q); el.hidden = !hit; if (hit) shown++; });
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
    if (el.id) { const chip = root.querySelector(`.settings-toc [data-id="${el.id}"]`); if (chip) chip.hidden = !hit; }
  }
  const none = document.getElementById('settings-none'); if (none) none.hidden = shown > 0;
}

function onInput(e) {
  const t = e.target;
  if (t.id === 'rc-q') { S.rcQ = t.value; applyRecipeFilter(); return; }
  if (t.id === 'settings-q') { S.settingsQ = t.value; applySettingsFilter(); return; }
  if (t.id === 'cmp-q') { S.cmpQ = t.value; const box = document.getElementById('cmp-found'); if (box) box.innerHTML = compareResults(S.cmpQ); return; }
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
  if (t.dataset.slider) { setAmount(t.dataset.slider, sliderToGrams(t.value, MAX_G), { fromSlider: true }); return; }
  if (t.id === 'q') {
    S.q = t.value; S.extPage = 0; $('#foodlist').innerHTML = foodList('ex', S.cat, S.q, S.extGroup);
    if (S.q) $('.welcome')?.remove();
    return;
  }
  if (t.id === 'pq') { S.picker.q = t.value; S.picker.extPage = 0; $('.pk-list').innerHTML = foodList('pk', S.picker.cat, S.picker.q, S.picker.extGroup); return; }
  if (t.id === 'rc-name') { activeRecipe().name = t.value.slice(0, 80) || L("Adsız tarif"); persistRecipes(); return; }
}
function onChange(e) {
  // B200: Kıyasla kartında biçim (çiğ/pişmiş…) yerinde değişir; miktar korunur
  if (e.target.dataset.cmpform != null) { const c = S.compare[+e.target.dataset.cmpform]; const f = +e.target.value; if (c?.ref?.t === 'c' && FOODS.find((x) => x.id === c.ref.id)?.forms[f]) { c.ref = { ...c.ref, f }; render(); $(`[data-cmpform="${e.target.dataset.cmpform}"]`)?.focus(); } return; }
  if (e.target.dataset.colTransfer && e.target.value) {
    const to = S.collections.find((c) => c.id === e.target.value);
    const ref = JSON.parse(e.target.dataset.ref);
    const r = transferRef(S.collections, e.target.dataset.colTransfer, e.target.value, ref);
    if (r.status === 'full') { toast(L("“{c}” dolu: bir koleksiyonda en fazla {m} besin olabilir.", { c: to.name, m: MAX_ITEMS })); e.target.value = ''; return; }
    if (r.status === 'moved' || r.status === 'merged') {
      S.collections = r.list; persistCollections(); render();
      toast(r.status === 'merged' ? L("“{c}” içinde zaten vardı; buradan çıkarıldı.", { c: to.name }) : L("“{c}” koleksiyonuna taşındı.", { c: to.name }));
    }
    return;
  }
  const changedGroup = e.target.dataset.extgroup;
  if (changedGroup) {
    if (changedGroup === 'ex') { S.extGroup = e.target.value || null; S.extPage = 0; }
    else if (S.picker) { S.picker.extGroup = e.target.value || null; S.picker.extPage = 0; }
    render(); return;
  }
  const t = e.target;
  if (t.dataset.diet && DIET_KEYS.includes(t.dataset.diet)) { updateDiet({[t.dataset.diet]:t.type==='checkbox'?t.checked:t.value}); return; }
  if (t.dataset.personalField) { updatePersonalDraft(t); return; }
  if (t.dataset.settingNumber) { if (!t.checkValidity()) toast(tr('settingInvalid')); return; }
  if (t.id === 'personal-day') { if (validDay(t.value)) { S.personalDay = t.value; S.personalDayAuto = t.value === localDay(); render(); } else { toast(tr('dateInvalid')); t.value = S.personalDay; } return; }
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
    const current = selectedRecipeResult();
    $('#recipe-source-rows').innerHTML = renderRecipeSourceRows(current.rc, resolve, S.recipeSource, current.factor, S.settings.precision);
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
      if (S.settings.showExt || S.recipes.some(r => r.items.some(it => it.ref.t === 'x'))) requestExtCatalog();
      render(); toast(L("Ayarlar içe aktarıldı"));
    }).catch((err) => uiDialog(L("Ayarlar içe aktarılamadı:") + ' ' + L(err.message)));
    return;
  }
  if (t.id === 'imp-file' && t.files?.[0]) { t.files[0].text().then(importText); return; }
  if (t.id === 'rc-name') render();
}

export function start() {
  setRenderer(render); // B223: ui.js (geniş katalog yüklenince) yeniden çizer
  bindDayActions({ render, persistPersonal, uiDialog, selectFood, setSetting }); // B230
  bindCollectionActions({ render, uiDialog }); // B232
  bindRecipeActions({ render, uiDialog, setSetting }); // B235
  bindPickActions({ render, selectFood, addToRecipe, addToCompare }); // B236
  printController = createPrintController(document, window);
  applySettings();
  if (S.settings.showExt || S.recipes.some(r => r.items.some(it => it.ref.t === 'x'))) requestExtCatalog();
  if (S.personal.entries.some(e => e.ref.t === 'x')) requestExtCatalog();
  if (S.collections.some(c => c.items.some(r => r.t === 'x'))) requestExtCatalog(); // B165
  window.addEventListener('resize', () => { document.documentElement.dataset.uiNarrow = String(window.innerWidth / (S.settings.uiScale / 100) < 900); });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (S.settings.theme === 'system') applySettings(); });
  if (location.hash && location.hash !== '#/') applyRoute(location.hash);
  window.addEventListener('popstate', () => { applyRoute(location.hash); render(); window.scrollTo(0, 0); });
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
  // Başka sekmede yapılan değişiklikler: üzerine yazmamak için yeniden yükle (localStorage 'storage' olayı)
  window.addEventListener('storage', (e) => {
    if (!e.key || !e.key.startsWith('bm.') || e.key.startsWith('bm.aion')) return;
    flushSave();
    S.recipes = loadRecipes(); if (!S.recipes.length) S.recipes = [newRecipe(L("İlk tarifim"))];
    if (!S.recipes.some((r) => r.id === S.activeRecipe)) S.activeRecipe = S.recipes[0].id;
    setCustomFoods(loadCustom()); S.collections = loadCollections(); S.profiles = loadProfiles();
    const p = loadPersonal(); S.personal = p.state; S.personalReadError = p.error;
    // B166: ayarlar da eşitlenir; yoksa bu sekme eski ayarlarla bir sonraki kayıtta diğer sekmenin değişikliğini ezer
    if (e.key === 'bm.settings.v2') { S.settings = loadSettings(); applySettings(); if (S.settings.showExt) requestExtCatalog(); }
    render();
  });
  window.addEventListener('pagehide', flushSave);
  document.addEventListener('visibilitychange', () => { if (document.hidden) flushSave(); });
  document.addEventListener('click', onClick);
  document.addEventListener('input', onInput);
  document.addEventListener('change', onChange);
  // Bölümlerin açık/kapalı durumunu hatırla
  document.addEventListener('toggle', (e) => {
    const d = e.target;
    rememberDetails(d);
    if (d.isConnected && d.matches?.('details.personal-sources')) {
      S.personalSourceOpen = d.open;
      if (d.open && !S.personal.milestones.source) {
        S.personal.milestones.source = true; persistPersonal();
        const done = Object.values(S.personal.milestones).filter(Boolean).length, progress = $('.exploration-progress progress');
        if (progress) { progress.value = done; progress.setAttribute('aria-label', tr('progressCount', { done })); $('.exploration-progress p').textContent = tr('progressCount', { done }); }
      }
    }
    if (d.isConnected && d.matches?.('.personal details.micro-overview') && isPhone()) S.dayMicroOpen = d.open; // seçim diğer sekmelerle de paylaşılır (aşağıda)
    if (!printController.active && d.isConnected && d.matches?.('details.sec, details.micro-overview')) { if (d.open) S.closed.delete(d.dataset.sec); else S.closed.add(d.dataset.sec); }
  }, true);
  document.addEventListener('keydown', (e) => {
    if (quickKeys(e)) return;
    if (!document.querySelector('.modal') && !e.target.closest('input, textarea, select, [contenteditable="true"]') && e.altKey && !e.ctrlKey && !e.metaKey) {
      const key = shortcutKey(e); const target = Object.keys(SHORTCUT_ACTIONS).find(id => S.settings.shortcuts[id] === `Alt+${key}`);
      if (target) { e.preventDefault(); S.tab = target; render(); window.scrollTo(0, 0); document.querySelector(`[data-tab="${target}"]`)?.focus(); return; }
    }
    trapModalTab(e); if (!e.defaultPrevented && e.key === 'Escape' && (S.picker || S.customEdit || S.themeEditor || S.colPicker)) { if (S.themeEditor) S.themeEditor = null; else if (S.customEdit) S.customEdit = null; else if (S.colPicker) S.colPicker = false; else S.picker = null; render(); } });
  // Modal arka planına tıklayınca kapat
  document.addEventListener('mousedown', (e) => { if (e.target.classList?.contains('modal') && !e.target.classList.contains('dlg') && !S.customEdit) { S.picker = null; S.colPicker = false; render(); } });
  const ruler = $('#ruler');
  document.addEventListener('pointermove', (e) => { if (S.settings.ruler && ruler) ruler.style.transform = `translateY(${e.clientY - 22}px)`; }, { passive: true });
}

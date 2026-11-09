import { CATEGORIES, FOODS, META, resolve, refKey, search, loadExt, extLoaded, extGroups, extFoods, setCustomFoods, customFoods } from './data.js';
import { NUTRIENTS, SECTIONS, SOURCES } from './nutrients.js';
import { scaleItem, aggregate, scaleAggregate } from './calc.js';
import { renderMatrix } from './matrix.js';
import { FONTS, fontStack, ensureFont } from './fonts.js';
import { loadSettings, saveSettings, DEFAULT_SETTINGS, THEMES, ACCENTS, loadRecipes, saveRecipes, newRecipe, exportPayload, parseImport, loadCustom, saveCustom, loadSearches, saveSearches, loadProfiles, saveProfiles } from './store.js';
import { esc, fmtNum, fmtAmount, clamp, download, uid, configureFormatting } from './util.js';
import { matrixCSV } from './export.js';
import { contrastRatio, accentText, exportTheme, parseTheme } from './theme.js';
import { focusSelector, syncModalFocus, trapModalTab } from './accessibility.js';
import { recentSearches } from './search.js';
import { recipeCost, normalizeCustom } from './records.js';
import { normalizeSettings, resetSettingGroup, exportSettings, parseSettings, MATRIX_SECTIONS, moveSection, SHORTCUT_ACTIONS } from './settings.js';

const PRESETS = [1, 5, 10, 25, 50, 100, 150, 200, 250, 500, 750, 1000];
const MAX_G = 1000;

const S = {
  tab: 'kesfet',
  searches: loadSearches(),
  profiles: loadProfiles(),
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
  compare: [],
  cmpSection: 'all',
  picker: null, // { target, cat, q, sel, amount }
  customEdit: null, // { id?, name, liquid, portion, v: {} }
};
setCustomFoods(loadCustom());
S.amount = S.settings.defaultAmount;
if (!S.recipes.length) S.recipes = [newRecipe('İlk tarifim')];
S.activeRecipe = S.recipes[0].id;

const $ = (sel, el = document) => el.querySelector(sel);
const app = () => $('#app');
let modalOpener = null;

// ---------------------------------------------------------------- ayarlar
function applySettings() {
  const s = S.settings, r = document.documentElement;
  configureFormatting(s);
  for (const key of ['bg', 'fg', 'card', 'card2', 'muted', 'line', 'ac0', 'ac-fg', 'ok', 'warn', 'bad', 'okbg', 'warnbg', 'badbg']) r.style.removeProperty('--' + key);
  r.dataset.theme = s.theme;
  if (s.theme === 'custom') {
    const c = s.customTheme;
    for (const [k, v] of Object.entries({ bg: c.bg, fg: c.fg, card: c.card, card2: c.bg, muted: c.fg, line: c.fg, ac0: c.accent, ok: c.fg, warn: c.fg, bad: c.fg, okbg: c.card, warnbg: c.card, badbg: c.card })) r.style.setProperty('--' + k, v);
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
  const accent = s.accent === 'auto' ? (s.theme === 'custom' ? s.customTheme.accent : THEMES.find(t => t.id === s.theme)?.ac) : s.accent;
  if (accent) r.style.setProperty('--ac-fg', accentText(accent));
  ensureFont(s.font);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = getComputedStyle(r).getPropertyValue('--bg').trim() || '#ffffff';
  $('#ruler')?.classList.toggle('on', !!s.ruler);
}
function setSetting(k, v) {
  S.settings = normalizeSettings({ ...S.settings, [k]: v });
  if (!saveSettings(S.settings)) toast('Ayarlar bu oturumda uygulandı; cihaz depolamasına yazılamadı');
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
  if (id?.startsWith('ext:')) return 'USDA: ' + (extGroups()[id.slice(4)] || '');
  return CATEGORIES.find((c) => c.id === id)?.name || '';
}
const catIcon = (id) => (S.settings.emoji ? CATEGORIES.find((c) => c.id === id)?.icon || '📦' : '');

function amountControls(target, g, portions = [], { compact = false, liquid = false } = {}) {
  const oz = S.settings.amountUnit === 'oz';
  const unit = oz ? `oz (≈ ${fmtNum(g)} g)` : liquid ? 'g ≈ mL' : 'g';
  const presets = compact ? [10, 25, 50, 100, 200, 500, 1000] : PRESETS;
  return `<div class="amount ${compact ? 'compact' : ''}" data-amount="${esc(target)}">
    <div class="amt-main">
      <button class="nudge" data-action="nudge" data-target="${esc(target)}" data-delta="-10" aria-label="10 gram azalt">−10</button>
      <button class="nudge" data-action="nudge" data-target="${esc(target)}" data-delta="-1" aria-label="1 gram azalt">−1</button>
      <output class="amt-val" data-amtval="${esc(target)}"><b>${fmtNum(oz ? g / 28.349523125 : g)}</b> <span class="amount-unit">${unit}</span></output>
      <button class="nudge" data-action="nudge" data-target="${esc(target)}" data-delta="1" aria-label="1 gram artır">+1</button>
      <button class="nudge" data-action="nudge" data-target="${esc(target)}" data-delta="10" aria-label="10 gram artır">+10</button>
    </div>
    <input type="range" class="slider" min="1" max="${MAX_G}" step="1" value="${g}" data-slider="${esc(target)}" aria-label="Miktar (gram)">
    <div class="presets">${presets.map((p) => `<button class="pchip ${p === g ? 'on' : ''}" data-action="amt" data-target="${esc(target)}" data-val="${p}">${p >= 1000 ? '1 kg' : p + ' g'}</button>`).join('')}</div>
    ${portions.length ? `<div class="portions">${portions.map((p) => `<button class="pchip por ${Math.abs(p.g - g) < 0.01 ? 'on' : ''}" data-action="amt" data-target="${esc(target)}" data-val="${p.g}" title="${esc(p.en)} (USDA)">${esc(p.label)} · ${fmtNum(p.g)} g</button>`).join('')}</div>` : ''}
  </div>`;
}

function foodButton(f, action, extra = '') {
  return `<button class="food" data-action="${action}" data-id="${esc(f.id)}" ${extra}>
    <span class="fi" aria-hidden="true">${catIcon(f.cat)}</span>
    <span class="fn">${esc(f.tr)}</span>
    <span class="ff">${f.forms.length > 1 ? f.forms.length + ' form' : esc(f.forms[0].label)}</span>
  </button>`;
}
function extButton(f, action) {
  return `<button class="food ext" data-action="${action}" data-ndb="${esc(f.n)}"><span class="fi">${S.settings.emoji ? '🇺🇸' : ''}</span><span class="fn">${esc(f.en)}</span><span class="ff">USDA ${esc(f.n)}</span></button>`;
}

// ---------------------------------------------------------------- KEŞFET
function categoryNav(prefix, current, withExt) {
  const all = `<button class="cat ${!current ? 'on' : ''}" data-action="${prefix}-cat" data-cat="">${S.settings.emoji ? '✨ ' : ''}Tümü <span class="cnt">${FOODS.length}</span></button>`;
  const cats = CATEGORIES.map((c) => {
    const n = FOODS.filter((f) => f.cat === c.id).length;
    return `<button class="cat ${current === c.id ? 'on' : ''}" data-action="${prefix}-cat" data-cat="${c.id}">${S.settings.emoji ? c.icon + ' ' : ''}${esc(c.name)} <span class="cnt">${n}</span></button>`;
  }).join('');
  const ext = withExt ? `<button class="cat ${current === 'ext' ? 'on' : ''}" data-action="${prefix}-cat" data-cat="ext">${S.settings.emoji ? '🗂️ ' : ''}Geniş katalog (USDA, İngilizce)</button>` : '';
  const cu = `<button class="cat ${current === 'custom' ? 'on' : ''}" data-action="${prefix}-cat" data-cat="custom">${S.settings.emoji ? '🏷️ ' : ''}Kendi besinlerim <span class="cnt">${customFoods().length}</span></button>`;
  return all + cats + cu + ext;
}

function customButton(f, action) {
  return `<button class="food" data-action="${action}" data-cid="${esc(f.id)}"><span class="fi">${S.settings.emoji ? '🏷️' : ''}</span><span class="fn">${esc(f.name)}</span><span class="ff">Etiketten · ${f.v.energy != null ? fmtNum(f.v.energy) + ' kcal/100 g' : 'enerji yok'}</span></button>`;
}

function foodList(prefix, cat, q, extGroup) {
  if (cat === 'custom') {
    const list = q ? search(q).custom : customFoods();
    return `<button class="btn primary block" data-action="cu-new">＋ Etiketten yeni besin ekle</button>
      <p class="hint">Markalı ürünler (bitkisel süt, protein tozu, hazır gıda…) için etiketteki 100 g değerlerini gir. Cihazda saklanır, yedeğe dahil edilir.</p>
      <div class="foods">${list.map((f) => customButton(f, prefix + '-pick-custom')).join('') || '<p class="empty">Henüz kendi besinin yok.</p>'}</div>`;
  }
  if (cat === 'ext') {
    if (!extLoaded()) { loadExt().then(render); return '<p class="empty">Geniş katalog yükleniyor…</p>'; }
    const groups = extGroups();
    const chips = Object.entries(groups).map(([g, n]) => `<button class="pchip ${extGroup === g ? 'on' : ''}" data-action="${prefix}-extgroup" data-g="${g}">${esc(n)}</button>`).join('');
    let list = extFoods();
    if (extGroup) list = list.filter((f) => f.g === extGroup);
    if (q) list = search(q, { ext: true, extGroup }).ext;
    const shown = list.slice(0, 400);
    return `<div class="presets extgroups">${chips}</div>
      <p class="hint">USDA SR28'den bitkisel gruplar; hayvansal içerikli ve marka ürünler otomatik ayıklandı, yine de vegan uygunluğu ürün bazında doğrulanmalıdır.</p>
      <div class="foods">${shown.map((f) => extButton(f, prefix + '-pick-ext')).join('')}</div>
      ${list.length > shown.length ? `<p class="hint">${list.length - shown.length} kayıt daha var; aramayla daralt.</p>` : ''}`;
  }
  const res = search(q, { cat, ext: S.settings.showExt && extLoaded() && !!q });
  if (!res.curated.length && !res.ext.length && !res.custom.length) return '<p class="empty">Eşleşen besin yok. Aramayı kısalt veya “Tümü”ne dön.</p>';
  let html = '';
  if (!q && !cat) {
    for (const c of CATEGORIES) {
      const fs = res.curated.filter((f) => f.cat === c.id);
      if (!fs.length) continue;
      html += `<h3 class="grp">${S.settings.emoji ? c.icon + ' ' : ''}${esc(c.name)}</h3><div class="foods">${fs.map((f) => foodButton(f, prefix + '-pick')).join('')}</div>`;
    }
  } else {
    html = `<div class="foods">${res.curated.map((f) => foodButton(f, prefix + '-pick')).join('')}</div>`;
  }
  if (res.custom.length) html += `<h3 class="grp">Kendi besinlerim</h3><div class="foods">${res.custom.map((f) => customButton(f, prefix + '-pick-custom')).join('')}</div>`;
  if (res.ext.length) html += `<h3 class="grp">Geniş katalog (USDA)</h3><div class="foods">${res.ext.map((f) => extButton(f, prefix + '-pick-ext')).join('')}</div>`;
  return html;
}

function formChips(prefix, ref) {
  if (ref.t !== 'c') return '';
  const food = FOODS.find((f) => f.id === ref.id);
  if (food.forms.length < 2) return `<div class="forms"><span class="pchip on static">${esc(food.forms[0].label)}</span></div>`;
  return `<div class="forms" role="group" aria-label="Tüketim biçimi">${food.forms.map((fm, i) => `<button aria-pressed="${i === ref.f}" class="pchip ${i === ref.f ? 'on' : ''}" data-action="${prefix}-form" data-f="${i}">${esc(fm.label)}${fm.ifct ? ' <span class="dot" title="Derin matriks (IFCT) bağlı">●</span>' : ''}</button>`).join('')}</div>`;
}

function renderExplore() {
  const item = S.sel ? resolve(S.sel) : null;
  const detail = item
    ? `<div class="dhead">
        <button class="back" data-action="ex-back" aria-label="Listeye dön">← Liste</button>
        <div class="dtitle"><h2>${S.settings.emoji && item.food ? catIcon(item.food.cat) + ' ' : ''}${esc(item.name)}</h2>
          <div class="dsub">${esc(catName(item.cat))}${item.sci ? ` · <i>${esc(item.sci)}</i>` : ''}</div></div>
        <div class="dact">
          <button class="btn primary" data-action="ex-add-recipe">＋ Tarife ekle</button>
          <button class="btn" data-action="ex-add-compare">⇄ Karşılaştır</button>
          ${item.custom ? '<button class="btn" data-action="cu-edit">✎ Düzenle</button>' : ''}
          <button class="btn ghost" data-action="csv" title="Matriksi tablo (CSV) olarak indir">⬇ CSV</button>
          <button class="btn ghost" data-action="print" title="Yazdır veya PDF olarak kaydet">🖨 Yazdır</button>
        </div>
      </div>
      ${formChips('ex', S.sel)}
      ${amountControls('ex', S.amount, item.portions, { liquid: item.liquid })}
      <div id="matrix" class="matrix">${matrixForExplore(item)}</div>`
    : welcome();
  return `<div class="explore ${item ? 'has-sel' : ''}">
    <nav class="cats" aria-label="Kategoriler">${categoryNav('ex', S.cat, S.settings.showExt)}</nav>
    <section class="list" aria-label="Besinler">
      <div class="searchbar"><input type="search" id="q" placeholder="Ara (isteğe bağlı): muz, mercimek, lentil…" value="${esc(S.q)}" autocomplete="off" aria-label="Besin ara">
      ${S.q ? '<button class="btn ghost" data-action="ex-clear">Temizle</button>' : ''}</div>
      ${S.searches.length ? `<div class="recent-searches" aria-label="Son aramalar"><span class="hint">Son aramalar</span><div class="presets">${S.searches.map(q => `<button class="pchip" data-action="search-recent" data-q="${esc(q)}">${esc(q)}</button>`).join('')}<button class="btn ghost" data-action="search-clear">Geçmişi temizle</button></div></div>` : ''}
      <div id="foodlist">${foodList('ex', S.cat, S.q, S.extGroup)}</div>
    </section>
    <section class="detail" aria-label="Besin matriksi">${detail}</section>
  </div>`;
}

function welcome() {
  return `<div class="welcome">
    <h2>${S.settings.emoji ? '🌱 ' : ''}Besin matriksine hoş geldin</h2>
    <ol>
      <li>Soldan bir <b>kategori</b> seç (ör. Baklagiller).</li>
      <li>Bir <b>besine</b> tıkla (ör. Yeşil mercimek).</li>
      <li><b>Biçimi</b> (çiğ / haşlanmış…) ve <b>miktarı</b> (1 g – 1 kg) tıklayarak seç.</li>
      <li><b>Tarife ekle</b> ile birden çok besinin toplam matriksini gör.</li>
    </ol>
    <p class="hint">${META.curated} besin, ${META.forms} form, ${META.ifctLinked} derin (IFCT) eşleşme · tamamen çevrimdışı · klavye gerekmez.</p>
    <div class="quick">${['muz', 'yesil_mercimek', 'nohut', 'ispanak', 'yulaf', 'ceviz', 'tofu_sert', 'yabanmersini'].map((id) => { const f = FOODS.find((x) => x.id === id); return f ? foodButton(f, 'ex-pick') : ''; }).join('')}</div>
  </div>`;
}

function matrixForExplore(item) {
  const r = scaleItem(item, S.amount);
  return renderMatrix(r, S.settings, { item, closed: S.closed });
}

// ---------------------------------------------------------------- TARİF
const activeRecipe = () => S.recipes.find((r) => r.id === S.activeRecipe) || S.recipes[0];
function persistRecipes() {
  const rc = activeRecipe();
  if (rc) rc.updated = Date.now();
  if (!saveRecipes(S.recipes)) toast('Kaydedilemedi: cihaz depolaması kullanılamıyor');
}

function recipeResult(rc) {
  const scaled = rc.items.map((it) => { const item = resolve(it.ref); return item ? scaleItem(item, it.g) : { v: {}, s: {}, grams: it.g }; });
  const agg = aggregate(scaled);
  let r = agg, basisLabel = `Toplam tarif (${fmtNum(agg.grams)} g malzeme)`;
  if (S.basis === 'serving') { r = scaleAggregate(agg, 1 / rc.servings); basisLabel = `1 porsiyon (${rc.servings} porsiyondan biri, ≈ ${fmtNum(agg.grams / rc.servings)} g malzeme)`; }
  if (S.basis === 'per100') {
    const finalW = rc.cookedWeight || agg.grams;
    if (finalW > 0) { r = scaleAggregate(agg, 100 / finalW); basisLabel = `Son ürünün 100 g'ı (${rc.cookedWeight ? 'pişmiş ağırlık ' + fmtNum(rc.cookedWeight) + ' g' : 'pişmiş ağırlık girilmedi; çiğ toplam kullanıldı'})`; }
  }
  return { r, basisLabel, agg };
}

function renderRecipe() {
  const rc = activeRecipe();
  const list = S.recipes.map((r) => `<div class="rlist-item ${r.id === rc.id ? 'on' : ''}">
      <button class="rname" data-action="rc-open" data-id="${r.id}">${S.settings.emoji ? '📒 ' : ''}${esc(r.name)} <span class="cnt">${r.items.length}</span></button>
    </div>`).join('');
  const items = rc.items.map((it) => {
    const item = resolve(it.ref);
    if (!item) return `<div class="ing missing"><span>Bulunamayan kayıt (${esc(refKey(it.ref))}) ${it.ref.t === 'x' ? '— geniş katalog açık olmalı' : ''}</span><button class="btn ghost" data-action="rc-del-item" data-id="${it.id}">Kaldır</button></div>`;
    return `<div class="ing">
      <div class="ing-h"><span class="fi">${item.food ? catIcon(item.food.cat) : ''}</span><b>${esc(item.name)}</b> <span class="muted">${esc(item.formLabel)}</span>
      <span class="ing-kcal">${item.v.energy != null ? fmtNum((item.v.energy * it.g) / 100) + ' kcal' : ''}</span>
      <button class="btn ghost danger" data-action="rc-del-item" data-id="${it.id}" aria-label="Malzemeyi kaldır">✕</button></div>
      ${amountControls('rc:' + it.id, it.g, item.portions, { compact: true, liquid: item.liquid })}
      <label class="price-field">Kilogram fiyatı (TL/kg, isteğe bağlı)<input type="number" min="0" step="any" inputmode="decimal" data-price="${it.id}" value="${it.pricePerKg ?? ''}" aria-label="${esc(item.name)} kilogram fiyatı"></label>
    </div>`;
  }).join('');
  const { r, basisLabel, agg } = recipeResult(rc);
  const basisBtn = (id, label) => `<button class="pchip ${S.basis === id ? 'on' : ''}" data-action="rc-basis" data-b="${id}">${label}</button>`;
  return `<div class="recipe">
    <aside class="rlist" aria-label="Tarifler">
      <button class="btn primary block" data-action="rc-new">＋ Yeni tarif</button>
      ${list}
      <div class="rtools">
        <button class="btn" data-action="rc-dup">Kopyala</button>
        <button class="btn danger" data-action="rc-delete">Sil</button>
      </div>
    </aside>
    <section class="rmain">
      <div class="rhead"><label class="rtitle"><span class="sr">Tarif adı</span><input id="rc-name" value="${esc(rc.name)}" aria-label="Tarif adı"></label>
        <button class="btn primary" data-action="rc-add">＋ Malzeme ekle</button>
        ${rc.items.length ? '<button class="btn ghost" data-action="csv">⬇ CSV</button><button class="btn ghost" data-action="print">🖨 Yazdır</button>' : ''}</div>
      <div class="ings">${items || `<p class="empty">Henüz malzeme yok. “Malzeme ekle”ye tıkla veya Keşfet'te bir besinde “Tarife ekle”yi kullan. Ör: muz + yaban mersini.</p>`}</div>
      ${rc.items.length ? `<div class="ropts">
        <div class="kv"><span>Porsiyon sayısı</span><span class="stepper"><button class="nudge" data-action="rc-serv" data-d="-1" aria-label="Porsiyon sayısını azalt">−</button><b>${rc.servings}</b><button class="nudge" data-action="rc-serv" data-d="1" aria-label="Porsiyon sayısını artır">+</button></span></div>
        <div class="kv"><span>Pişmiş son ağırlık <span class="help" title="Pişirmede su kaybı/kazancı olur. Son ürünü tartıp girersen 100 g son ürün değeri doğru hesaplanır. Pişirme kayıpları (vitamin vb.) hesaba katılmaz.">?</span></span>
          <span class="stepper"><button class="nudge" data-action="rc-cw" data-d="-50">−50</button><button class="nudge" data-action="rc-cw" data-d="-10">−10</button>
          <b>${rc.cookedWeight ? fmtNum(rc.cookedWeight) + ' g' : 'girilmedi'}</b>
          <button class="nudge" data-action="rc-cw" data-d="10">+10</button><button class="nudge" data-action="rc-cw" data-d="50">+50</button>
          ${rc.cookedWeight ? '<button class="btn ghost" data-action="rc-cw-clear">Sıfırla</button>' : `<button class="btn ghost" data-action="rc-cw-set">= çiğ toplam (${fmtNum(agg.grams)} g)</button>`}</span></div>
        <div class="presets">${basisBtn('total', 'Toplam')}${basisBtn('serving', '1 porsiyon')}${basisBtn('per100', 'Son ürün 100 g')}</div>
      </div>
      <div id="recipe-summary">${renderRecipeSummary(rc, r)}</div>
      <div id="matrix" class="matrix">${renderMatrix(r, S.settings, { recipe: rc, basisLabel, closed: S.closed })}</div>` : ''}
    </section>
  </div>`;
}

function renderRecipeSummary(rc, r) {
  const cost = recipeCost(rc);
  const missing = rc.items.filter(it => !resolve(it.ref)).length;
  const nutrient = (key, label, unit) => {
    const x = r.v[key], partial = x != null && (r.cov[key] || 0) < r.n;
    return `<div><span>${label}</span><b>${x == null ? 'veri yok' : fmtNum(x) + ' ' + unit}</b>${partial ? `<small>kısmi ${r.cov[key]}/${r.n}</small>` : ''}</div>`;
  };
  return `<section class="card recipe-summary" aria-label="Tarif özeti">
    <h3>${S.basis === 'serving' ? '1 porsiyon' : S.basis === 'per100' ? 'Son ürün 100 g' : 'Toplam tarif'}</h3>
    <div class="nutrition-label">${nutrient('energy', 'Enerji', 'kcal')}${nutrient('protein', 'Protein', 'g')}${nutrient('carb_avail', 'Karbonhidrat (lif hariç)', 'g')}${nutrient('fat', 'Yağ', 'g')}${nutrient('fiber', 'Lif', 'g')}${nutrient('salt', 'Tuz', 'g')}</div>
    <p><b>Maliyet:</b> ${cost.known ? `${fmtNum(cost.total)} TL toplam · ${fmtNum(cost.perServing)} TL / porsiyon` : 'fiyat girilmedi'}${cost.complete ? '' : ` · kısmi ${cost.known}/${cost.count} malzeme`}</p>
    ${missing ? `<p class="note" role="status">${missing} malzemenin kaydı bulunamadı. Bu malzemelerin ağırlığı toplamda, besin değerleri eksik kapsamda tutuldu.</p>` : ''}
  </section>`;
}

// ---------------------------------------------------------------- KARŞILAŞTIR
function renderCompare() {
  const items = S.compare.map((c) => ({ c, item: resolve(c.ref) })).filter((x) => x.item);
  const cols = items.map(({ c, item }, i) => `<div class="cmp-col">
      <div class="cmp-h"><b>${esc(item.name)}</b><span class="muted">${esc(item.formLabel)}</span>
      <button class="btn ghost danger" data-action="cmp-del" data-i="${i}" aria-label="Çıkar">✕</button></div>
      ${amountControls('cmp:' + i, c.g, [], { compact: true, liquid: item.liquid })}
    </div>`).join('');
  const addBtn = S.compare.length < 4 ? `<button class="cmp-add" data-action="cmp-add">＋ Besin ekle<br><span class="muted">${S.compare.length}/4</span></button>` : '';
  let table = '';
  if (items.length) {
    const rs = items.map(({ c, item }) => scaleItem(item, c.g));
    const secChips = [['all', 'Tümü'], ...SECTIONS.map((s) => [s.id, s.title])].map(([id, t]) => `<button class="pchip ${S.cmpSection === id ? 'on' : ''}" data-action="cmp-sec" data-s="${id}">${esc(t)}</button>`).join('');
    const rows = [];
    let lastSec = null;
    for (const n of NUTRIENTS) {
      if (n.key === 'energy_kj' && S.settings.energyUnit === 'kcal') continue;
      if (n.key === 'energy' && S.settings.energyUnit === 'kj') continue;
      if (S.cmpSection !== 'all' && n.section !== S.cmpSection) continue;
      const vals = rs.map((r) => r.v[n.key]);
      if (vals.every((x) => x == null)) continue;
      if (n.section !== lastSec) { lastSec = n.section; rows.push(`<tr class="secrow"><th colspan="${items.length + 1}">${esc(SECTIONS.find((s) => s.id === n.section).title)}</th></tr>`); }
      const max = Math.max(...vals.filter((x) => x != null));
      rows.push(`<tr><th scope="row">${esc(n.label)} <span class="unit">${esc(n.unit)}</span></th>${vals.map((x) => {
        if (x == null) return '<td class="miss">veri yok</td>';
        const w = max > 0 ? (x / max) * 100 : 0;
        return `<td class="${x === max && items.length > 1 && max > 0 ? 'best' : ''}"><span class="cbar"><i style="width:${w.toFixed(1)}%"></i></span>${fmtAmount(x, n.unit, S.settings.precision).n}${fmtAmount(x, n.unit).u !== n.unit ? ' ' + fmtAmount(x, n.unit).u : ''}</td>`;
      }).join('')}</tr>`);
    }
    table = `<div class="presets">${secChips}</div>
      <div class="tablewrap"><table class="cmp"><thead><tr><th>Bileşen</th>${items.map(({ c, item }) => `<th>${esc(item.name)}<br><span class="muted">${esc(item.formLabel)} · ${fmtNum(c.g)} g</span></th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>
      <p class="hint">Aynı miktar ve biçimde karşılaştırmak için miktarları eşitle: <button class="btn ghost" data-action="cmp-same" data-g="100">Hepsi 100 g</button> <button class="btn ghost" data-action="cmp-same" data-g="50">Hepsi 50 g</button>. Satırdaki en yüksek değer vurgulanır; “yüksek = iyi” anlamına gelmez (sodyum, toksik mineraller, antinutrientler).</p>`;
  } else {
    table = '<p class="empty">İki ile dört besini yan yana koy. Keşfet\'te “Karşılaştır”a tıklayarak da ekleyebilirsin.</p>';
  }
  return `<div class="compare"><div class="cmp-cols">${cols}${addBtn}</div>${table}</div>`;
}

// ---------------------------------------------------------------- AYARLAR
function renderSettings() {
  const s = S.settings;
  const opt = (k, v, label) => `<button class="pchip ${s[k] === v ? 'on' : ''}" data-action="set" data-k="${k}" data-v="${esc(JSON.stringify(v))}">${label}</button>`;
  const tog = (k, label, help = '') => `<label class="toggle"><input type="checkbox" data-setbool="${k}" ${s[k] ? 'checked' : ''}><span class="sw"></span><span>${label}${help ? ` <span class="help" title="${esc(help)}">?</span>` : ''}</span></label>`;
  const step = (k, label, min, max, st, unit, f = (x) => fmtNum(x)) => `<div class="kv"><span>${label}</span><span class="stepper">
      <button class="nudge" data-action="setstep" data-k="${k}" data-d="${-st}" data-min="${min}" data-max="${max}" aria-label="${label} azalt">−</button><b>${f(s[k])}${unit}</b>
      <button class="nudge" data-action="setstep" data-k="${k}" data-d="${st}" data-min="${min}" data-max="${max}" aria-label="${label} artır">+</button></span></div>`;
  return `<div class="settings">
    <section class="card"><h2>Hızlı ön ayarlar</h2><div class="presets">
      <button class="btn" data-action="preset" data-p="dyslexia">Disleksi dostu</button>
      <button class="btn" data-action="preset" data-p="lowvision">Az görme / büyük yazı</button>
      <button class="btn" data-action="preset" data-p="calm">Sakin ve sade</button>
      <button class="btn" data-action="preset" data-p="cute">Pastel ve sevimli</button>
      <button class="btn ghost" data-action="preset" data-p="reset">Varsayılana dön</button></div></section>

    <section class="card"><h2>Tema</h2><button class="btn ghost" data-action="reset-group" data-group="appearance">Tema ayarlarını sıfırla</button><div class="themes">${THEMES.map((t) => `<button class="theme ${s.theme === t.id ? 'on' : ''}" data-action="set" data-k="theme" data-v='"${t.id}"' style="--tbg:${t.bg};--tfg:${t.fg};--tac:${t.ac}"><span class="tprev"><i></i><b>Aa</b></span>${esc(t.name)}</button>`).join('')}</div>
      <h3>Vurgu rengi</h3><div class="swatches">${ACCENTS.map((a) => `<button class="sw-btn ${s.accent === a ? 'on' : ''}" data-action="set" data-k="accent" data-v='"${a}"' style="${a === 'auto' ? '' : `--sw:${a}`}" aria-label="${a === 'auto' ? 'Tema rengi' : a}">${a === 'auto' ? 'Tema' : ''}</button>`).join('')}</div></section>

    <section class="card"><h2>Yazı tipi</h2><button class="btn ghost" data-action="reset-group" data-group="reading">Yazı ayarlarını sıfırla</button><div class="fonts">${FONTS.map((f) => `<button class="fontbtn ${s.font === f.id ? 'on' : ''}" data-action="font" data-v="${f.id}" style="font-family:${esc(fontStack(f.id))}"><b>${esc(f.name)}</b><span>Işık, ağaç, şeftali — İıĞğŞş 0O 1lI</span><small>${esc(f.note)}</small></button>`).join('')}</div>
      ${step('fontSize', 'Yazı boyutu', 13, 28, 1, ' px')}
      ${step('lineHeight', 'Satır aralığı', 1.2, 2.4, 0.1, '', (x) => fmtNum(x))}
      ${step('letterSpacing', 'Harf aralığı', 0, 0.2, 0.01, ' em', (x) => fmtNum(x))}
      ${step('wordSpacing', 'Sözcük aralığı', 0, 0.5, 0.04, ' em', (x) => fmtNum(x))}
      ${tog('bold', 'Daha kalın yazı')}
    </section>

    <section class="card"><h2>Düzen ve erişilebilirlik</h2><button class="btn ghost" data-action="reset-group" data-group="accessibility">Erişilebilirlik ayarlarını sıfırla</button>
      <div class="kv"><span>Yoğunluk</span><span class="presets">${opt('density', 'comfy', 'Rahat')}${opt('density', 'compact', 'Sıkı')}${opt('density', 'large', 'Büyük dokunma')}</span></div>
      ${step('radius', 'Köşe yuvarlaklığı', 0, 24, 2, ' px')}
      ${tog('ruler', 'Okuma cetveli', 'İmlecin olduğu satırı vurgulayan yatay şerit; satır takibini kolaylaştırır.')}
      ${tog('reduceMotion', 'Animasyonları azalt')}
      ${tog('emoji', 'Simgeleri / emojileri göster')}
      ${tog('largeCursor', 'Büyük fare imleci')}
      ${step('focusWidth', 'Odak halkası kalınlığı', 2, 6, 1, ' px')}
      <h3>Klavye kısayolları</h3><p class="hint">Metin yazarken ve pencereler açıkken sekme kısayolları devre dışıdır. Tab ile gez, Enter / Boşluk ile seç, Escape ile pencereyi kapat. Kısayolları yeniden ata veya kapat.</p>
      ${Object.entries(SHORTCUT_ACTIONS).map(([id, name]) => `<label class="field"><span>${name}</span><select data-shortcut="${id}"><option value="" ${!s.shortcuts[id] ? 'selected' : ''}>Kapalı</option>${Array.from({ length: 9 }, (_, i) => `Alt+${i + 1}`).map(key => `<option value="${key}" ${s.shortcuts[id] === key ? 'selected' : ''}>${key}</option>`).join('')}</select></label>`).join('')}
    </section>

    <section class="card"><h2>Matriks gösterimi</h2><button class="btn ghost" data-action="reset-group" data-group="matrix">Matriks ayarlarını sıfırla</button>
      ${tog('showNrv', '%BRD çubukları', 'Beslenme Referans Değeri (AB 1169/2011, TGK): yetişkin için etiket referansı; kişisel ihtiyaç değildir.')}
      ${tog('showSource', 'Kaynak etiketleri (USDA / IFCT / Tahmin)')}
      ${tog('showAlt', 'İkinci kaynağın değerini göster (aralık)')}
      ${tog('showSd', 'IFCT standart sapmasını göster')}
      ${tog('showMissing', '“Veri yok” satırlarını listele')}
      <div class="kv"><span>Ondalık hassasiyeti</span><span class="presets">${opt('precision', 'low', 'Az')}${opt('precision', 'normal', 'Normal')}${opt('precision', 'high', 'Çok')}</span></div>
      <div class="kv"><span>Varsayılan miktar</span><span class="presets">${[50, 100, 250, 1000].map((g) => opt('defaultAmount', g, g === 1000 ? '1 kg' : g + ' g')).join('')}</span></div>
      ${tog('showExt', 'Geniş katalog (USDA, ~1900 bitkisel kayıt, İngilizce adlar)')}
    </section>

    <section class="card"><h2>Matriks bölümleri</h2>
      <p class="hint">Görünür bölümleri seç, oklarla sırala. Kimlik ve kapsam özeti her zaman görünür.</p>
      <div class="section-settings">${s.sectionOrder.map((id, i) => `<div class="section-option">
        <label><input type="checkbox" data-section-visible="${id}" ${s.hiddenSections.includes(id) ? '' : 'checked'}> ${esc(MATRIX_SECTIONS.find(x => x.id === id).title)}</label>
        <span class="presets"><button class="btn ghost" data-action="section-move" data-id="${id}" data-d="-1" ${i === 0 ? 'disabled' : ''} aria-label="${esc(MATRIX_SECTIONS.find(x => x.id === id).title)} yukarı">↑</button><button class="btn ghost" data-action="section-move" data-id="${id}" data-d="1" ${i === s.sectionOrder.length - 1 ? 'disabled' : ''} aria-label="${esc(MATRIX_SECTIONS.find(x => x.id === id).title)} aşağı">↓</button></span>
      </div>`).join('')}</div>
      <h3>Sabitlenen besin öğeleri</h3><p class="hint">En fazla 24 öğeyi matriksin en üstünde izle.</p>
      <label class="field"><span>Öğe sabitle</span><select id="pin-nutrient"><option value="">Bir bileşen seç</option>${NUTRIENTS.filter(n => !['energy', 'energy_kj'].includes(n.key) && !s.pinnedNutrients.includes(n.key)).map(n => `<option value="${n.key}">${esc(n.label)} (${esc(n.unit)})</option>`).join('')}</select></label>
      <div class="presets">${s.pinnedNutrients.map(k => `<button class="pchip on" data-action="unpin" data-key="${k}" aria-label="${esc(NUTRIENTS.find(n => n.key === k).label)} sabitlemesini kaldır">${esc(NUTRIENTS.find(n => n.key === k).label)} ×</button>`).join('')}</div>
    </section>
    <section class="card"><h2>Birim ve sayı tercihleri</h2>
      <div class="kv"><span>Enerji (matriks)</span><div class="presets">${opt('energyUnit', 'both', 'kcal + kJ')}${opt('energyUnit', 'kcal', 'kcal')}${opt('energyUnit', 'kj', 'kJ')}</div></div>
      <div class="kv"><span>Miktar göstergesi</span><div class="presets">${opt('amountUnit', 'g', 'Gram')}${opt('amountUnit', 'oz', 'Ons (oz)')}</div></div>
      <p class="hint">1 oz = 28,349523125 g. Seçim düğmeleri ve hesap tabanı 1–1000 g aralığında kalır. Sıvılarda yaklaşık mL, yoğunluk 1 varsayımıdır.</p>
      <div class="kv"><span>Ondalık ayracı</span><div class="presets">${opt('decimalSeparator', 'comma', 'Virgül: 1,5')}${opt('decimalSeparator', 'dot', 'Nokta: 1.5')}</div></div>
      ${tog('autoUnits', 'Büyük miktarlarda birimi yükselt (µg → mg → g)')}
      <p class="hint">CSV her zaman Türkçe Excel uyumlu ondalık virgül ve tanımlı besin birimlerini kullanır.</p>
    </section>
    <section class="card"><h2>Yüzde referansı</h2>
      <div class="presets">${opt('referenceMode', 'eu', 'AB / TGK BRD')}${opt('referenceMode', 'custom', 'Kendi hedeflerim')}</div>
      <p class="hint">AB 1169/2011 (2011) yetişkin etiket referansıdır. Kişisel hedeflerin elle girilir; yaşa veya sağlık durumuna göre otomatik öneri yapılmaz. Eksik hedefe BRD değeri atanmaz.</p>
      ${s.referenceMode === 'custom' ? `<label class="field"><span>Hedef eklenecek bileşen</span><select id="target-nutrient"><option value="">Bileşen seç</option>${NUTRIENTS.filter(n => n.key !== 'energy_kj' && s.targets[n.key] == null).map(n => `<option value="${n.key}">${esc(n.label)} (${esc(n.unit)})</option>`).join('')}</select></label><label class="field"><span>Yeni hedef miktarı (seçili bileşenin biriminde)</span><input type="number" min="0" step="any" id="target-new-value"></label><button class="btn" data-action="target-add">Hedef ekle</button>
      ${Object.entries(s.targets).map(([k, value]) => { const n = NUTRIENTS.find(n => n.key === k); return `<label class="field"><span>${esc(n.label)} hedefi (${esc(n.unit)})</span><input type="number" min="0" step="any" data-target-value="${k}" value="${value}"></label><button class="btn ghost" data-action="target-remove" data-key="${k}">${esc(n.label)} hedefini kaldır</button>`; }).join('')}` : ''}
    </section>
    <section class="card"><h2>Kendi temam</h2>
      <div class="cu-grid">${Object.entries({ bg: 'Arka plan', fg: 'Yazı', card: 'Kart', accent: 'Vurgu' }).map(([k, label]) => `<label class="field"><span>${label}</span><input type="color" data-theme-color="${k}" value="${s.customTheme[k]}"></label>`).join('')}</div>
      <div class="theme-preview" style="background:${s.customTheme.bg};color:${s.customTheme.fg}"><span style="background:${s.customTheme.card};padding:.4rem">İı Şş Ğğ 123 · Örnek metin</span></div>
      <p class="hint" role="status">WCAG metin kontrastı: arka plan ${fmtNum(contrastRatio(s.customTheme.fg, s.customTheme.bg))}:1 · kart ${fmtNum(contrastRatio(s.customTheme.fg, s.customTheme.card))}:1. ${Math.min(contrastRatio(s.customTheme.fg, s.customTheme.bg), contrastRatio(s.customTheme.fg, s.customTheme.card)) < 4.5 ? '⚠ Normal metin için 4,5:1 eşiğinin altında; yazı veya zemin rengini değiştir.' : 'Normal metin için AA eşiğini karşılıyor.'} Vurgu / kart: ${fmtNum(contrastRatio(s.customTheme.accent, s.customTheme.card))}:1.</p>
      <div class="presets"><button class="btn" data-action="set" data-k="theme" data-v='"custom"'>Kendi temamı uygula</button><button class="btn" data-action="theme-export">Temayı indir</button><button class="btn" data-action="open-file" data-id="theme-file">Tema dosyası aç</button><input type="file" id="theme-file" accept="application/json,.json" hidden></div>
    </section>
    <section class="card"><h2>Görünüm profilleri</h2>
      <p class="hint">Okuma, sunum veya gece için en fazla 12 görünüm kaydet. Profiller üst çubuktan uygulanabilir ve tam yedeğe dahildir.</p>
      <div class="presets"><input id="profile-name" aria-label="Yeni profil adı" placeholder="Ör. Gece okuması" maxlength="40"><button class="btn" data-action="profile-save">Görünümü kaydet</button></div>
      ${S.profiles.map(p => `<div class="section-option"><b>${esc(p.name)}</b><span class="presets"><button class="btn" data-action="profile-apply" data-id="${p.id}">Uygula</button><button class="btn" data-action="profile-update" data-id="${p.id}" aria-label="${esc(p.name)} profilini güncelle">Güncelle</button><button class="btn danger" data-action="profile-delete" data-id="${p.id}" aria-label="${esc(p.name)} profilini sil">Sil</button></span></div>`).join('')}
    </section>
    <section class="card"><h2>Yalnızca ayarları taşı</h2>
      <p class="hint">Görünümünü başka cihaza taşı. Tarifler ve kendi besinlerin bu işlemden etkilenmez.</p>
      <div class="presets"><button class="btn" data-action="settings-export">Ayarları indir</button>
      <button class="btn" data-action="open-file" data-id="settings-file">Ayar dosyası aç</button><input type="file" accept="application/json,.json" id="settings-file" hidden></div>
    </section>
    <section class="card"><h2>Yedekleme</h2>
      <p class="hint">Tarifler ve ayarlar yalnızca bu cihazda saklanır. Başka cihaza taşımak veya yedeklemek için dışa aktar.</p>
      <div class="presets"><button class="btn" data-action="exp-file">Dosyaya kaydet (.json)</button>
      <button class="btn" data-action="exp-copy">Panoya kopyala</button>
      <button class="btn" data-action="open-file" data-id="imp-file">Dosyadan içe aktar</button><input type="file" accept="application/json,.json" id="imp-file" hidden>
      <button class="btn" data-action="imp-paste">Yapıştırarak içe aktar</button></div>
    </section>
  </div>`;
}

function renderAbout() {
  return `<div class="about card">
    <h2>Besin Matriksi</h2>
    <p>Çevrimdışı çalışan, bitkisel (vegan) besinler için ayrıntılı bileşim gezgini ve tarif hesaplayıcı. İnternet bağlantısı gerekmez; hiçbir veri cihazdan çıkmaz.</p>
    <h3>Veri kaynakları</h3>
    <ul>
      <li><b>${esc(SOURCES.u.short)}</b>: ${esc(SOURCES.u.long)}. Su, enerji, makrolar, lif, şeker, vitaminler, mineraller, yağ sınıfları; pişmiş formlar dahil.</li>
      <li><b>${esc(SOURCES.i.short)}</b>: ${esc(SOURCES.i.long)}. Amino asitler, tek tek yağ asitleri, şeker türleri, lif fraksiyonları, karotenoidler, polifenoller, fitosteroller, organik asitler, fitat, oksalat, saponin, iz ve toksik mineraller. Çiğ/kuru örnekler.</li>
      <li><b>Tahmin</b>: ${esc(SOURCES.e.long)}.</li>
    </ul>
    <h3>Veri dürüstlüğü</h3>
    <ul>
      <li>Ölçülmemiş bileşen <b>“veri yok”</b> olarak gösterilir, asla 0 yazılmaz. 0 yalnızca kaynak 0 bildirdiğinde görünür.</li>
      <li>İki kaynak farklı örnekleri ölçer; fark doğal değişkenliği gösterir (çeşit, toprak, olgunluk, yöntem).</li>
      <li>Varlık ≠ ölçülen miktar ≠ emilen miktar ≠ sağlık etkisi. Göstergeler eğitim amaçlıdır, tıbbi tavsiye değildir.</li>
      <li>%BRD, AB/TGK etiket referansıdır; kişisel ihtiyacın yaşa, cinsiyete, sağlık durumuna göre değişir.</li>
    </ul>
    <p class="hint">Sürüm ${esc(window.__APP_VERSION__ || '')} · veri: ${esc(META.sources)} · ${META.curated} küratörlü besin / ${META.forms} form / ${META.estimated} tahmini değer.</p>
  </div>`;
}

// ---------------------------------------------------------------- SEÇİCİ (modal)
function renderPicker() {
  const P = S.picker;
  if (!P) return '';
  const item = P.sel ? resolve(P.sel) : null;
  return `<div class="modal" role="dialog" aria-modal="true" aria-label="Besin seç">
    <div class="modal-box">
      <div class="modal-h"><h2>${P.target === 'recipe' ? 'Tarife malzeme ekle' : 'Karşılaştırmaya besin ekle'}</h2>
        <button class="btn ghost" data-action="pk-close" aria-label="Kapat">✕ Kapat</button></div>
      ${item ? `<div class="pk-sel"><button class="back show" data-action="pk-back">← Geri</button><h3>${esc(item.name)}</h3>
          ${formChips('pk', P.sel)}
          ${amountControls('pk', P.amount, item.portions, { liquid: item.liquid })}
          <div class="pk-prev">${item.v.energy != null ? `${fmtNum((item.v.energy * P.amount) / 100)} kcal · ` : ''}${item.v.protein != null ? `${fmtNum((item.v.protein * P.amount) / 100)} g protein · ` : ''}${item.v.fiber != null ? `${fmtNum((item.v.fiber * P.amount) / 100)} g lif` : ''}</div>
          <button class="btn primary big" data-action="pk-confirm">${P.target === 'recipe' ? '＋ Tarife ekle' : '＋ Karşılaştırmaya ekle'}</button>
          ${P.target === 'recipe' ? '<button class="btn" data-action="pk-confirm-more">＋ Ekle ve başka seç</button>' : ''}</div>`
      : `<nav class="cats row">${categoryNav('pk', P.cat, S.settings.showExt)}</nav>
        <div class="searchbar"><input type="search" id="pq" placeholder="Ara (isteğe bağlı)" value="${esc(P.q)}" autocomplete="off" aria-label="Besin ara"></div>
        <div class="pk-list">${foodList('pk', P.cat, P.q, P.extGroup)}</div>`}
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
  return `<div class="modal" role="dialog" aria-modal="true" aria-label="Kendi besinim">
    <div class="modal-box"><div class="modal-h"><h2>${E.id ? 'Besini düzenle' : 'Etiketten yeni besin'}</h2><button class="btn ghost" data-action="cu-close">✕ Kapat</button></div>
      <label class="field"><span>Ad</span><input id="cu-name" value="${esc(E.name)}" placeholder="ör. Alpro soya içeceği (şekersiz)"></label>
      <div class="kv"><span>Değerler</span><span class="presets">${['100 g', '100 mL'].map((t, i) => `<button class="pchip ${!!E.liquid === !!i ? 'on' : ''}" data-action="cu-liquid" data-v="${i}">${t} başına</button>`).join('')}</span></div>
      <label class="field"><span>Etiketteki porsiyon (g, isteğe bağlı)</span><input id="cu-portion" type="number" inputmode="decimal" min="1" max="1000" value="${E.portion ?? ''}"></label>
      <p class="hint">Boş bıraktığın bileşenler “veri yok” sayılır (0 değil). Etikette “&lt;0,5 g” yazıyorsa boş bırakmak daha dürüsttür.</p>
      <div class="cu-grid">${CUSTOM_FIELDS.map(([k, l, u]) => `<label class="field ${l.startsWith('  ') ? 'indent' : ''}"><span>${esc(l.trim())} <em>${u}</em></span><input type="number" inputmode="decimal" min="0" step="any" data-cu="${k}" value="${val(k)}"></label>`).join('')}</div>
      <div class="presets end">${E.id ? '<button class="btn danger" data-action="cu-delete">Sil</button>' : ''}<button class="btn" data-action="cu-close">Vazgeç</button><button class="btn primary" data-action="cu-save">Kaydet</button></div>
    </div></div>`;
}
function saveCustomEdit() {
  const E = S.customEdit;
  if (!E.name.trim()) { toast('Bir ad gir'); return false; }
  const list = customFoods().slice();
  if (Object.values(E.v).some(v => !Number.isFinite(v) || v < 0)) { toast('Besin değerleri sıfır veya pozitif sonlu sayılar olmalı'); return false; }
  const rec = normalizeCustom({ ...E, id: E.id || uid() });
  const i = list.findIndex((x) => x.id === rec.id);
  if (i >= 0) list[i] = rec; else list.push(rec);
  setCustomFoods(list);
  if (!saveCustom(list)) toast('Kaydedilemedi: cihaz depolaması kullanılamıyor');
  S.customEdit = null;
  S.cat = 'custom';
  S.sel = { t: 'u', id: rec.id };
  return true;
}

// ---------------------------------------------------------------- render
const TABS = [['kesfet', 'Keşfet', '🔎'], ['tarif', 'Tarif oluştur', '🥣'], ['karsilastir', 'Karşılaştır', '⚖️'], ['ayarlar', 'Ayarlar', '🎨'], ['hakkinda', 'Hakkında', 'ℹ️']];

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
  else if (S.tab === 'tarif') view = renderRecipe();
  else if (S.tab === 'karsilastir') view = renderCompare();
  else if (S.tab === 'ayarlar') view = renderSettings();
  else view = renderAbout();
  app().innerHTML = `
    <header class="top">
      <div class="brand">${S.settings.emoji ? '<span class="logo" aria-hidden="true">🫐</span>' : ''}<b>Besin Matriksi</b></div>
      <nav class="tabs" aria-label="Bölümler">${TABS.map(([id, t, ic]) => `<button class="tab ${S.tab === id ? 'on' : ''}" data-action="tab" data-tab="${id}" ${S.tab === id ? 'aria-current="page"' : ''}><span class="ti" aria-hidden="true">${S.settings.emoji ? ic : ''}</span><span class="tt">${t}</span>${id === 'tarif' && activeRecipe()?.items.length ? `<span class="badge">${activeRecipe().items.length}</span>` : ''}${id === 'karsilastir' && S.compare.length ? `<span class="badge">${S.compare.length}</span>` : ''}</button>`).join('')}</nav>
    </header>
    ${S.profiles.length ? `<div class="profile-bar" role="group" aria-label="Görünüm profilleri"><span class="hint">Görünüm:</span>${S.profiles.map(p => `<button class="pchip" data-action="profile-apply" data-id="${p.id}">${esc(p.name)}</button>`).join('')}</div>` : ''}
    <main class="view view-${S.tab}">${view}</main>
    ${renderPicker()}${renderCustomEditor()}`;
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
    const { r, basisLabel } = recipeResult(rc);
    m.innerHTML = renderMatrix(r, S.settings, { recipe: rc, basisLabel, closed: S.closed });
    const summary = $('#recipe-summary'); if (summary) summary.innerHTML = renderRecipeSummary(rc, r);
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
    box.querySelectorAll('.pchip').forEach((b) => b.classList.toggle('on', Math.abs(Number(b.dataset.val) - g) < 0.01));
  }
  if (target === 'pk') {
    const item = resolve(S.picker.sel);
    const pv = $('.pk-prev');
    if (pv && item) pv.textContent = [item.v.energy != null ? `${fmtNum((item.v.energy * g) / 100)} kcal` : null, item.v.protein != null ? `${fmtNum((item.v.protein * g) / 100)} g protein` : null, item.v.fiber != null ? `${fmtNum((item.v.fiber * g) / 100)} g lif` : null].filter(Boolean).join(' · ');
  } else if (target.startsWith('cmp:')) render();
  else refreshMatrix();
}

// Uygulama içi diyalog (masaüstü/mobil web görünümlerinde alert/confirm/prompt güvenilir değil)
function uiDialog(message, { input = null, ok = 'Tamam', cancel = null } = {}) {
  return new Promise((resolveP) => {
    const wrap = document.createElement('div');
    wrap.className = 'modal dlg';
    wrap.innerHTML = `<div class="modal-box small" role="alertdialog" aria-modal="true" aria-label="Onay"><p>${esc(message)}</p>
      ${input != null ? `<textarea rows="6" aria-label="Metin">${esc(input)}</textarea>` : ''}
      <div class="presets end">${cancel ? `<button class="btn" data-r="0">${esc(cancel)}</button>` : ''}<button class="btn primary" data-r="1">${esc(ok)}</button></div></div>`;
    const previousFocus = focusSelector(document.activeElement);
    document.body.appendChild(wrap);
    syncModalFocus();
    const ta = wrap.querySelector('textarea');
    (ta || wrap.querySelector('[data-r="1"]')).focus();
    if (ta && input) ta.select();
    const finish = yes => {
      wrap.remove(); syncModalFocus(previousFocus);
      resolveP(input != null ? (yes ? ta.value : null) : yes);
    };
    wrap.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finish(!cancel); } });
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

  if (prefix === 'ex') { S.sel = ref; S.amount = S.settings.defaultAmount; render(); const d = $('.detail'); if (d) d.scrollTop = 0; if (window.innerWidth < 900) window.scrollTo(0, 0); }
  else { S.picker.sel = ref; S.picker.amount = S.settings.defaultAmount; render(); }
}

function addToRecipe(ref, g) {
  const rc = activeRecipe();
  const existing = rc.items.find((i) => refKey(i.ref) === refKey(ref));
  if (existing) existing.g = clamp(existing.g + g, 1, MAX_G);
  else rc.items.push({ id: Math.random().toString(36).slice(2, 9), ref: { ...ref }, g });
  persistRecipes();
  toast(`“${resolve(ref).name}” → ${rc.name} (${fmtNum(g)} g)`);
}
function addToCompare(ref, g) {
  if (S.compare.length >= 4) { toast('En fazla 4 besin karşılaştırılabilir'); return false; }
  S.compare.push({ ref: { ...ref }, g });
  toast(`Karşılaştırmaya eklendi: ${resolve(ref).name}`);
  return true;
}

const PRESETS_UI = {
  dyslexia: { font: 'opendyslexic', fontSize: 19, lineHeight: 1.8, letterSpacing: 0.05, wordSpacing: 0.16, theme: 'sepia', ruler: true, density: 'comfy' },
  lowvision: { font: 'atkinson', fontSize: 22, lineHeight: 1.6, theme: 'contrast', bold: true, density: 'large' },
  calm: { theme: 'light', emoji: false, reduceMotion: true, accent: '#3557d6', font: 'inter', showSd: false, showAlt: false },
  cute: { theme: 'pastel', font: 'nunito', emoji: true, radius: 20, accent: 'auto' },
};

async function onClick(e) {
  const b = e.target.closest('[data-action]');
  if (!b) return;
  const a = b.dataset.action;
  if (!document.querySelector('.modal')) modalOpener = focusSelector(b);
  switch (a) {
    case 'tab': S.tab = b.dataset.tab; render(); window.scrollTo(0, 0); break;
    // keşfet
    case 'ex-cat': S.sel = null; S.cat = b.dataset.cat || null; S.extGroup = null; render(); $('.list') && ($('.list').scrollTop = 0); break;
    case 'ex-extgroup': S.extGroup = S.extGroup === b.dataset.g ? null : b.dataset.g; render(); break;
    case 'ex-pick': selectFood('ex', { t: 'c', id: b.dataset.id, f: 0 }); break;
    case 'ex-pick-ext': selectFood('ex', { t: 'x', n: b.dataset.ndb }); break;
    case 'ex-pick-custom': selectFood('ex', { t: 'u', id: b.dataset.cid }); break;
    case 'pk-pick-custom': selectFood('pk', { t: 'u', id: b.dataset.cid }); break;
    case 'cu-new': S.customEdit = { name: '', liquid: false, portion: null, v: {} }; render(); break;
    case 'cu-edit': { const f = customFoods().find((x) => x.id === S.sel?.id); if (f) { S.customEdit = JSON.parse(JSON.stringify(f)); render(); } break; }
    case 'cu-close': S.customEdit = null; render(); break;
    case 'cu-liquid': S.customEdit.liquid = b.dataset.v === '1'; render(); break;
    case 'cu-save': if (saveCustomEdit()) { S.tab = 'kesfet'; render(); toast('Kaydedildi'); } break;
    case 'cu-delete': {
      const E = S.customEdit;
      if (!(await uiDialog(`“${E.name}” silinsin mi? Tariflerdeki kullanımları “bulunamadı” olarak kalır.`, { ok: 'Sil', cancel: 'Vazgeç' }))) break;
      const list = customFoods().filter((x) => x.id !== E.id);
      setCustomFoods(list); saveCustom(list); S.customEdit = null; if (S.sel?.t === 'u') S.sel = null; render(); break;
    }
    case 'csv': exportCSV(); break;
    case 'print': document.querySelectorAll('details.sec').forEach((d) => (d.open = true)); setTimeout(() => window.print(), 50); break;
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
      if (!(await uiDialog(`“${rc.name}” silinsin mi?`, { ok: 'Sil', cancel: 'Vazgeç' }))) break;
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
    case 'cmp-del': S.compare.splice(+b.dataset.i, 1); render(); break;
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
    case 'theme-export': download('besin-matriksi-tema.json', exportTheme(S.settings.customTheme)); break;
    case 'target-add': {
      const key = $('#target-nutrient')?.value, value = Number($('#target-new-value')?.value);
      if (!key || !Number.isFinite(value) || value <= 0) { toast('Bir bileşen ve sıfırdan büyük hedef miktarı gir'); break; }
      setSetting('targets', { ...S.settings.targets, [key]: value }); render(); break;
    }
    case 'target-remove': { const targets = { ...S.settings.targets }; delete targets[b.dataset.key]; setSetting('targets', targets); render(); break; }
    case 'open-file': document.getElementById(b.dataset.id)?.click(); break;
    case 'profile-save': {
      const name = $('#profile-name')?.value.trim();
      if (!name) { toast('Bir profil adı gir'); break; }
      if (S.profiles.length >= 12) { toast('En fazla 12 profil kaydedilebilir'); break; }
      S.profiles.push({ id: uid(), name: name.slice(0, 40), settings: normalizeSettings(S.settings) });
      if (!saveProfiles(S.profiles)) toast('Profil cihaz depolamasına yazılamadı'); else toast('Görünüm kaydedildi'); render(); break;
    }
    case 'profile-apply': {
      const p = S.profiles.find(p => p.id === b.dataset.id);
      if (p) { S.settings = normalizeSettings(p.settings); saveSettings(S.settings); applySettings(); if (S.settings.showExt) loadExt().then(render); render(); toast(`Görünüm: ${p.name}`); } break;
    }
    case 'profile-update': {
      const p = S.profiles.find(p => p.id === b.dataset.id);
      if (p && await uiDialog(`“${p.name}” geçerli görünümle güncellensin mi?`, { ok: 'Güncelle', cancel: 'Vazgeç' })) { p.settings = normalizeSettings(S.settings); saveProfiles(S.profiles); toast('Profil güncellendi'); } break;
    }
    case 'profile-delete': {
      const p = S.profiles.find(p => p.id === b.dataset.id);
      if (p && await uiDialog(`“${p.name}” görünüm profili silinsin mi?`, { ok: 'Sil', cancel: 'Vazgeç' })) { S.profiles = S.profiles.filter(x => x.id !== p.id); saveProfiles(S.profiles); render(); } break;
    }
    case 'section-move': S.settings = moveSection(S.settings, b.dataset.id, Number(b.dataset.d)); saveSettings(S.settings); render(); break;
    case 'unpin': setSetting('pinnedNutrients', S.settings.pinnedNutrients.filter(k => k !== b.dataset.key)); render(); break;
    case 'reset-group': S.settings = resetSettingGroup(S.settings, b.dataset.group); saveSettings(S.settings); applySettings(); render(); toast('Bölüm ayarları sıfırlandı'); break;
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
      saveSettings(S.settings); applySettings(); render(); toast('Ön ayar uygulandı'); break;
    }
    case 'toggle-missing': setSetting('showMissing', true); refreshMatrix(); break;
    case 'exp-file': download(`besin-matriksi-yedek-${new Date().toISOString().slice(0, 10)}.json`, exportPayload(S.recipes, S.settings, customFoods(), S.profiles)); toast('Yedek dosyası hazırlandı'); break;
    case 'exp-copy':
      try { await navigator.clipboard.writeText(exportPayload(S.recipes, S.settings, customFoods(), S.profiles)); toast('Panoya kopyalandı'); }
      catch { await uiDialog('Pano kullanılamadı. Metni seçip kopyala:', { input: exportPayload(S.recipes, S.settings, customFoods(), S.profiles), ok: 'Tamam' }); }
      break;
    case 'imp-paste': {
      const t = await uiDialog('Yedek metnini yapıştır:', { input: '', ok: 'İçe aktar', cancel: 'Vazgeç' });
      if (t) importText(t);
      break;
    }
  }
}

async function importText(t) {
  try {
    const { recipes, settings, custom, profiles } = parseImport(t);
    S.recipes.push(...recipes);
    if (profiles.length) { S.profiles = [...S.profiles, ...profiles].slice(0, 12); saveProfiles(S.profiles); }
    if (custom.length) {
      const have = new Set(customFoods().map((f) => f.id));
      const merged = [...customFoods(), ...custom.filter((f) => !have.has(f.id))];
      setCustomFoods(merged); saveCustom(merged);
    }
    if (S.recipes.some(r => r.items.some(it => it.ref.t === 'x'))) await loadExt();
    if (settings && (await uiDialog('Yedekteki ayarlar da uygulansın mı?', { ok: 'Evet', cancel: 'Hayır' }))) { S.settings = normalizeSettings(settings); saveSettings(S.settings); applySettings(); }
    persistRecipes();
    toast(`${recipes.length} tarif içe aktarıldı`);
    render();
  } catch (err) {
    uiDialog('İçe aktarılamadı: ' + err.message, { ok: 'Tamam' });
  }
}

function exportCSV() {
  let r, title;
  if (S.tab === 'tarif') { const rc = activeRecipe(); const x = recipeResult(rc); r = x.r; title = `${rc.name} – ${x.basisLabel}`; }
  else if (S.sel) { const item = resolve(S.sel); r = scaleItem(item, S.amount); title = `${item.name} – ${item.formLabel} – ${fmtNum(S.amount)} g`; }
  else return;
  const safe = title.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 60);
  download(`besin-matriksi-${safe}.csv`, matrixCSV(r, title, S.settings), 'text/csv;charset=utf-8');
  toast('CSV hazırlandı');
}

function onInput(e) {
  const t = e.target;
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
  if (t.id === 'rc-name') { activeRecipe().name = t.value.slice(0, 80) || 'Adsız tarif'; persistRecipes(); return; }
}
function onChange(e) {
  const t = e.target;
  if (t.dataset.shortcut) {
    if (t.value && Object.entries(S.settings.shortcuts).some(([id, key]) => id !== t.dataset.shortcut && key === t.value)) { toast('Bu kısayol başka bölüme atanmış; önce onu kapat'); render(); return; }
    setSetting('shortcuts', { ...S.settings.shortcuts, [t.dataset.shortcut]: t.value }); return;
  }
  if (t.dataset.themeColor) { setSetting('customTheme', { ...S.settings.customTheme, [t.dataset.themeColor]: t.value }); render(); return; }
  if (t.id === 'theme-file' && t.files?.[0]) {
    t.files[0].text().then(text => { setSetting('customTheme', parseTheme(text)); setSetting('theme', 'custom'); render(); toast('Tema içe aktarıldı'); }).catch(err => uiDialog(err.message)); return;
  }
  if (t.dataset.sectionVisible) { setSetting('hiddenSections', t.checked ? S.settings.hiddenSections.filter(id => id !== t.dataset.sectionVisible) : [...S.settings.hiddenSections, t.dataset.sectionVisible]); render(); return; }
  if (t.id === 'pin-nutrient' && t.value) { setSetting('pinnedNutrients', [...S.settings.pinnedNutrients, t.value]); render(); return; }
  if (t.dataset.setbool) { setSetting(t.dataset.setbool, t.checked); render(); return; }
  if (t.id === 'settings-file' && t.files?.[0]) {
    t.files[0].text().then((text) => {
      S.settings = parseSettings(text); saveSettings(S.settings); applySettings();
      if (S.settings.showExt || S.recipes.some(r => r.items.some(it => it.ref.t === 'x'))) loadExt().then(render);
      render(); toast('Ayarlar içe aktarıldı');
    }).catch((err) => uiDialog('Ayarlar içe aktarılamadı: ' + err.message));
    return;
  }
  if (t.id === 'imp-file' && t.files?.[0]) { t.files[0].text().then(importText); return; }
  if (t.id === 'rc-name') render();
}

export function start() {
  applySettings();
  if (S.settings.showExt || S.recipes.some(r => r.items.some(it => it.ref.t === 'x'))) loadExt().then(render);
  render();
  document.addEventListener('click', onClick);
  document.addEventListener('input', onInput);
  document.addEventListener('change', onChange);
  // Bölümlerin açık/kapalı durumunu hatırla
  document.addEventListener('toggle', (e) => {
    const d = e.target;
    if (d.matches?.('details.sec')) { if (d.open) S.closed.delete(d.dataset.sec); else S.closed.add(d.dataset.sec); }
  }, true);
  document.addEventListener('keydown', (e) => {
    if (!document.querySelector('.modal') && !e.target.closest('input, textarea, select, [contenteditable="true"]') && e.altKey && !e.ctrlKey && !e.metaKey) {
      const target = Object.keys(SHORTCUT_ACTIONS).find(id => S.settings.shortcuts[id] === `Alt+${e.key}`);
      if (target) { e.preventDefault(); S.tab = target; render(); window.scrollTo(0, 0); document.querySelector(`[data-tab="${target}"]`)?.focus(); return; }
    }
    trapModalTab(e); if (!e.defaultPrevented && e.key === 'Escape' && (S.picker || S.customEdit)) { if (S.customEdit) S.customEdit = null; else S.picker = null; render(); } });
  // Modal arka planına tıklayınca kapat
  document.addEventListener('mousedown', (e) => { if (e.target.classList?.contains('modal') && !e.target.classList.contains('dlg') && !S.customEdit) { S.picker = null; render(); } });
  const ruler = $('#ruler');
  document.addEventListener('pointermove', (e) => { if (S.settings.ruler && ruler) ruler.style.transform = `translateY(${e.clientY - 22}px)`; }, { passive: true });
}

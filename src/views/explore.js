// B229: Keşfet sekmesi (kategori şeridi, liste, kartlar, arama sonuçları, detay, benzer besinler) app.js'ten ayrıldı; davranış aynı
import { S } from '../state.js';
import { FOODS, META, CATEGORIES, NAV_CATEGORIES, ANIMAL_CATS, resolve, refKey, search, foodName, formName, categoryName, eligibleFood, eligibleRef, visibleFoods, customFoods, extLoaded, extFoods, extGroups, extMeta, extAnimalGroup } from '../data.js';
import { catalogGroup, catalogSections, categoryContains, DRINK_GROUPS } from '../catalog-tree.js';
import { dietActive } from '../diet.js';
import { renderDietFilter } from '../diet-view.js';
import { collectionRefs, collectionTree, hasRef } from '../collections.js';
import { similarFoods } from '../similar.js';
import { renderMatrix } from '../matrix.js';
import { scaleItem } from '../calc.js';
import { esc, fmtNum, norm } from '../util.js';
import { L, t as tr, getLanguage } from '../i18n.js';
import { amountControls } from './amount.js';
import { foodIcon, persona } from './common.js';
import { catalogPending } from './ui.js';
import { diaryAddedText } from '../personal-view.js';
export function catName(id) {
  if (id?.startsWith('ext:')) return 'USDA: ' + L(extGroups()[id.slice(4)] || '');
  const c = NAV_CATEGORIES.find(c=>c.id===id) || DRINK_GROUPS.find(c=>c.id===id) || CATEGORIES.find(c=>c.id===id);
  return c ? categoryName(c) : id === 'custom' ? L("Kendi besinlerim") : '';
}
export function foodCategoryPath(food){
 const group=catalogGroup(food),parent=NAV_CATEGORIES.find(c=>categoryContains(food,c.id));
 const child=DRINK_GROUPS.find(c=>c.id===group)||CATEGORIES.find(c=>c.id===group);
 if(parent&&child&&parent.id!==child.id)return categoryName(parent)+' › '+categoryName(child);
 return parent?categoryName(parent):catName(food.cat);
}



export function foodButton(f, action, extra = '') {
  const multi = S.multi && action === 'ex-pick', on = multi && S.picked.includes(f.id);
  if (multi) { action = 'multi-pick'; extra += ` aria-pressed="${on}"`; }
  return `<button class="food ${on ? 'picked' : S.sel?.id === f.id ? 'selected' : ''}" data-action="${action}" data-id="${esc(f.id)}" ${extra}>
    <span class="fi" aria-hidden="true">${on ? '✓' : foodIcon(f)}</span>
    <span class="fn">${esc(foodName(f))}${f.animal ? ` <span class="tag-animal">${L("Hayvansal")}</span>` : ''}</span>
    <span class="ff">${f.forms.length > 1 ? L("{n} biçim", { n: f.forms.length }) : esc(formName(f.forms[0].label))}${quickFacts((f.forms.find((fm) => fm.v?.energy != null) || f.forms[0]).v || {})}</span>
  </button>`;
}
// Kartta tek bakışta: 100 g ilk biçim için enerji, protein, lif (veri yoksa yazılmaz)
export function quickFacts(v) {
  if (!S.settings.cardFacts) return '';
  const parts = [];
  if (v.energy != null) parts.push(`${fmtNum(v.energy, 'low')} kcal`);
  if (v.protein != null) parts.push(`${fmtNum(v.protein, 'low')} g ${L("prot.")}`);
  if (v.fiber != null) parts.push(`${fmtNum(v.fiber, 'low')} g ${L("lif")}`);
  // B208: hiç ölçüm yoksa boş bırakma; kart dürüstçe "ölçüm yok" der (0 değil)
  return parts.length ? `<span class="facts"> · ${parts.join(' · ')}</span>` : `<span class="facts nodata"> · ${L("ölçüm yok")}</span>`;
}
export const SORTS = { default: () => 0, name: (a, b) => foodName(a).localeCompare(foodName(b), getLanguage() === 'en' ? 'en' : 'tr'),
  energy: (a, b) => (b.forms[0].v.energy ?? -1) - (a.forms[0].v.energy ?? -1), protein: (a, b) => (b.forms[0].v.protein ?? -1) - (a.forms[0].v.protein ?? -1), fiber: (a, b) => (b.forms[0].v.fiber ?? -1) - (a.forms[0].v.fiber ?? -1) };
export const sortFoods = (list) => (S.sort === 'default' ? list : list.slice().sort(SORTS[S.sort] || SORTS.default));
function sortBar() {
  const opts = [['default', L("Önerilen")], ['name', L("A–Z")], ['energy', L("Enerji")], ['protein', L("Protein")], ['fiber', L("Lif")]];
  return `<div class="sortbar" role="group" aria-label="${L("Sırala")}"><span class="hint">${L("Sırala:")}</span>${opts.map(([id, label]) => `<button class="pchip ${S.sort === id ? 'on' : ''}" aria-pressed="${S.sort === id}" data-action="sort" data-s="${id}">${label}</button>`).join('')}</div>${['energy', 'protein', 'fiber'].includes(S.sort) ? `<p class="hint">${L("100 g ve ilk biçime göre, en yüksekten. Veri olmayanlar sonda.")}</p>` : ''}`;
}

function multiSelection() {
  return S.multi ? `<div class="multibar"><span role="status">${S.picked.length ? L("{n} besin seçildi", { n: S.picked.length }) : L("Tarife eklemek istediğin besinlere dokun.")}</span>
    <button class="btn primary" data-action="multi-add" ${S.picked.length ? '' : 'disabled'}>＋ ${L("Tarife ekle (her biri 100 g)")}</button><button class="btn ghost" data-action="multi-toggle">${L("Vazgeç")}</button></div>` : '';
}
export function extButton(f, action) {
  return `<button class="food ext" data-action="${action}" data-ndb="${esc(f.n)}"><span class="fn">${esc(f.en)}</span><span class="ff">USDA SR28 · 2015 · NDB ${esc(f.n)}${f.a ? ` · ${L("Hayvansal")}` : f.diet === 'unknown' ? ` · ${L("İçerik doğrulanmalı")}` : ''}${f.branded ? ` · ${L("Markalı kaynak kaydı")}` : ''}</span></button>`;
}

// ---------------------------------------------------------------- KEŞFET
export function categoryNav(prefix, current) {
  const vis = visibleFoods();
  const all = `<button class="cat ${!current ? 'on' : ''}" aria-pressed="${!current}" data-action="${prefix}-cat" data-cat=""><span class="cat-i">${S.settings.emoji ? '✨' : ''}</span><span class="cat-l">${L("Tümü")}</span> <span class="cnt">${vis.length}</span></button>`;
  const cats = NAV_CATEGORIES.filter((c) => S.settings.showAnimal || !ANIMAL_CATS.has(c.id)).map((c) => {
    const n = vis.filter(f=>categoryContains(f,c.id)).length;
    return `<button class="cat ${current === c.id ? 'on' : ''}" aria-pressed="${current === c.id}" data-action="${prefix}-cat" data-cat="${c.id}"><span class="cat-i">${S.settings.emoji ? c.icon : ''}</span><span class="cat-l">${esc(categoryName(c))}</span> <span class="cnt">${n}</span></button>`;
  }).join('');
  const ext = `<button class="cat ${current === 'ext' ? 'on' : ''}" aria-pressed="${current === 'ext'}" data-action="${prefix}-cat" data-cat="ext"><span class="cat-i">${S.settings.emoji ? '🗂️' : ''}</span><span class="cat-l">${L("Tam Katalog")}</span> <span class="cnt">${fmtNum(META.ext)}</span></button>`;
  const cu = `<button class="cat ${current === 'custom' ? 'on' : ''}" aria-pressed="${current === 'custom'}" data-action="${prefix}-cat" data-cat="custom"><span class="cat-i">${S.settings.emoji ? '🏷️' : ''}</span><span class="cat-l">${L("Kendi besinlerim")}</span> <span class="cnt">${customFoods().filter(eligibleFood).length}</span></button>`;
  const colBtn = (c, sub) => {
    const n = (sub ? c.items : collectionRefs(S.collections, c.id)).filter(eligibleRef).length;
    return `<button class="cat ${sub ? 'sub' : ''} ${current === 'col:' + c.id ? 'on' : ''}" aria-pressed="${current === 'col:' + c.id}" data-action="${prefix}-cat" data-cat="col:${c.id}"><span class="cat-i">${sub ? '↳' : S.settings.emoji ? '📁' : ''}</span><span class="cat-l">${esc(c.name)}</span> <span class="cnt">${n}</span></button>`;
  };
  const tree = collectionTree(S.collections);
  const cols = `<div class="cat-group" role="presentation">${L("Koleksiyonlarım")}</div>${tree.map((c) => colBtn(c, false) + c.children.map((ch) => colBtn(ch, true)).join('')).join('')}${prefix === 'ex' ? `<button class="cat add" data-action="col-new">＋ ${L("Yeni koleksiyon")}</button>` : ''}`;
  // B185: koleksiyon varsa "Tümü"nün hemen ardından gelir (telefonda şerit ~5950 px; koleksiyonlar 5165. pikseldeydi)
  return S.collections.length ? all + cols + cats + cu + ext : all + cats + cu + cols + ext;
}

export function browseControls(prefix, cat, { catsOpen, filtersOpen } = {}) {
  const picker = prefix === 'pk';
  const category = cat === 'ext' ? L("Tam Katalog") : cat?.startsWith('col:') ? S.collections.find((c) => `col:${c.id}` === cat)?.name : catName(cat);
  const diet = S.settings.dietPattern;
  const dietLabel = { vegan: L("Vegan"), vegetarian: L("Vejetaryen"), pescatarian: L("Pesketaryen") }[diet];
  const activeFilters = dietActive(S.settings) || (!picker && S.sort !== 'default');
  return `<div class="browse-tools">
    <button type="button" class="cats-toggle" data-action="${picker ? 'pk-cats-toggle' : 'cats-toggle'}" aria-controls="${prefix}-categories" aria-expanded="${catsOpen}">${L("Kategoriler")}${category ? ` <span class="tool-current">· ${esc(category)}</span>` : ''}</button>
    <button type="button" class="filters-toggle" data-action="browse-filters" data-prefix="${prefix}" aria-controls="${prefix}-filters" aria-expanded="${filtersOpen}">${L("Filtreler")}${activeFilters ? ` <span class="tool-current">· ${dietLabel || L("Etkin")}</span>` : ''}</button>
    ${picker ? '' : `<button type="button" class="browse-multi" data-action="multi-toggle" aria-pressed="${S.multi}">${L("Çoklu seç")}</button>`}
  </div>
  <nav id="${prefix}-categories" class="cats browse-categories${picker ? ' pk-cats-nav' : ''}${S.settings.catGrid && !picker ? ' cats-grid' : ''}" aria-label="${L("Kategoriler")}" ${catsOpen ? '' : 'hidden'}>${categoryNav(prefix, cat)}</nav>
  <div id="${prefix}-filters" class="browse-filters" ${filtersOpen ? '' : 'hidden'}>${renderDietFilter(S.settings, prefix, S.dietOpen[prefix])}${picker ? '' : sortBar()}</div>`;
}

export function refButton(ref, prefix, colId, index = -1, count = 0) {
  const item = resolve(ref);
  const nm = item ? item.name : refKey(ref);
  const moves = colId && prefix === 'ex' && index >= 0 ? `<span class="move"><button class="btn ghost" data-action="col-move" data-id="${esc(colId)}" data-i="${index}" data-d="-1" ${index === 0 ? 'disabled' : ''} aria-label="${esc(L("{n} yukarı taşı", { n: nm }))}">↑</button><button class="btn ghost" data-action="col-move" data-id="${esc(colId)}" data-i="${index}" data-d="1" ${index === count - 1 ? 'disabled' : ''} aria-label="${esc(L("{n} aşağı taşı", { n: nm }))}">↓</button></span>` : '';
  // B173: başka koleksiyona / alt kategoriye taşı (yalnız başka koleksiyon varsa)
  const targets = colId && prefix === 'ex' ? collectionTree(S.collections).flatMap((c) => [c, ...c.children]).filter((c) => c.id !== colId) : [];
  const transfer = targets.length ? `<select class="col-transfer" data-col-transfer="${esc(colId)}" data-ref="${esc(JSON.stringify(ref))}" aria-label="${esc(L("{n}: başka koleksiyona taşı", { n: nm }))}"><option value="">${L("Taşı…")}</option>${targets.map((c) => `<option value="${esc(c.id)}">${c.parent ? '↳ ' : ''}${esc(c.name)}</option>`).join('')}</select>` : '';
  const remove = moves + transfer + (colId && prefix === 'ex' ? `<button class="btn ghost danger item-remove" data-action="col-remove-item" data-id="${esc(colId)}" data-ref="${esc(JSON.stringify(ref))}" aria-label="${esc(L("{n} koleksiyondan çıkar", { n: nm }))}">✕</button>` : '');
  if (!item && ref.t === 'x' && !extLoaded()) return `<div class="food pending-ref"><span class="fn">USDA NDB ${esc(ref.n)}</span>${catalogPending()}${remove}</div>`;
  if (!item) return `<div class="food missing-ref"><span class="fi">❔</span><span class="fn">${L("Kayıt bulunamadı")}</span><span class="ff">${esc(refKey(ref))}</span>${remove}</div>`;
  return `<div class="food-wrap"><button class="food" data-action="${prefix}-pick-ref" data-ref="${esc(JSON.stringify(ref))}"><span class="fi" aria-hidden="true">${item.food ? foodIcon(item.food) : item.custom ? '🏷️' : '🇺🇸'}</span><span class="fn">${esc(item.name)}</span><span class="ff">${esc(item.formLabel)}</span></button>${remove}</div>`;
}

export function collectionList(prefix, cat, q) {
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
    // B165: geniş katalog henüz yüklenmemişken USDA kaydı süzgeçte kaybolmaz; "yükleniyor" satırı görünür ve yüklemeyi başlatır
    const pendingExt = (r) => r.t === 'x' && !extLoaded() && !resolve(r);
    const shown = refs.filter((r) => { if (pendingExt(r)) return !k; if (!eligibleRef(r)) return false; if (!k) return true; const it = resolve(r); return it && norm(it.name).includes(k); });
    if (col !== c) html += `<h3 class="grp">↳ ${esc(col.name)}</h3>`;
    html += shown.length ? `<div class="foods">${shown.map((r) => refButton(r, prefix, col.id, k ? -1 : refs.indexOf(r), refs.length)).join('')}</div>` : (col === c && sections.length > 1 ? '' : `<p class="empty">${refs.length && dietActive(S.settings) ? L("Beslenme filtrelerine uyan kayıt yok. Filtreleri temizleyerek tüm kayıtlarını görebilirsin.") : L("Bu koleksiyon boş. Bir besin seç ve “Koleksiyona ekle”ye dokun.")}</p>`);
  }
  return manage + html;
}

export function customButton(f, action) {
  return `<button class="food" data-action="${action}" data-cid="${esc(f.id)}"><span class="fi">${S.settings.emoji ? '🏷️' : ''}</span><span class="fn">${esc(f.name)}</span><span class="ff">${L("Etiketten")} · ${f.v.energy != null ? fmtNum(f.v.energy) + ' kcal/100 g' : L("enerji yok")}</span></button>`;
}

export const knownFood = (r) => !!FOODS.find((f) => f.id === r.id)?.forms[r.f];
// Son bakılanlar: aramasız, kategorisiz Keşfet görünümünde tek satır
export function recentRow(prefix) {
  if (prefix !== 'ex' || S.multi || !S.settings.showRecent) return '';
  const items = S.recent.map((r) => ({ r, f: FOODS.find((x) => x.id === r.id) })).filter((x) => x.f && eligibleRef(x.r));
  if (!items.length) return '';
  return `<div class="recent-row"><h3 class="grp">🕘 ${L("Son bakılanlar")}</h3><button class="btn ghost" data-action="recent-clear" aria-label="${L("Son bakılanları temizle")}">${L("Temizle")}</button></div>
    <div class="presets recent">${items.map(({ r, f }) => `<button class="pchip" data-action="ex-pick-ref" data-ref='${esc(JSON.stringify(r))}'>${S.settings.emoji ? foodIcon(f) + ' ' : ''}${esc(foodName(f))}${f.forms.length > 1 ? ` <span class="muted">${esc(formName(f.forms[r.f].label))}</span>` : ''}</button>`).join('')}</div>`;
}

// B198: uzun listeler (ana sayfa ~690 kart, ~8700 DOM öğesi) parça parça çizilir; arama/kategori/sıralama değişince sıfırlanır
export const LIST_CHUNK = 60;
export function listLimit(prefix, key) {
  S.listLimit ||= {};
  const cur = S.listLimit[prefix];
  if (!cur || cur.key !== key) S.listLimit[prefix] = { key, n: LIST_CHUNK };
  return S.listLimit[prefix].n;
}
export function moreButton(prefix, rest) {
  return rest > 0 ? `<button class="btn block list-more" data-action="list-more" data-prefix="${prefix}">${L("{n} besin daha göster", { n: fmtNum(rest) })}</button>` : '';
}

export function foodList(prefix, cat, q, extGroup) {
  if (cat?.startsWith('col:')) return collectionList(prefix, cat, q);
  if (cat === 'custom') {
    const list = q ? search(q).custom : customFoods().filter(eligibleFood);
    return `<button class="btn primary block" data-action="cu-new">＋ ${L("Etiketten yeni besin ekle")}</button>
      <p class="hint">${L("Markalı ürünler (bitkisel süt, protein tozu, hazır gıda…) için etiketteki 100 g değerlerini gir. Cihazda saklanır, yedeğe dahil edilir.")}</p>
      <div class="foods">${list.map((f) => customButton(f, prefix + '-pick-custom')).join('') || `<p class="empty">${customFoods().length && dietActive(S.settings) ? L("Beslenme filtrelerine uyan kayıt yok. Filtreleri temizleyerek tüm kayıtlarını görebilirsin.") : L("Henüz kendi besinin yok.")}</p>`}</div>`;
  }
  if (cat === 'ext') {
    if (!extLoaded()) return `<div class="catalog-wait">${catalogPending()}</div>`;
    const meta = extMeta();
    const groups = Object.entries(extGroups()).filter(([g]) => S.settings.showAnimal || !extAnimalGroup(g));
    const all = q ? search(q, { ext: true, extGroup }).ext : extFoods().filter((f) => !extGroup || f.g === extGroup).sort((a, b) => Number(!!a.branded) - Number(!!b.branded) || a.en.localeCompare(b.en));
    const pageSize = 80, pageCount = Math.max(1, Math.ceil(all.length / pageSize));
    const current = Math.min(prefix === 'ex' ? S.extPage : S.picker.extPage || 0, pageCount - 1);
    const shown = all.slice(current * pageSize, (current + 1) * pageSize);
    const groupLabel = L("USDA besin grubu");
    return `<div class="catalog-heading"><h2 tabindex="-1">${L("Tam Katalog")}</h2><span class="hint">${L("{n} kayıt", { n: fmtNum(all.length) })}</span></div>
      <p class="catalog-source">${L("USDA SR28 · 2015 kaynak arşivi. İngilizce özgün adlar; markalı ürünler güncel ambalaj etiketi değildir.")}</p>
      <p class="hint">${L("Kaynak kapsamı: {n} / {n} SR28 kaydı. {c} kayıt ana katalogda; {x} kayıt bu listede. Gizleme tercihin sonuçları daraltabilir.", { n: fmtNum(meta.sourceRecords), c: fmtNum(meta.curatedSourceRecords), x: fmtNum(meta.extendedRecords) })}</p>
      <label class="catalog-group"><span>${groupLabel}</span><select id="${prefix}-extgroup" data-extgroup="${prefix}"><option value="">${L("Tüm besin grupları")}</option>${groups.map(([g, name]) => `<option value="${g}" ${g === extGroup ? 'selected' : ''}>${esc(L(name))}</option>`).join('')}</select></label>
      ${!S.settings.showAnimal ? `<p class="hint">${L("Hayvansal ve içeriği belirsiz karma kayıtlar gizli.")}</p>` : ''}
      <p class="hint">${L("Özgün İngilizce adla veya NDB numarasıyla ara. Örneğin: soup, bagel, 18069.")}</p>
      <div class="foods">${shown.map((f) => extButton(f, prefix + '-pick-ext')).join('') || `<p class="empty">${L("Bu grupta aramana uyan kayıt yok. Aramayı kısalt veya grubu değiştir.")}</p>`}</div>
      ${all.length > pageSize ? `<nav class="catalog-pages" aria-label="${L("Katalog sayfaları")}"><button class="btn" data-action="${prefix}-extpage" data-page="${current - 1}" ${current === 0 ? 'disabled' : ''}>${L("Önceki")}</button><span role="status">${L("Sayfa {a} / {b}", { a: current + 1, b: pageCount })}</span><button class="btn" data-action="${prefix}-extpage" data-page="${current + 1}" ${current === pageCount - 1 ? 'disabled' : ''}>${L("Sonraki")}</button></nav>` : ''}`;
  }
  const res = search(q, { cat, ext: S.settings.showExt && extLoaded() && !!q });
  if (!res.curated.length && !res.ext.length && !res.custom.length) return emptySearch(prefix, q, cat);
  let html = (prefix === 'ex' ? catalogHeading(cat, q, res.curated.length + res.ext.length + res.custom.length) + multiSelection() : '') + (!q && !cat ? recentRow(prefix) : '');
  const groupedCategory = ['meyve','sebze','baklagil','icecek'].includes(cat);
  if (prefix==='ex' && groupedCategory && !q && S.sort!=='default') html += `<p class="hint">${L("Her alt başlık kendi içinde sıralanır.")}</p>`;
  const capped = !cat; // kategori listeleri kısa (≤ ~90); ana sayfa ve kategorisiz aramalar uzun
  let budget = capped ? listLimit(prefix, `${q}|${S.sort}`) : Infinity;
  const total = res.curated.length;
  if (groupedCategory || (!q && !cat && S.sort === 'default')) {
    for (const group of catalogSections(res.curated,CATEGORIES)) {
      if (budget <= 0) break;
      const title=categoryName(group);
      const level = prefix === 'ex' && !cat && !q ? 'h2' : 'h3';
      const heading = prefix === 'ex' && !q && cat && title === catName(cat) ? '' : `<${level} class="grp">${esc(title)}</${level}>`;
      const gf = sortFoods(group.foods).slice(0, budget); budget -= gf.length;
      html += `<section class="catalog-section" data-catalog-group="${group.id}" aria-label="${esc(title)}">${heading}<div class="foods">${gf.map(f=>foodButton(f,prefix+'-pick')).join('')}</div></section>`;
    }
  } else {
    const list = sortFoods(res.curated).slice(0, budget); budget -= list.length;
    html += `<div class="foods">${list.map((f) => foodButton(f, prefix + '-pick')).join('')}</div>`;
  }
  if (capped && Number.isFinite(budget)) html += moreButton(prefix, total - (S.listLimit[prefix].n - Math.max(0, budget)));
  if (res.custom.length) html += `<h3 class="grp">${L("Kendi besinlerim")}</h3><div class="foods">${res.custom.map((f) => customButton(f, prefix + '-pick-custom')).join('')}</div>`;
  if (res.ext.length) html += `<h3 class="grp">${L("Geniş katalog (USDA)")}</h3><div class="foods">${res.ext.slice(0, 80).map((f) => extButton(f, prefix + '-pick-ext')).join('')}</div>`;
  if (res.ext.length > 80) html += `<p class="hint">${L("USDA sonuçlarının ilk 80 kaydı gösteriliyor. Tüm sonuçları sayfalı katalogda aç.")}</p>`;
  return html + (q ? fullCatalogSearch(prefix) : '');
}

export function fullCatalogSearch(prefix) {
  return `<button class="linkish full-catalog-search" data-action="${prefix}-full-search">${L("Tam Katalog içinde de ara")}</button>`;
}

export function formChips(prefix, ref) {
  if (ref.t !== 'c') return '';
  const food = FOODS.find((f) => f.id === ref.id);
  if (food.forms.length < 2) return `<div class="forms"><span class="pchip on static">${esc(formName(food.forms[0].label))}</span></div>`;
  return `<div class="forms" role="group" aria-label="${L("Tüketim biçimi")}">${food.forms.map((fm, i) => `<button aria-pressed="${i === ref.f}" class="pchip ${i === ref.f ? 'on' : ''}" data-action="${prefix}-form" data-f="${i}">${esc(formName(fm.label))}</button>`).join('')}</div>`;
}

// Aynı kategoride makro profili en yakın besinler (alternatif bulmak için; "eşdeğer" iddiası değil)
export function similarRow(item) {
  if (!S.settings.showSimilar || !item.food) return '';
  const list = similarFoods(item.food, visibleFoods(), { formIndex: S.sel.f });
  if (!list.length) return '';
  return `<div class="similar"><span class="hint" title="${esc(L("Aynı kategoride 100 g'daki enerji, protein, karbonhidrat, yağ ve lif profili en yakın besinler. Vitamin ve mineraller farklı olabilir."))}">${L("Benzer besinler:")}</span>
    <div class="presets">${list.map((f) => `<button class="pchip" data-action="ex-pick" data-id="${esc(f.id)}">${esc(foodName(f))}</button>`).join('')}</div></div>`;
}

export function renderExplore() {
  const item = S.sel ? resolve(S.sel) : null;
  const inCollection = !!item && S.collections.some(c => hasRef(c, S.sel));
  const detail = item
    ? `<section class="detail food-detail" aria-labelledby="food-title">
      <div class="dhead">
        <button class="back" data-action="ex-back">← ${L("Listeye dön")}</button>
        <div class="dtitle"><h1 id="food-title" tabindex="-1">${S.settings.emoji && item.food ? foodIcon(item.food, 32) + ' ' : ''}${esc(item.name)}</h1>
          <div class="dsub">${item.animal ? `<span class="tag-animal">${L("Hayvansal")}</span> ` : ''}${esc(item.food ? foodCategoryPath(item.food) : catName(item.cat))}${item.sci ? ` · <i>${esc(item.sci)}</i>` : ''}</div></div>
      </div>
      ${formChips('ex', S.sel)}
      ${amountControls('ex', S.amount, item.portions, { density: item.density, customLiquid: item.customLiquid })}
      <div class="dact" role="group" aria-label="${L("Besin eylemleri")}">
        <button class="btn primary" data-action="ex-add-day">${tr('addDay')}</button>
        <button class="btn" data-action="ex-add-recipe">${tr('addRecipe')}</button>
      </div>
      <div id="food-day-feedback" class="day-feedback">${renderDayFeedback()}</div>
      ${item.food && (item.study || !Object.keys(item.v || {}).length) ? `<div class="unavail"><p>${esc(item.note || '')}</p><button class="btn" data-action="cu-new" data-name="${esc(item.name)}">＋ ${L("Etiketten kendi besinim olarak ekle")}</button></div>` : ''}
      <details class="food-tools" data-ux-details="food-tools" ${S.uxDetails['food-tools'] ? 'open' : ''}>
        <summary>${L("Besin işlemleri")}</summary>
        <div class="presets">
          <button class="btn" data-action="ex-add-compare">${tr('addCompare')}</button>
          <button class="btn" data-action="col-pick">${inCollection ? L("Koleksiyonda") : L("Koleksiyona ekle")}</button>
          ${item.custom ? `<button class="btn" data-action="cu-edit">${L("Düzenle")}</button>` : ''}
          <button class="btn" data-action="csv">${L("CSV indir")}</button>
          <button class="btn" data-action="print">${L("Yazdır")}</button>
          ${location.protocol.startsWith('http') && !item.custom ? `<button class="btn" data-action="copy-link">${L("Bağlantıyı kopyala")}</button>` : ''}
        </div>
      </details>
      <div id="matrix" class="matrix">${matrixForExplore(item)}</div>
      ${similarRow(item)}
    </section>` : '';
  return `<div class="explore ${item ? 'has-sel' : ''}">
    <section class="list" aria-label="${L("Besinler")}">
      <search><div class="searchbar">
        ${item ? `<label for="q">${L("Besin ara")}</label>` : `<h1><label for="q">${L("Besin ara")}</label></h1>`}
        <div class="search-input-row"><input type="search" id="q" placeholder="${L("ör. mercimek, latte, pizza")}" value="${esc(S.q)}" autocomplete="off" enterkeyhint="search" autocapitalize="none" spellcheck="false" aria-keyshortcuts="/">
        <button type="button" class="btn ghost" data-action="ex-clear" ${S.q ? '' : 'hidden'}>${L("Temizle")}</button></div>
      </div></search>
      ${browseControls('ex', S.cat, { catsOpen: S.catsOpen ?? S.settings.catGrid, filtersOpen: !!S.browseFilters.ex })}
      ${S.searches.length ? `<div class="recent-searches" aria-label="${L("Son aramalar")}"><span class="hint">${L("Son aramalar")}</span><div class="presets">${S.searches.map(q => `<button class="pchip" data-action="search-recent" data-q="${esc(q)}">${esc(q)}</button>`).join('')}<button class="btn ghost" data-action="search-clear">${L("Geçmişi temizle")}</button></div></div>` : ''}
      <div id="foodlist">${foodList('ex', S.cat, S.q, S.extGroup)}</div>
    </section>
    ${detail}
  </div>`;
}

function renderDayFeedback() {
  const feedback = S.dayFeedback;
  if (!feedback || feedback.key !== refKey(S.sel)) return '';
  return `<p role="status">${esc(diaryAddedText(feedback, resolve))}</p>
    <button class="linkish" data-action="personal-show-added">${L("Günlüğü aç")}</button>`;
}

// B247: boş sonuçta nedenini ve tek dokunuşluk çıkışları göster: kategori daraltıyorsa tümünde ara, beslenme filtresi açıksa sıfırla, aramayı temizle
export function emptySearch(prefix, q, cat) {
  const actions = [];
  if (cat && q) actions.push(`<button class="btn" data-action="${prefix}-cat">${L("Tüm kategorilerde ara")}</button>`);
  if (dietActive(S.settings)) actions.push(`<button class="btn" data-action="diet-reset">${L("Beslenme filtresini sıfırla")}</button>`);
  if (q && prefix === 'ex') actions.push(`<button class="btn ghost" data-action="ex-clear">${L("Aramayı temizle")}</button>`);
  const why = dietActive(S.settings) ? `<p class="hint">${L("Beslenme filtresi açık; uymayan besinler gizli.")}</p>` : '';
  return `<div class="empty-state" role="status"><p class="empty">${L("Eşleşen besin yok. Aramayı kısalt veya “Tümü”ne dön.")}</p>${why}${actions.length ? `<div class="empty-actions">${actions.join('')}</div>` : ''}</div>${q ? fullCatalogSearch(prefix) : ''}`;
}

export function catalogHeading(cat, q, count) {
  const title = q ? L("“{q}” için sonuçlar", { q }) : cat ? catName(cat) : "";
  return `<div class="catalog-heading ${['meyve','sebze','baklagil','icecek'].includes(cat)?'grouped-heading':''}">${title ? `<h2>${esc(title)}</h2>` : ''}<span class="hint">${L("{n} besin", { n: count })}</span></div>`;
}

export function matrixForExplore(item) {
  const r = scaleItem(item, S.amount);
  return renderMatrix(r, S.settings, { item, overview: true, overviewOpen: S.uxDetails['food-reference'], closed: S.closed, aminoProfile: S.personal.profile, persona: persona() });
}

// ---------------------------------------------------------------- TARİF






// Hedefe en uzak 3 bileşen ve onları 100 g'da en çok veren katalog besinleri (öneri değil, yön gösterir)

// ---------------------------------------------------------------- KARŞILAŞTIR
// B194: Kıyasla'da doğrudan arama. Her biçim ayrı sonuç (ör. Nohut · Kuru, Nohut · Haşlanmış); dokununca 100 g eklenir.


// ---------------------------------------------------------------- AYARLAR

// B181: Ayarlar telefonda ~12 600 px. Arama kutusunun altında bölüm şeridi: her kart başlığına tek dokunuşla atlar.

// ---------------------------------------------------------------- SEÇİCİ (modal)

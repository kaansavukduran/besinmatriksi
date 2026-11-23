import { S } from '../state.js';
import { resolve, refKey, extLoaded, visibleFoods, foodName, formName } from '../data.js';
import { scaleItem, aggregate, scaleAggregate } from '../calc.js';
import { NUTRIENTS } from '../nutrients.js';
import { combineRecipes } from '../recipe-total.js';
import { renderRecipeTotal } from '../recipe-total-view.js';
import { renderMatrix, basicCard } from '../matrix.js';
import { renderRecipeSources } from '../recipe-sources.js';
import { recipeGaps } from '../gaps.js';
import { referenceFor } from '../settings.js';
import { esc, fmtNum, norm, pctText } from '../util.js';
import { L, getLanguage } from '../i18n.js';
import { nutrientLabel } from '../i18n-nutrients.js';
import { amountControls, perServing } from './amount.js';
import { foodIcon, persona } from './common.js';
import { activeRecipe, catalogPending, servingKcal } from './ui.js';
export function recipeResult(rc) {
  const scaled = rc.items.map((it) => { const item = resolve(it.ref); return item ? scaleItem(item, it.g) : { v: {}, s: {}, grams: it.g, name: refKey(it.ref) }; });
  const agg = aggregate(scaled);
  let factor = 1, r = agg, basisLabel = L("Toplam tarif ({g} g malzeme)", { g: fmtNum(agg.grams) });
  if (S.basis === 'serving') { factor = 1 / rc.servings; r = scaleAggregate(agg, factor); basisLabel = L("1 porsiyon ({n} porsiyondan biri, ≈ {g} g malzeme)", { n: rc.servings, g: fmtNum(agg.grams / rc.servings) }); }
  if (S.basis === 'per100') {
    const finalW = rc.cookedWeight || agg.grams;
    if (finalW > 0) { factor = 100 / finalW; r = scaleAggregate(agg, factor); basisLabel = rc.cookedWeight ? L("Son ürünün 100 g'ı (pişmiş ağırlık {g} g)", { g: fmtNum(rc.cookedWeight) }) : L("Son ürünün 100 g'ı (pişmiş ağırlık girilmedi; çiğ toplam kullanıldı)"); }
  }
  return { r, basisLabel, agg, factor };
}
export function recipeTotalModel() { return combineRecipes(S.recipes, resolve, S.settings.recipeTotalBasis); }
export function selectedRecipeResult() {
  if (!S.recipeDaily) return { rc: activeRecipe(), ...recipeResult(activeRecipe()) };
  const model = recipeTotalModel();
  return { rc: { ...model.recipe, name: L("Günlük Toplam Tarif") }, r: model.result, factor: 1, basisLabel: S.settings.recipeTotalBasis === 'serving' ? L("Her tariften 1 porsiyon") : L("Tariflerin tamamı") };
}
export function renderRecipe() {
  const rc = activeRecipe();
  const kcalOf = new Map(S.recipes.map((r) => [r.id, servingKcal(r)]));
  const ordered = S.rcSort === 'name' ? S.recipes.slice().sort((x, y) => x.name.localeCompare(y.name, getLanguage() === 'en' ? 'en' : 'tr'))
    : S.rcSort === 'kcal' ? S.recipes.slice().sort((x, y) => (kcalOf.get(x.id)?.v ?? Infinity) - (kcalOf.get(y.id)?.v ?? Infinity)) : S.recipes;
  const sortChip = (id, label) => `<button class="pchip ${S.rcSort === id ? 'on' : ''}" aria-pressed="${S.rcSort === id}" data-action="rc-sort" data-s="${id}">${label}</button>`;
  const tools = S.recipes.length > 3 ? `<label class="field"><span>${L("Tariflerde ara")}</span><input id="rc-q" type="search" value="${esc(S.rcQ)}" autocomplete="off"></label>
      <div class="presets" role="group" aria-label="${L("Sırala")}">${sortChip('manual', L("Eklenme"))}${sortChip('name', L("A–Z"))}${sortChip('kcal', L("kcal/porsiyon"))}</div>` : '';
  const list = tools + ordered.map((r) => { const k = kcalOf.get(r.id); return `<div class="rlist-item ${!S.recipeDaily && r.id === rc.id ? 'on' : ''}" data-rname="${esc(norm(r.name))}">
      <button type="button" class="rname" data-action="rc-open" data-id="${esc(r.id)}" aria-pressed="${!S.recipeDaily && r.id === rc.id}">${esc(r.name)} <span class="cnt">${r.items.length}</span>${k ? `<small class="rkcal">${k.partial ? '≥ ' : ''}${fmtNum(k.v)} kcal/${L("porsiyon")}</small>` : ''}</button>
    </div>`; }).join('') + `<p class="hint" id="rc-none" hidden>${L("Bu aramaya uyan tarif yok.")}</p>`;
  const totalEntry = `<div class="rlist-item daily-total-entry ${S.recipeDaily ? 'on' : ''}"><button class="rname" data-action="rc-daily-total" aria-pressed="${S.recipeDaily}">${L("Günlük Toplam Tarif")}<small class="rkcal">${L("Otomatik toplam · {n} tarif", { n: S.recipes.length })}</small></button></div>`;
  const archiveOpen = S.uxDetails?.recipes ?? !globalThis.matchMedia?.('(max-width: 900px)')?.matches;
  const recipeList = `<aside class="rlist" aria-label="${L("Tarifler")}">
      <button type="button" class="btn" data-action="rc-new">＋ ${L("Yeni tarif")}</button>
      <details class="recipe-list" data-ux-details="recipes" ${archiveOpen ? 'open' : ''}>
        <summary id="recipe-list-toggle">${L("Tarifler")}</summary>
        <div class="recipe-list-content">${list}</div>
      </details>
      ${totalEntry}
    </aside>`;
  if (S.recipeDaily) {
    const model = recipeTotalModel();
    return `<div class="recipe">${recipeList}<section class="rmain daily-recipe-total" tabindex="-1" aria-label="${L("Günlük Toplam Tarif")}">${renderRecipeTotal(model, S.settings, { resolve, persona: persona(), closed: S.closed, aminoProfile: S.personal.profile, sourceKey: S.recipeSource, sourceOpen: S.recipeSourcesOpen, gaps: renderRecipeGaps(model.result, true) })}</section></div>`;
  }
  const items = rc.items.map((it, idx) => {
    const item = resolve(it.ref);
    if (!item && it.ref.t === 'x' && !extLoaded()) return `<div class="ing pending-ref"><span>USDA NDB ${esc(it.ref.n)} · ${fmtNum(it.g)} g</span>${catalogPending()}</div>`;
    if (!item) return `<div class="ing missing"><span>${L("Bulunamayan kayıt ({key})", { key: esc(refKey(it.ref)) })} ${it.ref.t === 'x' ? '— ' + L("geniş katalog açık olmalı") : ''}</span><button class="btn ghost" data-action="rc-del-item" data-id="${it.id}">${L("Kaldır")}</button></div>`;
    const isOpen = S.ingOpen.has(it.id);
    const panelId = `ingredient-${esc(it.id)}`;
    return `<div class="ing">
      <div class="ingredient-line">
        ${item.food && S.settings.emoji ? `<span class="fi" aria-hidden="true">${foodIcon(item.food, 30)}</span>` : ''}
        <div class="ingredient-info">
          <b>${esc(item.name)}</b>
          <span class="muted">${esc(item.formLabel)}</span>
          <span class="ing-kcal">${item.v.energy != null ? fmtNum((item.v.energy * it.g) / 100) + ' kcal' : ''}</span>
        </div>
        ${isOpen ? '' : `<span class="ingredient-amount">${fmtNum(it.g)} ${item.customLiquid ? 'mL' : 'g'}</span>`}
        <button type="button" class="btn ghost" data-action="ing-open" data-id="${esc(it.id)}" aria-controls="${panelId}" aria-expanded="${isOpen}" aria-label="${esc(`${L(isOpen ? "Kapat" : "Düzenle")} · ${item.name}`)}">${L(isOpen ? "Kapat" : "Düzenle")}</button>
      </div>
      <div id="${panelId}" ${isOpen ? '' : 'hidden'}>${isOpen ? `
        ${amountControls('rc:' + it.id, it.g, item.portions, { compact: true, liquid: item.liquid, density: item.density, customLiquid: item.customLiquid })}
        ${item.customLiquid ? '' : perServing(it.g, rc.servings)}
        <div class="ingredient-tools presets">
          <button type="button" class="btn ghost" data-action="rc-move" data-id="${esc(it.id)}" data-d="-1" ${idx === 0 ? 'disabled' : ''} aria-label="${esc(L("{n} yukarı taşı", { n: item.name }))}">↑ ${L("Yukarı taşı")}</button>
          <button type="button" class="btn ghost" data-action="rc-move" data-id="${esc(it.id)}" data-d="1" ${idx === rc.items.length - 1 ? 'disabled' : ''} aria-label="${esc(L("{n} aşağı taşı", { n: item.name }))}">↓ ${L("Aşağı taşı")}</button>
          <button type="button" class="btn ghost danger" data-action="rc-del-item" data-id="${esc(it.id)}">${L("Malzemeyi kaldır")}</button>
        </div>` : ''}</div>
    </div>`;
  }).join('');
  const { r, basisLabel, agg, factor } = recipeResult(rc);
  const basisBtn = (id, label) => `<button type="button" class="pchip ${S.basis === id ? 'on' : ''}" data-action="rc-basis" data-b="${id}" aria-pressed="${S.basis === id}">${label}</button>`;
  const recipeTools = `<details class="recipe-tools" data-ux-details="recipe-tools" ${S.uxDetails?.['recipe-tools'] ? 'open' : ''}>
    <summary id="recipe-tools-toggle">${L("Tarif işlemleri")}</summary>
    <div class="presets">
      ${rc.items.length ? `<button type="button" class="btn ghost" data-action="csv">${L("CSV indir")}</button><button type="button" class="btn ghost" data-action="print">${L("Yazdır")}</button>` : ''}
      <button type="button" class="btn ghost" data-action="rc-dup">${L("Tarifi kopyala")}</button>
      <button type="button" class="btn ghost danger" data-action="rc-delete">${L("Tarifi sil")}</button>
    </div>
  </details>`;
  return `<div class="recipe">
    ${recipeList}
    <section class="rmain">
      <header id="active-recipe-title" class="rhead" tabindex="-1" aria-labelledby="current-recipe-heading">
        <h1 id="current-recipe-heading" class="sr">${esc(rc.name)}</h1>
        <div class="recipe-heading">
          <div class="rtitle field"><label for="rc-name">${L("Tarif adı")}</label><input type="text" id="rc-name" value="${esc(rc.name)}"></div>
          <button type="button" class="btn primary" data-action="rc-add">＋ ${L("Malzeme ekle")}</button>
          ${rc.items.length ? `<button type="button" class="btn" data-action="rc-to-day">${L("Günlüğe ekle")}</button>` : ''}
        </div>
      </header>
      <div class="ings">${items || `<p class="empty">${L("Henüz malzeme yok")}</p>`}</div>
      ${rc.items.length ? `<div class="presets recipe-basis">${basisBtn('total', L("Toplam"))}${basisBtn('serving', L("1 porsiyon"))}${basisBtn('per100', L("Son ürün 100 g"))}</div>
      <div id="recipe-summary">${renderRecipeSummary(rc, r)}</div>
      <div class="ropts">
        <div class="kv"><span>${L("Porsiyon sayısı")}</span><span class="stepper"><button class="nudge" data-action="rc-serv" data-d="-1" aria-label="${L("Porsiyon sayısını azalt")}">−</button><b>${rc.servings}</b><button class="nudge" data-action="rc-serv" data-d="1" aria-label="${L("Porsiyon sayısını artır")}">+</button></span></div>
        <details class="recipe-weight" data-ux-details="recipe-weight" ${S.uxDetails?.['recipe-weight'] ? 'open' : ''}>
          <summary id="recipe-weight-toggle">${L("Pişmiş son ağırlık")}${rc.cookedWeight ? ` · ${fmtNum(rc.cookedWeight)} g` : ''}</summary>
          <p class="hint">${L("Pişirmede su kaybı/kazancı olur. Son ürünü tartıp girersen 100 g son ürün değeri doğru hesaplanır. Pişirme kayıpları (vitamin vb.) hesaba katılmaz.")}</p>
          <span class="stepper"><button class="nudge" data-action="rc-cw" data-d="-50">−50</button><button class="nudge" data-action="rc-cw" data-d="-10">−10</button>
          <b>${rc.cookedWeight ? fmtNum(rc.cookedWeight) + ' g' : L("girilmedi")}</b>
          <button class="nudge" data-action="rc-cw" data-d="10">+10</button><button class="nudge" data-action="rc-cw" data-d="50">+50</button>
          ${rc.cookedWeight ? `<button class="btn ghost" data-action="rc-cw-clear">${L("Sıfırla")}</button>` : `<button class="btn ghost" data-action="rc-cw-set">${L("= çiğ toplam ({g} g)", { g: fmtNum(agg.grams) })}</button>`}</span>
        </details>
      </div>
      ${recipeTools}
      <div id="recipe-gaps">${renderRecipeGaps(r)}</div>
      <div id="matrix" class="matrix">${renderMatrix(r, S.settings, { recipe: rc, basisLabel, closed: S.closed, aminoProfile: S.personal.profile })}</div>
      <div id="recipe-sources">${renderRecipeSources(rc, resolve, { key: S.recipeSource, factor, basisLabel, open: S.recipeSourcesOpen, precision: S.settings.precision })}</div>` : recipeTools}
    </section>
  </div>`;
}
export function renderRecipeSummary(rc, r) {
  const missing = rc.items.filter(it => !resolve(it.ref)).length;
  const title = S.basis === 'serving' ? L("1 porsiyon") : S.basis === 'per100' ? L("Son ürün 100 g") : L("Toplam tarif");
  return basicCard(r, S.settings, title, {
    persona: persona(), pie: true, overview: true,
    overviewKey: 'recipe-reference', overviewOpen: S.uxDetails?.['recipe-reference'],
  }) +
    (missing ? `<p class="note" role="status">${L("{n} malzemenin kaydı bulunamadı. Bu malzemelerin ağırlığı toplamda, besin değerleri eksik kapsamda tutuldu.", { n: missing })}</p>` : '');
}
export function renderRecipeGaps(r, daily = false) {
  if (!S.settings.recipeGaps || (!daily && S.basis === 'per100')) return '';
  const gaps = recipeGaps(r, NUTRIENTS, visibleFoods(), (n) => referenceFor(n, S.settings));
  if (!gaps.length) return '';
  const noteFor = (g) => g.sourceNote === 'b12'
    ? `<p class="hint">${L("Doğal bitkisel besinlerde güvenilir B12 kaynağı yoktur; zenginleştirilmiş ürünler veya takviye değerlendirilir.")}</p>`
    : g.sourceNote === 'vitd'
      ? `<p class="hint">${L("D vitamini için UV ışığına maruz kalmış mantarlar, zenginleştirilmiş ürünler veya takviye değerlendirilir.")}</p>`
      : '';
  const rows = gaps.map((g) => `<li><div class="gap-h"><b>${esc(nutrientLabel(g.n))}</b> <span class="muted">${pctText(fmtNum(g.pct, 'low'))}${g.partial ? ' · ' + L("kısmi veri, gerçek değer daha yüksek olabilir") : ''}</span></div>
    ${noteFor(g)}
    ${!g.foods.length ? '' : `<div class="presets">${g.foods.map((x) => `<button class="pchip" data-action="gap-open" data-id="${esc(x.f.id)}" data-f="${x.fi ?? 0}">${esc(foodName(x.f))}${x.f.forms.length > 1 && x.fm?.label ? ` <span class="muted">(${esc(formName(x.fm.label))})</span>` : ''} <span class="muted">${fmtNum(x.v, 'low')} ${esc(g.n.unit)}/100 g</span></button>`).join('')}</div>`}</li>`).join('');
  return `<section class="card recipe-gaps" aria-label="${L("En düşük kalan besinler")}">
    <h3>${L("En düşük kalan besinler")}</h3>
    <p class="hint">${L("Referansa göre en düşük yüzdeler ve bunları 100 g'da en çok veren besinler. Kişisel ihtiyaç veya emilim değildir; veri olmayan bileşenler burada sayılmaz.")}</p>
    <ul class="gaps">${rows}</ul></section>`;
}

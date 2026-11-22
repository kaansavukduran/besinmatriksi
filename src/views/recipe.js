// B223: Tarif sekmesi (liste, malzemeler, matris, özet, eksikler) app.js'ten ayrıldı; davranış aynı
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
import { amountControls, miniAmount, perServing } from './amount.js';
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
  const tools = S.recipes.length > 3 ? `<label class="field"><span class="sr">${L("Tariflerde ara")}</span><input id="rc-q" type="search" value="${esc(S.rcQ)}" placeholder="🔎 ${L("Tariflerde ara")}" autocomplete="off"></label>
      <div class="presets" role="group" aria-label="${L("Sırala")}">${sortChip('manual', L("Eklenme"))}${sortChip('name', L("A–Z"))}${sortChip('kcal', L("kcal/porsiyon"))}</div>` : '';
  const list = tools + ordered.map((r) => { const k = kcalOf.get(r.id); return `<div class="rlist-item ${!S.recipeDaily && r.id === rc.id ? 'on' : ''}" data-rname="${esc(norm(r.name))}">
      <button class="rname" data-action="rc-open" data-id="${r.id}">${S.settings.emoji ? '📒 ' : ''}${esc(r.name)} <span class="cnt">${r.items.length}</span>${k ? `<small class="rkcal">${k.partial ? '≥ ' : ''}${fmtNum(k.v)} kcal/${L("porsiyon")}</small>` : ''}</button>
    </div>`; }).join('') + `<p class="hint" id="rc-none" hidden>${L("Bu aramaya uyan tarif yok.")}</p>`;
  const totalEntry = `<div class="rlist-item daily-total-entry ${S.recipeDaily ? 'on' : ''}"><button class="rname" data-action="rc-daily-total" aria-pressed="${S.recipeDaily}">${L("Günlük Toplam Tarif")}<small class="rkcal">${L("Otomatik toplam · {n} tarif", { n: S.recipes.length })}</small></button></div>`;
  if (S.recipeDaily) {
    const model = recipeTotalModel();
    return `<div class="recipe"><aside class="rlist" aria-label="${L("Tarifler")}"><button class="btn primary block" data-action="rc-new">＋ ${L("Yeni tarif")}</button>${list}${totalEntry}</aside><section class="rmain daily-recipe-total">${renderRecipeTotal(model, S.settings, { resolve, persona: persona(), closed: S.closed, aminoProfile: S.personal.profile, sourceKey: S.recipeSource, sourceOpen: S.recipeSourcesOpen, gaps: renderRecipeGaps(model.result, true) })}</section></div>`;
  }
  const items = rc.items.map((it, idx) => {
    const item = resolve(it.ref);
    if (!item && it.ref.t === 'x' && !extLoaded()) return `<div class="ing pending-ref"><span>USDA NDB ${esc(it.ref.n)} · ${fmtNum(it.g)} g</span>${catalogPending()}</div>`;
    if (!item) return `<div class="ing missing"><span>${L("Bulunamayan kayıt ({key})", { key: esc(refKey(it.ref)) })} ${it.ref.t === 'x' ? '— ' + L("geniş katalog açık olmalı") : ''}</span><button class="btn ghost" data-action="rc-del-item" data-id="${it.id}">${L("Kaldır")}</button></div>`;
    return `<div class="ing">
      <div class="ing-h"><span class="fi">${item.food ? foodIcon(item.food) : ''}</span><b>${esc(item.name)}</b> <span class="muted">${esc(item.formLabel)}</span>
      <span class="ing-kcal">${item.v.energy != null ? fmtNum((item.v.energy * it.g) / 100) + ' kcal' : ''}</span>
      <span class="move"><button class="btn ghost" data-action="rc-move" data-id="${it.id}" data-d="-1" ${idx === 0 ? 'disabled' : ''} aria-label="${esc(L("{n} yukarı taşı", { n: item.name }))}">↑</button><button class="btn ghost" data-action="rc-move" data-id="${it.id}" data-d="1" ${idx === rc.items.length - 1 ? 'disabled' : ''} aria-label="${esc(L("{n} aşağı taşı", { n: item.name }))}">↓</button></span>
      <button class="btn ghost danger" data-action="rc-del-item" data-id="${it.id}" aria-label="${L("Malzemeyi kaldır")}">✕</button></div>
      ${S.ingOpen.has(it.id) ? `${amountControls('rc:' + it.id, it.g, item.portions, { compact: true, liquid: item.liquid, density: item.density, customLiquid: item.customLiquid })}${perServing(it.g, rc.servings)}
      <button class="btn ghost" data-action="ing-open" data-id="${it.id}" aria-expanded="true">${L("Kapat")}</button>`
      : miniAmount('rc:' + it.id, it.g, rc.servings, it.id, item.name)}
    </div>`;
  }).join('');
  const { r, basisLabel, agg, factor } = recipeResult(rc);
  const basisBtn = (id, label) => `<button class="pchip ${S.basis === id ? 'on' : ''}" data-action="rc-basis" data-b="${id}">${label}</button>`;
  return `<div class="recipe">
    <aside class="rlist" aria-label="${L("Tarifler")}">
      <button class="btn primary block" data-action="rc-new">＋ ${L("Yeni tarif")}</button>
      ${list}${totalEntry}
    </aside>
    <section class="rmain">
      <div class="rhead"><label class="rtitle"><span class="sr">${L("Tarif adı")}</span><input id="rc-name" value="${esc(rc.name)}" aria-label="${L("Tarif adı")}"></label>
        <button class="btn primary" data-action="rc-add">＋ ${L("Malzeme ekle")}</button>
        ${rc.items.length ? `<button class="btn" data-action="rc-to-day">📒 ${L("Günlüğe ekle")}</button><button class="btn ghost" data-action="csv">⬇ CSV</button><button class="btn ghost" data-action="print">🖨 ${L("Yazdır")}</button>` : ''}
        <span class="rtools" role="group" aria-label="${L("Bu tarif")}"><button class="btn ghost" data-action="rc-dup">${L("Tarifi kopyala")}</button><button class="btn ghost danger" data-action="rc-delete">${L("Tarifi sil")}</button></span></div>
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
      <div id="matrix" class="matrix">${renderMatrix(r, S.settings, { recipe: rc, basisLabel, closed: S.closed, aminoProfile: S.personal.profile })}</div>
      <div id="recipe-sources">${renderRecipeSources(rc, resolve, { key: S.recipeSource, factor, basisLabel, open: S.recipeSourcesOpen, precision: S.settings.precision })}</div>` : ''}
    </section>
  </div>`;
}
export function renderRecipeSummary(rc, r) {
  const missing = rc.items.filter(it => !resolve(it.ref)).length;
  const title = S.basis === 'serving' ? L("1 porsiyon") : S.basis === 'per100' ? L("Son ürün 100 g") : L("Toplam tarif");
  return basicCard(r, S.settings, title, { persona: persona(), pie: true }) +
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

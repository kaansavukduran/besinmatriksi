// B218: miktar denetimleri (kaydırıcı, ±1/±10, hazır miktarlar, porsiyonlar) ve tarifteki tek satırlık kısa denetim
import { S } from '../state.js';
import { esc, fmtNum } from '../util.js';
import { L, getLanguage } from '../i18n.js';
import { SLIDER_STEPS, gramsToSlider, MAX_GRAMS, kgLabel } from '../amount-scale.js';

export const PRESETS = [1, 5, 10, 25, 50, 100, 150, 200, 250, 500, 750, 1000, 2000, 5000, 10000];
export const MAX_G = MAX_GRAMS; // B197: 10 kg
export function amountControls(target, g, portions = [], { compact = false, liquid = false } = {}) {
  const oz = S.settings.amountUnit === 'oz';
  const unit = oz ? `oz (≈ ${fmtNum(g)} g)` : liquid ? 'g ≈ mL' : 'g';
  const presets = compact ? [10, 25, 50, 100, 200, 500, 1000, 2000, 5000] : PRESETS;
  return `<div class="amount ${compact ? 'compact' : ''}" data-amount="${esc(target)}">
    <div class="amt-main">
      <button class="nudge" data-action="nudge" data-target="${esc(target)}" data-delta="-10" aria-label="${L("10 gram azalt")}">−10</button>
      <button class="nudge" data-action="nudge" data-target="${esc(target)}" data-delta="-1" aria-label="${L("1 gram azalt")}">−1</button>
      <output class="amt-val" data-amtval="${esc(target)}"><b>${fmtNum(oz ? g / 28.349523125 : g)}</b> <span class="amount-unit">${unit}</span></output>
      <button class="nudge" data-action="nudge" data-target="${esc(target)}" data-delta="1" aria-label="${L("1 gram artır")}">+1</button>
      <button class="nudge" data-action="nudge" data-target="${esc(target)}" data-delta="10" aria-label="${L("10 gram artır")}">+10</button>
    </div>
    <input type="range" class="slider" min="0" max="${SLIDER_STEPS}" step="1" value="${gramsToSlider(g, MAX_G)}" style="--fill:${gramsToSlider(g, MAX_G) / SLIDER_STEPS * 100}%" data-slider="${esc(target)}" aria-valuetext="${fmtNum(g)} g" aria-label="${L("Miktar (gram)")}">
    ${compact ? '' : `<div class="slider-scale" aria-hidden="true">${[[1, '1 g'], [100, '100'], [1000, '1 kg'], [MAX_G, '10 kg']].map(([v, t]) => `<span style="left:${gramsToSlider(v, MAX_G) / SLIDER_STEPS * 100}%">${t}</span>`).join('')}</div>`}
    <div class="presets">${presets.map((p) => `<button class="pchip ${p === g ? 'on' : ''}" data-action="amt" data-target="${esc(target)}" data-val="${p}">${kgLabel(p)}</button>`).join('')}</div>
    ${portions.length ? `<div class="portions">${portions.map((p) => `<button class="pchip por ${Math.abs(p.g - g) < 0.01 ? 'on' : ''}" data-action="amt" data-target="${esc(target)}" data-val="${p.g}" title="${esc(p.r ? L("Tarif porsiyonu; ölçüm değil") : p.d ? L("USDA “{u}” ölçüsünden hacimle hesaplandı; yaklaşık", { u: p.src }) : p.en + ' (USDA)')}">${esc(getLanguage() === 'en' && p.en ? p.en : p.label)} · ${p.d ? '≈ ' : ''}${fmtNum(p.g)} g</button>`).join('')}</div>` : ''}
  </div>`;
}
// Tarif malzemesi kapalıyken tek satır: −10 · gram · +10 · porsiyon başı · Ayarla
export function perServing(g, servings) {
  return servings > 1 ? `<span class="per-serv" data-perserv="${servings}">${L("porsiyon başı {g} g", { g: fmtNum(g / servings) })}</span>` : '';
}
export function miniAmount(target, g, servings, id, name) {
  return `<div class="amount mini" data-amount="${esc(target)}">
    <button class="nudge" data-action="nudge" data-target="${esc(target)}" data-delta="-10" aria-label="${esc(L("{n}: 10 gram azalt", { n: name }))}">−10</button>
    <output class="amt-val"><b>${fmtNum(g)}</b> <span class="amount-unit">g</span></output>
    <button class="nudge" data-action="nudge" data-target="${esc(target)}" data-delta="10" aria-label="${esc(L("{n}: 10 gram artır", { n: name }))}">+10</button>
    ${perServing(g, servings)}
    <button class="btn ghost ing-adjust" data-action="ing-open" data-id="${esc(id)}" aria-expanded="false">⚙ ${L("Ayarla")}</button>
  </div>`;
}

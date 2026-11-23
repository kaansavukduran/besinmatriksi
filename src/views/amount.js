// B218: miktar denetimleri (kaydırıcı, ±1/±10, hazır miktarlar, porsiyonlar) ve tarifteki tek satırlık kısa denetim
import { S } from '../state.js';
import { esc, fmtNum, fmtExactAmount } from '../util.js';
import { L, getLanguage } from '../i18n.js';
import { SLIDER_STEPS, gramsToSlider, MAX_GRAMS, kgLabel, amountUnitText as baseAmountUnitText } from '../amount-scale.js';

export const PRESETS = [1, 5, 10, 25, 50, 100, 150, 200, 250, 500, 750, 1000, 2000, 5000, 10000];
export const CORE_PRESETS = [25, 50, 100, 150, 200, 250, 500, 1000];
export const EXTRA_PRESETS = [1, 5, 10, 750, 2000, 5000, 10000];
export const MAX_G = MAX_GRAMS; // B197: 10 kg
export function amountUnitText(g, opts = {}) {
  return baseAmountUnitText(g, { ...opts, format: fmtNum });
}
export function amountControls(target, g, portions = [], { compact = false, liquid = false, density = null, customLiquid = false } = {}) {
  const simple = target === 'ex' || target === 'pk';
  const oz = S.settings.amountUnit === 'oz' && !customLiquid;
  const unit = amountUnitText(g, { oz, density, customLiquid });
  const inputId = `amount-${target}`;
  const exactLabel = customLiquid ? L("Miktar (mL)") : L("Miktar (gram)");
  const presets = compact ? [10, 25, 50, 100, 200, 500, 1000, 2000, 5000] : CORE_PRESETS;
  const extraOpen = !compact && EXTRA_PRESETS.some((p) => Math.abs(p - g) < 0.01);
  const chip = (p) => `<button class="pchip ${Math.abs(p - g) < 0.01 ? 'on' : ''}" data-action="amt" data-target="${esc(target)}" data-val="${p}">${customLiquid ? (p >= 1000 ? `${fmtNum(p / 1000)} L` : `${p} mL`) : kgLabel(p)}</button>`;
  const morePresets = compact ? '' : `<details class="amt-more" ${extraOpen ? 'open' : ''}><summary>${L("Diğer miktarlar (1 g – 10 kg)")}</summary><div class="presets">${EXTRA_PRESETS.map(chip).join('')}</div></details>`;
  const input = `<input id="${esc(inputId)}" type="text" inputmode="decimal" enterkeyhint="done" class="amt-input" data-amtinput="${esc(target)}" value="${fmtExactAmount(g)}" aria-describedby="${esc(inputId)}-error">`;
  const error = `<p id="${esc(inputId)}-error" class="amount-error" role="status" hidden>${L("Miktar 1 ile 10.000 arasında bir sayı olmalı.")}</p>`;
  const readout = `<output class="amt-val" data-amtval="${esc(target)}"><b${simple && !oz ? ' class="sr"' : ''}>${fmtNum(oz ? g / 28.349523125 : g)}</b> <span class="amount-unit">${unit}</span></output>`;
  const nudges = `<div class="amt-main">
      <button class="nudge" data-action="nudge" data-target="${esc(target)}" data-delta="-10" aria-label="${customLiquid ? L("10 mL azalt") : L("10 gram azalt")}">−10</button>
      <button class="nudge" data-action="nudge" data-target="${esc(target)}" data-delta="-1" aria-label="${customLiquid ? L("1 mL azalt") : L("1 gram azalt")}">−1</button>
      ${simple ? '' : readout}
      <button class="nudge" data-action="nudge" data-target="${esc(target)}" data-delta="1" aria-label="${customLiquid ? L("1 mL artır") : L("1 gram artır")}">+1</button>
      <button class="nudge" data-action="nudge" data-target="${esc(target)}" data-delta="10" aria-label="${customLiquid ? L("10 mL artır") : L("10 gram artır")}">+10</button>
      ${simple ? '' : `<label class="amt-exact" for="${esc(inputId)}"><span class="sr">${exactLabel}</span>${input}</label>`}
    </div>`;
  const extra = `<input type="range" class="slider" min="0" max="${SLIDER_STEPS}" step="1" value="${gramsToSlider(g, MAX_G)}" style="--fill:${gramsToSlider(g, MAX_G) / SLIDER_STEPS * 100}%" data-slider="${esc(target)}" aria-valuetext="${fmtNum(g)} ${customLiquid ? 'mL' : 'g'}" aria-label="${exactLabel}">
    ${compact ? '' : `<div class="slider-scale" aria-hidden="true">${[[1, customLiquid ? '1 mL' : '1 g'], [100, '100'], [1000, customLiquid ? '1 L' : '1 kg'], [MAX_G, customLiquid ? '10 L' : '10 kg']].map(([v, t]) => `<span style="left:${gramsToSlider(v, MAX_G) / SLIDER_STEPS * 100}%">${t}</span>`).join('')}</div>`}
    <div class="presets">${presets.map(chip).join('')}</div>
    ${morePresets}
    ${portions.length ? `<div class="portions">${portions.map((p) => `<button class="pchip por ${Math.abs(p.g - g) < 0.01 ? 'on' : ''}" data-action="amt" data-target="${esc(target)}" data-val="${p.g}" title="${esc(p.r ? L("Tarif porsiyonu; ölçüm değil") : p.d ? L("USDA “{u}” ölçüsünden hacimle hesaplandı; yaklaşık", { u: p.src }) : p.en + ' (USDA)')}">${esc(getLanguage() === 'en' && p.en ? p.en : p.label)} · ${p.d ? '≈ ' : ''}${fmtNum(p.g)} ${customLiquid ? 'mL' : 'g'}</button>`).join('')}</div>` : ''}`;
  return `<div class="amount ${compact ? 'compact' : ''}${simple ? ' amount-simple' : ''}" data-amount="${esc(target)}" data-density="${density?.gPerMl || ''}" data-custom-liquid="${customLiquid ? '1' : ''}">
    ${simple ? `<div class="amount-primary"><label for="${esc(inputId)}">${exactLabel}</label><div>${input}${readout}</div>${error}</div>
      <details class="amount-options" data-ux-details="${target}-amount" ${S.uxDetails[`${target}-amount`] ? 'open' : ''}><summary>${L("Diğer miktarlar")}</summary>${nudges}${extra}</details>` : `${nudges}${error}${extra}`}
  </div>`;
}
// Tarif malzemesi kapalıyken tek satır: −10 · gram · +10 · porsiyon başı · Ayarla
export function perServing(g, servings) {
  return servings > 1 ? `<span class="per-serv" data-perserv="${servings}">${L("porsiyon başı {g} g", { g: fmtNum(g / servings) })}</span>` : '';
}
export function miniAmount(target, g, servings, id, name, { customLiquid = false } = {}) {
  return `<div class="amount mini" data-amount="${esc(target)}" data-custom-liquid="${customLiquid ? '1' : '0'}">
    <button class="nudge" data-action="nudge" data-target="${esc(target)}" data-delta="-10" aria-label="${esc(name + ": " + (customLiquid ? L("10 mL azalt") : L("10 gram azalt")))}">−10</button>
    <output class="amt-val"><b>${fmtNum(g)}</b> <span class="amount-unit">${customLiquid ? 'mL' : 'g'}</span></output>
    <button class="nudge" data-action="nudge" data-target="${esc(target)}" data-delta="10" aria-label="${esc(name + ": " + (customLiquid ? L("10 mL artır") : L("10 gram artır")))}">+10</button>
    ${perServing(g, servings)}
    <button class="btn ghost ing-adjust" data-action="ing-open" data-id="${esc(id)}" aria-expanded="false">⚙ ${L("Ayarla")}</button>
  </div>`;
}

import { t } from './i18n.js';
import { fmtNum } from './util.js';
export function settingSlider(key, value, min, max, step, unit = '', presets = []) {
  if (key === 'lineHeight') step = .05;
  if (key === 'wordSpacing') step = .01;
  if (key === 'fontSize') step = .5;
  const name = t(key);
  return `<div class="setting-slider"><label for="range-${key}">${name}: <output data-setting-output="${key}">${fmtNum(value)}${unit}</output></label>
    <input id="range-${key}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" data-setting-range="${key}" aria-label="${name}">
    <div class="setting-number"><input type="number" min="${min}" max="${max}" step="${step}" value="${value}" data-setting-number="${key}" aria-label="${name} (${unit || 'value'})"><span>${unit}</span><button class="btn" data-action="setting-reset" data-key="${key}">${t('reset')}</button></div>
    ${presets.length ? `<div class="presets">${presets.map(n => `<button class="pchip ${n === value ? 'on' : ''}" data-action="set" data-k="${key}" data-v="${n}">${n}%</button>`).join('')}</div>` : ''}</div>`;
}
export function renderAppearance(s) {
  return `<section class="card appearance-controls"><h2>${t('appearance')}</h2><p class="hint">${t('deviceOnly')}</p>
    ${settingSlider('uiScale', s.uiScale, 80, 200, 5, '%', [80, 100, 125, 150, 175, 200])}<p class="hint">${t('scaleHint')}</p>
    <button class="btn" data-action="set" data-k="theme" data-v='"system"'>${t('systemTheme')}</button>
    <label class="toggle"><input type="checkbox" data-setbool="progressEnabled" ${s.progressEnabled ? 'checked' : ''}><span class="sw" aria-hidden="true"></span><span>${t('progressEnabled')}</span></label>
    <label class="toggle"><input type="checkbox" data-setbool="progressAnimations" ${s.progressAnimations ? 'checked' : ''}><span class="sw" aria-hidden="true"></span><span>${t('progressAnimations')}</span></label><p class="hint">${t('progressHint')}</p>
  </section>`;
}

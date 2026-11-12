import { NUTRIENTS, SECTIONS } from './nutrients.js';
import { EN_NUTRIENTS } from './i18n-nutrients.js';
import { t, getLanguage, locale, L } from './i18n.js';
import { esc, fmtNum, fmtAmount } from './util.js';
import { PROFILE_RANGES, bodyMetrics, energyEstimate, dayResult, nutrientComparison, weekSeries, localDay, shiftDay } from './personal.js';
import { recipeContributions } from './recipe-sources.js';
import { basicCard, macroPie } from './matrix.js';
const label = n => getLanguage() === 'en' ? EN_NUTRIENTS[n.key] : n.label;
const amount = (value, unit) => { if (value == null) return t('unknown'); const a = fmtAmount(value, unit); return `${a.n} ${esc(a.u)}`; };
const dateText = day => new Intl.DateTimeFormat(locale(), { dateStyle: 'long' }).format(new Date(day + 'T12:00:00'));
const foodName = item => getLanguage() === 'en' && item.food?.en ? item.food.en : item.name;
export function renderEnergy(profile, preview = false) {
  let energy, metrics;
  try { energy = energyEstimate(profile); metrics = bodyMetrics(profile); } catch { return `<p role="status">${t('profile.invalid')}</p>`; }
  const hint = profile.energySource === 'device' ? 'deviceEstimateHint' : 'estimateHint';
  return `<p class="hint">${t(preview ? 'unsaved' : hint)}</p>
    ${energy.status === 'ready' ? `<div class="nutrition-label"><div><span>${t('resting')}</span><b>${fmtNum(energy.resting)} kcal</b></div><div><span>${t('dailyEnergy')}</span><b>${fmtNum(energy.daily)} kcal</b><small>PAL ${fmtNum(energy.activity)}</small></div></div>` : `<p>${t(energy.status)}</p>`}
    <div class="personal-metrics">${['bmi', 'fatKg', 'leanKg'].map(k => `<span>${t(k)}: <b>${metrics[k] == null ? t('unknown') : fmtNum(metrics[k])}</b></span>`).join('')}</div>
    ${preview ? `<p class="hint">${t(hint)}</p>` : ''}`;
}
function profileForm(profile) {
  const numeric = key => { const [min, max] = PROFILE_RANGES[key]; return `<label class="field"><span>${t(key)}</span><input type="number" min="${min}" max="${max}" step="${['age', 'metabolicAge'].includes(key) ? 1 : 'any'}" data-personal-field="${key}" value="${profile[key] ?? ''}" inputmode="decimal"><small>${min}–${max}</small></label>`; };
  const options = (key, values) => `<label class="field"><span>${t(key)}</span><select data-personal-field="${key}">${values.map(([v, keyLabel]) => `<option value="${v}" ${String(profile[key] ?? '') === String(v) ? 'selected' : ''}>${t(keyLabel)}</option>`).join('')}</select></label>`;
  return `<section class="card personal-profile"><h2>${t('profileTitle')}</h2>
    <div class="cu-grid">${['age', 'height', 'weight'].map(numeric).join('')}${options('sex', [['unspecified', 'unspecified'], ['male', 'male'], ['female', 'female']])}${options('activity', [['', 'unspecified'], ['1.4', 'pal14'], ['1.6', 'pal16'], ['1.8', 'pal18'], ['2', 'pal20']])}</div>
    <details><summary>${t('tanita')}</summary><p class="hint">${t('deviceHint')}</p><div class="cu-grid">${['bodyFat', 'waterPct', 'muscleKg', 'boneKg', 'visceralLevel', 'metabolicAge', 'deviceRmr'].map(numeric).join('')}<label class="field"><span>${t('measuredOn')}</span><input type="date" data-personal-field="measuredOn" value="${profile.measuredOn}"></label></div><label class="field"><span>${t('note')}</span><textarea data-personal-field="note" maxlength="1000">${esc(profile.note)}</textarea></label></details>
    ${options('energySource', [['equation', 'equation'], ['device', 'device']])}
    <label class="toggle"><input type="checkbox" data-personal-field="specialContext" ${profile.specialContext ? 'checked' : ''}><span class="sw" aria-hidden="true"></span><span>${t('specialContext')}</span></label>
    <div id="personal-preview">${renderEnergy(profile, true)}</div>
    <div class="presets"><button class="btn primary" data-action="personal-save">${t('saveProfile')}</button><button class="btn" data-action="personal-clear">${t('clearProfile')}</button><button class="btn" data-action="personal-efsa">${t('applyEfsa')}</button></div><p class="hint">${t('efsaHint')}</p>
    <p id="personal-save-status" role="status"></p>
  </section>`;
}
export function renderDaySources(entries, resolve, key) {
  const n = NUTRIENTS.find(n => n.key === key);
  const rows = recipeContributions({ items: entries }, resolve, key);
  return `<p class="hint">${t('sourceHint')}</p><ul class="source-ingredients">${rows.map((row, i) => {
    const item = resolve(entries[i].ref);
    const code = row.source === 'u' ? 'USDA SR28 (2015)' : row.source === 'k' ? (getLanguage() === 'en' ? 'User label' : 'Kullanıcı etiketi') : row.source === 'd' ? (getLanguage() === 'en' ? 'Calculated' : 'Hesap') : '';
    return `<li><b>${item ? esc(foodName(item)) : t('missingRecord')}</b> · ${fmtNum(row.grams)} g · ${amount(row.value, n.unit)}<p>${esc(code)} ${row.usda && row.value != null ? `NDB ${esc(row.usda.ndb)} · ${esc(row.usda.desc)}` : ''}</p>${row.inputs.length ? `<ul>${row.inputs.map(input => { const nn = NUTRIENTS.find(n => n.key === input.key); return `<li>${esc(label(nn))}: ${amount(input.value, nn.unit)}</li>`; }).join('')}</ul>` : ''}</li>`;
  }).join('')}</ul>`;
}
function renderNutrients(result, settings, energyTarget) {
  return `<h2>${t('nutrientTitle')}</h2><p class="hint">${t('compareHint')}</p>${SECTIONS.map(sec => {
    const ns = NUTRIENTS.filter(n => n.section === sec.id);
    return `<details class="personal-section" ${['enerji', 'protein', 'mineral'].includes(sec.id) ? 'open' : ''}><summary>${t('sec_' + sec.id)}</summary><div class="personal-table-scroll" tabindex="0" role="region" aria-label="${t('sec_' + sec.id)}"><table class="personal-table"><thead><tr><th>${t('nutrient')}</th><th>${t('amount')}</th><th>${t('reference')}</th><th>${t('difference')}</th></tr></thead><tbody>${ns.map(n => {
      const c = nutrientComparison(n, result, settings, energyTarget), ref = c.reference;
      return `<tr data-daily-nutrient="${n.key}"><th scope="row">${esc(label(n))}</th><td>${amount(c.value, n.unit)}<small>${t('coverage', { known: result.cov[n.key] || 0, total: result.n })}${!c.complete && c.value != null ? ' · ' + t('partial') : ''}</small></td><td>${ref.value == null ? t('noReference') : `${amount(ref.value, n.unit)} · ${ref.personalKind ? t(ref.personalKind === 'manual' ? 'energyRefManual' : 'energyRefEstimate') : esc(ref.type || t(settings.referenceMode === 'custom' ? 'refManual' : 'refEU'))}`}</td><td>${c.difference == null ? '—' : `${c.difference > 0 ? '+' : ''}${amount(c.difference, n.unit)}<small>${t(c.difference > 0 ? 'above' : c.difference < 0 ? 'below' : 'equal')}</small>`}</td></tr>`;
    }).join('')}</tbody></table></div></details>`;
  }).join('')}`;
}
// Son 7 gün enerji: kayıtsız gün çubuksuz "—", kısmi kapsam "≥" ve açık renkli; çubuğa dokununca o gün açılır
export function renderWeek(state, day, resolve, consumedOnly) {
  // Seçili gün son 7 gün içindeyse pencere bugünde biter (çubuğa dokununca grafik kaymaz)
  const today = localDay(), end = day <= today && day > shiftDay(today, -7) ? today : day;
  const s = weekSeries(state, end, resolve, 'energy', consumedOnly);
  if (!s.some((x) => x.n)) return '';
  const max = Math.max(1, ...s.map((x) => x.v ?? 0));
  const wd = new Intl.DateTimeFormat(locale(), { weekday: 'short' });
  return `<div class="week" role="group" aria-label="${L("Son 7 gün enerji")}"><p class="hint">${L("Son 7 gün enerji (kcal)")}</p><div class="week-bars">${s.map((x) => {
    const h = x.v == null ? 0 : Math.max(4, (x.v / max) * 100);
    const label = x.v == null ? '—' : `${x.partial ? '≥' : ''}${fmtNum(x.v)}`;
    const name = wd.format(new Date(x.day + 'T12:00:00'));
    return `<button class="wk ${x.day === day ? 'on' : ''} ${x.partial ? 'partial' : ''}" data-action="personal-goto-day" data-day="${x.day}" aria-label="${esc(name + ' ' + x.day + ': ' + (x.v == null ? L("kayıt yok") : label + ' kcal'))}" ${x.day === day ? 'aria-current="date"' : ''}>
      <span class="wk-v">${label}</span><span class="wk-bar"><i style="height:${h.toFixed(1)}%"></i></span><span class="wk-d">${esc(name)}</span></button>`;
  }).join('')}</div>${s.some((x) => x.partial) ? `<p class="hint">${L("≥: bazı kayıtlarda enerji verisi yok; gerçek değer daha yüksek olabilir.")}</p>` : ''}</div>`;
}

export function renderPersonal(state, draft, day, consumedOnly, settings, resolve, sourceKey, sourceOpen, undo, readError) {
  const { entries, result } = dayResult(state, day, resolve, consumedOnly);
  let estimate; try { estimate = energyEstimate(state.profile); } catch { estimate = {}; }
  const manual = settings.referenceMode === 'custom' && settings.targets.energy > 0;
  const target = manual ? settings.targets.energy : estimate.daily;
  const complete = result.n > 0 && result.cov.energy === result.n;
  const difference = complete && target > 0 && result.v.energy != null ? result.v.energy - target : null;
  const done = Object.values(state.milestones).filter(Boolean).length;
  return `<div class="personal"><header><h1>${t('dailyTitle')}</h1><p class="hint">${t('privacy')}</p></header>
    ${readError ? `<p role="alert">${t('corruptPersonal')} <button class="btn" data-action="personal-raw">${t('rawBackup')}</button></p>` : ''}
    ${settings.progressEnabled ? `<section class="card exploration-progress ${settings.progressAnimations ? 'progress-animated' : ''}" aria-label="${t('progressTitle')}"><h2>${t('progressTitle')}</h2><progress value="${done}" max="3" aria-label="${t('progressCount', { done })}"></progress><p>${t('progressCount', { done })}</p><p class="hint">${t('progressHint')}</p></section>` : ''}
    <section class="card"><h2>${t('date')}: ${esc(dateText(day))}</h2><label class="field"><span>${t('date')}</span><input id="personal-day" type="date" value="${day}"></label><div class="presets"><button class="pchip ${!consumedOnly ? 'on' : ''}" data-action="personal-mode" data-mode="plan">${t('plan')}</button><button class="pchip ${consumedOnly ? 'on' : ''}" data-action="personal-mode" data-mode="consumed">${t('consumed')}</button><button class="btn primary" data-action="tab" data-tab="kesfet">${t('browseFood')}</button></div>
    ${entries.length ? basicCard(result, settings, L("Günün temel besin değerleri"), { goals: true, energyTarget: target, persona: { sex: ['female', 'male'].includes(state.profile?.sex) ? state.profile.sex : null } }) : ''}
    ${entries.length ? macroPie(result, settings) : ''}
    <p>${t('loggedEnergy')}: <b>${amount(result.v.energy, 'kcal')}</b> · ${t('coverage', { known: result.cov.energy || 0, total: result.n })}</p><p>${t('dailyEnergy')}: <b>${target == null ? t('unknown') : amount(target, 'kcal')}</b> · ${t('energyGap')}: <b>${difference == null ? t(target == null ? 'noReference' : 'partial') : (difference > 0 ? '+' : '') + amount(difference, 'kcal')}</b></p><p class="hint">${t(manual ? 'manualEnergyHint' : state.profile.energySource === 'device' ? 'deviceEstimateHint' : 'estimateHint')}</p>
    ${entries.length ? `<ul class="source-ingredients">${entries.map(entry => { const item = resolve(entry.ref); return `<li><b>${item ? esc(foodName(item)) : t('missingRecord')}</b> · ${fmtNum(entry.g)} g<div class="presets"><button class="btn" data-action="personal-consumed" data-id="${entry.id}" aria-pressed="${entry.consumed}">${t(entry.consumed ? 'markPlanned' : 'markConsumed')}</button><button class="btn" data-action="personal-remove" data-id="${entry.id}">${t('remove')}</button></div></li>`; }).join('')}</ul>` : `<p>${t('emptyDay')}</p>`}
    ${renderWeek(state, day, resolve, consumedOnly)}
    ${entries.length ? `<button class="btn" data-action="personal-to-recipe">🥣 ${L("Bu günü tarif olarak kaydet")}</button>` : ''}
    ${undo ? `<button class="btn" data-action="personal-undo">${t('undo')}</button>` : ''}
    <details class="personal-sources" ${sourceOpen ? 'open' : ''}><summary>${t('source')}</summary><label class="field"><span>${t('nutrient')}</span><select id="personal-source-key">${NUTRIENTS.map(n => `<option value="${n.key}" ${n.key === sourceKey ? 'selected' : ''}>${esc(label(n))}</option>`).join('')}</select></label><div id="personal-sources-content">${renderDaySources(entries, resolve, sourceKey)}</div></details>
    ${renderNutrients(result, settings, target > 0 ? { value: target, kind: manual ? 'manual' : 'estimate' } : null)}
    </section>
    ${profileForm(draft)}
    <section class="card"><div class="presets"><button class="btn" data-action="personal-export">${t('exportPersonal')}</button><button class="btn" data-action="open-file" data-id="personal-file">${t('importPersonal')}</button><input type="file" accept="application/json,.json" id="personal-file" hidden></div><p class="hint">${t('privacy')}</p></section>
  </div>`;
}

// B217: Günlük "Geçmiş" bölümü: Son 7 gün · Son 30 gün · Takvim. Özet kutucukları, en sık yenenler, renk yoğunluklu ay takvimi.
// Boş gün = kayıt yok (çubuk/renk yok, 0 yazılmaz); eksik ölçümlü gün "≥" (alt sınır).
import { L, locale } from './i18n.js';
import { esc, fmtNum } from './util.js';
import { localDay, shiftDay } from './personal.js';
import { rangeSummary, summarize, daySummary, monthGrid, shiftMonth, loggingStreak, periodDelta, HISTORY_KEYS, WEEK_KEYS } from './history.js';

const MODES = [['7', "Son 7 gün"], ['30', "Son 30 gün"], ['month', "Takvim"]];

function tiles(sum, key, delta = {}, deltaLabel = '', streak = 0) {
  const unitOf = Object.fromEntries(HISTORY_KEYS);
  const tile = (k, title) => {
    const a = sum.avg[k], d = delta[k];
    const val = a.value == null ? `<b class="ht-none">${L("veri yok")}</b>` : `<b>${a.partial ? '≥' : ''}${fmtNum(a.value)}</b> <span class="unit">${unitOf[k]}${L("/gün")}</span>`;
    // B222: önceki döneme göre fark; yargısız (iyi/kötü rengi yok), yön oku + sayı
    const diff = d && Math.abs(d.value) >= (k === 'energy' ? 1 : 0.1) ? `<small class="ht-d">${d.value > 0 ? '▲' : '▼'} ${d.partial ? '≈' : ''}${fmtNum(Math.abs(d.value))} ${unitOf[k]} · ${esc(deltaLabel)}</small>` : d ? `<small class="ht-d">= ${esc(deltaLabel)}</small>` : '';
    return `<div class="ht ${k === key ? 'on' : ''}"><span class="ht-l">${title}</span>${val}${diff}</div>`;
  };
  return `<div class="hist-tiles">
    <div class="ht"><span class="ht-l">${L("Kayıtlı gün")}</span><b>${sum.logged}</b> <span class="unit">/ ${sum.total}</span>${streak >= 2 ? `<small class="ht-d ht-streak">🔥 ${L("{n} gündür kesintisiz", { n: streak })}</small>` : ''}</div>
    ${tile('energy', L("Ort. enerji"))}${tile('protein', L("Ort. protein"))}${tile('fiber', L("Ort. lif"))}
  </div>`;
}

function topFoods(sum) {
  if (!sum.top.length) return '';
  // B227: "＋ Bugüne": olağan miktarla (kayıt başına ortalama) bugünün planına tek dokunuşla ekler
  return `<div class="hist-top"><h4>${L("En sık yediklerin")}</h4><ol>${sum.top.map((f) => `<li><button class="linkish" data-action="hist-open" data-ref='${esc(JSON.stringify(f.ref))}'>${esc(f.name || L("Kayıt bulunamadı"))}</button><span class="muted">${L("{d} gün · {g} g", { d: f.days, g: fmtNum(f.g) })}</span>${f.name ? `<button class="btn ghost hist-add" data-action="hist-add" data-ref='${esc(JSON.stringify(f.ref))}' data-g="${f.usual}" aria-label="${esc(L("{n}, {g} g bugüne ekle", { n: f.name, g: fmtNum(f.usual) }))}">＋ ${L("Bugüne")} · ${fmtNum(f.usual)} g</button>` : ''}</li>`).join('')}</ol></div>`;
}

function bars(list, day, key, unit, long) {
  const max = Math.max(1, ...list.map((x) => x.v[key] ?? 0));
  const wd = new Intl.DateTimeFormat(locale(), long ? { day: 'numeric' } : { weekday: 'short' });
  const full = new Intl.DateTimeFormat(locale(), { weekday: 'long', day: 'numeric', month: 'long' });
  return `<div class="week-bars ${long ? 'hist-30' : ''}">${list.map((x) => {
    const v = x.v[key], p = x.partial[key];
    const h = v == null ? 0 : Math.max(4, (v / max) * 100);
    const label = v == null ? '—' : `${p ? '≥' : ''}${fmtNum(v)}`;
    const date = new Date(x.day + 'T12:00:00');
    return `<button class="wk ${x.day === day ? 'on' : ''} ${p ? 'partial' : ''}" data-action="personal-goto-day" data-day="${x.day}" aria-label="${esc(full.format(date) + ': ' + (v == null ? (x.n ? L("veri yok") : L("kayıt yok")) : label + ' ' + unit))}" ${x.day === day ? 'aria-current="date"' : ''}>
      <span class="wk-v">${long ? '' : label}</span><span class="wk-bar"><i style="height:${h.toFixed(1)}%"></i></span><span class="wk-d">${esc(wd.format(date))}</span></button>`;
  }).join('')}</div>`;
}

function calendar(state, month, day, key, unit, resolve, consumedOnly) {
  const [y, m] = month.split('-').map(Number);
  const weeks = monthGrid(y, m - 1);
  const today = localDay();
  const cells = weeks.flat().filter(Boolean).map((d) => daySummary(state, d, resolve, consumedOnly));
  const byDay = new Map(cells.map((c) => [c.day, c]));
  const max = Math.max(1, ...cells.map((c) => c.v[key] ?? 0));
  const title = new Intl.DateTimeFormat(locale(), { month: 'long', year: 'numeric' }).format(new Date(y, m - 1, 15));
  const wdays = [...Array(7)].map((_, i) => new Intl.DateTimeFormat(locale(), { weekday: 'short' }).format(new Date(2026, 10, 16 + i, 12))); // 16.11.2026 Pazartesi
  const full = new Intl.DateTimeFormat(locale(), { weekday: 'long', day: 'numeric', month: 'long' });
  const compact = new Intl.NumberFormat(locale(), { notation: 'compact', maximumFractionDigits: 1 });
  const nextDisabled = month >= today.slice(0, 7);
  const grid = weeks.map((w) => w.map((d) => {
    if (!d) return '<span class="cal-cell out" aria-hidden="true"></span>';
    const c = byDay.get(d), v = c.v[key], future = d > today;
    const i = v == null ? 0 : Math.max(0.12, v / max);
    // Hücre dar: 1000 ve üstü kısa yazılır (1,9 B / 1.9K); tam değer aria etiketinde
    const label = v == null ? (c.n ? L("veri yok") : '') : `${c.partial[key] ? '≥' : ''}${v >= 1000 ? compact.format(v) : fmtNum(v)}`;
    const fullVal = v == null ? '' : `${c.partial[key] ? '≥' : ''}${fmtNum(v)}`;
    const aria = full.format(new Date(d + 'T12:00:00')) + ': ' + (c.n ? (v == null ? L("veri yok") : fullVal + ' ' + unit) + ` · ${L("{n} besin kaydı", { n: c.n })}` : L("kayıt yok"));
    return `<button class="cal-cell ${c.n ? 'has' : ''} ${d === today ? 'today' : ''} ${d === day ? 'on' : ''}" style="--i:${i.toFixed(2)}" data-action="personal-goto-day" data-day="${d}" ${future ? 'disabled' : ''} aria-label="${esc(aria)}" ${d === day ? 'aria-current="date"' : ''}><span class="cal-n">${Number(d.slice(8))}</span><span class="cal-v">${esc(label)}</span></button>`;
  }).join('')).join('');
  return `<div class="cal" role="group" aria-label="${esc(title)}">
    <div class="cal-head"><button class="btn ghost" data-action="hist-month" data-d="-1" aria-label="${L("Önceki ay")}">‹</button><b>${esc(title)}</b><button class="btn ghost" data-action="hist-month" data-d="1" aria-label="${L("Sonraki ay")}" ${nextDisabled ? 'disabled' : ''}>›</button></div>
    <div class="cal-grid">${wdays.map((w) => `<span class="cal-wd" aria-hidden="true">${esc(w)}</span>`).join('')}${grid}</div>
    <p class="hint">${L("Renk koyulaştıkça değer artar; boş gün = kayıt yok. Bir güne dokun, o günü aç.")}</p>
  </div>`;
}

// Görünümdeki aralığın günleri (CSV de aynı aralığı kullanır)
export function historyRange(state, day, resolve, consumedOnly, { mode = '7', month = null } = {}) {
  const today = localDay();
  if (mode === 'month') {
    const [y, m] = (month || day.slice(0, 7)).split('-').map(Number);
    const days = monthGrid(y, m - 1).flat().filter((d) => d && d <= today);
    return summarize(days.map((d) => daySummary(state, d, resolve, consumedOnly)), resolve);
  }
  const n = mode === '30' ? 30 : 7;
  const end = day <= today && day > shiftDay(today, -n) ? today : day; // seçili gün pencerede ise pencere bugünde biter
  return rangeSummary(state, end, n, resolve, consumedOnly);
}

export function renderHistory(state, day, resolve, consumedOnly, { mode = '7', month = null, key = 'energy', displayHeading = true } = {}) {
  const [k, unit, title] = WEEK_KEYS.find((x) => x[0] === key) || WEEK_KEYS[0];
  const today = localDay();
  const modeChips = MODES.map(([m, t]) => `<button class="pchip ${m === mode ? 'on' : ''}" aria-pressed="${m === mode}" data-action="hist-mode" data-mode="${m}">${L(t)}</button>`).join('');
  const keyChips = WEEK_KEYS.map(([kk, , t]) => `<button class="pchip ${kk === k ? 'on' : ''}" aria-pressed="${kk === k}" data-action="week-key" data-key="${kk}">${L(t)}</button>`).join('');
  const sum = historyRange(state, day, resolve, consumedOnly, { mode, month });
  // B222: önceki eşit dönem (7/30 gün ya da önceki ay) ve kayıt serisi
  const prevSum = mode === 'month'
    ? historyRange(state, day, resolve, consumedOnly, { mode, month: shiftMonth(month || day.slice(0, 7), -1) })
    : sum.days.length ? rangeSummary(state, shiftDay(sum.days[0].day, -1), mode === '30' ? 30 : 7, resolve, consumedOnly) : null;
  const delta = prevSum ? periodDelta(sum, prevSum) : {};
  const deltaLabel = mode === 'month' ? L("önceki aya göre") : mode === '30' ? L("önceki 30 güne göre") : L("önceki 7 güne göre");
  const streak = loggingStreak(state.entries, today, consumedOnly);
  const body = mode === 'month' ? calendar(state, month || day.slice(0, 7), day, k, unit, resolve, consumedOnly) : sum.logged ? bars(sum.days, day, k, unit, mode === '30') : '';
  const empty = !sum.logged ? `<p class="empty hist-empty">${L("Bu aralıkta kayıt yok. Keşfet'te bir besin seç ve “Günlüğe ekle”ye dokun; günlerin burada birikir.")} <button class="btn" data-action="tab" data-tab="kesfet">${L("Keşfet'e git")}</button></p>` : '';
  return `<section class="history" aria-labelledby="hist-h" data-hist-mode="${mode}">
    <div class="hist-head"><h3 id="hist-h"${displayHeading ? '' : ' class="sr"'}>${L("Geçmiş")}</h3><div class="presets" role="group" aria-label="${L("Aralık")}">${modeChips}</div></div>
    <div class="week" data-week-key="${k}"><div class="week-head"><p class="hint">${esc(L("Grafikte: {n} ({u})", { n: L(title).toLocaleLowerCase(locale()), u: unit }))}</p><div class="presets week-keys" role="group" aria-label="${L("Grafikte gösterilecek değer")}">${keyChips}</div></div>
    ${body}</div>
    ${empty}${sum.logged ? tiles(sum, k, delta, deltaLabel, streak) + `<p class="hint">${L("Ortalama yalnız kayıt olan günlerden; boş günler 0 sayılmaz. ≥: bazı kayıtlarda ölçüm yok, gerçek değer daha yüksek olabilir.")}</p>` + topFoods(sum) + `<p class="hist-export"><button class="btn ghost" data-action="hist-csv">⬇ ${L("Bu aralığı tablo (CSV) olarak indir")}</button></p>` : ''}
  </section>`;
}

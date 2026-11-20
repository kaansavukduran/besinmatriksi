// B230: Günlük (kişisel kayıt) ve Geçmiş eylemleri app.js'teki büyük tıklama yöneticisinden ayrıldı.
// app.js'e bağımlı yardımcılar (render, kalıcı kayıt, iletişim kutusu, besin seçme, ayar yazma) bindDayActions ile verilir; döngüsel içe aktarma yok.
import { S } from '../state.js';
import { L, t as tr } from '../i18n.js';
import { resolve, customFoods } from '../data.js';
import { newRecipe } from '../store.js';
import { uid, clamp, fmtNum, download } from '../util.js';
import { normalizeCustom } from '../records.js';
import { recipeToEntries, dayToRecipeItems, copyDayEntries, emptyProfile, normalizeProfile, localDay, validDay, PERSONAL_KEY } from '../personal.js';
import { aionPlay } from '../aion.js';
import { shiftMonth, historyCSV } from '../history.js';
import { historyRange } from '../history-view.js';
import { MAX_G } from '../views/amount.js';
import { toast, activeRecipe, persistRecipes } from '../views/ui.js';

let render = () => {}, persistPersonal = () => false, uiDialog = async () => null, selectFood = () => {}, setSetting = () => {};
const $ = (sel) => document.querySelector(sel);

export function bindDayActions(deps) {
  ({ render, persistPersonal, uiDialog, selectFood, setSetting } = deps);
}

export const DAY_ACTIONS = {
  'personal-goto-day': async (b) => { if (validDay(b.dataset.day)) { const fromCal = !!b.closest('.cal'); S.personalDay = b.dataset.day; S.personalDayAuto = b.dataset.day === localDay(); render(); if (fromCal) { const h = document.querySelector('#personal-day'); h?.closest('.card')?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); h?.focus({ preventScroll: true }); } } return; },
  'personal-to-recipe': async (b) => {
      const { items, capped } = dayToRecipeItems(S.personal.entries, S.personalDay, { consumedOnly: S.consumedOnly, maxG: MAX_G });
      if (!items.length) return;
      const r = newRecipe(L("Günlük {d}", { d: S.personalDay })); r.items = items;
      S.recipeDaily = false; S.recipes.push(r); S.activeRecipe = r.id; persistRecipes(); S.tab = 'tarif'; render();
      toast(L("{n} malzemeli tarif oluşturuldu", { n: items.length }) + (capped ? ' · ' + L("{n} besin 1 kg sınırında kesildi", { n: capped }) : ''));
      aionPlay('celebrate'); return;
    },
  'rc-to-day': async (b) => {
      const rc = activeRecipe(); if (!rc.items.length) return;
      const ans = await uiDialog(L("“{r}” tarifinden kaç porsiyon? (Tarif {s} porsiyon; ölçü bugünün günlüğüne malzeme malzeme eklenir.)", { r: rc.name, s: rc.servings }), { input: '1', line: true, ok: L("Günlüğe ekle"), cancel: L("Vazgeç") });
      if (ans == null) return;
      const portions = Number(String(ans).replace(',', '.'));
      if (!(portions > 0 && portions <= 50)) { toast(L("Porsiyon 0'dan büyük ve en fazla 50 olmalı.")); return; }
      const day = localDay();
      const { entries, skipped } = recipeToEntries(rc.items, portions, rc.servings, day, (ref) => !!resolve(ref));
      if (!entries.length) { toast(L("Eklenecek malzeme yok.")); return; }
      S.personal.entries.push(...entries); S.personal.milestones.food = true; if (!persistPersonal()) return;
      toast(L("{n} kayıt bugünün günlüğüne eklendi", { n: entries.length }) + (skipped ? ' · ' + L("{n} malzeme atlandı (bulunamadı veya 1 g altı)", { n: skipped }) : ''));
      aionPlay('celebrate'); return;
    },
  'ex-add-day': async (b) => {
      if (!S.sel || !resolve(S.sel)) return;
      if (S.personalDayAuto) S.personalDay = localDay(); // uygulama gece yarısını açık geçirdiyse bugüne yaz
      S.personal.entries.push({ id: uid(), day: S.personalDay, ref: { ...S.sel }, g: S.amount, consumed: false });
      S.personal.milestones.food = true; if (!persistPersonal()) return; toast(tr('dayAdded')); aionPlay('celebrate'); return;
    },
  'personal-save': async (b) => {
      if ([...document.querySelectorAll('[data-personal-field]')].some(el => !el.checkValidity())) { toast(tr('profile.invalid')); return; }
      try {
        S.personal.profile = normalizeProfile(S.personalDraft);
        if (S.personal.profile.age && S.personal.profile.height && S.personal.profile.weight && S.personal.profile.sex !== 'unspecified') S.personal.milestones.profile = true;
        const saved = persistPersonal(); render(); if (saved) $('#personal-save-status').textContent = tr('saved');
      } catch { toast(tr('profile.invalid')); }
      return;
    },
  'personal-clear': async (b) => {
      if (!await uiDialog(tr('confirmClear'), { ok: tr('clearProfile'), cancel: tr('cancel') })) return;
      S.personalUndo = { type: 'profile', profile: structuredClone(S.personal.profile) };
      S.personal.profile = emptyProfile(); S.personalDraft = emptyProfile(); persistPersonal(); render(); return;
    },
  'personal-mode': async (b) => { S.consumedOnly = b.dataset.mode === 'consumed'; render(); return; },
  'personal-consumed': async (b) => { const entry = S.personal.entries.find(e => e.id === b.dataset.id); if (entry) entry.consumed = !entry.consumed; persistPersonal(); render(); return; },
  'personal-remove': async (b) => { const entry = S.personal.entries.find(e => e.id === b.dataset.id); if (entry) { S.personalUndo = { type: 'entry', entry: { ...entry } }; S.personal.entries = S.personal.entries.filter(e => e.id !== entry.id); persistPersonal(); render(); } return; },
  // B220: geçmiş bir günü bugüne kopyala (planlandı olarak); geri alınabilir
  'personal-copy-day': async (b) => {
      const today = localDay(), copied = copyDayEntries(S.personal.entries, S.personalDay, today, { consumedOnly: S.consumedOnly });
      if (!copied.length) return;
      S.personal.entries.push(...copied); S.personalUndo = { type: 'copy', ids: copied.map((e) => e.id) };
      if (!persistPersonal()) return;
      S.personalDay = today; S.personalDayAuto = true; render(); window.scrollTo(0, 0);
      toast(L("{n} kayıt bugüne plan olarak eklendi; yedikçe “Tüketildi” diye işaretle.", { n: copied.length })); return;
    },
  'personal-undo': async (b) => {
      const undo = S.personalUndo;
      if (undo?.type === 'entry' && !S.personal.entries.some(e => e.id === undo.entry.id)) S.personal.entries.push(undo.entry);
      if (undo?.type === 'profile') { S.personal.profile = undo.profile; S.personalDraft = structuredClone(undo.profile); }
      if (undo?.type === 'copy') { const ids = new Set(undo.ids); S.personal.entries = S.personal.entries.filter((e) => !ids.has(e.id)); }
      S.personalUndo = null; persistPersonal(); render(); return;
    },
  'personal-efsa': async (b) => {
      const p = S.personal.profile;
      if (!(p.age >= 1 && p.age <= 99) || !['male', 'female'].includes(p.sex)) { toast(tr('saveProfileFirst')); return; }
      setSetting('referenceMode', 'efsa'); setSetting('efsaAge', p.age); setSetting('efsaSex', p.sex); setSetting('efsaPhytate', ''); setSetting('efsaIronGroup', 'unspecified'); render(); return;
    },
  'personal-export': async (b) => {
      const refs = new Set(S.personal.entries.filter(e => e.ref.t === 'u').map(e => e.ref.id));
      download('besin-matriksi-personal.json', JSON.stringify({ app: 'besin-matriksi-personal', version: 1, personal: S.personal, custom: customFoods().filter(f => refs.has(f.id)).map(normalizeCustom) }, null, 2)); return;
    },
  'personal-raw': async (b) => { try { download('besin-matriksi-personal-raw.txt', localStorage.getItem(PERSONAL_KEY) || '', 'text/plain'); } catch { await uiDialog(tr('storageError'), { ok: tr('ok') }); } return; },
  'hist-mode': async (b) => { S.hist = { ...(S.hist || {}), mode: b.dataset.mode }; render(); document.querySelector(`[data-action="hist-mode"][data-mode="${b.dataset.mode}"]`)?.focus(); return; },
  'hist-month': async (b) => { S.hist ||= {}; const cur = S.hist.month || S.personalDay.slice(0, 7); const next = shiftMonth(cur, Number(b.dataset.d)); if (next <= localDay().slice(0, 7)) S.hist.month = next; render(); document.querySelector(`[data-action="hist-month"][data-d="${b.dataset.d}"]`)?.focus(); return; },
  'hist-csv': async (b) => {
      const h = S.hist || {}, sum = historyRange(S.personal, S.personalDay, resolve, S.consumedOnly, h);
      const first = sum.days[0]?.day, last = sum.days.at(-1)?.day;
      download(`besin-gecmisi-${first}_${last}.csv`, historyCSV(sum.days, resolve, { date: L("Tarih"), entries: L("Kayıt"), energy: L("Enerji (kcal)"), protein: L("Protein (g)"), fiber: L("Lif (g)"), partial: L("Eksik ölçüm (≥)"), foods: L("Besinler") }), 'text/csv;charset=utf-8');
      return;
    },
  'hist-add': async (b) => {
      const ref = JSON.parse(b.dataset.ref), g = clamp(Number(b.dataset.g) || 100, 1, MAX_G), today = localDay();
      S.personal.entries.push({ id: uid(), day: today, ref, g, consumed: false });
      S.personalUndo = { type: 'copy', ids: [S.personal.entries.at(-1).id] };
      if (!persistPersonal()) return;
      toast(L("{n} ({g} g) bugüne plan olarak eklendi.", { n: resolve(ref)?.name || '', g: fmtNum(g) })); render(); return;
    },
  'hist-open': async (b) => { const ref = JSON.parse(b.dataset.ref); S.tab = 'kesfet'; selectFood('ex', ref); window.scrollTo(0, 0); return; },
  'week-key': async (b) => { S.weekKey = b.dataset.key; render(); document.querySelector(`[data-action="week-key"][data-key="${b.dataset.key}"]`)?.focus(); return; },
};

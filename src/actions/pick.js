// B236: malzeme/kıyas seçicisi (pk-) ve Kıyasla (cmp-) tıklama eylemleri app.js'ten ayrıldı.
// render, besin seçme, tarife/kıyasa ekleme bindPickActions ile verilir; modül app.js'ten içe aktarmaz.
import { S } from '../state.js';
import { addDiaryFood } from './day.js';
import { L, t } from '../i18n.js';
import { localDay } from '../personal.js';
import { resolve } from '../data.js';

let render = () => {}, selectFood = () => {}, addToRecipe = () => false, addToCompare = () => false;
const $ = (sel) => document.querySelector(sel);

export function bindPickActions(deps) {
  ({ render, selectFood, addToRecipe, addToCompare } = deps);
}

// Seçicide "Ekle" (kapat) ve "Ekle, devam et" (seçici açık kalır); tarife ekleme kaydedilemezse seçim korunur
function confirmPick(more) {
  const P = S.picker;
  if (!P?.sel || !resolve(P.sel)) return;
  if (P.target === 'day' && !addDiaryFood(P.sel, P.amount, P.day)) {
    P.error = t(S.personalReadError ? 'corruptPersonal' : 'storageError');
    render();
    return;
  }
  if (P.target === 'recipe' && !addToRecipe(P.sel, P.amount)) {
    P.error = L("Kaydedilemedi: cihaz depolaması kullanılamıyor");
    render();
    return;
  }
  if (P.target === 'compare' && !addToCompare(P.sel, P.amount)) return;
  if (P.target === 'day') {
    S.personalDay = P.day;
    S.personalDayAuto = P.day === localDay();
    S.consumedOnly = false;
  }
  if (more) {
    P.notice = L("{n} tarife eklendi.", { n: resolve(P.sel).name });
    P.sel = null; P.q = ''; P.extPage = 0;
  } else S.picker = null;
  render();
  if (more) $('#pq')?.focus();
}

export const PICK_ACTIONS = {
  'pk-full-search': async (b) => { S.picker.cat = 'ext'; S.picker.extGroup = null; S.picker.extPage = 0; render(); return; },
  'pk-extpage': async (b) => { S.picker.extPage = Math.max(0, Number(b.dataset.page) || 0); render(); $('.pk-list .catalog-heading h2')?.focus(); $('.pk-list .catalog-heading')?.scrollIntoView({ block: 'start' }); return; },
  'pk-pick-ref': async (b) => { selectFood('pk', JSON.parse(b.dataset.ref)); return; },
  'pk-pick-custom': async (b) => { selectFood('pk', { t: 'u', id: b.dataset.cid }); return; },
  'cmp-add': async (b) => { S.picker = { target: 'compare', cat: null, q: '', sel: null, amount: S.settings.defaultAmount }; render(); return; },
  'cmp-del': async (b) => { S.compare.splice(+b.dataset.i, 1); [...S.ingOpen].filter((k) => k.startsWith('cmp:')).forEach((k) => S.ingOpen.delete(k)); render(); return; },
  'cmp-sec': async (b) => { S.cmpSection = b.dataset.s; render(); return; },
  'cmp-same': async (b) => { S.compare.forEach((c) => (c.g = Number(b.dataset.g))); render(); return; },
  'pk-close': async (b) => { S.picker = null; render(); return; },
  'pk-clear': async () => {
    if (!S.picker) return;
    S.picker.q = ''; S.picker.extPage = 0;
    const input = $('#pq');
    if (input) input.value = '';
    render(); input?.focus();
  },
  'pk-cats-toggle': async () => { if (S.picker) { S.picker.catsOpen = !S.picker.catsOpen; render(); } return; },
  'pk-cat': async (b) => { S.picker.cat = b.dataset.cat || null; S.picker.extGroup = null; S.picker.extPage = 0; S.picker.catsOpen = false; render(); $('[data-action="pk-cats-toggle"]')?.focus(); },
  'pk-extgroup': async (b) => { S.picker.extGroup = S.picker.extGroup === b.dataset.g ? null : b.dataset.g; render(); return; },
  'pk-pick': async (b) => { selectFood('pk', { t: 'c', id: b.dataset.id, f: 0 }); return; },
  'pk-pick-ext': async (b) => { selectFood('pk', { t: 'x', n: b.dataset.ndb }); return; },
  'pk-form': async (b) => { S.picker.sel = { ...S.picker.sel, f: +b.dataset.f }; render(); return; },
  'pk-back': async () => { S.picker.sel = null; render(); $('#pq')?.focus(); },
  'pk-confirm': async () => confirmPick(false),
  'pk-confirm-more': async () => confirmPick(true),
};

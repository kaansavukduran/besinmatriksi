// B236: malzeme/kıyas seçicisi (pk-) ve Kıyasla (cmp-) tıklama eylemleri app.js'ten ayrıldı.
// render, besin seçme, tarife/kıyasa ekleme bindPickActions ile verilir; modül app.js'ten içe aktarmaz.
import { S } from '../state.js';
import { FOODS } from '../data.js';

let render = () => {}, selectFood = () => {}, addToRecipe = () => false, addToCompare = () => false;
const $ = (sel) => document.querySelector(sel);

export function bindPickActions(deps) {
  ({ render, selectFood, addToRecipe, addToCompare } = deps);
}

// Seçicide "Ekle" (kapat) ve "Ekle, devam et" (seçici açık kalır); tarife ekleme kaydedilemezse seçim korunur
function confirmPick(more) {
  const P = S.picker;
  if (P.target === 'recipe') { if (!addToRecipe(P.sel, P.amount)) return; }
  else addToCompare(P.sel, P.amount);
  if (more) { P.sel = null; } else S.picker = null;
  render();
}

export const PICK_ACTIONS = {
  'pk-full-search': async (b) => { S.picker.cat = 'ext'; S.picker.extGroup = null; S.picker.extPage = 0; render(); return; },
  'pk-extpage': async (b) => { S.picker.extPage = Math.max(0, Number(b.dataset.page) || 0); render(); $('.pk-list .catalog-heading h2')?.focus(); $('.pk-list .catalog-heading')?.scrollIntoView({ block: 'start' }); return; },
  'pk-pick-ref': async (b) => { selectFood('pk', JSON.parse(b.dataset.ref)); return; },
  'pk-pick-custom': async (b) => { selectFood('pk', { t: 'u', id: b.dataset.cid }); return; },
  'cmp-pick': async (b) => {
      const f = FOODS.find((x) => x.id === b.dataset.id); const i = Number(b.dataset.f);
      if (!f || !f.forms[i]) return;
      if (addToCompare({ t: 'c', id: f.id, f: i }, S.settings.defaultAmount || 100)) { S.cmpQ = ''; render(); setTimeout(() => document.getElementById('cmp-q')?.focus(), 0); }
      return;
    },
  'cmp-add': async (b) => { S.picker = { target: 'compare', cat: null, q: '', sel: null, amount: S.settings.defaultAmount }; render(); return; },
  'cmp-del': async (b) => { S.compare.splice(+b.dataset.i, 1); [...S.ingOpen].filter((k) => k.startsWith('cmp:')).forEach((k) => S.ingOpen.delete(k)); render(); return; },
  'cmp-sec': async (b) => { S.cmpSection = b.dataset.s; render(); return; },
  'cmp-same': async (b) => { S.compare.forEach((c) => (c.g = Number(b.dataset.g))); render(); return; },
  'pk-close': async (b) => { S.picker = null; render(); return; },
  'pk-cat': async (b) => { S.picker.cat = b.dataset.cat || null; S.picker.extGroup = null; S.picker.extPage = 0; render(); return; },
  'pk-extgroup': async (b) => { S.picker.extGroup = S.picker.extGroup === b.dataset.g ? null : b.dataset.g; render(); return; },
  'pk-pick': async (b) => { selectFood('pk', { t: 'c', id: b.dataset.id, f: 0 }); return; },
  'pk-pick-ext': async (b) => { selectFood('pk', { t: 'x', n: b.dataset.ndb }); return; },
  'pk-form': async (b) => { S.picker.sel = { ...S.picker.sel, f: +b.dataset.f }; render(); return; },
  'pk-back': async (b) => { S.picker.sel = null; render(); return; },
  'pk-confirm': async () => confirmPick(false),
  'pk-confirm-more': async () => confirmPick(true),
};

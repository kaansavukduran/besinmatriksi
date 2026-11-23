// B239: Keşfet tıklama eylemleri (kategori, katalog sayfası, besin seç, sıralama, son bakılanlar, çoklu seçim, kendi besinin, biçim,
// arama geçmişi, tarife/kıyasa ekleme) app.js'ten ayrıldı. app.js yardımcıları bindExploreActions ile verilir; modül app.js'ten içe aktarmaz.
import { S } from '../state.js';
import { L } from '../i18n.js';
import { customFoods, setCustomFoods } from '../data.js';
import { saveRecent, saveSearches, saveCustom } from '../store.js';
import { aionPlay } from '../aion.js';
import { toast, activeRecipe, persistRecipes } from '../views/ui.js';

let render = () => {}, selectFood = () => {}, addToRecipe = () => false, addToCompare = () => false, uiDialog = async () => null, saveCustomEdit = () => false;
const $ = (sel) => document.querySelector(sel);

export function bindExploreActions(deps) {
  ({ render, selectFood, addToRecipe, addToCompare, uiDialog, saveCustomEdit } = deps);
}

export const EXPLORE_ACTIONS = {
  'ex-home': async () => { S.tab = 'kesfet'; S.sel = null; S.cat = null; S.q = ''; S.extGroup = null; S.extPage = 0; S.catsOpen = undefined; S.browseFilters.ex = false; S.moreNav = false; render(); window.scrollTo(0, 0); },
  'ex-cat': async (b) => {
    S.sel = null; S.cat = b.dataset.cat || null; S.extGroup = null; S.extPage = 0;
    S.catsOpen = S.settings.catGrid;
    render();
    $('.list').scrollTop = 0;
    if (!S.catsOpen) $('.cats-toggle')?.focus({ preventScroll: true });
  },
  'ex-full-search': async (b) => { S.sel = null; S.cat = 'ext'; S.extGroup = null; S.extPage = 0; render(); return; },
  'ex-extpage': async (b) => { S.extPage = Math.max(0, Number(b.dataset.page) || 0); render(); $('#foodlist .catalog-heading h2')?.focus(); $('#foodlist .catalog-heading')?.scrollIntoView({ block: 'start' }); return; },
  'ex-extgroup': async (b) => { S.extGroup = S.extGroup === b.dataset.g ? null : b.dataset.g; render(); return; },
  'ex-pick': async (b) => { selectFood('ex', { t: 'c', id: b.dataset.id, f: 0 }); return; },
  'gap-open': async (b) => { S.tab = 'kesfet'; selectFood('ex', { t: 'c', id: b.dataset.id, f: Number(b.dataset.f) || 0 }); return; },
  'ex-pick-ext': async (b) => { selectFood('ex', { t: 'x', n: b.dataset.ndb }); return; },
  'ex-pick-custom': async (b) => { selectFood('ex', { t: 'u', id: b.dataset.cid }); return; },
  'ex-pick-ref': async (b) => { selectFood('ex', JSON.parse(b.dataset.ref)); return; },
  'sort': async (b) => { S.sort = b.dataset.s; render(); return; },
  'rc-sort': async (b) => { S.rcSort = b.dataset.s; render(); return; },
  'recent-clear': async (b) => { S.recent = []; saveRecent([]); render(); return; },
  'ing-open': async (b) => { const id = b.dataset.id; if (S.ingOpen.has(id)) S.ingOpen.delete(id); else S.ingOpen.add(id); render(); document.querySelector(`[data-action="ing-open"][data-id="${CSS.escape(id)}"]`)?.focus(); return; },
  'multi-toggle': async (b) => { S.multi = !S.multi; S.picked = []; render(); return; },
  'multi-pick': async (b) => { const id = b.dataset.id; S.picked = S.picked.includes(id) ? S.picked.filter((x) => x !== id) : [...S.picked, id]; render(); return; },
  'multi-add': async (b) => {
      const n = S.picked.length; if (!n) return;
      const rc = activeRecipe(), previous = structuredClone(rc.items);
      for (const id of S.picked) addToRecipe({ t: 'c', id, f: 0 }, 100, true);
      if (!persistRecipes()) { rc.items = previous; render(); return; }
      toast(L("{n} besin → {r} (her biri 100 g)", { n, r: activeRecipe().name })); aionPlay('celebrate');
      S.multi = false; S.picked = []; render(); return;
    },
  'cu-new': async (b) => { S.customEdit = { name: b.dataset.name || '', liquid: false, portion: null, v: {} }; render(); return; },
  'cu-edit': async (b) => { const f = customFoods().find((x) => x.id === S.sel?.id); if (f) { S.customEdit = JSON.parse(JSON.stringify(f)); render(); } return; },
  'cu-close': async (b) => { S.customEdit = null; render(); return; },
  'cu-liquid': async (b) => { S.customEdit.liquid = b.dataset.v === '1'; render(); return; },
  'cu-save': async (b) => { if (saveCustomEdit()) { if (!S.picker) S.tab = 'kesfet'; render(); toast(L("Kaydedildi")); } return; },
  'cu-delete': async (b) => {
      const E = S.customEdit;
      if (!(await uiDialog(L("“{n}” silinsin mi? Tariflerdeki kullanımları “bulunamadı” olarak kalır.", { n: E.name }), { ok: L("Sil"), cancel: L("Vazgeç") }))) return;
      const list = customFoods().filter((x) => x.id !== E.id);
      if (!saveCustom(list)) { toast(L("Kaydedilemedi: cihaz depolaması kullanılamıyor")); return; }
      setCustomFoods(list); S.customEdit = null; if (S.sel?.t === 'u') S.sel = null; render(); return;
    },
  'ex-form': async (b) => { S.sel = { ...S.sel, f: +b.dataset.f }; render(); return; },
  'ex-back': async () => {
    const previous = S.browseOpener;
    S.sel = null;
    render(); window.scrollTo(0, S.browseScrollY || 0);
    ((previous && $(previous)) || $('#q'))?.focus({ preventScroll: true });
  },
  'cats-toggle': async () => { S.catsOpen = !(S.catsOpen ?? S.settings.catGrid); render(); },
  'search-recent': async (b) => { S.q = b.dataset.q; S.cat = null; render(); return; },
  'search-clear': async (b) => { S.searches = []; saveSearches([]); render(); return; },
  'ex-clear': async () => { S.q = ''; render(); $('#q')?.focus(); },
  'ex-add-recipe': async (b) => { addToRecipe(S.sel, S.amount); render(); return; },
  'ex-add-compare': async (b) => { addToCompare(S.sel, S.amount); render(); return; },
};

// B235: Tarif sekmesi tıklama eylemleri (yeni, kopya, sil, aç, malzeme sırala/sil/ekle, porsiyon, pişmiş ağırlık, günlük toplam) app.js'ten ayrıldı.
// render, iletişim kutusu ve ayar yazma bindRecipeActions ile verilir; modül app.js'ten içe aktarmaz.
import { S } from '../state.js';
import { L } from '../i18n.js';
import { newRecipe } from '../store.js';
import { clamp } from '../util.js';
import { moveIndex } from '../collections.js';
import { activeRecipe, persistRecipes } from '../views/ui.js';

let render = () => {}, uiDialog = async () => null, setSetting = () => {};

export function bindRecipeActions(deps) {
  ({ render, uiDialog, setSetting } = deps);
}

function closeNarrowRecipeList() {
  if (!matchMedia('(max-width: 900px)').matches) return;
  const list = document.querySelector('.recipe-list');
  if (list) list.open = false;
}

export const RECIPE_ACTIONS = {
  'rc-move': async (b) => {
    const rc = activeRecipe();
    const { id, d } = b.dataset;
    const index = rc.items.findIndex((item) => item.id === id);
    rc.items = moveIndex(rc.items, index, Number(d));
    persistRecipes();
    render();
    const control = document.querySelector(`[data-action="rc-move"][data-id="${CSS.escape(id)}"][data-d="${CSS.escape(d)}"]`);
    if (control?.disabled) document.querySelector(`[data-action="rc-move"][data-id="${CSS.escape(id)}"]:not(:disabled)`)?.focus();
  },
  'rc-new': async (b) => {
    const recipe = newRecipe(L("Tarif {n}", { n: S.recipes.length + 1 }));
    S.recipeDaily = false;
    S.recipes.push(recipe);
    S.activeRecipe = recipe.id;
    persistRecipes();
    closeNarrowRecipeList();
    render();
    document.getElementById('active-recipe-title')?.focus();
  },
  'rc-daily-total': async (b) => {
    S.recipeDaily = true;
    closeNarrowRecipeList();
    render();
    document.querySelector('.daily-recipe-total')?.focus();
  },
  'daily-recipe-basis': async (b) => { setSetting('recipeTotalBasis', b.dataset.b); render(); return; },
  'rc-open': async (b) => {
    S.recipeDaily = false;
    S.activeRecipe = b.dataset.id;
    closeNarrowRecipeList();
    render();
    document.getElementById('active-recipe-title')?.focus();
  },
  'rc-dup': async (b) => { const src = activeRecipe(); const r = { ...JSON.parse(JSON.stringify(src)), id: Math.random().toString(36).slice(2, 10), name: L("{n} (kopya)", { n: src.name }) }; S.recipeDaily = false; S.recipes.push(r); S.activeRecipe = r.id; persistRecipes(); render(); return; },
  'rc-delete': async (b) => {
      const rc = activeRecipe();
      if (!(await uiDialog(L("“{n}” silinsin mi?", { n: rc.name }), { ok: L("Sil"), cancel: L("Vazgeç") }))) return;
      S.recipes = S.recipes.filter((r) => r.id !== rc.id);
      if (!S.recipes.length) S.recipes.push(newRecipe(L("Yeni tarif")));
      S.activeRecipe = S.recipes[0].id; persistRecipes(); render(); return;
    },
  'rc-del-item': async (b) => {
    const rc = activeRecipe();
    const { id } = b.dataset;
    const index = rc.items.findIndex((item) => item.id === id);
    rc.items = rc.items.filter((item) => item.id !== id);
    S.ingOpen.delete(id);
    persistRecipes();
    render();
    const next = rc.items[Math.min(index, rc.items.length - 1)];
    const edit = next && document.querySelector(`[data-action="ing-open"][data-id="${CSS.escape(next.id)}"]`);
    (edit || document.querySelector('[data-action="rc-add"]'))?.focus();
  },
  'rc-add': async (b) => { S.picker = { target: 'recipe', cat: null, q: '', sel: null, amount: S.settings.defaultAmount }; render(); return; },
  'rc-basis': async (b) => { S.basis = b.dataset.b; render(); return; },
  'rc-serv': async (b) => { const rc = activeRecipe(); rc.servings = clamp((rc.servings || 1) + Number(b.dataset.d), 1, 50); persistRecipes(); render(); return; },
  'rc-cw': async (b) => { const rc = activeRecipe(); const base = rc.cookedWeight || rc.items.reduce((acc, i) => acc + i.g, 0); rc.cookedWeight = clamp(Math.round(base + Number(b.dataset.d)), 1, 50000); persistRecipes(); render(); return; },
  'rc-cw-set': async (b) => { const rc = activeRecipe(); rc.cookedWeight = rc.items.reduce((a, i) => a + i.g, 0); persistRecipes(); render(); return; },
  'rc-cw-clear': async (b) => { const rc = activeRecipe(); rc.cookedWeight = null; persistRecipes(); render(); return; },
};

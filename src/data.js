import { categoryContains, rootCategories } from './catalog-tree.js';
import { matchesDiet, extendedDietProfile } from './diet.js';
import PACKED from './data/foods.json';
import { decodeDB, decodeExt } from './foods-codec.js';
import { norm } from './util.js';
import { searchKey } from './search.js';
import { getLanguage, L } from './i18n.js';
import { EN_FOODS, EN_CATEGORIES, EN_FORMS } from './i18n-foods.js';

const DB = decodeDB(PACKED); // B245: kayıpsız sıkıştırılmış katalog açılır

const en = () => getLanguage() === 'en';
export const foodName = (f) => (en() && EN_FOODS[f.id]) || f.tr;
export const formName = (label) => (en() && EN_FORMS[label]) || label;
export const categoryName = (c) => (en() && EN_CATEGORIES[c.id]) || c.name;

export const META = DB.meta;
export const CATEGORIES = DB.categories.map(([id, name, icon]) => ({ id, name, icon }));
export const NAV_CATEGORIES = rootCategories(CATEGORIES);
export const FOODS = DB.foods;
const byId = new Map(FOODS.map((f) => [f.id, f]));
const curatedByNdb = new Map();
for (const food of FOODS) food.forms.forEach((form, f) => {
  const ndb = form.usda?.ndb;
  if (ndb && !curatedByNdb.has(ndb)) curatedByNdb.set(ndb, { t: 'c', id: food.id, f });
});
for (const f of FOODS) f._k = searchKey(f) + ' ' + norm(EN_FOODS[f.id] || ''); // ekranda görünen İngilizce adla da bulunur

const LITE = typeof __LITE__ !== 'undefined' && __LITE__ === true;
let EXT = null, EXT_REQUEST = null; // geniş katalog tembel yüklenir; eşzamanlı çağrılar aynı yüklemeyi kullanır
const extByNdb = new Map();

export async function loadExt() {
  if (EXT) return EXT;
  // B202: hafif tek dosya sürümünde geniş katalog paketlenmez (dal derlemede silinir)
  if (LITE) return Promise.reject(Object.assign(new Error('lite'), { lite: true }));
  if (!EXT_REQUEST) EXT_REQUEST = import('./data/foods-ext.json').then((mod) => {
    const next = decodeExt(mod.default); // B245
    for (const f of next.foods) { f._k = norm(`${f.en} ${f.sci || ''} ${f.n} ${next.groups[f.g] || ''}`); extByNdb.set(f.n, f); }
    EXT = next;
    return EXT;
  }).catch((error) => { EXT_REQUEST = null; throw error; });
  return EXT_REQUEST;
}
export const extLoaded = () => !!EXT;
export const isLite = () => LITE;
export const extMeta = () => EXT?.meta || {};
export const extGroups = () => (EXT ? EXT.groups : {});
export const extFoods = () => (EXT ? (SHOW_ANIMAL ? EXT.foods : EXT.foods.filter((f) => !f.a && f.diet !== 'unknown')).filter(eligibleExtFood) : []);
export const extAnimalGroup = (g) => !!EXT && !EXT.foods.some((f) => f.g === g && !f.a && f.diet !== 'unknown');

import { volumeDensity } from './amount-scale.js';
export { volumeDensity };

// Ref: { t: 'c', id, f } küratörlü | { t: 'x', n } geniş katalog
export function resolve(ref) {
  if (!ref) return null;
  if (ref.t === 'c') {
    const food = byId.get(ref.id);
    if (!food) return null;
    const form = food.forms[ref.f];
    if (!form) return null;
    const liquid = ['icecek', 'demleme', 'suyu', 'yag'].includes(form.key);
    return {
      ref, food, form, animal: !!food.animal,
      name: foodName(food), formLabel: formName(form.label), cat: food.cat,
      liquid,
      density: liquid ? volumeDensity(form.portions) : null,
      customLiquid: false,
      v: form.v, s: form.s, alt: form.alt || {}, sd: form.sd || {},
      portions: form.portions || [],
      allergens: food.allergens, note: [food.note, form.unavailable].filter(Boolean).map((x) => L(x)).join(' ') || null, sci: food.sci,
      usda: form.usda, cofid: form.cofid || null, ifct: form.ifct, estFrom: form.estFrom, recipeOf: form.recipeOf || null, recipeYield: form.recipeYield || null,
      cofidCalculated: form.cofidCalculated || false,
      matvaretabellen: form.matvaretabellen || null,
      ciqual: form.ciqual || null,
      study: form.study || null,
    };
  }
  if (ref.t === 'x') {
    const f = extByNdb.get(ref.n);
    if (!f) {
      // Tam Katalog'dan küratörlü kataloğa alınan aynı NDB, eski tarif ve günlük kayıtlarında açılmaya devam eder.
      const curated = curatedByNdb.get(ref.n);
      return curated ? { ...resolve(curated), ref } : null;
    }
    const s = {};
    for (const k of Object.keys(f.v)) s[k] = f.fs?.[k] || 'u';
    const liquid = f.g === '1400' || f.g === '0400';
    return {
      ref, ext: f, animal: !!f.a, name: f.en, formLabel: L('USDA tanımı'), cat: 'ext:' + f.g,
      liquid,
      density: liquid ? volumeDensity(f.p) : null,
      customLiquid: false,
      v: f.v, s, alt: {}, sd: {}, portions: f.p || [],
      allergens: [], note: [L('USDA SR28 (2015) arşiv kaydı; güncel ürün etiketi değildir.'), f.a ? L('Hayvansal içerikli kayıt.') : f.diet === 'unknown' ? L('Karma içerik doğrulanmadı; vegan veya alerjensiz olduğu varsayılmaz.') : L('Kaynak grubu bitkiseldir; marka ve içerik ambalajdan doğrulanmalıdır.'), f.branded ? L('Markalı kaynak kaydı; ürünün tarifi zamanla değişmiş olabilir.') : ''].filter(Boolean).join(' '), sci: f.sci,
      usda: { ndb: f.n, desc: f.en, refuse: f.r, refDesc: f.rd, sci: f.sci }, cofid: null, ifct: null, estFrom: null,
    };
  }
  if (ref.t === 'u') {
    const f = CUSTOM.find((x) => x.id === ref.id);
    if (!f) return null;
    const v = { ...f.v }, s = {};
    if (v.energy != null) v.energy_kj = v.energy * 4.184;
    if (v.carb_avail != null && v.fiber != null) v.carb = v.carb_avail + v.fiber;
    for (const k of Object.keys(v)) s[k] = 'k';
    if (v.energy_kj != null) s.energy_kj = 'd';
    if (v.carb != null && f.v.carb == null) s.carb = 'd';
    return {
      ref, custom: f, name: f.name, formLabel: L('Kendi besinim (etiket)'), cat: 'custom',
      liquid: !!f.liquid, density: null, customLiquid: !!f.liquid, v, s, alt: {}, sd: {}, portions: f.portion ? [{ g: f.portion, label: L('1 porsiyon (etiket)'), en: 'label serving' }] : [],
      allergens: [], note: f.note || L('Değerler kullanıcı tarafından ürün etiketinden girildi.'), sci: null,
      usda: null, cofid: null, ifct: null, estFrom: null,
    };
  }
  return null;
}

export const refKey = (ref) => (ref.t === 'c' ? `c:${ref.id}:${ref.f}` : ref.t === 'u' ? `u:${ref.id}` : `x:${ref.n}`);

// Kullanıcının etiketten girdiği besinler (cihazda saklanır)
let CUSTOM = [];
export function setCustomFoods(list) {
  CUSTOM = list;
  for (const f of CUSTOM) f._k = norm(`${f.name} kendi etiket`);
}
export const customFoods = () => CUSTOM;

// Hayvansal besinler Ayarlar'dan gizlenebilir; gizliyken liste, arama ve öneriler yalnız bitkisel kayıtları görür
let SHOW_ANIMAL = true, SHOW_NICHE = false, DIET_SETTINGS = {};
export function setDietSettings(s) { DIET_SETTINGS = s; }
export const eligibleFood = f => matchesDiet(f?.dietary, DIET_SETTINGS);
export const eligibleExtFood = f => matchesDiet(extendedDietProfile(f), DIET_SETTINGS);
export const eligibleRef = ref => { const item = resolve(ref); return item?.food ? eligibleFood(item.food) : item?.ext ? eligibleExtFood(item.ext) : matchesDiet(null, DIET_SETTINGS); };
export function setAnimalVisible(v) { SHOW_ANIMAL = v !== false; }
// Az bilinen (niş) besinler kategori listelerinde varsayılan olarak gizli; aramada ve kayıtlı tariflerde görünür
export function setNicheVisible(v) { SHOW_NICHE = v === true; }
export const visibleFoods = ({ niche = SHOW_NICHE } = {}) => FOODS.filter((f) => (SHOW_ANIMAL || !f.animal) && (niche || !f.niche) && eligibleFood(f));
export const ANIMAL_CATS = new Set(DB.animalCategories || []);

export function search(q, { cat = null, ext = false, extGroup = null } = {}) {
  const k = norm(q);
  const terms = k ? k.split(' ') : [];
  const match = (s) => terms.every((t) => s.includes(t));
  let out = visibleFoods({ niche: SHOW_NICHE || terms.length > 0 }).filter((f) => (!cat || categoryContains(f,cat)) && (!terms.length || match(f._k)));
  if (terms.length) {
    out.sort((a, b) => score(b._k, k) - score(a._k, k) || a.tr.localeCompare(b.tr, 'tr'));
  }
  let extOut = [];
  if (ext && EXT && terms.length && !cat) extOut = EXT.foods.filter((f) => (SHOW_ANIMAL || (!f.a && f.diet !== 'unknown')) && (!extGroup || f.g === extGroup) && eligibleExtFood(f) && match(f._k)).sort((a, b) => Number(!!a.branded) - Number(!!b.branded) || score(b._k, k) - score(a._k, k) || a.en.localeCompare(b.en));
  const custom = terms.length && !cat ? CUSTOM.filter((f) => eligibleFood(f) && match(f._k)) : [];
  return { curated: out, ext: extOut, custom };
}
function score(s, k) { return s.startsWith(k) ? 3 : s.includes(' ' + k) ? 2 : 1; }


import DB from './data/foods.json';
import { norm } from './util.js';
import { searchKey } from './search.js';

export const META = DB.meta;
export const CATEGORIES = DB.categories.map(([id, name, icon]) => ({ id, name, icon }));
export const FOODS = DB.foods;
const byId = new Map(FOODS.map((f) => [f.id, f]));
for (const f of FOODS) f._k = searchKey(f);

let EXT = null; // geniş katalog tembel yüklenir
const extByNdb = new Map();

export async function loadExt() {
  if (EXT) return EXT;
  const mod = await import('./data/foods-ext.json');
  EXT = mod.default;
  for (const f of EXT.foods) { f._k = norm(`${f.en} ${f.sci || ''} ${f.n}`); extByNdb.set(f.n, f); }
  return EXT;
}
export const extLoaded = () => !!EXT;
export const extGroups = () => (EXT ? EXT.groups : {});
export const extFoods = () => (EXT ? EXT.foods : []);

// Ref: { t: 'c', id, f } küratörlü | { t: 'x', n } geniş katalog
export function resolve(ref) {
  if (!ref) return null;
  if (ref.t === 'c') {
    const food = byId.get(ref.id);
    if (!food) return null;
    const form = food.forms[ref.f];
    if (!form) return null;
    return {
      ref, food, form,
      name: food.tr, formLabel: form.label, cat: food.cat,
      liquid: ['icecek', 'demleme', 'suyu', 'yag'].includes(form.key),
      v: form.v, s: form.s, alt: form.alt || {}, sd: form.sd || {},
      portions: form.portions || [],
      allergens: food.allergens, note: [food.note, form.unavailable].filter(Boolean).join(' ') || null, sci: food.sci,
      usda: form.usda, ifct: form.ifct, estFrom: form.estFrom,
    };
  }
  if (ref.t === 'x') {
    const f = extByNdb.get(ref.n);
    if (!f) return null;
    const s = {};
    for (const k of Object.keys(f.v)) s[k] = 'u';
    return {
      ref, ext: f, name: f.en, formLabel: 'USDA tanımı', cat: 'ext:' + f.g,
      liquid: f.g === '1400', v: f.v, s, alt: {}, sd: {}, portions: f.p || [],
      allergens: [], note: 'Geniş katalog kaydı: vegan uygunluğu ve içerik ürüne göre doğrulanmalı.', sci: f.sci,
      usda: { ndb: f.n, desc: f.en, refuse: f.r, refDesc: f.rd, sci: f.sci }, ifct: null, estFrom: null,
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
      ref, custom: f, name: f.name, formLabel: 'Kendi besinim (etiket)', cat: 'custom',
      liquid: !!f.liquid, v, s, alt: {}, sd: {}, portions: f.portion ? [{ g: f.portion, label: '1 porsiyon (etiket)', en: 'label serving' }] : [],
      allergens: [], note: f.note || 'Değerler kullanıcı tarafından ürün etiketinden girildi.', sci: null,
      usda: null, ifct: null, estFrom: null,
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

export function search(q, { cat = null, ext = false, extGroup = null } = {}) {
  const k = norm(q);
  const terms = k ? k.split(' ') : [];
  const match = (s) => terms.every((t) => s.includes(t));
  let out = FOODS.filter((f) => (!cat || f.cat === cat) && (!terms.length || match(f._k)));
  if (terms.length) {
    out.sort((a, b) => score(b._k, k) - score(a._k, k) || a.tr.localeCompare(b.tr, 'tr'));
  }
  let extOut = [];
  if (ext && EXT && terms.length) extOut = EXT.foods.filter((f) => (!extGroup || f.g === extGroup) && match(f._k)).slice(0, 80);
  const custom = terms.length ? CUSTOM.filter((f) => match(f._k)) : [];
  return { curated: out, ext: extOut, custom };
}
function score(s, k) { return s.startsWith(k) ? 3 : s.includes(' ' + k) ? 2 : 1; }


import { NUTRIENTS } from './nutrients.js';
import { uid, clamp } from './util.js';
const object = v => v && typeof v === 'object' && !Array.isArray(v);
const id = v => typeof v === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(v);
const finite = v => typeof v === 'number' && Number.isFinite(v);
export function validRef(ref) {
  if (!object(ref)) return null;
  if (ref.t === 'c' && id(ref.id) && Number.isInteger(ref.f) && ref.f >= 0) return { t: 'c', id: ref.id, f: ref.f };
  if (ref.t === 'u' && id(ref.id)) return { t: 'u', id: ref.id };
  if (ref.t === 'x' && typeof ref.n === 'string' && /^\d{4,6}$/.test(ref.n)) return { t: 'x', n: ref.n };
  return null;
}
export function normalizeRecipe(r, { freshIds = false } = {}) {
  if (!object(r) || typeof r.name !== 'string' || !Array.isArray(r.items)) return null;
  const items = r.items.flatMap(it => {
    const ref = validRef(it?.ref);
    if (!ref || !finite(it.g) || it.g <= 0) return [];
    return [{ id: !freshIds && id(it.id) ? it.id : uid(), ref, g: clamp(it.g, 1, 1000),
      pricePerKg: finite(it.pricePerKg) && it.pricePerKg >= 0 ? it.pricePerKg : null }];
  });
  return { id: !freshIds && id(r.id) ? r.id : uid(), name: r.name.trim().slice(0, 80) || 'Adsız tarif', items,
    servings: finite(r.servings) ? clamp(Math.round(r.servings), 1, 50) : 1,
    cookedWeight: finite(r.cookedWeight) && r.cookedWeight > 0 ? clamp(r.cookedWeight, 1, 50000) : null,
    created: finite(r.created) ? r.created : Date.now(), updated: finite(r.updated) ? r.updated : Date.now() };
}
export function normalizeCustom(f) {
  if (!object(f) || typeof f.name !== 'string' || !f.name.trim() || !id(f.id) || !object(f.v)) return null;
  const v = {};
  for (const n of NUTRIENTS) if (finite(f.v[n.key]) && f.v[n.key] >= 0) v[n.key] = f.v[n.key];
  return { id: f.id, name: f.name.trim().slice(0, 80), liquid: f.liquid === true,
    portion: finite(f.portion) && f.portion > 0 ? clamp(f.portion, 1, 1000) : null,
    note: typeof f.note === 'string' ? f.note.slice(0, 1000) : '', v };
}
export function recipeCost(recipe) {
  const priced = recipe.items.filter(it => finite(it.pricePerKg) && it.pricePerKg >= 0);
  const total = priced.reduce((sum, it) => sum + it.g * it.pricePerKg / 1000, 0);
  return { total, perServing: total / recipe.servings, known: priced.length, count: recipe.items.length, complete: priced.length === recipe.items.length };
}

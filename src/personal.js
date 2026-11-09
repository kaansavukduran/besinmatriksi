import { scaleItem, aggregate } from './calc.js';
import { validRef, normalizeCustom } from './records.js';
import { uid } from './util.js';
import { referenceFor } from './settings.js';
export const PERSONAL_KEY = 'bm.personal.v1';
export const PROFILE_RANGES = { age: [1, 120], height: [50, 250], weight: [10, 400], bodyFat: [0, 100], waterPct: [0, 100], muscleKg: [0, 400], boneKg: [0, 50], visceralLevel: [0, 100], metabolicAge: [1, 120], deviceRmr: [1, 10000] };
export const emptyProfile = () => ({ ...Object.fromEntries(Object.keys(PROFILE_RANGES).map(k => [k, null])), sex: 'unspecified', activity: null, energySource: 'equation', specialContext: false, measuredOn: '', note: '' });
export const emptyPersonal = () => ({ schema: 1, profile: emptyProfile(), entries: [], milestones: { profile: false, food: false, source: false } });
export function localDay(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
export function validDay(value) { return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value + 'T12:00:00Z')) && new Date(value + 'T12:00:00Z').toISOString().slice(0, 10) === value; }
export function normalizeProfile(input = {}) {
  const out = emptyProfile();
  for (const [key, [min, max]] of Object.entries(PROFILE_RANGES)) {
    const n = input[key];
    if (n == null || n === '') continue;
    if (typeof n !== 'number' || !Number.isFinite(n) || n < min || n > max || (['age', 'metabolicAge'].includes(key) && !Number.isInteger(n))) throw Error('profile.invalid');
    out[key] = n;
  }
  if (['male', 'female', 'unspecified'].includes(input.sex)) out.sex = input.sex;
  if (input.activity != null) { if (![1.4, 1.6, 1.8, 2].includes(input.activity)) throw Error('profile.invalid'); out.activity = input.activity; }
  if (input.energySource === 'device') out.energySource = 'device';
  out.specialContext = input.specialContext === true;
  if (input.measuredOn && !validDay(input.measuredOn)) throw Error('profile.invalid');
  if (validDay(input.measuredOn)) out.measuredOn = input.measuredOn;
  if (typeof input.note === 'string') { if (input.note.length > 1000) throw Error('profile.invalid'); out.note = input.note; }
  return out;
}
export function energyEstimate(profile) {
  const p = normalizeProfile(profile);
  if (p.specialContext || (p.age != null && (p.age < 19 || p.age > 78))) return { status: 'scope' };
  if (p.age == null || p.activity == null) return { status: 'incomplete' };
  let resting;
  if (p.energySource === 'device') { if (p.deviceRmr == null) return { status: 'incomplete' }; resting = p.deviceRmr; }
  else {
    if (p.weight == null || p.height == null || !['male', 'female'].includes(p.sex)) return { status: 'incomplete' };
    resting = 9.99 * p.weight + 6.25 * p.height - 4.92 * p.age + (p.sex === 'male' ? 166 : 0) - 161;
  }
  if (!(resting > 0)) return { status: 'scope' };
  return { status: 'ready', resting, daily: resting * p.activity, activity: p.activity, source: p.energySource };
}
export function bodyMetrics(profile) {
  const p = normalizeProfile(profile), out = {};
  if (p.weight != null && p.height != null) out.bmi = p.weight / ((p.height / 100) ** 2);
  if (p.weight != null && p.bodyFat != null) { out.fatKg = p.weight * p.bodyFat / 100; out.leanKg = p.weight - out.fatKg; }
  return out;
}
export function normalizePersonal(input) {
  if (!input || input.schema !== 1 || !Array.isArray(input.entries) || input.entries.length > 10000) throw Error('personal.importError');
  const ids = new Set(), entries = [];
  for (const row of input.entries) {
    const ref = validRef(row?.ref);
    if (!ref || typeof row.id !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(row.id) || !validDay(row.day) || typeof row.g !== 'number' || !Number.isFinite(row.g) || row.g < 1 || row.g > 1000) throw Error('personal.importError');
    if (ids.has(row.id)) continue;
    ids.add(row.id); entries.push({ id: row.id, day: row.day, ref, g: row.g, consumed: row.consumed === true });
  }
  return { schema: 1, profile: normalizeProfile(input.profile), entries, milestones: Object.fromEntries(['profile', 'food', 'source'].map(k => [k, input.milestones?.[k] === true])) };
}
export function loadPersonal(storage) {
  try { storage ??= globalThis.localStorage; const text = storage.getItem(PERSONAL_KEY); return { state: text ? normalizePersonal(JSON.parse(text)) : emptyPersonal(), error: false }; }
  catch { return { state: emptyPersonal(), error: true }; }
}
export function savePersonal(state, storage) { try { storage ??= globalThis.localStorage; storage.setItem(PERSONAL_KEY, JSON.stringify(normalizePersonal(state))); return true; } catch { return false; } }
export function mergePersonal(current, incoming) {
  const next = normalizePersonal(incoming), old = normalizePersonal(current);
  next.entries = normalizePersonal({ ...next, entries: [...old.entries, ...next.entries] }).entries;
  next.milestones = Object.fromEntries(Object.keys(next.milestones).map(k => [k, old.milestones[k] || next.milestones[k]]));
  return next;
}
export function mergePersonalFoods(current, incoming, currentFoods, incomingFoods, newId = uid) {
  const state = normalizePersonal(incoming), custom = currentFoods.map(normalizeCustom), ids = new Map();
  if (custom.some(f => !f) || !Array.isArray(incomingFoods)) throw Error('personal.importError');
  const content = food => JSON.stringify({ ...food, id: undefined });
  for (const value of incomingFoods) {
    const food = normalizeCustom(value); if (!food) throw Error('personal.importError');
    const oldId = food.id, found = custom.find(f => f.id === oldId);
    if (found && content(found) !== content(food)) {
      const same = custom.find(f => content(f) === content(food));
      food.id = same?.id || newId();
      if (!same && custom.some(f => f.id === food.id)) throw Error('personal.importError');
    }
    if (!custom.some(f => f.id === food.id)) custom.push(food);
    ids.set(oldId, food.id);
  }
  for (const entry of state.entries) if (entry.ref.t === 'u' && ids.has(entry.ref.id)) entry.ref.id = ids.get(entry.ref.id);
  return { state: mergePersonal(current, state), custom };
}
export function dayResult(state, day, resolve, consumedOnly = false) {
  const entries = state.entries.filter(e => e.day === day && (!consumedOnly || e.consumed));
  const scaled = entries.map(e => { const item = resolve(e.ref); return item ? scaleItem(item, e.g) : { v: {}, s: {}, grams: e.g }; });
  return { entries, result: aggregate(scaled) };
}
export function nutrientComparison(nutrient, result, settings, energyTarget = null) {
  const value = result.v[nutrient.key];
  const reference = energyTarget?.value > 0 && ['energy', 'energy_kj'].includes(nutrient.key)
    ? { value: energyTarget.value * (nutrient.key === 'energy_kj' ? 4.184 : 1), personalKind: energyTarget.kind }
    : referenceFor(nutrient, settings);
  const complete = result.n > 0 && result.cov[nutrient.key] === result.n;
  return { value, reference, complete, difference: value != null && reference.value > 0 && complete ? value - reference.value : null };
}

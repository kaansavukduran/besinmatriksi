import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { emptyPersonal, emptyProfile, normalizeProfile, normalizePersonal, energyEstimate, bodyMetrics, dayResult, nutrientComparison, mergePersonal, mergePersonalFoods, loadPersonal, savePersonal, PERSONAL_KEY, validDay } from '../src/personal.js';
import { NUTRIENTS } from '../src/nutrients.js';
import { EN_NUTRIENTS } from '../src/i18n-nutrients.js';
import { preferredLanguage, setLanguage, t } from '../src/i18n.js';
import { normalizeSettings, DEFAULT_SETTINGS, resetSettingGroup } from '../src/settings.js';
import { renderPersonal } from '../src/personal-view.js';
const profile = { ...emptyProfile(), age: 35, height: 172, weight: 80, sex: 'male', activity: 1.6, bodyFat: 25 };
const nutrient = key => NUTRIENTS.find(n => n.key === key);
test('kalori tahmini birincil denklem katsayılarını ve seçilmiş PAL çarpanını kullanır', () => {
  const source = JSON.parse(fs.readFileSync(new URL('../data/references/ENERGY_MODEL_SOURCE.json', import.meta.url)));
  assert.equal(source.doi, '10.1093/ajcn/51.2.241');
  assert.equal(energyEstimate(profile).resting, 1707);
  assert.equal(energyEstimate(profile).daily, 2731.2000000000003);
  const female = energyEstimate({ ...profile, sex: 'female' }); assert.equal(female.resting, 1541);
  assert.equal(energyEstimate(emptyProfile()).status, 'incomplete');
  for (const age of [18, 79]) assert.equal(energyEstimate({ ...profile, age }).status, 'scope');
  assert.equal(energyEstimate({ ...profile, specialContext: true }).status, 'scope');
  assert.equal(energyEstimate({ ...profile, energySource: 'device', deviceRmr: null }).status, 'incomplete');
  const device = energyEstimate({ ...profile, energySource: 'device', deviceRmr: 1500 }); assert.equal(device.daily, 2400); assert.equal(device.source, 'device');
  assert.deepEqual(bodyMetrics({ ...profile, bodyFat: null }), { bmi: 80 / (1.72 ** 2) });
  assert.equal(bodyMetrics(profile).fatKg, 20); assert.equal(bodyMetrics(profile).leanKg, 60);
});
test('günlük plan tüketim sayılmaz; kayıp kayıt, eksik veri ve kaynak sıfırı farklıdır', () => {
  const state = emptyPersonal(); state.entries = [
    { id: 'a', day: '2026-11-09', ref: { t: 'c', id: 'a', f: 0 }, g: 100, consumed: false },
    { id: 'b', day: '2026-11-09', ref: { t: 'c', id: 'lost', f: 0 }, g: 50, consumed: true },
  ];
  const resolve = ref => ref.id === 'a' ? { v: { energy: 89, protein: 0 }, s: { energy: 'u', protein: 'u' } } : null;
  const all = dayResult(state, '2026-11-09', resolve); assert.equal(all.result.grams, 150); assert.equal(all.result.n, 2); assert.equal(all.result.v.energy, 89); assert.equal(all.result.cov.energy, 1);
  assert.equal(nutrientComparison(nutrient('energy'), all.result, DEFAULT_SETTINGS).difference, null);
  assert.equal(nutrientComparison(nutrient('protein'), all.result, DEFAULT_SETTINGS).value, 0);
  const consumed = dayResult(state, '2026-11-09', resolve, true); assert.equal(consumed.entries.length, 1); assert.equal(consumed.result.v.energy, undefined);
  const known = dayResult({ ...state, entries: state.entries.slice(0, 1) }, '2026-11-09', resolve);
  const energy = nutrientComparison(nutrient('energy'), known.result, DEFAULT_SETTINGS, { value: 2731.2, kind: 'estimate' }); assert.ok(Math.abs(energy.difference + 2642.2) < 1e-9);
  assert.equal(nutrientComparison(nutrient('polyphenols'), known.result, DEFAULT_SETTINGS).reference.value, undefined);
  assert.equal(nutrientComparison(nutrient('lys'), known.result, DEFAULT_SETTINGS).difference, null);
});
test('kişisel kayıt ve notlar korunur; yedek tekrar içe alındığında kayıt/ilerleme çift sayılmaz', () => {
  const state = emptyPersonal(); state.profile = { ...profile, note: 'Fişim: İı Şş; my note' };
  state.entries = [{ id: 'a', day: '2026-11-09', ref: { t: 'u', id: 'mine' }, g: 250, consumed: false }]; state.milestones.food = true;
  const merged = mergePersonal(state, normalizePersonal(JSON.parse(JSON.stringify(state)))); assert.equal(merged.entries.length, 1); assert.equal(merged.profile.note, state.profile.note); assert.deepEqual(merged.milestones, state.milestones);
  const memory = new Map(), storage = { getItem: k => memory.get(k) ?? null, setItem: (k, v) => memory.set(k, v) };
  assert.equal(savePersonal(state, storage), true); assert.deepEqual(loadPersonal(storage).state, state);
  memory.set(PERSONAL_KEY, '{corrupt'); assert.equal(loadPersonal(storage).error, true); assert.equal(memory.get(PERSONAL_KEY), '{corrupt');
  assert.equal(savePersonal(state, { setItem() { throw Error('blocked'); } }), false);
  assert.throws(() => normalizeProfile({ age: 1.5 })); assert.throws(() => normalizeProfile({ bodyFat: 101 })); assert.throws(() => normalizePersonal({ ...state, schema: 99 }));
  assert.equal(validDay('2026-02-30'), false);
});
test('dil, ölçek ve font ayarları göç eder; görünüm gerçek ölçümleri veya ilerlemeyi değiştirmez', () => {
  assert.equal(preferredLanguage('auto', ['fr-FR', 'en-US']), 'en'); assert.equal(preferredLanguage('auto', ['de-DE']), 'tr'); assert.equal(preferredLanguage('tr', ['en-US']), 'tr');
  assert.equal(normalizeSettings({ theme: 'dark' }).language, 'tr');
  const cfg = normalizeSettings({ ...DEFAULT_SETTINGS, language: 'en', uiScale: 135, fontSize: 22 }); assert.equal(cfg.uiScale, 135); assert.equal(cfg.fontSize, 22);
  assert.equal(resetSettingGroup(cfg, 'reading').uiScale, 135); assert.equal(resetSettingGroup(cfg, 'reading').fontSize, 17);
  for (const uiScale of [79, 201, 137, NaN]) assert.equal(normalizeSettings({ uiScale }).uiScale, 100);
  for (const n of NUTRIENTS) assert.ok(EN_NUTRIENTS[n.key], 'English label missing: ' + n.key);
  const state = emptyPersonal(), before = structuredClone(state);
  for (const language of ['tr', 'en']) { setLanguage(language); const html = renderPersonal(state, state.profile, '2026-11-09', false, cfg, () => null, 'energy', false, null, false); assert.ok(html.includes(t('dailyTitle'))); }
  assert.deepEqual(state, before); setLanguage('tr');
});
test('localStorage getter erişimi reddedilse bile tek HTML başlangıcı hata fırlatmaz', () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw Error('opaque origin'); } });
  try { assert.equal(loadPersonal().error, true); assert.equal(savePersonal(emptyPersonal()), false); }
  finally { if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor); else delete globalThis.localStorage; }
});
test('kişisel yedekte özel besin çakışması mevcut ölçümü ezmez; tekrar ithal ikiz kayıt üretmez', () => {
  const current = emptyPersonal(), incoming = emptyPersonal();
  current.entries = [{ id: 'old', day: '2026-11-09', ref: { t: 'u', id: 'same' }, g: 100, consumed: true }];
  incoming.entries = [{ id: 'new', day: '2026-11-09', ref: { t: 'u', id: 'same' }, g: 200, consumed: false }];
  const oldFood = { id: 'same', name: 'Benim ürünüm', v: { energy: 10 } }, newFood = { id: 'same', name: 'Benim ürünüm', v: { energy: 20 } };
  const once = mergePersonalFoods(current, incoming, [oldFood], [newFood], () => 'new-food');
  assert.equal(once.custom.length, 2); assert.equal(once.custom.find(f => f.id === 'same').v.energy, 10);
  assert.equal(once.state.entries.find(e => e.id === 'new').ref.id, 'new-food');
  const twice = mergePersonalFoods(once.state, incoming, once.custom, [newFood], () => 'unneeded-id');
  assert.equal(twice.custom.length, 2); assert.equal(twice.state.entries.length, 2);
});

import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_SETTINGS, normalizeSettings, resetSettingGroup, exportSettings, parseSettings } from '../src/settings.js';
import { loadSettings, saveSettings } from '../src/store.js';
let memory;
beforeEach(() => {
  memory = new Map();
  globalThis.localStorage = { getItem: k => memory.get(k) ?? null, setItem: (k, v) => memory.set(k, v) };
});
test('v1 ayarları v2 biçimine taşınır; eski kopya ve tercihler korunur', () => {
  memory.set('bm.settings.v1', JSON.stringify({ theme: 'dark', fontSize: 22, ruler: true }));
  const s = loadSettings();
  assert.equal(s.theme, 'dark'); assert.equal(s.fontSize, 22); assert.equal(s.ruler, true);
  assert.equal(s.showNrv, true);
  assert.equal(JSON.parse(memory.get('bm.settings.v2')).version, 2);
  assert.ok(memory.has('bm.settings.v1'));
  saveSettings({ ...s, fontSize: 20 }); assert.equal(loadSettings().fontSize, 20);
});
test('bozuk, bilinmeyen ve sınırsız ayarlar güvenli varsayılanlara döner', () => {
  const s = normalizeSettings(JSON.parse('{"theme":"<script>","fontSize":1000,"lineHeight":null,"accent":"red; color: red","ruler":"false","__proto__":{"evil":true}}'));
  assert.equal(s.fontSize, 28); assert.equal(s.lineHeight, DEFAULT_SETTINGS.lineHeight);
  assert.equal(s.theme, 'dark'); assert.equal(s.accent, 'auto'); assert.equal(s.ruler, false);
  assert.equal(s.evil, undefined); assert.deepEqual(normalizeSettings([]), DEFAULT_SETTINGS);
  assert.equal(normalizeSettings({ fontSize: Infinity }).fontSize, 17);
  memory.set('bm.settings.v2', '{broken'); assert.equal(loadSettings().theme, 'dark');
});
test('bölüm sıfırlama diğer tercihleri korur; ayar dosyası tarif taşımaz', () => {
  const s = resetSettingGroup({ ...DEFAULT_SETTINGS, theme: 'dark', fontSize: 24 }, 'reading');
  assert.equal(s.theme, 'dark'); assert.equal(s.fontSize, 17);
  assert.deepEqual(parseSettings(exportSettings(s)), s);
  assert.equal(JSON.parse(exportSettings(s)).recipes, undefined);
  assert.throws(() => parseSettings('{"app":"besin-matriksi","recipes":[]}'));
  assert.throws(() => parseSettings('{"app":"besin-matriksi-ayarlar","version":99,"settings":{}}'));
});
test('depolama kullanılamazsa uygulama varsayılanlarla açılır', () => {
  globalThis.localStorage = { getItem() { throw Error('kapalı'); }, setItem() { throw Error('dolu'); } };
  assert.deepEqual(loadSettings(), DEFAULT_SETTINGS); assert.equal(saveSettings(DEFAULT_SETTINGS), false);
});

test('bölüm sırası ve sabitler doğrulanır; yeni bölümler kaybolmaz', async () => {
  const { moveSection, MATRIX_SECTIONS } = await import('../src/settings.js');
  const s = normalizeSettings({ sectionOrder: ['tolerans', 'tolerans', 'uydurma'], hiddenSections: ['kalinti', '<script>'], pinnedNutrients: ['b12', 'b12', 'energy', 'uydurma'] });
  assert.equal(s.sectionOrder[0], 'tolerans'); assert.equal(s.sectionOrder.length, MATRIX_SECTIONS.length);
  assert.deepEqual(s.hiddenSections, ['kalinti']); assert.deepEqual(s.pinnedNutrients, ['b12']);
  assert.equal(moveSection(s, 'tolerans', 1).sectionOrder[1], 'tolerans');
  assert.deepEqual(moveSection(s, 'tolerans', -1), s);
});
test('matriks gizleme, sıralama ve sabitleme ölçümleri değiştirmez', async () => {
  const { renderMatrix } = await import('../src/matrix.js');
  const r = { v: { energy: 89, b12: 0, protein: 1 }, s: { energy: 'u', b12: 'u', protein: 'u' }, grams: 100, n: 1 };
  const before = structuredClone(r);
  const html = renderMatrix(r, { hiddenSections: ['hesap'], sectionOrder: ['tolerans'], pinnedNutrients: ['b12', 'fe'] }, { recipe: { name: 'Test' }, basisLabel: 'Toplam' });
  assert.ok(!html.includes('data-sec="hesap"')); assert.ok(html.indexOf('data-sec="tolerans"') < html.indexOf('data-sec="protein"'));
  assert.match(html, /Sabitlenen besin öğeleri/); assert.match(html, /kaynak 0/); assert.match(html, /veri yok/);
  assert.deepEqual(r, before);
});

test('yeni kurulum: varsayılan tema Koyu, yazı Inter (B110 kararı); eski kayıtlı seçimler korunur (2026-11-12)', () => {
  assert.equal(DEFAULT_SETTINGS.theme, 'dark'); assert.equal(DEFAULT_SETTINGS.font, 'inter');
  const old = normalizeSettings({ theme: 'light', font: 'atkinson' });
  assert.equal(old.theme, 'light'); assert.equal(old.font, 'atkinson');
  assert.equal(normalizeSettings({}).theme, 'dark');
});
test('yazı tipi: varsayılan Inter; bir kerelik geçiş yuvarlak/sistem yazısını Inter yapar, erişilebilirlik seçimini korur (B110)', async () => {
  const { DEFAULT_SETTINGS, migrateFontV2 } = await import('../src/settings.js');
  assert.equal(DEFAULT_SETTINGS.font, 'inter');
  const mem = () => { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)) }; };
  let st = mem(); assert.equal(migrateFontV2({ font: 'system' }, st).font, 'inter');
  assert.equal(migrateFontV2({ font: 'nunito' }, st).font, 'nunito', 'geçiş bir kez yapılır; sonraki seçim korunur');
  st = mem(); assert.equal(migrateFontV2({ font: 'lexend' }, st).font, 'inter');
  st = mem(); assert.equal(migrateFontV2({ font: 'opendyslexic' }, st).font, 'opendyslexic');
  st = mem(); assert.equal(migrateFontV2({ font: 'atkinson' }, st).font, 'atkinson');
});
test('Aion varsayılan kapalı; mevcut kurulumda bir kez kapatılır, sonra kullanıcının açması korunur (B113)', async () => {
  const { DEFAULT_SETTINGS, migrateAionOff } = await import('../src/settings.js');
  assert.equal(DEFAULT_SETTINGS.aionEnabled, false);
  const m = new Map(), st = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)) };
  assert.equal(migrateAionOff({ aionEnabled: true }, st).aionEnabled, false);
  assert.equal(migrateAionOff({ aionEnabled: true }, st).aionEnabled, true);
});

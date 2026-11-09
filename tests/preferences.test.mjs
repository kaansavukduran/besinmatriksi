import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contrastRatio, accentText, exportTheme, parseTheme } from '../src/theme.js';
import { normalizeSettings, referenceFor } from '../src/settings.js';
import { configureFormatting, fmtNum, fmtAmount } from '../src/util.js';
import { matrixCSV } from '../src/export.js';
const protein = { key: 'protein', nrv: 50, unit: 'g' };
test('özel hedef eksikken BRD ile doldurulmaz; CSV aynı hedefi kullanır', () => {
  const cfg = normalizeSettings({ referenceMode: 'custom', targets: { protein: 80, fe: -1, water: Infinity, fake: 10 } });
  assert.deepEqual(cfg.targets, { protein: 80 }); assert.equal(referenceFor(protein, cfg).value, 80);
  assert.equal(referenceFor({ key: 'ca', nrv: 800 }, cfg).value, undefined);
  const csv = matrixCSV({ v: { protein: 40 }, s: { protein: 'u' }, n: 1 }, 'Test', cfg);
  assert.match(csv, /%hedef/); assert.match(csv, /Protein \(toplam\);40;g;50;/);
});
test('sayı ayracı ve birim yükseltme tercihleri ölçüm değerini değiştirmez', () => {
  configureFormatting({ decimalSeparator: 'dot', autoUnits: false });
  assert.equal(fmtNum(1.25), '1.25'); assert.deepEqual(fmtAmount(15000, 'mg'), { n: '15,000', u: 'mg' });
  configureFormatting({}); assert.equal(fmtNum(1.25), '1,25'); assert.deepEqual(fmtAmount(15000, 'mg'), { n: '15', u: 'g' });
});
test('tema renkleri doğrulanır; WCAG referans çiftleri ve paylaşım korunur', () => {
  assert.equal(contrastRatio('#000000', '#ffffff'), 21); assert.equal(contrastRatio('#ffffff', '#ffffff'), 1);
  assert.equal(accentText('#ffffff'), '#000000'); assert.equal(accentText('#000000'), '#ffffff');
  const s = normalizeSettings({ theme: 'custom', customTheme: { fg: 'red; color:red', bg: '#121212' } });
  assert.equal(s.customTheme.fg, '#1e2233'); assert.equal(s.customTheme.bg, '#121212');
  assert.deepEqual(parseTheme(exportTheme(s.customTheme)), s.customTheme);
  assert.throws(() => parseTheme('{"app":"besin-matriksi-tema","version":1,"colors":{}}'));
});
test('kısayollar çakışma ve bilinmeyen değerleri reddeder; odak sınırları korunur', () => {
  const cfg = normalizeSettings({ shortcuts: { kesfet: 'Alt+9', tarif: 'Alt+9', ayarlar: 'Ctrl+X', hakkinda: '' }, focusWidth: 100 });
  assert.equal(cfg.shortcuts.kesfet, 'Alt+9'); assert.equal(cfg.shortcuts.tarif, ''); assert.equal(cfg.shortcuts.ayarlar, '');
  assert.equal(cfg.shortcuts.hakkinda, ''); assert.equal(cfg.focusWidth, 6);
});

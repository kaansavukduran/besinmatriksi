import { test } from 'node:test';
import assert from 'node:assert/strict';
import { referenceFor, normalizeSettings } from '../src/settings.js';
import { NUTRIENT_BY_KEY } from '../src/nutrients.js';

test('RAE ölçümü farklı RE etiket referansına otomatik bölünmez; miktar ve kendi biriminde elle hedef korunur', () => {
  const a = NUTRIENT_BY_KEY.vita_rae;
  const eu = referenceFor(a, normalizeSettings({ referenceMode: 'eu' }));
  assert.equal(eu.value, undefined);
  assert.match(eu.reason, /RAE.*RE/);
  assert.equal(referenceFor(NUTRIENT_BY_KEY.vitc, normalizeSettings({ referenceMode: 'eu' })).value, 80);
  const custom = referenceFor(a, normalizeSettings({ referenceMode: 'custom', targets: { vita_rae: 800 } }));
  assert.equal(custom.value, 800);
  assert.equal(custom.reason, undefined);
});

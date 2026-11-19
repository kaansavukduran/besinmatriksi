import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sliderToGrams, gramsToSlider, SLIDER_STEPS, MAX_GRAMS, kgLabel } from '../src/amount-scale.js';

test('B197 küp ölçek: uçlar 1 g ve 10 kg; küçük miktarlara geniş alan (10 g ~%10, 100 g ~%22, 1 kg ~%46)', () => {
  assert.equal(MAX_GRAMS, 10000);
  assert.equal(sliderToGrams(0), 1);
  assert.equal(sliderToGrams(SLIDER_STEPS), 10000);
  assert.ok(gramsToSlider(10) >= 90 && gramsToSlider(10) <= 105);
  assert.ok(gramsToSlider(100) >= 200 && gramsToSlider(100) <= 230);
  assert.ok(gramsToSlider(1000) >= 450 && gramsToSlider(1000) <= 480);
});
test('B197 gidiş-dönüş: tüm hazır miktarlar (1 g … 10 kg) aynı grama döner; adımlar 1/5/10/50/100 g; tekdüze', () => {
  for (const g of [1, 5, 10, 25, 50, 100, 150, 200, 250, 500, 750, 1000, 2000, 5000, 10000]) assert.equal(sliderToGrams(gramsToSlider(g)), g, `${g} g`);
  for (let p = 0; p <= SLIDER_STEPS; p++) {
    const g = sliderToGrams(p);
    assert.ok(g >= 1 && g <= 10000);
    const step = g < 100 ? 1 : g < 500 ? 5 : g < 2000 ? 10 : g < 5000 ? 50 : 100;
    assert.equal(g % step, 0, `${p} → ${g}`);
    if (p) assert.ok(g >= sliderToGrams(p - 1), 'tekdüze artan');
  }
});
test('B197 kg etiketi: 1000 g ve üstü kg, altı g (eskiden 1000 g üstü her şey "1 kg" yazıyordu)', () => {
  assert.equal(kgLabel(250), '250 g'); assert.equal(kgLabel(1000), '1 kg'); assert.equal(kgLabel(2000), '2 kg'); assert.equal(kgLabel(2500), '2,5 kg'); assert.equal(kgLabel(10000), '10 kg');
});

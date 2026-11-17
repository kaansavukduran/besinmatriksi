import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sliderToGrams, gramsToSlider, SLIDER_STEPS } from '../src/amount-scale.js';

test('B168 karekök ölçek: uçlar 1 ve 1000 g, orta 250 g, küçük miktarlara geniş alan', () => {
  assert.equal(sliderToGrams(0), 1);
  assert.equal(sliderToGrams(SLIDER_STEPS), 1000);
  assert.equal(sliderToGrams(500), 250);
  assert.ok(gramsToSlider(10) > 90 && gramsToSlider(10) < 100, '10 g kaydırıcının ~%9,5 konumunda (doğrusalda %0,9)');
  assert.ok(gramsToSlider(100) > 300, '100 g kaydırıcının ~%31 konumunda');
});
test('B168 gidiş-dönüş: düğmeyle seçilen tüm hazır miktarlar kaydırıcıda aynı gramda kalır; adımlar 1/5/10 g', () => {
  for (const g of [1, 5, 10, 25, 50, 100, 150, 200, 250, 500, 750, 1000]) assert.equal(sliderToGrams(gramsToSlider(g)), g, `${g} g`);
  for (let p = 0; p <= SLIDER_STEPS; p++) {
    const g = sliderToGrams(p);
    assert.ok(g >= 1 && g <= 1000);
    if (g >= 500) assert.equal(g % 10, 0); else if (g >= 100) assert.equal(g % 5, 0);
    if (p) assert.ok(g >= sliderToGrams(p - 1), 'tekdüze artan');
  }
});

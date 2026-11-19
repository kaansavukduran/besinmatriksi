import test from 'node:test';
import assert from 'node:assert/strict';
import { compareChart } from '../src/compare-chart.js';

test('B201 Kıyasla grafiği: satır içi ölçek, ölçülmemiş = veri yok (çubuk yok), tek besinde grafik yok', () => {
  const rows = [{ key: 'protein', label: 'Protein', unit: 'g' }, { key: 'fiber', label: 'Lif', unit: 'g' }, { key: 'salt', label: 'Tuz', unit: 'g' }];
  const foods = [{ name: 'Nohut', form: 'Kuru', v: { protein: 20, fiber: 12 } }, { name: 'Yulaf', form: '', v: { protein: 10 } }];
  const html = compareChart(foods, rows);
  assert.match(html, /class="s1" style="width:100.0%"/);
  assert.match(html, /class="s2" style="width:50.0%"/);
  assert.match(html, /cc-bar miss[^>]*title="Yulaf: veri yok"/);
  assert.doesNotMatch(html, /data-cc="salt"/); // hiç ölçülmemiş satır gösterilmez
  assert.equal(compareChart(foods.slice(0, 1), rows), '');
  assert.match(html, /cc-legend/);
});

import { compareAminoChart } from '../src/compare-chart.js';
import { assessAmino } from '../src/calc.js';
test('B201 amino asit profili kıyası: %100 çizgisi, eksik = veri yok, sınırlayıcı adı', () => {
  const full = { protein: 10, his: 300, ile: 450, leu: 800, lys: 700, met: 150, cys: 150, phe: 500, tyr: 300, thr: 380, trp: 120, val: 500 };
  const a = assessAmino({ v: full, n: 1 });
  const b = assessAmino({ v: { protein: 10, lys: 200 }, n: 1 });
  const html = compareAminoChart([{ name: 'Nohut', amino: a }, { name: 'Pirinç', amino: b }]);
  assert.match(html, /data-cc-aa="lys"/);
  assert.match(html, /sınırlayıcı: /);
  assert.match(html, /title="Pirinç: veri yok"/);
  assert.match(html, /--ref:/); assert.match(html, /class="cc-ref"/); assert.match(html, /<details class="cmp-chart cmp-amino"[^>]* open>/);
  assert.doesNotMatch(compareAminoChart([{ name: "Nohut", amino: a }, { name: "P", amino: b }], undefined, undefined, false), / open>/);
  assert.equal(compareAminoChart([{ name: 'X', amino: assessAmino({ v: {}, n: 1 }) }, { name: 'Y', amino: assessAmino({ v: {}, n: 1 }) }]), '');
});

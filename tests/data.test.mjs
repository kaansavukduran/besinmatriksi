import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { NUTRIENTS } from '../src/nutrients.js';
import { scaleItem, aggregate, derive } from '../src/calc.js';

const DB = JSON.parse(fs.readFileSync(new URL('../src/data/foods.json', import.meta.url)));
const keys = new Set(NUTRIENTS.map((n) => n.key));
const form = (id, i = 0) => {
  const f = DB.foods.find((x) => x.id === id).forms[i];
  return { v: f.v, s: f.s, alt: f.alt || {}, sd: f.sd || {} };
};

test('her besinin en az bir formu ve enerji/protein değeri var', () => {
  for (const f of DB.foods) {
    assert.ok(f.forms.length > 0, f.id);
    for (const fm of f.forms) {
      assert.ok(fm.v.energy != null && fm.v.protein != null, `${f.id}/${fm.key}`);
      for (const k of Object.keys(fm.v)) assert.ok(keys.has(k), `bilinmeyen anahtar ${k}`);
      for (const [k, s] of Object.entries(fm.s)) assert.ok(['u', 'i', 'e'].includes(s), `${f.id} ${k} ${s}`);
    }
  }
});

test('makro toplamı 100 g\'ı geçmez (ölçüm toleransı %3)', () => {
  for (const f of DB.foods) for (const fm of f.forms) {
    const { water = 0, protein = 0, fat = 0, carb = 0, ash = 0 } = fm.v;
    assert.ok(water + protein + fat + carb + ash < 103, `${f.id}/${fm.key}: ${water + protein + fat + carb + ash}`);
  }
});

test('USDA referans değerleri: çiğ muz (NDB 09040)', () => {
  const b = form('muz');
  assert.equal(b.v.energy, 89);
  assert.equal(b.v.k, 358);
  assert.equal(b.s.k, 'u');
});

test('IFCT birim dönüşümü: mercimek lizin mg/100 g makul (1000–2500)', () => {
  const l = form('yesil_mercimek', 0);
  assert.ok(l.v.lys > 1000 && l.v.lys < 2500, String(l.v.lys));
  assert.equal(l.s.lys, 'i');
});

test('pişmiş mercimekte amino asitler "Tahmin" olarak işaretli ve proteine orantılı', () => {
  const raw = form('yesil_mercimek', 0), cooked = form('yesil_mercimek', 1);
  assert.equal(cooked.s.lys, 'e');
  const ratioRaw = raw.v.lys / raw.alt.protein, ratioCooked = cooked.v.lys / cooked.v.protein;
  assert.ok(Math.abs(ratioRaw - ratioCooked) / ratioRaw < 0.01);
  assert.equal(cooked.v.phytate, undefined, 'pişmiş formda fitat uydurulmamalı');
});

test('ölçekleme doğrusal ve eksik veri 0 sayılmaz', () => {
  const s = scaleItem(form('muz'), 250);
  assert.ok(Math.abs(s.v.k - 895) < 1e-9);
  assert.equal(s.v.b12 === undefined || s.v.b12 === 0, true);
  assert.ok(Math.abs(s.v.salt - (s.v.na * 2.5) / 1000) < 1e-12);
});

test('tarif toplamı ve kısmi kapsam', () => {
  const a = scaleItem(form('yesil_mercimek', 0), 100);
  const b = scaleItem(form('yabanmersini', 0), 100);
  const agg = aggregate([a, b]);
  assert.ok(Math.abs(agg.v.energy - (a.v.energy + b.v.energy)) < 1e-9);
  assert.equal(agg.cov.lys, 1);
  assert.equal(agg.n, 2);
});

test('türetilmiş göstergeler: ıspanakta oksalat:Ca ≥ 1, AAS hesaplanır', () => {
  const sp = derive(scaleItem(form('ispanak', 0), 100));
  assert.ok(sp.oxCa >= 1, String(sp.oxCa));
  const le = derive(scaleItem(form('yesil_mercimek', 0), 100));
  assert.ok(le.aas && le.aas.raw > 50 && le.aas.raw < 150);
  assert.equal(le.aas.limiting, 'Met + Sis');
});

test('katalogda hayvansal ürün yok', () => {
  const bad = /\b(milk|cheese|egg|honey|beef|chicken|fish|butter|ghee|yogurt)\b/i;
  for (const f of DB.foods) for (const fm of f.forms) {
    if (fm.usda) assert.ok(!bad.test(fm.usda.desc.replace(/peanut butter|sesame butter|soymilk|almond milk|rice milk|coconut milk/gi, '')), fm.usda.desc);
  }
});

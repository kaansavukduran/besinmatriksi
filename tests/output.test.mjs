import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matrixCSV } from '../src/export.js';
import { renderMatrix } from '../src/matrix.js';
test('CSV sıfır ve eksik değeri ayırır; kısmi kapsamı ve Türkçe kaçışı korur', () => {
  const csv = matrixCSV({ v: { protein: 0 }, s: { protein: 'k' }, cov: { protein: 1 }, n: 2 }, 'Muz; "Tarif"');
  assert.ok(csv.startsWith('\ufeff"Muz; ""Tarif"""'));
  assert.match(csv, /Protein \(toplam\);0;g;0;Etiket;1\/2/);
  assert.match(csv, /Demir \(Fe\);veri yok;mg;;;0\/2/);
});
test('kaynak etiketi veri seti yılı ve kayıt kimliğini taşır; bilinmeyen alerjen boşluk olarak görünür', () => {
  const r = { v: { protein: 1 }, s: { protein: 'u' }, grams: 100, n: 1 };
  const item = { name: 'Ürün', formLabel: 'Etiket', custom: true, usda: { ndb: '09040', desc: 'Bananas, raw' }, allergens: [] };
  const html = renderMatrix(r, {}, { item });
  assert.match(html, /USDA SR28 \(2015\), NDB 09040/);
  assert.match(html, /Bilgi girilmedi; ürün etiketini kontrol et/);
  assert.ok(!html.includes('Tahıl kaynaklı gluten beklenmez'));
});
test('Günlük hedef çubukları: hedefe doğru, üst sınır ve veri yok ayrımı (B093)', async () => {
  const { basicCard } = await import('../src/matrix.js');
  const r = { v: { energy: 1000, protein: 60, sugars: 120, salt: 3, fiber: 12 }, s: {}, n: 1, cov: {} };
  const html = basicCard(r, {}, null, { goals: true, energyTarget: 2000, persona: { sex: 'male' } });
  const tile = (k) => html.match(new RegExp(`<div class="[^"]*" data-basic="${k}"[\\s\\S]*?</div>`))[0];
  assert.match(tile('energy'), /kalan 1\.000 kcal/);
  assert.match(tile('energy'), /width:50\.0%/);
  assert.match(tile('protein'), /hedefe ulaşıldı/);
  assert.match(tile('protein'), /goal done/);
  assert.match(tile('sugars'), /goal over/);
  assert.match(tile('sugars'), /üst sınırı .* aştı/);
  assert.match(tile('salt'), /üst sınırın %50/);
  assert.match(tile('fiber'), /kalan 18 g/);
  assert.match(tile('fat'), /veri yok/);
  assert.ok(!tile('fat').includes('gbar'), 'veri yokken çubuk çizilmez');
  assert.match(html, /ortalama yetişkin erkek/);
});
test('kişisel bilgi yoksa temel değerlerde ortalama kadın ve erkek yüzdesi; kaynak en altta (B097)', async () => {
  const { basicCard, renderMatrix } = await import('../src/matrix.js');
  const r = { v: { energy: 1000, protein: 45, salt: 3, ash: 2 }, s: {}, n: 1, cov: {}, grams: 100 };
  const html = basicCard(r, {});
  const tile = (k) => html.match(new RegExp(`<div class="[^"]*" data-basic="${k}"[\\s\\S]*?</div>`))[0];
  assert.match(tile('energy'), /data-who="female"[\s\S]*%50[\s\S]*data-who="male"[\s\S]*%40/);
  assert.match(tile('protein'), /data-who="female"[^>]*>[\s\S]*%100/);
  assert.match(tile('salt'), /data-who="both"[\s\S]*%50/);
  assert.match(html, /PHE Government Dietary Recommendations \(2016/);
  assert.ok(!html.includes('BRD'), 'BRD etiketi yok');
  const m = renderMatrix(r, {}, { item: { name: 'Ürün', formLabel: 'Çiğ', custom: true, allergens: [] } });
  assert.ok(!m.includes('data-sec="enerji"'), 'ayrı Kalori kutusu yok; kalori temel kartta (B113)');
  assert.ok(m.indexOf('reference-label') > m.indexOf('data-sec="protein"'), 'kaynak/kapsam en altta');
  assert.ok(!/Kül/.test(m), 'kül satırı gösterilmez');
  // B099 Kalori kutusu B113'te temel karta katıldı

});
test('kalori kutusunun üstünde makro pasta grafiği; eksik makroda çizilmez (B100)', async () => {
  const { renderMatrix, macroPie } = await import('../src/matrix.js');
  const r = { v: { energy: 100, protein: 5, carb_avail: 10, fat: 2, fiber: 2.5 }, s: {}, n: 1, cov: {}, grams: 100 };
  const pie = macroPie(r, {});
  // 5×4=20, 10×4=40, 2×9=18, 2.5×2=5 → toplam 83
  assert.match(pie, /data-part="p"[\s\S]*%24/);
  assert.match(pie, /data-part="c"[\s\S]*%48/);
  assert.match(pie, /<svg[^>]*class="pie"/);
  assert.equal(macroPie({ ...r, v: { energy: 100, protein: 5 } }, {}), '', 'eksik makroda pasta yok');
  const m = renderMatrix(r, {}, { item: { name: 'Ürün', formLabel: 'Çiğ', custom: true, allergens: [] } });
  assert.ok(m.indexOf('macro-pie') > 0 && m.indexOf('macro-pie') < m.indexOf('basic-tiles'), 'pasta temel değer kartında, karoların solunda');
});
test('denetim düzeltmeleri: CSV ve döküm her kaynak etiketini taşır; tahmin "Tahmin (tarif)"; CSV formül enjeksiyonu yok (B127)', async () => {
  const fs = await import('node:fs');
  const { SRC } = await import('../src/export.js');
  const { LABELS } = await import('../src/recipe-sources.js');
  const db = JSON.parse(fs.readFileSync(new URL('../src/data/foods.json', import.meta.url)));
  const tags = new Set(db.foods.flatMap((f) => f.forms.flatMap((fm) => Object.values(fm.s))));
  for (const t of tags) { assert.ok(SRC[t], 'CSV: ' + t); assert.ok(LABELS[t], 'döküm: ' + t); }
  const csv = matrixCSV({ v: { protein: 2 }, s: { protein: 'r' }, n: 1 }, '=HYPERLINK("x")');
  assert.match(csv, /Tahmin \(tarif\)/);
  assert.ok(csv.startsWith("﻿'=HYPERLINK") || csv.startsWith('﻿"\'=HYPERLINK'), csv.slice(0, 30));
});

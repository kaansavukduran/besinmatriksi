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

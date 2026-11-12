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
  const r = { v: { energy: 1000, protein: 60, sugars: 120, salt: 3 }, s: {}, n: 1, cov: {} };
  const html = basicCard(r, {}, null, { goals: true, energyTarget: 2000 });
  const tile = (k) => html.match(new RegExp(`<div class="[^"]*" data-basic="${k}"[\\s\\S]*?</div>`))[0];
  assert.match(tile('energy'), /kalan 1\.000 kcal/);
  assert.match(tile('energy'), /width:50\.0%/);
  assert.match(tile('protein'), /hedefe ulaşıldı/);
  assert.match(tile('protein'), /goal done/);
  assert.match(tile('sugars'), /goal over/);
  assert.match(tile('sugars'), /üst sınırı .* aştı/);
  assert.match(tile('salt'), /üst sınırın/);
  assert.match(tile('fat'), /veri yok/);
  assert.ok(!tile('fat').includes('gbar'), 'veri yokken çubuk çizilmez');
  assert.match(tile('fiber'), /veri yok/);
  assert.ok(!tile('fat').includes('hedef yok'), 'veri yokken hedef yok denmez');
  assert.ok(!basicCard(r, {}).includes('gbar'), 'besin ekranında çubuk yok');
  const fib = basicCard({ v: { fiber: 12 }, s: {}, n: 1, cov: {} }, {}, null, { goals: true });
  assert.match(fib, /BRD'de lif hedefi yok/);
});

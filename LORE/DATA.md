# Veri ve hesaplar

- [Katalog](../data/catalog.mjs) besin kimliğini ve tüketim biçimini tutar. Kayıtlı tarif ve günlük için kimliği ve biçim sırasını koru. [Derleyici](../scripts/build-data.mjs) yerel kaynaklardan `src/data/` çıktısını üretir.
- Ölçülmeyen alan «veri yok» görünür. Kaynaklı sıfır ve varsayılan sıfır ayrı etiketlenir. Kaynakta ölçülen birimi, hazırlamayı ve yenebilir kısmı koru. Hesaplanmış tarifleri tahmin olarak işaretle. Pişirme sırasında değişen bileşenler için çiğ profil kopyalanmaz. [Hesap](../src/calc.js)
- Katalog bitkisel, mantar ve alg ağırlıklıdır. Hayvansal besin USDA bağlantısıyla, ayrı kategoride veya `animal: true` ile görünür ve `showAnimal` ile gizlenebilir. [Kategori ağacı](../src/catalog-tree.js)
- IFCT ve IFCT tabanlı tahminler yazılı kullanım izni doğrulanana dek dağıtıma girmez. EFSA PRI/AI grup referansıdır ve besin ölçümünden ayrı izlenir. [Veri araştırması](../docs/DATA_RESEARCH.md) · [Lisans](../docs/LICENSE_AUDIT.md)

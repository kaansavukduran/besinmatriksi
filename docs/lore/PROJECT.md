# Proje hafızası

[Lore dizinine dön](README.md)

Besin Matriksi’nin işi, insanın elindeki besini bulmasını ve seçtiği miktarın içeriğini anlamasını kolaylaştırmak. Aynı bilgi Keşfet, Tarif, Günlük ve Karşılaştır’da kullanılır. Türkçe ve İngilizce arayüz ile çevrimdışı kullanım ürünün parçasıdır. [Uygulama rehberi](../../README.md)

## Kalıcı kararlar

| Karar | Uygulamaya etkisi |
| --- | --- |
| Besin ve tüketim biçimi birlikte tanımlanır. | Çiğ, haşlanmış ve kurutulmuş biçimler doğru kaynakla eşleşir. Kaydedilmiş tariflerin aynı kaydı açabilmesi için besin kimlikleri ve biçim sırası korunur. [Katalog](../../data/catalog.mjs) |
| Değerin kaynağı ve ölçüm kapsamı görünür. | Eksik ölçüm «veri yok», kaynakta bildirilen sıfır `0`, bazı malzemeleri eksik bir toplam `≥` ile gösterilir. Ölçüm, tarif hesabı ve günlük referans etiketi kendi anlamını taşır. [Veri araştırması](../DATA_RESEARCH.md) |
| İlk iş besini bulmaktır. | Keşfet’te arama öndedir. Kategoriler ve filtreler gerektiğinde açılır. Kuru meyveler Meyveler, Yeşil yapraklılar ve Kök ve yumrular Sebzeler, Soya ürünleri Baklagiller altında yer alır. [Kategori yapısı](../../src/catalog-tree.js) |
| Günlük tarihle, tarif porsiyonla çalışır. | Tarif saklanır ve porsiyona göre hesaplanır. Günlük tarihe bağlı kayıtlardan oluşur. Günlük Toplam Tarif, mevcut tarifleri öğün öğün gösterip birleştiren bir özettir. [Günlük rehberi](../PERSONAL_DAILY.md) · [Tarif görünümü](../../src/views/recipe.js) |
| Uygulama kişisel kayıtları cihazda tutar. | Tarifler, günlük ve tercihler cihazda saklanır. Yedek dışa ve içe aktarılabilir. [Depolama kodu](../../src/store.js) |
| Fragaria kimliğinin başlıklardaki karşılığı Bricolage Grotesque’tir. | Okunabilirlik için seçilen yazı tipi ayarı başlıklara da uygulanabilir. Aion isteğe bağlı bir rehberdir. [Tipografi kararı](../DEPENDENCIES.md#bricolage-grotesque-başlık-yazısı--2026-11-15) · [Aion](AION.md) |

## Çalışmayı devralırken

1. GitHub’daki `main` dalını ve yerel çalışma ağacını kontrol et. Yayındaki sürümü ve son değişiklikleri sürüm notlarından doğrula. [Sürüm notları](../RELEASE_NOTES.md)
2. Açık işleri ve doğrulama durumunu incele. Bir kararın ne zaman alındığını araştırırken ilgili Forge kaydını ve commit’i birlikte oku. [Durum kaydı](../../project_state/CURRENT_STATE.json) · [Forge günlüğü](../../project_state/FORGE_LOG.md) · [Yol haritası](../ROADMAP.md)
3. Besin verisi değişiyorsa kaynak, birim ve tüketim biçimini kayıtla karşılaştır. Web dağıtımı `main` dalını izler. Yerel derleme, uzak dağıtım ve canlı uygulama için doğrulama yolu README’dedir. [Veri araştırması](../DATA_RESEARCH.md) · [Web yayını](../../README.md#web-yayını)

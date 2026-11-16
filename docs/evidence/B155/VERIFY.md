# B155 · Gün kurusu kayısı ve kuru meyveler · beta.42

16 Kasım 2026. Başlangıç `9bee2ea03cad1597fae6530dfc427dd56f1bb3e3`,
dal `ccr-1e1934aa-iv8aev`. Kullanıcı isteği öncelikli; önceki kapsam işi B156.

14 yeni kimlik; kuru meyveler14→28 kayıt, toplam707 besin/853 biçim. Eski
niş muz tozu tercihi değişmediği için varsayılan listede27 kuru kayıt görünür.
Gün kurusu ayrı seçilir; eski kuru kayısı09032 kaydı aynıdır.

## İncelenen kaynak ve sınır

Yerel USDA SR28 FOOD_DES tüm meyve tanımları, NUT_DATA tam bileşen kaydı,
mevcut2026 Foundation NDB eşleme alt kümesi (424 kayıt) ve FNDDS yerel alt
kümesinin adları kontrol edildi. Foundation dosyası NDB numarası olan kayıtlarla
sınırlıdır; bütün çevrimiçi katalog veya her marka tarandı iddiası yoktur.
Kaynak/lisans/özet: data/raw/USDA_SR28_SOURCE.json ve
data/raw/USDA_FDC_FOUNDATION_SOURCE.json. Mevcut USDA public domain/CC0
izinleri geçerlidir; yeni harici veri lisansı eklenmedi.

| Yeni seçim | SR28 NDB | Kaynak tanımı | kcal/100g |
|---|---|---|---|
| Kuru mango (şekerli) | 09178 | Mango, dried, sweetened | 319 |
| Kuru armut | 09259 | Pears, dried, sulfured, uncooked | 262 |
| Kuru Trabzon hurması | 09264 | Persimmons, japanese, dried | 274 |
| Kuru turna yemişi (şekerli) | 09079 | Cranberries, dried, sweetened | 308 |
| Kuru yaban mersini (şekerli) | 09163 | Blueberries, dried, sweetened | 317 |
| Kuru hünnap | 09147 | Jujube, Chinese, fresh, dried | 281 |
| Kuru liçi | 09165 | Litchis, dried | 277 |
| Kuru longan | 09173 | Longans, dried | 286 |
| Muz cipsi (kızartılmış) | 19400 | Snacks, banana chips | 519 |

Gün kurusu kayısı, kuru dut, çilek, ananas ve kivide ayrı doğrulanmış ölçüm
bulunmadı. v/s boş, USDA null; değerler sıfır değildir. Taze meyve, şeker
ilaveli ürün veya kükürtlü kayısı değerleri bu kimliklere kopyalanmadı.
Kullanıcıya neden ve ambalajdan Kendi besinim ekleme yolu gösterilir.
Kükürtsüz kimlik, belirli bir markanın alerjen sertifikası olarak sunulmaz.

Kuru turna yemişi/yaban mersini/hünnap, önceki taze kayıttaki kuru biçimle
aynı analizi paylaşır; bu açık notta belirtilir. Eski biçim indeksleri korunur.
Şekerli ürünler ve kızartılmış muz adlarında ayrılır. Armut sülfit işaretli.

## Doğrulama

-156/156 birim: ham USDA enerji/protein eşleşmesi, boş veri ve eş adlar,
  paylaşılan ölçümlerde tam değer/kaynak eşitliği,707 tekil SVG.
-Web/PWA + tek HTML11,25MB,24 bildirim PASS.
-`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/browser/dried-fruit.spec.mjs tests/browser/apricot-name.spec.mjs`:12/12 PASS(33,5sn).
-TR/EN desktop/phone; Meyveler→Kuru meyveler, arama, gün kurusunda veri yok,
  kaynaklı mangoda319kcal, ikisi tarifte≥319, aynı referanslarla yenileme.
-Açık/koyu katalog axe WCAG2.1AA0 ihlal. Kuru bölüm ve mobil veri boşluğu
  ekran görüntüleri incelendi.
-693 önceki besin kaydının her alanı tam aynı.8070 korunan geniş kayıt ve
  ana listeye taşınan6 kaynağın bütün besin değerleri de tam aynı.
-Deterministik veri üretimi;719+8070=8789 SR28 kapsamı, kayıp kaynak yok.
  `git diff --check` PASS.

Fiziksel cihaz, ekran okuyucu, yerel Firefox/WebKit/native NOT_RUN. Yeni
bağımlılık, native Release veya mağaza yayını yok. Web yayınları gönderimden
sonra canlı sürüm ve normal akışla ayrıca doğrulanır.

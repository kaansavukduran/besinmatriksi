# B152 · Soya ürünleri Baklagiller altında · beta.39

16 Kasım 2026. Başlangıç `8d18bdcad4f6d62cc5abb234353bf0f1b9fc9012`,
dal `ccr-1e1934aa-iv8aev`. Kullanıcının son isteği önceliklidir; Foundation/FNDDS
genişletmesi B153'e taşınmıştır.

Soya ürünleri ayrı üst sekmeden kaldırıldı. Baklagiller seçilince normal
baklagiller ve Soya ürünleri ayrı başlık/ızgaralarla gösterilir. Tümü sırası,
kategori sayacı, arama, alt başlık içi sıralama, beslenme filtresi ve iki besin
seçicisi aynı sunum eşlemesini kullanır. Ayrıntıda Baklagiller › Soya ürünleri
yolu görünür. İçecekler altındaki soya sütleri önceki kullanıcı kararıyla korunur.

Ham kategoriler, 693 besinin bütün kimlikleri/839 biçimi, ölçümleri ve bilimsel
referanslar değişmedi. Her besin Tümü'nde bir kez, tek üst kategori altında
bulunur. Eski tofu referansı `{t:'c',id:'tofu_sert',f:0}` aynıdır; tekrar ekleme
tek satırda 200g olur ve yeniden açılışta korunur. Veri göçü yoktur.

Doğrulama:
- `node --test --test-isolation=none tests/*.test.mjs`:152/152 PASS.
- `npm run build` ve `npm run build:single`:PASS; tek HTML11,23MB.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/browser/catalog-tree.spec.mjs tests/browser/diet.spec.mjs`:24/24 PASS (1,3dk).
- TR/EN masaüstü/telefon; Tümü ve seçili kategori başlıkları, sayaç, arama,
  sıralama, ayrıntı yolu, tarif seçicisi ve kayıt sürekliliği. 320px/28px/%200
  ve vegan filtrede soya başlığı/tofu erişilebilirliği PASS.
- Normal girişten açık/koyu Baklagiller sayfasında axe WCAG2.1AA:0 ihlal.
  Masaüstü ve mobil ekran görüntüleri incelendi.
- `git diff --exit-code -- src/data/foods.json src/data/foods-ext.json src/data/efsa.json`:PASS;
  `git diff --check`:PASS.24 lisans bildirimi yeniden üretildi.

Fiziksel cihaz, ekran okuyucu, yerel Firefox/WebKit/native NOT_RUN. Önceki
beta.38'in262 genel Chromium testi bu sürümde tekrarlanmadı. Yeni bağımlılık,
yeni native Release veya mağaza yayını yoktur. Otomatik web yayınları kod
gönderiminden sonra ayrıca canlı sürüm/akış üzerinden doğrulanır.

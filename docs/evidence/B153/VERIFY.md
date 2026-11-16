# B153 · Marka ile Keşfet ve kaydırmasız masaüstü kategorileri · beta.40

16 Kasım 2026. Başlangıç `90da78eb72117f0870dc458faaec315a37e4b296`,
dal `ccr-1e1934aa-iv8aev`. Son kullanıcı isteği uygulanmıştır. Önceki
Foundation/FNDDS genişletme önerisi B154'e taşınır.

Logo/ad gerçek bir düğmedir. Bütün ana sekmelerden Keşfet ana görünümüne döner,
arama/kategori/ayrıntı seçimini kapatır ve sayfa başına gelir. TR/EN erişilebilir
adı, Enter/boşluk ve görünür klavye odağı vardır. Tarifler, filtreler, görünüm,
karşılaştırma ve diğer taslaklar korunur. Yeni veri biçimi/ayar eklenmedi.

701px üstünde varsayılan kategori düğmeleri satırlara yerleşir. 1440px'de dört
satır, scrollWidth=clientWidth=1392px. 768/1024/1440px'de bütün düğmeler ekrana
sığar. Uzun adlar/büyük yazı kırılır. Telefonun dokunmatik kaydırması ve kayıtlı
eşit kutulu ızgara tercihi korunur. Kategori sırası/sayaçları değişmez.

Doğrulama:
- `node --test --test-isolation=none tests/*.test.mjs`:152/152 PASS.
- `npm run build` ve `npm run build:single`:PASS; tek HTML11,23MB.
- `npm run notices`:24 bildirim; besin/source veri dosyaları değiştirilmedi.
- Chromium ilk koşumunda catalog-tree/diet dosyalarının24 mevcut vakası PASS.
  Yeni12 kontrol yanlış atıştırmalık kimliği, sınıf sonu boşluğu ve fare odağına
  klavye halkası beklentisi nedeniyle FAIL idi. Bunlar test kusurları olarak
  düzeltildi, ürün hatası sayılmadı.
- Son koşum `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/browser/header-navigation.spec.mjs`:12/12 PASS (1dk).
  Bu iki koşum tek36/36 başarılı koşum olarak sunulmaz.
- TR/EN desktop/phone: logo SVG/ad tıklaması, bütün sekmeler, Enter/boşluk,
  klavye odağı, seçili Keşfet, boş arama, Tümü; tarif/ayar ham kayıtları aynı,
  yeniden açılışta malzeme korunuyor.768/1024/1440px satırları ve son kategori.
-320/960px,28px yazı,%200 ölçek, gizlenmiş simgeler ve her iki ızgara tercihi:
  ana eylemler erişilir, belge yatay taşmaz; kullanıcı ölçeği düşürülmedi.
- Normal girişte açık/koyu ana sayfa: axe WCAG2.1AA0 ihlal. Masaüstü ekran
  görüntüsü incelendi. `git diff --check`:PASS.

Fiziksel cihaz, ekran okuyucu, yerel Firefox/WebKit/native NOT_RUN. Yeni
bağımlılık, native Release veya mağaza yayını yoktur. Web yayınları gönderimden
sonra sürüm ve canlı akış üzerinden ayrıca doğrulanır.

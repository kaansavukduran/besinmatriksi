# B145 · beta.32

Yetkili depo kaansavukduran/besinmatriksi, dal ccr-1e1934aa-iv8aev. Başlangıç 8d38ed53b95b2f707eab42ba51cc65371a7025d2. Kullanıcının son görsel revizyonu önceki veri genişletme önerisinin önüne alındı.

Kategori başlıkları normal17px kökte25,5px; üst/alt padding8,5px, üst margin34px. Emojiler sadece liste ayraçlarından kaldırıldı. Sıralama yazısı13,94px; masaüstü32px, dokunmatik44px min hedef. Kullanıcının büyük yazı ve arayüz ölçeği ayarları korunur.

PASS: node --test --test-isolation=none tests/*.test.mjs128/128; npm run build; npm run build:single; git diff --check.

PASS: PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/browser/app.spec.mjs --grep 'besin kartları kısa özet|çoklu seçimle|Keşfet tek katalogda' --reporter=line6/6. Normal sıralama, çoklu ekleme ve kategori→besin akışı masaüstü/telefon.

PASS: üretim önizlemesinde6 ek manuel otomasyon bağlamı: TR/açık veEN/koyu;1440×1000masaüstü,390×1000dokunmatik,320×1000dokunmatik+28pxyazı/%200ölçek. Her bağlamda tüm29kategori başlığı emojisiz; heading/root font oranı1,5; padding/root0,5; kök veya sıralama düğmesi taşması yok. Enerji→Önerilen gerçek tıklamaları çalışır, pageerror yok. Görsel masaüstü/telefon yakalamaları çalışma alanında incelendi.

Fiziksel cihazlar, Firefox/WebKit ve native kurulum bu küçük revizyonda NOT_TESTED. Yeni kalıcı test eklenmedi; mevcut davranış testleri kullanıldı. Veri/kayıt/ayar şeması değişmedi.

Yayın: mevcut GitHub dalı ve bağlı Vercel üretim hedefi; dağıtım ve canlı giriş sonucu teslimde ayrı doğrulanır. Native Release yok. Sonraki tek Forge B146: güncel açık Foundation/FNDDS kaynak kapsamı.

```text
GPT/Codex için: B145 kategori hiyerarşisi ve kompakt sıralama revizyonu tamamlandı. Sonraki B146; kullanıcı verisini ve erişilebilir font/ölçek tercihlerini koru.
```

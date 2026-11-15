# B146 · beta.33 kabul

Depo kaansavukduran/besinmatriksi; dal ccr-1e1934aa-iv8aev; başlangıçc2e29de9e7f62f203c624af2b3413d8d26ef6a00.

Dokuz günlük amino asit çubuğu; normal kayıtlı yetişkin ağırlığı/70kg açık örnek; Met/Phe ortak hedefe katkı; kısmi≥. Toplam protein, protein kalitesi ve özel hedefler korunur. Günlükte aynı referans sahibi. Ayrıntılı kaynak ve veri araştırması [RESEARCH.md](RESEARCH.md). Tam Katalog her iki kategori gezgininin sonunda.

- PASS npm run data. 315yeni ölçüm,72kaynak kaydı:16/3ana form,299/69geniş kayıt. Başlangıçtaki her v hücresi karşılaştırıldı,0eski değer değişimi.
- PASS npm run notices; node --test --test-isolation=none tests/*.test.mjs132/132. Kaynak CSVSHA256, mg dönüşümü, gerçek0, günlük referans, custom/child/special/partial/missing ve eski veriler.
- PASS npm run build; npm run build:single (11,12MB); git diff --check.
- PASS PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/browser/amino-daily.spec.mjs tests/browser/micro-catalog.spec.mjs tests/browser/personal.spec.mjs --reporter=line26/26 (1,4dk). Masaüstü1440×1000, telefon390×844, TR/EN. Yeni reflow320×900+28px/%200. Yeni8test; mevcut18mikro/katalog/kayıt ve kişisel offline regresyonu.
- PASS normal girişten nohut→miktar110g→tarif+günlük; ristretto→kısmi tarif; profil30yaş80kg→kaydet→günlük/tarif hedefi→yenile. Her9amino barı; protein referansıWHOya dönüşmez; missingbar yok, gerçek0bar boş, partial≥. Kaynak kataloğu son gezgin öğesi; normal katalog açılışı eski testte çalışır.
- PASS gerçek masaüstü amino bölüm görseli /workspace/b146-evidence/amino-desktop.png üzerinde incelendi. Sayısal miktar/yüzde hizaları, satırbarları ve ortak hedef notları görünür.
- NOT_TESTED fiziksel cihaz/native/ekran okuyucu/Firefox-WebKit bu artışta. Paket/Release/store yayını yok. GitHubCI ve Vercel canlı kabulü yerel kapılardan ayrı; teslimde bildirilir.

İlk birim koşumunda henüz güncellenmemiş sürüm lisans bildirimi, sonraki koşumda katalog arama bağlantısındaki eski ekin çeviri anahtarı yakalandı; bildirim üretildi/anahtar düzeltildi ve132/132yenidenPASS. İlk tarayıcı koşumu, testin yalnız mobilde görünen geri düğmesini masaüstünde istemesi nedeniyle durduruldu; mevcut ekranın normal arama yolu kullanılarak26/26PASS. Uygulama etkileşimleri forceclick ile geçilmedi.

Tek sonraki Forge B147.

```text
GPT/Codex için: B146 günlük amino asit barları ve315kaynaklı veri doldurma tamamlandı. Bilinmeyeni0yapma; protein toplam/kaliteyi değiştirme. Yeni referansın WHO ortalama yetişkin olduğunu ve Met/Phe ortak hedefe katkısını koru. Sonraki B147.
```

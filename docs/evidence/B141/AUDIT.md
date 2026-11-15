# B141 — Besin Matriksi, 15 Kasım 2026

Hedef: `kaansavukduran/besinmatriksi`, üretim/varsayılan dal `ccr-1e1934aa-iv8aev`. Başlangıç commit'i `5f346c899e270a980e6d6752128a3b2fdb50e4d3`; karşılaştırma bu commit ile bu Forge'un yerel farkıdır. Sürüm: `1.1.2-beta.30`. `git fetch --all` ve uzak dal uçları doğrulandı. Önceki B139/B140 kayıtları okundu; eski paket kanıtları bu sürüme taşınmadı.

Kullanıcının istediği Fragaria Unslop, Unslop ve Yazılım Denetle akışları uygulandı. Bu uygulamada AIONIA oyun/evren kuralları kullanılmadı. Görsel referanslar kopyalanmadı: tabak, yaprak/kase marka işareti ve yeni besin çizimleri yerel SVG kodudur; dış servis, CDN veya yeni bağımlılık yoktur.

## Bulgular ve onarımlar

| Kimlik | Önem | Konum ve kanıt | Kullanıcı etkisi / onarım | Kabul |
|---|---|---|---|---|
| AUD-01 (B140 devamı) | Orta | `collections.js`, `store.js normalizeRecent`: eski `kudret_narı` kimliği tarif/günlükte taşınırken koleksiyon/recent'te taşınmıyordu. İki odaklı regresyon önce FAIL. | Eski favori kayboluyor, son bakılan düşüyordu. Ortak `validRef` yoluyla göç, kanonik tekilleştirme, varlık kontrolünden önce düzeltme. | PASS: birim + gerçek tarayıcıda eski kaydı aç, yeniden adlandır/kaydet, reload, tekrar aç; sentetik kayıt. |
| UI-01 | Düşük | `app.js renderExplore`, `styles.css`: masaüstünde aynı katalog hem listede hem sağdaki periyodik tabloda çiziliyordu; başlangıç ekran görüntüsü kaydedildi. | Tek katalog, anlamlı kategori/sayı başlığı, sıcak açık/koyu tema, kısa başlangıç ve hızlı kategori bağlantıları. Bu kısım kullanıcının tasarım isteğidir. | PASS: kategori ve arama tek listeyi süzer; besin açılır; mobil/geniş ekran aynı kayıt bir kez gösterilir. |
| UI-02 | Orta | `styles.css`: 28 px yazı + %200 ölçekte 320/390 px'de sekmeler hit target'ı örtüyor; Ayarla kart sınırının dışına, sabit minimumlu karşılaştırma kartı ebeveyninin dışına taşıyordu. | Akışta grid alanları, yerel genişliğe göre satır düzeni, ölçekli navigasyon, esneyen grid alt sınırları. | PASS: 320/390/768/1440 px, normal ve 28 px/%200; kapalı/açık tarif ve karşılaştırmada gerçek bounds + sibling örtüşme + ebeveyne sığma; gerçek nudge, preset, tablo ve reload sonucu. |
| UI-03 | Düşük | Büyük ölçek kontrolünde marka, tarif adı/aksiyonları, kapsam rozeti, amino asit çubukları ve yüzde hücreleri yatay kaçıyordu. | Metin sarma ve dar alanda tek sütuna akma; gerekli iki boyutlu karşılaştırma tablosunun kendi kaydırması korunur. | PASS: aynı 4 genişlik ve iki ölçek, kök belge yatay taşması yok. |

## Kapsam genişlemesi

- Katalog 627 → 664 kayıt (+37); niş besinler varsayılan gizli olduğunda ana ekranda 627 görünür. Başlık gerçekten görünen listeyi sayar.
- Ayrı kategoriler: Kahveler (19), Fast food ve pizza (11), Atıştırmalıklar (15). Mevcut kahve/patates kayıtları kimlikleri korunarak uygun kategoriye taşındı.
- Espresso, filtre, kafeinsiz türler, Americano, latte, cappuccino, flat white, cortado, macchiato, mocha, buzlu latte; pizza/dondurulmuş pizza, burger/nugget/soğan halkası; cips, çikolata, şekerleme, bisküvi/gofret.
- Americano ve sütlü kahveler açık malzeme oranlarıyla tarif tahmini. Tarif fincanı gramı ve kaynak türü doğru gösterilir. Isıyla değişen bileşenler için sahte ölçüm üretilmez.
- Ristretto, lungo ve sade Türk kahvesi için doğrulanmış ayrı ölçüm yok: açık veri boşluğu. Şekerli Türk kahvesinin FNDDS yaklaşımı ayrı açıklanır; sade filtreyle eşitlenmez.
- Dondurulmuş pizzada **fırınlanmış ağırlık**, nuggetın hazır/donmuş biçimleri açıkça ayrılır. Hayvansal işareti/gizleme, alerjen ve TR/EN ad/not/arama korunur.

## Doğrulama

| Kontrol | Sonuç ve koşul |
|---|---|
| Veri üretimi | PASS `npm run data`; generated içerik kaynağıyla yeniden üretildi. |
| Birim/veri/çeviri | PASS `node --test --test-isolation=none tests/*.test.mjs`: 116/116 gerçek alt test. Standart `npm test` de PASS (bu ortam alt süreç başına 21 dosya sonucu gösterir). |
| Kaynak/lisans | PASS `node scripts/build-notices.mjs --check`: 23 bildirim. |
| Web / tek dosya | PASS `npm run build`, `npm run build:single`; Vite çıktı + yerel SW. |
| Dev yerleşim regresyonu | PASS 10/10: Chromium masaüstü/telefon, TR, 320/390/768/1440; normal ve 28 px/%200. Harici istekler bloklu, sentetik yerel kayıt. |
| İlk tam paket tarayıcı koşumu | 158 PASS; 2 BLOCKED: yönetilen Chromium `file://` navigasyonunu `ERR_BLOCKED_BY_ADMINISTRATOR` ile engelledi. Ürün hatası olarak sayılmadı. Aynı tek dosyanın dış istek olmadan `setContent` girişiyle gerçek uygulama akışı PASS. |
| Son paket tarayıcı koşumu | PASS kapsamı 170/170: tam koşum 168 PASS + 2 eski Americano veri-boşluğu beklentisi FAIL; yeni tarif davranışı/etiketi/porsiyonu doğrulayan beklentilerle odaklı B117/B141 koşumu 2/2 PASS. Komut: `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test --grep-invert 'tek HTML dosyası internet olmadan yerelden açılır' --reporter=line`; ardından `npx playwright test tests/browser/app.spec.mjs --grep 'B117/B141'`. Önceden kanıtlanan iki file:// ortam engeli son koşuma dahil edilmedi. |
| Açık/koyu erişilebilirlik | PASS: yerel üretim paketinde 390×844, açık/koyu tema, katalog ve latte ayrıntısı; axe WCAG 2.1 AA dört durumda 0 ihlal. İlk yardımcı script browser.newContext gerektirdiği için çalışmadı; doğru context ile tekrarlandı. Otomatik kontrol fiziksel ekran okuyucu kabulü değildir. |
| Pages alt yolu | PASS `/besinmatriksi/` altında manifest/SW kapsamı, çevrimdışı reload, tarif kalıcılığı ve yeni besin seçimi; masaüstü/telefon. Canlı Pages ilk etkinleştirmesi ayrı. |
| Yerel fark | PASS `git diff --check`; yeni paket yok, veri kaybı yok. |
| Fiziksel / diğer tarayıcılar | NOT TESTED: gerçek telefon, ekran okuyucu, bu ortamda Firefox/WebKit ve native uygulama kurulumu. |

## Yayın sınırı

Vercel hedefi `team_C40LIuGjYVQBKzcqAIJArIWd / besinmatriksi`, mevcut üretim dalıyla aynı. Web yayını kullanıcının bu çalışmadaki isteği kapsamındadır. Native Release/store yayını yapılmaz.

Pages workflow üretim dalı push'unda test + build + deploy çalıştırır; resmi action sürümleri SHA ile sabittir. Repo Pages yönetimini açan araç bu bağlantıda yoktur; CLI oturumu geçersizdir. Denenen canlı URL `https://kaansavukduran.github.io/besinmatriksi/` 404 döndü. İlk kurulum: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Uzak Pages sonucu ayrıca raporlanır; yerel alt yol testinin canlı yayın olduğu iddia edilmez.

Tek sonraki Forge önerisi: **B142**, fiziksel telefon ve ekran okuyucuyla yeni katalog/ölçek kabulü.

```text
GPT/Codex'e verilecek prompt: B141 kapsamındaki doğrulanmış kod kusurları giderildi. Aynı sürümde npm test, npm run data, npm run build, npm run build:single ve npm run test:browser ile yeniden doğrula. file:// ortam engelini ürün kusuru sayma. Pages'in ilk etkinleştirilmesi ve fiziksel cihaz/ekran okuyucu testleri ayrı doğrulama boşluklarıdır.
```

## Görsel kanıt

- [Başlangıç masaüstü](before-desktop.png) · [Yeni masaüstü](after-desktop.png)
- [Yeni mobil](after-mobile.png)
- [Başlangıç 320 px malzeme kartı](before-recipe-320.png) · [Yeni 320 px malzeme kartı](after-recipe-320.png)

# B147 · beta.34

Depo kaansavukduran/besinmatriksi; dal ccr-1e1934aa-iv8aev; başlangıçade8e9d832619b3b7d3cc9af9ae6e1829bed85a2. Son açık kullanıcı isteğiyle önceki veri genişletme önerisi ertelendi.

## Kusur ve onarım

Önceki derive, çok malzemeli toplamda gerekliAAanahtarlarından tek birinin kapsamı eksilince_aaProtein'i tamamen siliyordu; derivedCard yalnız d.aas varsa grafiği çiziyordu. Böylece ölçülmüş değerler ve bütün grafik sessizce kayboluyordu. Tam ölçümlü tarif zaten çalışıyordu; şimdi eksik ölçümlü tarifin bilinen bilgisi de görünür.

Ortak assessAmino: tam dokuz grup→eski kesin skor/sınırlayıcı; kısmiAA+tamprotein→bilinen toplam/TÜMprotein üzerinden≥alt sınırlar. Eksik malzemenin proteini paydadan çıkarılmaz; oran yapay biçimde yükseltilmez. Bütün gruplarda bilinen değer varsa minimumlarının alt sınırı skor≥ olarak gösterilebilir; tamamen eksik grup varsa genel skor hesaplanamaz. Eksikprotein veya0protein oran üretmez; bilinenmg, açıklama ve dokuz boş referans çubuğu korunur. Kesin sınırlayıcı yalnız tam veride yazılır.

Eksik hücreler, kaynak besin adları ve bileşenleriyle açılır listede. scaleItem/aggregate/scaleAggregate geçici hesap bağlamını taşır; kayıt/ayar/yedek şeması değişmez. İki ekrandaki ortak renderMatrix aynı kalite grafiğini verir. Günlük ihtiyaç yüzdeleri, toplam protein ve kaynak veriler değişmedi. Tek besine özel kimlik kartı, doğal olarak tarifin malzeme listesi yerine çoğaltılmaz.

## Gözlenen kabul

- PASS node --test --test-isolation=none tests/*.test.mjs135/135. Tek maddeli tarif eşitliği; bileşenlerin ağırlıklı toplamı, yalnız AA ölçülen alt küme proteinini kullanmama; karşılıklı tamamlayan sentetik iki profilin50%→125%birleşimi; ölçek/permutasyon; kısmi/bilinmeyen/0protein. Eski kısmi diğer oran güvenliği testi korunur.
- PASS npm run notices, npm run build, npm run build:single (11,12MB), git diff --check.
- PASS PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/browser/recipe-amino.spec.mjs tests/browser/amino-daily.spec.mjs tests/browser/micro-catalog.spec.mjs --reporter=line28/28 (1,3dk).
- Son açıklama metni ve ikinci tam malzeme UI akışı eklendikten sonra final üretilmiş pakette PASS aynıexecutable ile npx playwright test tests/browser/recipe-amino.spec.mjs --reporter=line8/8 (32,6sn). Önceki28'e ek8yeni benzersiz test iddiası yok.
- Masaüstü1440×1000, telefon390×844; TR/EN. Ek320×900+28pxyazı/%200ölçek. Nohut tekseçim→tarifeekle: skor ve9yüzde birebir. Porsiyon/per100aynı kaliteoranı. Elma ekle→birleşen profil güncellenir→sil→eski profil. Kurutulmuş yabanmersini ekle→kısmi≥→eksik malzeme/bileşenleri aç→yenile→durumkalır→sil→tam skor geri gelir. Ristretto ekle→eksikprotein nedeni ve9satır korunur. Normal eylemler; forceclick yok.
- Gerçek kısmi tarif görseli /workspace/b147-evidence/recipe-partial.png incelendi:9çubuk,≥skor veeksikölçüm dökümü. Kaynak görüntüsü görsel düzenleme yapılmadan uygulamadan yakalandı.
- PASS final kısmi tarif grafiğinde axe WCAG2.1AA otomatik kontrolü:0ihlal (yönetilen Chromium, yerel üretim önizlemesi).
- Fiziksel cihaz/native/Firefox/WebKit/ekran okuyucu bu artıştaNOT_TESTED. Native Release/store yok. YeniCI ve Vercel canlı kabulü yerel testlerden ayrı; teslimde bildirilir.

Tek sonraki Forge B148.

```text
GPT/Codex için: B147 tarif/Keşfet AA eşitliği onarıldı. Eksik ölçüm grafiği gizlememeli; kısmiAAoranı tam toplam proteine bölünür, kesin sınırlayıcı uydurulmaz. 135birim+28regresyon+8final tarif testiPASS. SonrakiB148.
```

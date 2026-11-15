# B142–B144 — beta.31 devir ve doğrulama

15 Kasım 2026. Hedef: `kaansavukduran/besinmatriksi`, `ccr-1e1934aa-iv8aev`; başlangıç `34aa20f1c735a813265cf3322cfc28f6ab9c3062` ve bu commit'e göre son çalışma farkı. Kullanıcının yeni açık isteğiyle B142 tasarım/font, B143 kaynak kataloğu, B144 mikro görünüm ve skill paketleri aynı çalışma içinde tamamlandı. Önceki fiziksel cihaz kabulü tamamlandı sayılmadı.

## Kullanıcıya görünen sonuç

- Başlıklarda yerel Bricolage Grotesque700; gövde ve sayısal veri okuma fontunu korur. Atkinson/OpenDyslexic/Lexend/Andika seçimlerinde başlık da aynı okunabilirlik fontuna geçer. Türkçe glifler hem font metadata'sında hem gerçek tarayıcıda doğrulandı. Fontsource5.3.0 exact, OFL-1.1 ve özgün telif bildirimleri pakette.
- Hero'nun ayrı renkli yuvarlak paneli kaldırıldı. Katalog hizalı satır/ince ayırıcıya dönüştü; kapsül kontrol ailesi daha ölçülü oldu. Kaydırma sahibi tablo, form girdisi, ayar grubu ve düzenlenebilir malzeme kartı gibi anlamlı sınırlar korundu. Kaydedilmiş tema/font/ölçek/radius tercihleri sıfırlanmadı.
- 664 küratörlü besin/810 biçim korunuyor. **709 küratörlü SR28 kaydı +8.080 geniş kayıt =8.789/8.789 kaynak kaydı**, 25/25 grup. Geniş listeye5.097 kayıt eklendi. Ana ekrandaki kaynak katalog yolunda ayar açma zorunluluğu yok. 80 kayıtlık sayfalar, grup filtresi, özgün İngilizce ad/NDB araması; ana arama kısa önizlemesi sınırlı, tüm sonuçlar sayfalı katalogda erişilebilir.
- 28 yaygın vitamin/mineral özeti tek besin, tarif ve günlükte çalışır. Miktar/birim, seçilen referans, gerçek sıfır, veri boşluğu ve kısmi≥ toplam ayrıdır. Tarif/günlük adları mevcut katkı ve kaynak dökümüne gider. 244 bilimsel alanın ayrıntısı ve CSV korunur.
- Cronometer davranış/kapsam incelemesi [ayrı araştırma notunda](CRONOMETER_RESEARCH.md). **Cronometer'ın kapalı/lisanslı kayıtlarının tamamıyla eşitlik doğrulanmadı.** Buradaki tamlık iddiası depodaki açık SR28 kaynağına aittir. 2015 kaynak arşivi ve marka/içerik belirsizliği görünürdür.

## Doğrulanmış kusurlar

| Kimlik | Önem | Kanıt ve etki | Onarım ve kabul |
|---|---|---|---|
| CAT-01 | Orta | 8.789 ham kaydın5.097'si grup/ürün filtreleri nedeniyle görünmüyordu. | Ayrı kaynak kataloğunda tüm SR28 kapsamı; kaynak kimliklerinin birleşimi ve her kayıt grubuna erişim testli. |
| CAT-02 | Orta | showExt kapalı, yalnız koleksiyonda x:06190 kayıtlı: normal açılışta veri yüklenmiyor ve kalıcı “Kayıt bulunamadı” çıkıyordu. Yeni regresyon önce FAIL. | Ortak yükleme/hata bileşeni hem kayıt hem katalog yolundan lazy yüklemeyi başlatır. Aynı test masaüstü/telefon2/2PASS; öğe ve NDB ayrıntısı açılır. Kaynak gerçekten yüklendikten sonra olmayan kimlik yine gerçek eksik kayıttır. |
| MICRO-01 | Orta | RAE ölçümü, farklı RE eşdeğerliğindeki EU800 referansına doğrudan bölünüyordu. | Birincil kaynaklarla uyumsuzluk doğrulandı. Otomatik yüzde kaldırıldı; RAE miktarı ve aynı birimde özel hedef korunur. Saf model ve gerçek UI testli. |
| UI-01 | Orta | 320px+28px/%200: ayrıntı başlığı min200px, miktar çıktısı min7ch nedeniyle kök yatay taşması. | Doğal sarma ve dar alanda miktar satır düzeni. TR/EN320/390 normal/büyük ölçek; gerçek seçim, miktar değişimi, kaynak tıklamasıyla PASS. |
| UI-02 | Düşük | Mikro bölümünü kapatma genel toggle sahibine bağlanmadığı için sekme değişiminde açılıyordu. | Aynı S.closed sahibine bağlandı; tarif→günlük arasında kapalı durum korunur. |
| UI-03 | Orta | Etkileşimsiz kısa başarı bildirimi geri düğmesinin hit target'ını kapatabiliyordu. | Bildirim metni/role=status korunup pointer-events:none oldu. Normal tıklama akışları PASS. |
| LOAD-01 | Orta | Katalog modülü indirilemediğinde yalnız yükleniyor görünümü ve yakalanmayan hata riski vardı. | Tek paylaşılan yükleme, açık hata ve normal sayfa yenilemeyle kurtarma. Kontrollü ağ reddi→yenile→kaynak açılışı ve eski tarifin korunması PASS. |

Tasarım yönü kullanıcı onaylı revizyondur; yuvarlak bir köşe kendi başına davranış hatası olarak raporlanmadı.

## Test kanıtı

| Kapı | Sonuç |
|---|---|
| Veri | PASS `npm run data`; 664/810 küratörlü korunur, 8.789/8.789 SR28 kapsamı, 25 grup; kaynak kimliği, ölçülmüş0 ve veri boşluğu testleri. |
| Birim | PASS `npm test` ve `node --test --test-isolation=none tests/*.test.mjs`; açık alt test sayımı128/128. |
| Bildirimler | PASS `node scripts/build-notices.mjs --check`:24 özgün lisans/kaynak bildirimi. |
| Derleme | PASS `npm run build`, `npm run build:single`; final beta.31 PWA ve tek HTML. |
| Tam paket tarayıcı | PASS184/184: `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test --grep-invert 'tek HTML dosyası internet olmadan yerelden açılır' --reporter=line` (7,5dk). |
| Son koleksiyon onarımı sonrası | Final kaynak yeniden derlendi. PASS16/16: `npx playwright test tests/browser/micro-catalog.spec.mjs tests/browser/fonts.spec.mjs --reporter=line` (aynı Chromium executable env ile,44,1sn). Bunların2'si yeni koleksiyon kabulü,14'ü tekrarlanan son akışlardır. Toplam186 benzersiz tarayıcı kontrolü doğrulanmıştır; bu bir tek186-test koşumu iddiası değildir. |
| Hata/kurtarma | Kontrollü failed import, arayüzde gerçek hata/yenileme, kayıt koruma; tam yeni test dosyasında testli. |
| Görünüm | Chromium masaüstü1440×1000, telefon390×844; ek320/390/768/1440 reflow ve28px/%200. TR/EN; gerçek tıklamalar, element/ebeveyn sınırları, örtüşme, kök taşma, kalıcılık. |
| Otomatik erişilebilirlik | Son pakette açık/koyu tema mikro ekranı WCAG2.1AA axe:0 ihlal. Tam paketin önceki ekran kontrolleri de PASS. |
| file:// | BLOCKED: yönetilen Chromium yerel dosya açılışını ERR_BLOCKED_BY_ADMINISTRATOR ile engelliyor. İki bu tür kontrol son yerel koşuma alınmadı; aynı tek HTML'nin harici istek olmadan normal uygulama akışı pakette testli. |
| Fiziksel / diğer motorlar | NOT TESTED: bu beta.31 için fiziksel cihaz/ekran okuyucu/native kurulum. Firefox/WebKit yerel koşulmadı; GitHub CI sonucu yerel Chromium kabulünden ayrı. Önceki34aa20f CI'sı Chrome/Firefox/WebKit/iPhone/iPad için başarılıydı, yeni sürüm kanıtı sayılmadı. |
| Fark | PASS `git diff --check`; kaynak/genel katalog kimlikleri ve eski kaydedilmiş kullanıcı verisi korunur. |

## Skill güncellemeleri

Unslop ve Fragaria Unslop'un ana yönergeleri, UI referansları ve tekrar kullanılabilir inceleme senaryoları geliştirildi: anlamlı konteyner/arka plan rolü, ölçülü yuvarlaklık, onaylı başlık kimliği, gerçek font/glyph/offline doğrulaması ve erişilebilir font önceliği. Her şeyi köşeli/kartsız yapma veya Bricolage'ı ilgisiz projelere dayatma yok.

Tam iki ZIP, birleşik ZIP, değişim farkı, kaynak manifesti ve Türkçe uygulama notu ayrı çalışma alanında teslim edildi. 16 yapısal kontrol,17 iç bağlantı ve ZIP CRC PASS. **Yüklü native cloud skill sürümleri NOT_APPLIED:** bu oturumda yazma aracı yoktur. Yeni plugin/skill kimliği oluşturulmadı; özel referans paketleri bu halka açık proje deposuna aktarılmadı.

## Görsel kanıt ve yayın

- [Yeni masaüstü](desktop.png), [mobil](mobile.png), [kaynak kataloğu](catalog-mobile.png).
- [Mikro özet](micro-desktop.png): tam bileşen yakalaması için1440×1600 tarayıcı penceresi; normal1440×1000 etkileşim kabulü ayrı.
- Önceki panel düzeni: [B141 görüntüsü](../B141/after-desktop.png).

Vercel hedefi öncekiyle aynı proje/ekip ve üretim dalıdır; yeni commit'in READY ve canlı giriş kontrolü teslim mesajında ayrı doğrulanır. GitHub Pages ilk etkinleştirme engeli önceki çalışmada kanıtlanmıştır; yerel alt-yol/PWA kabulü canlı Pages yayını sayılmaz. Native Release/store yayını yapılmaz.

Tek sonraki Forge: **B145**, güncel açık Foundation/FNDDS kapsamını kaynak doğruluğu ve performans bütçesiyle genişletme. Fiziksel kabul ve cloud skill içe aktarma durumları ayrıca açık kalır.

```text
GPT/Codex'e verilecek prompt: B142–B144 doğrulanmış kod kusurları giderildi. beta.31 kaynaklarında npm test, npm run data, npm run build, npm run build:single ve npm run test:browser ile doğrula. Pages ilk etkinleştirme, native cloud skill içe aktarma ve fiziksel cihaz kabulü ayrı engel/boşluklardır; Cronometer kapalı katalog eşitliği doğrulanmış değildir.
```

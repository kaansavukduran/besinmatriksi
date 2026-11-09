# FORGE_LOG: Besin Matriksi

## B000 · 2026-11-08 · forge çekirdeği
- Kapsam: `CLAUDE.md`, `project_state/`, `docs/ROADMAP.md` eklendi; saatlik portföy Forge'una katıldı.
- Kanıt: `npm ci && npm test` → 9/9 PASS (UNIT_TESTED). Derleme/paketleme bu Forge'da NOT_RUN.
- Sonraki: **B001** ayar şeması sürümleme + ayar dışa/içe aktarma + sıfırlama.

## B001 · 2026-11-09
- Kapsam: Ayar v2 göçü, değer doğrulama, yalnız ayar dosyası ve bölüm sıfırlama.
- Kanıt: `npm test` → 23/23 PASS (UNIT_TESTED, toplu regresyon).
- Tarayıcı/paket kanıtı: henüz NOT_RUN; B013 içinde toplu çalışma zamanı kapısı var.
- Sonraki: **B002**.

## B002 · 2026-11-09
- Kapsam: Matriks bölüm görünürlüğü/sırası ve 24 öğeye kadar sabitleme.
- Kanıt: `npm test` → 23/23 PASS (UNIT_TESTED, toplu regresyon).
- Tarayıcı/paket kanıtı: henüz NOT_RUN; B013 içinde toplu çalışma zamanı kapısı var.
- Sonraki: **B007**.

## B007 · 2026-11-09
- Kapsam: 12 yerel görünüm profili, hızlı geçiş, güncelleme ve tam yedek kapsamı.
- Kanıt: `npm test` → 23/23 PASS (UNIT_TESTED, toplu regresyon).
- Tarayıcı/paket kanıtı: henüz NOT_RUN; B013 içinde toplu çalışma zamanı kapısı var.
- Sonraki: **B011**.

## B011 · 2026-11-09
- Kapsam: Türkçe karakter katlama, eş anlamlılar, 8 son arama ve temizleme.
- Kanıt: `npm test` → 23/23 PASS (UNIT_TESTED, toplu regresyon).
- Tarayıcı/paket kanıtı: henüz NOT_RUN; B013 içinde toplu çalışma zamanı kapısı var.
- Sonraki: **B012**.

## B012 · 2026-11-09
- Kapsam: TL/kg fiyat, toplam/porsiyon maliyeti, eksik fiyat kapsamı, etiket özeti.
- Kanıt: `npm test` → 23/23 PASS (UNIT_TESTED, toplu regresyon).
- Tarayıcı/paket kanıtı: henüz NOT_RUN; B013 içinde toplu çalışma zamanı kapısı var.
- Sonraki: **B014**.

## B014 · 2026-11-09
- Kapsam: Bozuk yedek ve kayıt doğrulama; özel besin kimliklerini eşleme; kayıp malzeme ağırlığı/kapsamı; kısmi oranları bastırma.
- Kanıt: `npm test` → 23/23 PASS (UNIT_TESTED, toplu regresyon).
- Tarayıcı/paket kanıtı: henüz NOT_RUN; B013 içinde toplu çalışma zamanı kapısı var.
- Sonraki: **B013**.

## B003a · 2026-11-09
- Kapsam: AB/TGK veya elle girilen hedefler; CSV yüzde temeli.
- Kanıt: kaynak `8864a29a94e91b5f8093929f82d9c5ffb7d8bc42`; `npm test` 29/29; `npm run data` sıfır fark; `npm run build` ve `npm run build:single` PASS.
- Çalışma zamanı: GitHub CI 42586943816, 20/20 tarayıcı testi PASS; yerel sistem Chromium 18 PASS + 2 file:// politikası nedeniyle SKIP, dosya açılışı GitHub CI üzerinde PASS.
- Düzey: RUNTIME_TESTED. Sonraki: **B004**.

## B004 · 2026-11-09
- Kapsam: kcal/kJ, g/oz gösterimi, ondalık ayracı ve birim yükseltme.
- Kanıt: kaynak `8864a29a94e91b5f8093929f82d9c5ffb7d8bc42`; `npm test` 29/29; `npm run data` sıfır fark; `npm run build` ve `npm run build:single` PASS.
- Çalışma zamanı: GitHub CI 42586943816, 20/20 tarayıcı testi PASS; yerel sistem Chromium 18 PASS + 2 file:// politikası nedeniyle SKIP, dosya açılışı GitHub CI üzerinde PASS.
- Düzey: RUNTIME_TESTED. Sonraki: **B005**.

## B005 · 2026-11-09
- Kapsam: Dört renkli tema, WCAG kontrast oranı ve tema dosyası.
- Kanıt: kaynak `8864a29a94e91b5f8093929f82d9c5ffb7d8bc42`; `npm test` 29/29; `npm run data` sıfır fark; `npm run build` ve `npm run build:single` PASS.
- Çalışma zamanı: GitHub CI 42586943816, 20/20 tarayıcı testi PASS; yerel sistem Chromium 18 PASS + 2 file:// politikası nedeniyle SKIP, dosya açılışı GitHub CI üzerinde PASS.
- Düzey: RUNTIME_TESTED. Sonraki: **B006**.

## B006 · 2026-11-09
- Kapsam: Atanabilir kısayollar, odak halkası, büyük imleç.
- Kanıt: kaynak `8864a29a94e91b5f8093929f82d9c5ffb7d8bc42`; `npm test` 29/29; `npm run data` sıfır fark; `npm run build` ve `npm run build:single` PASS.
- Çalışma zamanı: GitHub CI 42586943816, 20/20 tarayıcı testi PASS; yerel sistem Chromium 18 PASS + 2 file:// politikası nedeniyle SKIP, dosya açılışı GitHub CI üzerinde PASS.
- Düzey: RUNTIME_TESTED. Sonraki: **B013**.

## B013 · 2026-11-09
- Kapsam: Modal odak/Tab/Escape, mobil porsiyon taşması, kontrast, gerçek PWA offline ve CI.
- Kanıt: kaynak `8864a29a94e91b5f8093929f82d9c5ffb7d8bc42`; `npm test` 29/29; `npm run data` sıfır fark; `npm run build` ve `npm run build:single` PASS.
- Çalışma zamanı: GitHub CI 42586943816, 20/20 tarayıcı testi PASS; yerel sistem Chromium 18 PASS + 2 file:// politikası nedeniyle SKIP, dosya açılışı GitHub CI üzerinde PASS.
- Düzey: RUNTIME_TESTED. Sonraki: **B020a**.

## B020a · 2026-11-09
- Kapsam: Tek besin kaynaklarında veri seti/yıl/kayıt kimliği ve kısmi kapsam.
- Kanıt: kaynak `8864a29a94e91b5f8093929f82d9c5ffb7d8bc42`; `npm test` 29/29; `npm run data` sıfır fark; `npm run build` ve `npm run build:single` PASS.
- Çalışma zamanı: GitHub CI 42586943816, 20/20 tarayıcı testi PASS; yerel sistem Chromium 18 PASS + 2 file:// politikası nedeniyle SKIP, dosya açılışı GitHub CI üzerinde PASS.
- Düzey: UNIT_TESTED + BUILT. Sonraki: **B010a**.

## B010a · 2026-11-09
- Kapsam: CSV sıfır/eksik/kısmi kapsam regresyonu; Türkçe PDF glif ve sayfa numarası.
- Kanıt: kaynak `8864a29a94e91b5f8093929f82d9c5ffb7d8bc42`; `npm test` 29/29; `npm run data` sıfır fark; `npm run build` ve `npm run build:single` PASS.
- Çalışma zamanı: GitHub CI 42586943816, 20/20 tarayıcı testi PASS; yerel sistem Chromium 18 PASS + 2 file:// politikası nedeniyle SKIP, dosya açılışı GitHub CI üzerinde PASS.
- Düzey: RUNTIME_TESTED. Sonraki: **B030**.

## B030 · 2026-11-09
- Kapsam: Windows, macOS universal, Linux, Android ve imzasız iOS paketleri.
- Kanıt: kaynak `8864a29a94e91b5f8093929f82d9c5ffb7d8bc42`; `npm test` 29/29; `npm run data` sıfır fark; `npm run build` ve `npm run build:single` PASS.
- Çalışma zamanı: GitHub CI 42586943816, 20/20 tarayıcı testi PASS; yerel sistem Chromium 18 PASS + 2 file:// politikası nedeniyle SKIP, dosya açılışı GitHub CI üzerinde PASS.
- Düzey: PACKAGED. Sonraki: **B010b**.

## Son teslim / açık işler · 2026-11-09
- Paket kanıtı: Actions 42586943869; web, desktop-windows, desktop-macos, desktop-linux, android, ios artifact grupları başarılı. GitHub Release işi workflow_dispatch gereği SKIPPED, yeni yayın yok.
- Gerçek cihaz/OS kurulumu NOT_RUN; Tauri/Capacitor paketlenmesi cihaz kabulü değildir.
- PDF örneğinde Türkçe karakterler ve 1/24…24/24 sayfa numaraları doğrulandı, ilk sayfa render edilip incelendi. 24 sayfa uzunluğu B010b'nin gerçek kullanılabilirlik açığıdır; içerik silinmeyecek.
- TürKomp erişimi zaman aşımı ve lisans teyidi yok: B021 BLOCKED_SOURCE_VERIFICATION. EFSA grup tabloları B003b PLANNED; kaynak notu docs/DATA_RESEARCH.md.
- PR #2: https://github.com/kaansavukduran/besinmatriksi/pull/2 . Kod/paket SHA'sından sonraki commit yalnız README/yol haritası/devir belgeleridir.
- Kullanıcı isteğiyle saatlik devam görevi kuruldu; Europe/Istanbul, ilk planlı tur 9 Kasım 2026 12:40. Kullanım limiti aşma garantisi verilmedi. Sonraki tek Forge **B010b**.

## B010b · 2026-11-09 · A4 çıktı ve durum koruma
- Geçici yazdırma denetleyicisi beforeprint/afterprint ve print media değişimlerini yönetir; iptal, yinelenen olay ve desteklenmeyen print durumunda eski bölüm durumu korunur.
- A4 medya düzeni telefon kırılımlarından ayrıldı; okunaklı dört sütun, Türkçe fontlar ve sayfa numaraları korundu. Aynı USDA verisiyle eski düzen 15, yeni düzen 7 sayfa; ilk sayfa render edilip incelendi.
- Kanıt: 36/36 birim/veri/lisans testi; son A4/lisans hedefli tarayıcı kapısı 4/4 PASS; önceki tam yerel kapı 22 PASS + yönetilen file:// politikası nedeniyle 2 SKIP.
- Sonraki: **B040** kaynak ve dağıtım lisansları.

## B040 · 2026-11-09 · izin incelemesi ve açık veri tabanı
- Resmî NIN PDF ikinci sayfası okundu; elektronik ürün için önceden yazılı izin koşulu görüldü. İkincil npm MIT metni bu izin kanıtı sayılmadı.
- IFCT CSV/değer/ikinci kaynak/standart sapma/IFCT profil tahminleri güncel dağıtımdan çıkarıldı. Eski Git geçmişine force-push uygulanmadı.
- USDA SR28 resmî tam ASCII arşivi indirildi; URL ve özet kaydı eklendi. g→mg/µg ve bileşen kimliği sözlükle test edilir. İzomer ayrımı olmayan ölçümler özel izomer/omega toplamı sayılmaz; MK-4 toplam K2 değildir.
- Sekiz font ve Capacitor MIT bildirimleri özgün metinleriyle 13 kayıt olarak uygulamaya gömülür, ayrı metin dosyası da üretilir. Native Cargo dökümü release işine eklendi.
- Kanıt: 36/36 birim/veri/lisans testi PASS; PWA/tek HTML derlemesi PASS; yerel tüm akışlar 22 PASS + 2 file:// SKIP, son A4/lisans hedefli testler 4/4 PASS. GitHub'daki son kaynak ayrıca tam kapılardan geçecek.
- Sonraki: **B030-release** doğrudan indirilebilir 1.1.1 yayını. Kullanıcının Releases dosyalarını indirme isteği bu yayını yetkilendirir; fiziksel iOS kurulumu Apple imzası gerektirir.

## B040b · 2026-11-09 · native lisans kapısı ve doğrulanmış artifact teslimi
- Önce yarım paket/lisans kapısı kapatıldı. İlk 404 Cargo paketi / 36 eksik metin sonucu araştırıldı; COPYRIGHT/AUTHORS taraması ve 35 crate/sürüm için upstream commit/URL/SHA-256 kayıtları eklendi. Üç masaüstünde 404 paket / 0 eksik dosya; yeni eksik/özet uyuşmazlığı artifact kapısını durdurur.
- Son kullanıcı talimatı önceki yayın isteğini sınırladı: yeni herkese açık Release yok. Etiket run 42591741380 iptal edildi; v1.1.1 taşınmadı. Manual işin Release koşulu yalnız push-tag olayıyla sınırlandı. Merge/force-push/mağaza yayını yapılmadı.
- Birim: `npm test` 38/38 PASS; kaynak eşlemesi ve bozuk lisans özeti reddi dahil. `npm run data` derlenmiş iki JSON'da sıfır fark; `node scripts/build-notices.mjs --check` 13/13 PASS.
- Üretim: `npm run build` ve `npm run build:single` yerel ve CI PASS. Tarayıcı: son GitHub CI 24/24 PASS (telefon/masaüstü, file://, offline PWA); önceki yerel tam kapı 22 PASS + 2 politika SKIP, son A4/lisans regresyonu 4/4 PASS.
- Paket: workflow_dispatch run 42593575878 başarıyla tamamlandı; web/windows/macos/linux/android/ios 6 artifact grubunun metadata kaynak SHA'sı `a93e8a5903183f560adf0a1c8403dead5740c194` ile eşleşti. Web ve Windows ZIP indirildi, SHA-256 GitHub digest ile eşleşti ve iç dosyalar incelendi; Windows dökümü 404 SPDX girdisi içeriyor. Diğer paketler job adımları/çıktı listeleri/artifact metadata ile doğrulandı; hepsi indirilmiş veya çalıştırılmış gibi gösterilmez.
- Çalışma zamanı: web RUNTIME_TESTED; gerçek Windows/macOS/Linux/Android/iPhone cihaz kurulumu NOT_RUN. IPA imzasız. GitHub Pages 403 engeli sürüyor. Manuel ZIP içinde SHA256SUMS yok; paketlenmiş eski rehberin cümlesi güncel INSTALL.md'de düzeltilmiştir. ZIP özetleri ve test/paket/runtime ayrımı `docs/evidence/1.1.1-packages.json` içinde.
- Düzey: PACKAGED. Sonraki tek Forge **B020b** (tarif toplamındaki katkı veren malzeme/kaynak dökümü). Saatlik görev açık; yol haritası henüz bitmediğinden duraklatılmadı. Paket SHA'sından sonraki teslim commit'i yalnız dokümantasyon/durum/kanıttır.

## B020b · 2026-11-09 · tarif malzemelerinin kaynak dökümü
- Seçilen her bileşen için ayrı malzeme katkısı, USDA SR28 (2015)/NDB kaydı veya kullanıcı etiket kaynağı gösterilir. Yinelenen malzeme, kaynak 0, eksik ölçüm ve bulunamayan kayıt ayrı tutulur. Tuz/kJ/lif hariç karbonhidrat gibi hesapların girdileri ve formülleri görünür.
- Toplam, porsiyon ve pişmiş son ürün 100 g payları matrisle aynı çarpanı kullanır; miktar/porsiyon değişiminde açılmış panel güncellenir. Yeni veri/kütüphane eklenmedi.
- Birim: `npm test` 42/42 PASS; tüm tanımlı bileşenlerde katkı toplamı/ölçekleme ve kaynak/eksik/sıfır/HTML kaçışı denetlendi.
- Üretim: `npm run build`, `npm run build:single` PASS. Yerel tarayıcı: 24 PASS + 2 file:// politika SKIP; yeni telefon/masaüstü kaynak dökümü offline, sıfır/eksik ve axe/taşma kapıları PASS. Son CI ve native paketler henüz NOT_RUN (önceki paket SHA kanıtı güncel kod sayılmaz).
- Düzey: RUNTIME_TESTED. Kullanıcının yeni renk özelleştirme isteği nedeniyle sonraki tek Forge **B005b**. “Görev” sürükleme/saat kapsamı için metin açıklaması bekleniyor.

## B005b · 2026-11-09 · ayrıntılı tema renk seçimi
- Kullanıcının ek isteğiyle arka plan/yazı/kart/vurguya ikincil yüzey, ikincil yazı ve kenarlık eklendi. Renk seçim penceresi 12 hazır renk, sistem renk alanı, HEX, canlı örnek ve en düşük ana/ikincil metin kontrastını gösterir; kaydetmeden tema değişmez, Escape/iptal taslağı bırakır. Odak pencere içinde tutulur ve açan düğmeye geri döner.
- Eski dört renkli tema ve ayarlarda yeni alanlar önceki yüzey/yazı rengine göçer; v1 içe aktarımı sürer. V2 tema dosyası yedi rengi taşır; bozuk HEX/sürüm/eksik alan reddedilir. Temayı uygulamak/içe aktarmak ayrı vurgu tercihini otomatik moda geçirir.
- İlk tarayıcı kapısı indirme için kullanılan 500 ms'lik adsız bağlantıyı axe link-name hatası olarak yakaladı. Bağlantı `hidden` yapıldı; son tam regresyon geçti.
- Son yerel kanıt: `npm test` 43/43 PASS; `npm run build`, `npm run build:single` PASS; tarayıcı 26 PASS + 2 file:// politika SKIP. Renk penceresi masaüstü/telefon ekran görüntüleri incelendi; panel axe/taşma, odak, iptal, kalıcılık, paylaşım ve eski dosya uyumu kapıları PASS. GitHub tam CI/native paket kapısı bekleniyor; RUNTIME_TESTED, PACKAGING_PENDING.
- B020b GitHub CI run 42595437544 / 42595446579 başarılı. Sonraki tek Forge **B003b**; görev/saat ekranı kapsam sorusu hâlâ yanıt bekliyor.

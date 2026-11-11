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

## B020b/B005b son kapıları · 2026-11-09
- Kaynak `8e0b3178bc41864338a3fdf91afb6cf49e5497be`; devam dalına normal commit/push. Test CI 42596269733 ve 42596276024 PASS; paket run 42596270782 workflow_dispatch başarılı. Web işinin logunda 43/43 birim ve 28/28 tarayıcı testi PASS; üretim PWA ve tek HTML derlemeleri PASS.
- Altı artifact grubunun kaynak SHA eşleşmesi doğrulandı. Web ve Windows ZIP indirildi, SHA-256 GitHub digest ile karşılaştırıldı ve dosyaları listelendi. Web HTML yeni kaynak dökümü/renk alanını içeriyor. Üç masaüstü işinde Cargo: 404 paket, 0 eksik lisans metni. Paket kanıtı: `docs/evidence/B005b-packages.json`.
- Web çalışma zamanı RUNTIME_TESTED; fiziksel/native kurulum çalışma zamanı NOT_RUN. iOS imzasız, Apple imzası gerekir. GitHub Release SKIPPED; merge/force-push/mağaza yayını yapılmadı. Eski paket ve kaynak kanıtları tarihsel olarak korunur.
- B020b ve B005b düzeyi PACKAGED. Sonraki tek Forge **B003b**. Yeni sürükleme/saat isteğinin hangi ekrana uygulanacağı soruldu; UX-TASKS NEEDS_CLARIFICATION olarak açık bırakıldı, hayalî görev modeli eklenmedi. Saatlik görev açık; yol haritası bütünü tamamlanmadı. Etkin düzenleme oturumu kapandı; sonraki commit yalnız teslim belgeleridir.

## B003b · 2026-11-09 · EFSA grup referansı
- Resmî Finder JSON (578 satır), resmî konu açıklaması ve web yeniden kullanım koşulları okundu. Kaynak gösterilerek yeniden kullanım izni, özgün bildirim, erişim anı ve SHA'lar kayıtlıdır. Eski v4/Eylül 2017 PDF canlı Finder yerine güncel sayılmadı; journal PDF/figür/logo/görseller eklenmedi.
- 23 mevcut ve karşılaştırılabilir bileşen için çocuk/yetişkin 1–99 yaşta 169 PRI/AI kaydı; kaynak satırı, özgün birim, görüş yılı/DOI ve koşul korunur. Florür mg→µg açık dönüşüm; folat DFE, alfa-tokoferol ve K1 ayrımları korunur. Bebeklik/gebelik/emzirme, UL/AR/RI/SSI, enerji/ağırlık bağımlı veya uyumsuz biçimler kapsam dışı.
- Cinsiyet ve demir/fitat koşulu varsayılmaz. Eşleşme yok/çoksa BRD'ye dönülmez; kişisel hedefler değişmez. Yüzde türü matrikste, referans tablosu Ayarlar'da ve kaynak/tür/yıl CSV'de görünür. Açık referans tablosu seçim değişince korunur.
- `npm run data`: USDA JSON'ları sıfır fark; EFSA yerel ham dosyadan yeniden üretilir. `npm test`: 49/49 PASS. PWA/tek HTML üretim derlemeleri PASS; EFSA hedefli tarayıcı masaüstü/telefon 2/2 PASS, çevrimdışı CSV ve axe/taşma dahil. İlk toplu kapıda 26 mevcut akış PASS + 2 file:// SKIP; yeni testin Türkçe 1.000 biçimine ilişkin beklentisi düzeltildi. Son tam GitHub kapısı ve native paketler henüz NOT_RUN.
- 14 kaynak/lisans bildirimi, önceki sekiz OFL metni ve yazılım MIT bildirimi korunur. Yeni bağımlılık yok; TürkKomp engeline yeniden istek yok. Yerel Linux ortamında WebKitGTK 4.1/Xvfb bulunmadı; native cihaz kabulü NOT_RUN.
- Düzey: RUNTIME_TESTED, PACKAGING_PENDING. Sonraki tek Forge **B031**. UX-TASKS kapsam sorusu açık; otomasyon henüz kapanmaz.

## B003b son kapıları · 2026-11-09
- Kaynak `baaca2ba15fbacb208a8fbffc02d012741d27779`; Test CI 42606994827 / 42607004321 PASS. Workflow_dispatch run 42606995870 web logunda 49/49 birim, 30/30 tarayıcı, PWA/tek HTML üretim kapıları PASS. Kaynaklar checkout temizliğinde yeniden üretildi; bilimsel referans sayıları gıda ölçümlerine aktarılmadı.
- Web/windows/macos/linux/android/ios altı artifact grubunun source SHA eşleşmesi doğrulandı. Web ve Windows ZIP indirildi, SHA-256 GitHub digest ile karşılaştırıldı ve dosya listeleri incelendi. Tek HTML EFSA seçimleri/snapshot SHA'sını; bildirim dosyası EFSA izni, önceki OFL ve MIT teliflerini içeriyor. Üç masaüstünde Cargo 404 paket / 0 eksik lisans dosyası. Ayrı test/paket/runtime kanıtı: `docs/evidence/B003b-packages.json`.
- Web RUNTIME_TESTED, native fiziksel kurulum/çalışma zamanı NOT_RUN. iOS imzasız. Public Release SKIPPED; merge/force-push/tag taşıma/mağaza yayını yok. Yerel Linux'ta WebKitGTK 4.1/Xvfb yok; sonraki Forge ortam hazırlığını araştırmalı. TürKomp'a tekrar istek yapılmadı; eski erişim engeli ve bekleme zamanı korundu. UX-TASKS kapsam yanıtı yok, tamamlandı sayılmaz.
- B003b PACKAGED; son teslim commit'i yalnız durum/dokümantasyon/kanıttır. Sonraki tek Forge **B031**. Etkin düzenleme oturumu kapandı; uygulanabilir yol haritası ve dış kapılar bütünü bitmediğinden kendi saatlik görev açık kalır.

## B050 · 2026-11-09 · kişisel profil, günlük ve ayrıntılı görünüm
- Kullanıcının yeni kapsamı: yaş/boy/kilo/aktivite ve isteğe bağlı Tanita fişi alanları; kaydedilen profilden Mifflin 1990 veya ayrı etiketli cihaz dinlenme tahmini × açık PAL. Birincil denklem DOI/PMID Europe PMC API üzerinden doğrulandı; 19–78 yaş/özel durum kapsamı korunur. Makale/özet dağıtılmaz; gıda verisi/IFCT eklenmedi.
- Planlanan kayıt tüketilmiş sayılmaz. Tarih/plan/tüketim filtresi, 1–1000 g, 206 bileşende miktar-kapsam-referans-fark ve açılabilir kaynak girdileri; eksik ölçümden sıfır/eksiklik tanısı veya tanımsız polifenol/amino asit hedefi üretilmez. Yerel JSON aktarımı, tekrar yüklemede tekilleştirme ve kullanıcı besin kimlik çakışması testi eklendi.
- Yeni ekranlar merkezi TR/EN; cihaz dili, anlık seçim, %80–200 ölçek (elle %135), ayrı font/yazı/aralık kaydırıcıları, sistem teması ve yedi renk seçimi. Keşif ilerlemesi varsayılan kapalı; yemek/kalori/kilo ödülü veya seri cezası yok. Hareket ayrıca kapatılabilir.
- İlk regresyonlar %200 telefonda sabit gezinme örtüşmesini, odaklanmayan kaydırma tablosunu ve opak tek HTML origin'inde localStorage getter hatasını buldu; düzeltildi. A4 ekran/print ayrımı korundu. Telefon %200 Türkçe profil ekran görüntüsü incelendi; taşma/axe/klavye, renk penceresi, çevrimdışı ve veri koruma tarayıcıyla sınandı.
- Yerel birim 57/57 PASS; PWA ve tek HTML üretim PASS; 14 özgün bildirim doğrulandı; USDA/EFSA yeniden üretimi sıfır fark. Son tam yerel tarayıcı 34 PASS + yönetilen file:// nedeniyle 2 SKIP; son ithal değişikliği ardından tekrar devam ediyor. Temiz commit GitHub tam kapısı ve yeni native paketler henüz NOT_RUN.
- 1.1.2-beta.1 aday hazırlığı: mobil sürüm metadata koruması, APK sertifika dökümü, tüm platform dosyalarını zorunlu sayan ve SHA256/kaynak SHA üreten release-candidate adımı. Güncel talimat gereği yalnız workflow_dispatch/publish=false; herkese açık yayın yok. İmzalı updater/Apple imzaları/fiziksel kurulum ve eski ekranların İngilizcesi tamamlandı sayılmaz.
- Drive kaynak/öykü yedeği otomatik onay incelemesince iki kez reddedildi (tam yük/destinasyon yetkisi kabul edilmedi); sahiplik okuması bu engeli kaldırmadı. Alternatif yoldan yükleme yok. Yerel arşivler ayrıca doğrulanacak; uzak yedek varmış gibi yazılmayacak.
- Sonraki tek Forge **B051** (eski ekranların TR/EN kapsamı); B052, B031, TürKomp bekleme zamanı ve UX-TASKS açıklaması açık. Otomasyon kapanmaz. Son SHA test/paket kanıtı bu kayda eklenecek.

### B050 paket kapısı düzeltmesi
- İlk run 42616787051 web 57/57 birim + 36/36 tarayıcı PASS; Windows/Android/iOS paketleri oluştu. Linux RPM, 1.1.2-beta.1 version alanındaki tireyi reddetti; tüm-platform kapısı başarısız, tamamlandı sayılmadı. Tauri Linux platform ek ayarıyla version 1.1.2 / RPM release 0.beta.1 ayrıldı; uygulama beta kimliği, veri ve kullanıcı ayarları korunur. 58. birim testi sürüm eşlemesini denetler; yeni temiz kaynak için tüm kapılar yeniden çalıştırılacak.

## B050 son kapıları · 2026-11-09
- Kaynak `d78b8dae8a536214e7cf092e4c0be0e7b542ee62`; Test CI 42617531021 / 42617540750 PASS; workflow_dispatch 42617550175 web logunda 58/58 birim, 36/36 tarayıcı, PWA ve tek HTML üretim PASS. Linux RPM düzeltmesi gerçek runner'da 1.1.2-0.beta.1 olarak derlendi. Üç masaüstünde Cargo 404 paket / 0 eksik lisans dosyası.
- Yedi artifact grubunun source SHA eşleşmesi doğrulandı. Web, Android, Windows ve 124 MB release-candidate indirildi; ZIP SHA/CRC doğrulandı. Ortak arşivdeki 21 SHA256SUMS girdisinin her biri gerçek baytlarla eşleşti; BUILD_INFO kaynak SHA, 11 platform ürün dosyası, kaynak ZIP ve özgün bildirimler incelendi. Kanıt: docs/evidence/B050-packages.json.
- Android gerçek sertifikası Android Debug; kalıcı üretim anahtarı sürekliliği iddia edilmez. iOS imzasız/doğrudan kurulamaz; macOS imzasız/notersiz. Fiziksel/native kabul NOT_RUN. Güncel talimatla GitHub Release SKIPPED, yeni tag/merge/force-push/mağaza yayını yok; Pages için URL uydurulmadı.
- Kullanıcı kaynak ZIP + Git bundle + manifestin özel proje Drive klasörüne yüklenmesini açıkça onayladı. Önceki otomatik onay engeli çözüldü; üç dosya yüklendi, geri indirildi ve SHA256 eşleşti. 347 geçmiş blobda bilinen anahtar kalıpları tarandı, 0 bulgu (eksiksiz sır taraması garantisi değildir); ZIP CRC ve git bundle verify PASS. Sağlık verisi yok; özel Drive dosya/klasör kimlikleri açık repoya yazılmadı.
- B050 **PACKAGED**; son commit yalnız belge/durum/kanıt. Sonraki tek Forge **B051**. B052 imzalı updater/iki sürüm yükseltme, B031 fiziksel kabul, B021 kayıtlı kaynak bekleme sınırı ve UX-TASKS açıklaması açık; otomasyon duraklatılmaz. Eski paket/test kanıtları tarihsel olarak korundu.

## B053 · 2026-11-10 · Aionlaştırma (Claude devraldı)
- Devir: Claude, Codex'in `codex/forge-devam` dalını (711c084) `ccr-1e1934aa-iv8aev` dalına ileri sardı; Codex kararları ve kanıtları korunur.
- Kaynak: Drive "Aion-Trans-Akici-Dort-Hareket.png" (pembe-mavi solungaçlı Aion, kullanıcının seçtiği varyant; pembe yüzlü pafta kullanılmadı). Dört poz arka planı saydamlaştırılarak `assets-src/aion/` altına alındı.
- `scripts/build-aion.py`: 5 hareket × 8 kare sprite sheet (idle/çalışma, el sallama, okuma, üzgün, kutlama); ayak hizası sabit, ortak ölçek. Çıktı `src/assets/aion/` (WebP 341 KB), paket içinde; çalışma anında Drive'a bağımlılık yok.
- `src/aion.js`: ekrana göre ruh hali (Keşfet karşılama → el sallama, matriks → okuma, boş arama → üzgün), tarife/güne eklemede tek seferlik kutlama, dokununca TR/EN ipucu balonu. Görünmeyen sekmede durur.
- Ayarlar → Aion: göster/gizle, hareket (sisteme uy / hareketli / sabit poz), boyut, konum, ipucu balonu, sıfırla. Azaltılmış hareket tercihinde sabit poz.
- Kanıt: `npm test` 58/58; `npm run build` PASS; yerel tarayıcı akışı: kare ilerlemesi, kutlama, sabit poz, gizleme + yeniden açılışta kalıcılık, telefon görünümü PASS; konsol hatası yok.
- Düzey: RUNTIME_TESTED. Sonraki: **B051** (eski ekranların TR/EN çevirisi).

## B051 · 2026-11-10 · eski ekranların merkezi TR/EN çevirisi
- Yeni `L()` katmanı (`src/i18n.js`): Türkçe kaynak metin anahtardır, İngilizcesi merkezi `src/i18n-ui.js` sözlüğündedir (518 giriş); yer tutucular `{n}` ile doldurulur, eksik çeviride Türkçeye düşer.
- `src/i18n-foods.js`: 285 küratörlü besinin, 18 kategorinin ve 30 tüketim biçiminin İngilizce adı. Besin uyarı notları, alerjenler, bölüm/alt grup başlıkları, amino asit etiketleri, kaynak açıklamaları, EFSA ayarları ve referans metinleri, tarif kaynak dökümü, CSV başlıkları, bildirim ve diyaloglar çevrildi. Bileşen adları için ortak `nutrientLabel()`.
- Kullanıcının yazdığı tarif/besin/profil adları çevrilmez. USDA ev ölçüleri İngilizcede özgün USDA metniyle gösterilir.
- Testler: `tests/i18n.test.mjs` kaynaktaki her `L("…")` metninin, tüm besin/kategori/biçim/bileşen/bölüm/alerjen/not metinlerinin İngilizcesini zorunlu kılar. Tarayıcı: İngilizce modda Keşfet, matriks (veri yok satırları dahil), Tarif, Karşılaştır, Ayarlar, Hakkında ekranlarında Türkçe arayüz metni kalmadığını denetler.
- Ek düzeltme: Aion'un ilk selam kontrolü depolama yasaklı ortamda (about:blank) açılışı çökertiyordu; try/catch'e alındı ve Aion tarayıcı testi eklendi.
- Kanıt: `npm test` 61/61 PASS; `npm run build`, `npm run build:single` PASS; yerel tarayıcı kapısı 40/40 PASS (masaüstü + telefon, TR ve EN).
- Düzey: RUNTIME_TESTED. Sonraki: **B054** kullanıcı tanımlı koleksiyonlar (kategori/alt kategori ekleme-çıkarma) ve sade arayüz turu.

## B054 · 2026-11-11 · kullanıcı koleksiyonları ve sade arayüz
- `src/collections.js` (saf fonksiyonlar): koleksiyon → alt kategori (en fazla 2 düzey, 60 koleksiyon, koleksiyon başına 300 kayıt), aç-kapa ekleme, çıkarma, yeniden adlandırma, alt kategorileriyle silme, bozuk kayıt normalizasyonu. `bm.collections.v1` deposu; tam yedeğe dahil, içe aktarmada yeni kimlik + alt kategori bağı + kendi besin kimliği eşlemesi.
- Arayüz: kenar çubuğunda "Koleksiyonlarım" (alt kategoriler girintili), koleksiyon görünümü (yeniden adlandır / alt kategori / sil / ✕ ile besin çıkar, arama koleksiyon içinde), besin ekranında ☆/★ "Koleksiyona ekle" penceresi (aç-kapa, yeni koleksiyon oluştur ve ekle), Escape ve dış tıklama kapatır; eklemede Aion kutlar. Tek satır diyalog girişi (Enter onaylar).
- Sade akış: besin ekranında önce biçim + miktar, sonra tek sıra eylem çubuğu ("Tarife ekle" birincil). Büyük kaydırıcı (44 px dokunma, 34 px tutamak, dolgu, 1 g–1 kg ölçeği, aria-valuetext). Telefonda ikincil eylemler simge, hazır gram/porsiyon düğmeleri yatay kayar, sekmeler kısa adla sığar; Ayarlar sekmesi en sona (k44 gezinme kuralı).
- Kanıt: `npm test` 66/66 PASS (5 yeni koleksiyon/yedek testi). Tarayıcı 42/42 PASS: yeni B054 akışı (oluştur, alt kategori, ekle/çıkar, kalıcılık, silme onayı) masaüstü + telefon; axe ilk denemede telefonda adsız sekme düğmelerini yakaladı, düzeltildi.
- Sürüm 1.1.2-beta.3. Düzey: RUNTIME_TESTED; paketleme release.yml ile. Sonraki: **B055** kategori/alt kategori içi sıralama (sürükle + klavyeyle yukarı/aşağı) ve tarif malzemelerinin sırasını değiştirme.

## B055 · 2026-11-11 · sıralama (koleksiyon besinleri ve tarif malzemeleri)
- `moveIndex`/`moveRef` (saf, sınırda değişiklik yok). Koleksiyon görünümünde her besinde ↑/↓ (arama açıkken gizli, sıra karışmasın), tarif malzemelerinde ↑/↓; uçlarda düğme devre dışı; erişilebilir adlar ("Muz yukarı taşı"). Sıra cihazda kalıcı ve yedeğe dahil.
- k44 §4: sürüklemenin klavye/dokunma ile kullanılabilir yukarı/aşağı karşılığı. Gerçek sürükle-bırak bu artışta yok.
- Kanıt: `npm test` 67/67 PASS; tarayıcı 44/44 PASS (yeni B055 akışı masaüstü + telefon; ilk telefon denemesi testin kendisindeki adım sırasından düştü, düzeltildi).
- Düzey: RUNTIME_TESTED. Sonraki: **B052** uygulama içi güncelleme kontrolü (Ayarlar → Güncellemeler: yüklü sürüm, GitHub Releases'tan yeni sürüm bilgisi, indirme bağlantısı; çevrimdışıyken ana işi engellemez).

## B052a · 2026-11-11 · Ayarlar → Güncellemeler (manuel, gizlilik korumalı)
- Ayarlar'da "Güncellemeler" kartı: yüklü sürüm, GitHub Releases sayfasını açan bağlantı, "Bağlantıyı kopyala" (pano yoksa tek satır diyalog), "Önce yedek al". Uygulama kendiliğinden ağa çıkmaz (CLAUDE.md kuralı); repo gizli olduğu için kimliksiz API sorgusu zaten çalışmaz.
- Masaüstü (Tauri) web görünümünde target=_blank bağlantısı opener eklentisi olmadan dış tarayıcıyı açmayabilir; kopyalama yolu her ortamda çalışır. İmzalı otomatik güncelleyici ve iki gerçek paketle yükseltme testi (B052b) imza anahtarı olmadan tamamlanamaz: BLOCKED_SIGNING.
- Kanıt: `npm test` 67/67; tarayıcı 46/46 PASS (yeni B052 testi kendiliğinden dış istek olmadığını da denetler).
- CI notu: beta.3 run 42927583880 yalnız personal.spec EN/telefonda düştü; test 23:59:57–00:00 UTC arasında koştu, günlük kaydı gün dönümünde önceki güne kaldı (zamanlama, kod hatası değil). Yeniden çalıştırıldı.
- Sonraki: **B056** günlük testini sabit saatle (gün dönümüne dayanıklı) çalıştırmak ve Tauri'de sürüm sayfasını dış tarayıcıda açmak için resmî opener eklentisini değerlendirmek.

## B056 · 2026-11-11 · gün dönümüne dayanıklı günlük testi ve masaüstünde sürüm sayfasını açma
- `tests/browser/personal.spec.mjs`: sayfa saati `page.clock.setFixedTime` ile sabitlendi; 00:00 UTC'de koşan CI'da kaydın önceki güne düşmesi (run 42927583880) tekrar edemez. Zamanlayıcılar normal akar.
- Tauri resmî `tauri-plugin-opener` 2.x (MIT OR Apache-2.0, tauri-apps) eklendi; izin yalnız `https://github.com/kaansavukduran/besinmatriksi/releases*` ve yalnız kullanıcı "Sürüm sayfasını aç"a tıkladığında. Web/PWA/mobilde normal bağlantı davranışı.
- Kanıt: `npm test` 67/67; personal.spec 6/6 PASS; yerel `npx tauri build --bundles deb` PASS (3,58 MiB) ve Xvfb altında masaüstü uygulaması açıldı, ekran görüntüsü incelendi (Aion, İngilizce arayüz). Dış tarayıcının gerçekten açılması bu ortamda NOT_RUN (masaüstü tarayıcı yok).
- Sonraki: **B057** kategori görünümünde besin kartlarına küçük besin özeti (kcal/protein/lif) ve sıralama seçenekleri (ad, enerji, protein, lif).

## B057 · 2026-11-11 · besin kartlarında kısa özet ve liste sıralama
- Her besin kartında ilk biçimin 100 g değerleri: kcal · protein · lif. Ölçülmemiş değer yazılmaz (0 gösterilmez). Ayarlar → Matriks'te "Besin kartlarında kısa özet" ile kapatılır (`cardFacts`, varsayılan açık; eski ayarlar bozulmaz).
- Keşfet listesinin üstünde sıralama: Önerilen (kategori grupları) · A–Z (dile göre) · Enerji · Protein · Lif (en yüksekten; veri olmayanlar sonda). Aramada arama sırası korunur. Telefonda düğmeler yana kayar.
- Kanıt: `npm run build` PASS; `npm test` 67/67; Playwright 48/48 PASS (yeni B057 testi protein sırasının azalan olduğunu ve veri yokların sonda kaldığını denetler, masaüstü + telefon).
- Sonraki: **B058** tarif ekranında hedefe göre en düşük kalan besinler için katalogdan "bunu en çok veren besinler" önerisi (veri yok ≠ 0).

## B058 · 2026-11-11 · tarifte en düşük kalan besinler ve kaynakları
- Yeni saf modül `src/gaps.js`: seçili referansa (BRD / EFSA / hedef) göre tarifin en düşük 3 yüzdesi; her biri için katalogda 100 g'da en yüksek değerli 3 besin (ilk biçim). Veri yok açık sayılmaz; enerji, karbonhidrat, şeker, yağ, doymuş yağ ve tuz hedeflenmez; kısmi kapsamda "gerçek değer daha yüksek olabilir" uyarısı. B12 ve D vitamini için besin önerilmez, "zenginleştirilmiş ürün veya takviye" notu. Baharat ve taze otlar (100 g'da yenmez) öneriye girmez.
- Öneriye dokununca Keşfet'te o besin açılır. "Son ürün 100 g" görünümünde gizlenir. Ayarlar → Matriks'ten kapatılır (`recipeGaps`, varsayılan açık).
- İlk hata: telefonda yana kayan öneri satırı tarif sütununu genişletip dokunmaları engelledi (5 telefon testi). Satır sarmalı yapıldı; yeniden test temiz.
- Kanıt: `npm test` 69/69 (yeni gaps testleri); Playwright 50/50 PASS; telefon ekran görüntüsü incelendi.
- Sonraki: **B059** Keşfet'te birden çok besini seçip tek dokunuşla tarife ekleme (çoklu seçim) ve beta.5 sürümü.
- Sürüm notu (beta.4): release run 42959645122 masaüstü işlerinde `native-notices` kapısında düştü: opener'ın derleme bağımlılığı `tauri-plugin` 2.7.2 crate arşivinde lisans dosyası yok. tauri-apps/tauri `59b63ab` (crate'in `.cargo_vcs_info.json` commit'i) LICENSE-APACHE-2.0 ve LICENSE-MIT metinleri SHA-256 ile `data/licenses/native/` altına sabitlendi. Yerel `node scripts/native-notices.mjs`: 446 paket, eksik 0.
- Yayın: release run 42961307488 SUCCESS (commit 8bf239f). v1.1.2-beta.4 pre-release 2026-11-11T04:53Z yayımlandı; 22 varlık: Windows portable.exe / Setup.exe / .msi, macOS universal .dmg (imzasız), Linux AppImage / .deb / .rpm, Android .apk (geliştirici imzalı), iOS .ipa (imzasız, kurulamaz), offline.html, web-pwa.zip, source.zip, SHA256SUMS, BUILD_INFO, lisans dosyaları. Cihaz kurulumu NOT_RUN.

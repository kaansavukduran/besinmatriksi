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

## B059 · 2026-11-11 · çoklu seçimle tarife ekleme
- Keşfet sıralama satırında "☑ Çoklu seç": açıkken katalog besin kartları seçilir/bırakılır (aria-pressed, ✓ ve vurgulu kenar); üstte yapışkan çubuk "N besin seçildi · Tarife ekle (her biri 100 g) · Vazgeç". Hiç seçim yokken ekleme düğmesi devre dışı. Ekleme tek bildirim ve tek Aion kutlamasıyla biter, mod kapanır. Aynı besin tarifte varsa miktarı artar (mevcut addToRecipe kuralı).
- İlk hata: yeni stiller tanımsız `--ac` değişkenini kullandı (çerçeve görünmedi); temanın `--acc` değişkenine düzeltildi, telefon ekran görüntüsüyle doğrulandı.
- Kanıt: `npm test` 69/69; Playwright 52/52 PASS (yeni B059 testi: devre dışı durum, aria-pressed, iki besin, tarif sırası).
- Sonraki: **B060** tarif ekranında malzeme gramını kaydırıcıya ek olarak hızlı ± düğmeleriyle ve porsiyon başı gram göstergesiyle sadeleştirme; uygun birikimde beta.5.

## B060 · 2026-11-11 · sade tarif malzemeleri
- Tarif malzemeleri varsayılan olarak tek satır: −10 · gram · +10 · (porsiyon > 1 ise) "porsiyon başı X g" · "⚙ Ayarla". Ayarla (aria-expanded) kaydırıcıyı, hazır gramları, ölçü birimlerini ve kg fiyatını açar; "Kapat" ile döner. Porsiyon başı gram ± ile yerinde güncellenir. Açık/kapalı durum oturumluk (kalıcı veri değişmedi, eski tarifler aynen açılır).
- Eski testler yeni davranışa göre güncellendi (fiyat ve hazır gram öncesi "Ayarla"). Mini satırın çift çerçevesi kaldırıldı (telefon ekran görüntüsüyle doğrulandı).
- Kanıt: `npm test` 69/69; Playwright 54/54 PASS (yeni B060 testi), CSS düzeltmesinden sonra ilgili 6 test yeniden PASS.
- Sonraki: **B061** beta.5 sürümü (B059 + B060) ve ardından Keşfet'te son kullanılan besinler satırı.
- Yayın: release run 42972032019 SUCCESS (commit a2a0e39). v1.1.2-beta.5 pre-release 2026-11-11T06:29Z; 22 varlık (Windows portable/Setup/msi, macOS dmg, Linux AppImage/deb/rpm, Android apk, iOS ipa imzasız, offline.html, web-pwa, source, SHA256SUMS, BUILD_INFO, lisanslar). Cihaz kurulumu NOT_RUN.

## B061 · 2026-11-11 · beta.5 yayını ve "Son bakılanlar"
- Beta.5 yukarıda (run 42972032019, 22 varlık).
- Keşfet'te aramasız/kategorisiz görünümde "🕘 Son bakılanlar": son açılan 8 katalog besini (biçimiyle), dokununca açılır, "Temizle" ile silinir. Yalnız cihazda `bm.recent.v1`; bozuk veya katalogda artık olmayan kayıtlar atlanır. Çoklu seçim modunda gizli. Ayarlar → Matriks'ten kapatılır (`showRecent`, varsayılan açık). Telefonda tek satır yana kayar; sayfa genişliği 412 = görünüm 412 (taşma yok).
- Kanıt: `npm test` 70/70 (yeni recent testi: tekrarsızlık, sıra, sınır, bozuk veri); Playwright 56/56 PASS (yeni B061 testi: kalıcılık, sıra, açma, temizleme); erişilebilir ad düzeltmesinden sonra B051/B061 yeniden PASS.
- Sonraki: **B062** Tarif ekranında tarifi tek dokunuşla Günlük'e (bugün) ekleme ve günlükte porsiyon seçimi.

## B062 · 2026-11-11 · tarifi porsiyonla Günlük'e ekleme
- Tarif başlığında "📒 Günlüğe ekle": "kaç porsiyon?" (virgül/nokta kabul, 0 < p ≤ 50). Her malzeme gram × porsiyon ÷ tarif porsiyonu olarak bugünün (yerel gün) günlüğüne ayrı kayıt olur; günlük kayıt sınırı 1000 g olduğundan büyük miktar bölünür; bulunamayan ve 1 g altı malzemeler atlanır ve bildirimde sayılır (sessiz yuvarlama yok). Saf fonksiyon `recipeToEntries` (`src/personal.js`); günlük şeması değişmedi.
- Kanıt: `npm test` 72/72 (yeni recipe-day testleri: ölçekleme, bölme, atlama, geçersiz girdi); Playwright 58/58 PASS (yeni B062 testi: geçersiz girdi reddi, 2 porsiyonluk tarifte 1,5 porsiyon → 75 g, Günlük'te görünür); telefonda taşma yok (412 = 412), başlık ekran görüntüsü incelendi.
- Sonraki: **B063** Günlük'te bir günün kayıtlarını tek dokunuşla tarife dönüştürme (tersi) ya da beta.6 yayını.

## B063 · 2026-11-11 · Günlük'teki günü tarife çevirme ve beta.6
- Günlük'te kayıt varsa "🥣 Bu günü tarif olarak kaydet": seçili günün kayıtları (Plan/Tüketildi görünümüne uyar) yeni "Günlük YYYY-AA-GG" tarifine malzeme olur; aynı besin birleşir, 1 kg sınırını aşan toplam kesilip bildirimde sayılır. Saf fonksiyon `dayToRecipeItems` (`src/personal.js`).
- Kanıt: `npm test` 73/73 (yeni birleştirme/filtre/sınır testi); Playwright 60/60 PASS (yeni B063 testi: muz ×2 + yulaf → 2 malzeme, muz 200 g).
- Sürüm: 1.1.2-beta.6 (B061 son bakılanlar, B062 tarif→günlük, B063 günlük→tarif).
- Sonraki: **B064** beta.6 yayın doğrulaması, ardından Ayarlar ekranında arama kutusu (ayar adına göre süzme).
- Yayın: release run 42993729629 SUCCESS (commit 1fc970a). v1.1.2-beta.6 pre-release 2026-11-11T09:23Z; 22 varlık. Cihaz kurulumu NOT_RUN.

## B064 · 2026-11-11 · Ayarlarda arama
- Ayarlar'ın en üstünde "🔎 Ayarlarda ara": kartlar başlık ve içerik metnine göre büyük/küçük harf ve Türkçe karakter duyarsız (`norm`) süzülür; yeniden çizim yok, odak korunur; eşleşme yoksa "Bu aramaya uyan ayar yok." (role=status). Arama metni oturum boyunca korunur, ayar değişince yeniden uygulanır.
- Kanıt: `npm test` 73/73; Playwright 62/62 PASS (yeni B064 testi: "AİON" → Aion kartı, odak, eşleşmesiz durum, temizleyince tümü); hesaplanan stil ile gizli kartların `display: none` olduğu doğrulandı. Beta.6 yayını yukarıda (run 42993729629).
- Sonraki: **B065** tarif listesinde tarif arama/sıralama ve tarif başına kcal/porsiyon özeti.

## B065 · 2026-11-11 · tarif listesinde arama, sıralama, porsiyon başı kcal
- Tarif listesindeki her tarifte porsiyon başı enerji: bilinen malzemelerden; eksik malzeme varsa "≥" alt sınır, hiç enerji verisi yoksa gösterilmez (0 yazılmaz).
- 4 ve üzeri tarifte liste başında "🔎 Tariflerde ara" (Türkçe karakter duyarsız, yeniden çizimsiz, odak korunur, eşleşme yoksa uyarı) ve sıralama: Eklenme · A–Z · kcal/porsiyon (verisi olmayanlar sonda).
- İlk hata: axe, seçili tarifin vurgulu zemininde soluk kcal satırına kontrast ihlali verdi (2 test); renk düğme metninden alınacak şekilde düzeltildi.
- Kanıt: `npm test` 73/73; Playwright 64/64 PASS (yeni B065 testi: kcal, arama, odak, eşleşmesiz, A–Z).
- Sonraki: **B066** beta.7 yayını (B064 + B065) ve sonrasında Kıyasla ekranında farkları vurgulama (en yüksek değer işareti).
- Sürüm: 1.1.2-beta.7 (B064 ayarlarda arama, B065 tarif listesi).
- Beta.7 ilk koşu (run 43057431907) FAIL: web işinde `playwright install --with-deps` apt adımı "Temporary failure resolving 'security.ubuntu.com'" (runner DNS, kod dışı). Düşen işler yeniden çalıştırıldı. B066'nın ikinci kısmı (Kıyasla'da satırdaki en yüksek değer vurgusu) zaten mevcut (`td.best`, "yüksek = iyi değildir" notuyla); yeni iş açılmadı.
- Beta.7 yeniden deneme (attempt 2) yine FAIL: aynı runner DNS hatası ('archive.ubuntu.com', 'security.ubuntu.com' çözülemedi; imaj ubuntu-26.04, beta.6 aynı imajla geçmişti). Düzeltme: release.yml ve ci.yml'de `playwright install --with-deps chromium` başarısız olursa uyarı verip `playwright install chromium` ile devam; tarayıcı testleri yine koşar, yani kapı gevşemez. Yeni koşu başlatıldı.
- Yayın: release run 43062206618 SUCCESS (commit cb78920). v1.1.2-beta.7 pre-release 2026-11-11T17:06Z; 22 varlık. Web işinde apt yine çözülemedi ve yedek yol kullanıldı (log'da "apt bağımlılıkları kurulamadı" uyarısı); tarayıcı testleri yine koştu ve geçti. Cihaz kurulumu NOT_RUN.

## B067 · 2026-11-11 · besin ayrıntısında "Benzer besinler"
- Yeni saf modül `src/similar.js`: aynı kategoride, 100 g ilk biçim enerji/protein/karbonhidrat/yağ/lif profili en yakın 6 besin (göreli fark ortalaması; en az 3 ortak ölçülmüş bileşen gerekir, veri yok 0 sayılmaz). Ayrıntıda eylem çubuğunun altında tek satır; dokununca o besin açılır. Açıklama: vitamin/mineraller farklı olabilir, "eşdeğer" iddiası yok. Ayarlar → Matriks'ten kapatılır (`showSimilar`).
- İlk hata: yeni tarayıcı testi "mercimek" aramasında ilk sonucun baklagil olduğunu varsaydı (gerçekte "mercimek filizi", Sebzeler). Test açılan besinin kategorisine göre düzeltildi; kod değişmedi.
- Kanıt: `npm test` 74/74 (yeni similar testi); Playwright 64/66 → düzeltme sonrası B067 2/2 PASS; diğer 64 test aynı koşuda PASS; telefonda yatay taşma yok.
- Sonraki: **B068** beta.8 yayını (B067) veya B021 TürKomp kaynak doğrulaması (2026-11-11 sonrası açılır).

## B068 · 2026-11-12 · beta.8 yayını
- 1.1.2-beta.8 (B067 benzer besinler). Sürüm dosyaları, Cargo.lock, lisans dökümleri güncellendi; `npm test` PASS, `native-notices` 446 paket / eksik 0.
- Sonraki: **B069** B021 TürKomp kaynak doğrulaması (bekleme tarihi 2026-11-11 geçti): lisans/kullanım koşullarını resmî kaynaktan doğrula; uygun değilse BLOCKED olarak kaydet.
- Yayın: release run 43139843086 SUCCESS (commit 2b75829). v1.1.2-beta.8 pre-release 2026-11-12T02:21Z; 22 varlık. Cihaz kurulumu NOT_RUN.

## B069 · 2026-11-12 · TürKomp erişim/lisans yeniden denemesi
- Bekleme sınırı (2026-11-11) geçtiği için yeniden denendi. `curl https://turkomp.gov.tr/` ve `https://turkomp.tarimorman.gov.tr/` → "CONNECT tunnel failed, response 403" (ortam vekili); sayfa okuma aracı → ENOTFOUND (izinli alan dışı). Site metni okunamadı, lisans/yeniden dağıtım izni doğrulanamadı.
- Durum BLOCKED_SOURCE_VERIFICATION → **BLOCKED_ENVIRONMENT**; veri içe aktarılmadı, USDA kaydı yeniden adlandırılmadı. Açılması için kullanıcının ortam ağ ayarlarında turkomp.gov.tr'yi açması veya resmî koşul metnini sağlaması gerekir.
- Sonraki: **B070** Aion'a ilk açılışta kısa, atlanabilir 3 adımlı "nasıl kullanılır" turu (kategori → besin/kaydırıcı → tarif), azaltılmış harekete uyumlu.

## B070 · 2026-11-12 · ilk kullanım turu
- `src/tour.js` + Keşfet listesinin başında akışta duran kart (hiçbir öğenin üstünü örtmez): 3 adım (kategori/arama → besin + büyük kaydırıcı → Tarife ekle ve toplam matriks), hedef kesik çizgiyle vurgulanır (azaltılmış harekette animasyon yok). Geri / İleri / Bitir / Turu atla; bitince veya atlanınca `bm.tour.v1=done` (yalnız cihazda); depolama kapalıysa tur zorla gösterilmez. Ayarlar → Aion'da "Tanıtım turunu başlat". Tur gösterildiğinde Aion karşılama balonu çıkmaz (iki ipucu üst üste binmez). TR/EN.
- Kanıt: `npm test` 75/75 (yeni tour testi); Playwright 68/68 PASS (yeni B070 testi: adımlar, vurgu, geri sınırı, atlamanın kalıcılığı, Ayarlar'dan yeniden başlatma); telefonda 412 = 412, ekran görüntüsü incelendi.
- Sonraki: **B071** beta.9 yayını (B070).

## B071 · 2026-11-12 · beta.9 yayını
- 1.1.2-beta.9 (B070 tanıtım turu). Sürüm dosyaları/Cargo.lock/lisans dökümü güncellendi; `npm test` PASS; `native-notices` 446 / eksik 0.
- Sonraki: **B072** Günlük ekranında son 7 günün enerji/protein mini grafiği (yalnız bilinen değerler; veri yok günleri boş, 0 değil).
- Yayın: release run 43173720653 SUCCESS (commit 86b83f2). v1.1.2-beta.9 pre-release 2026-11-12T07:21Z; 22 varlık. Cihaz kurulumu NOT_RUN.

## B072 · 2026-11-12 · Günlük'te son 7 gün enerji grafiği
- `weekSeries`/`shiftDay` (`src/personal.js`) + `renderWeek` (`src/personal-view.js`): 7 çubuk; kayıtsız gün "—" ve çubuksuz (0 değil); bazı kayıtlarda enerji yoksa "≥" ve açık renk + açıklama; Plan/Tüketildi görünümüne uyar; çubuğa dokununca o gün açılır (aria-current=date). Seçili gün son 7 gün içindeyse pencere bugünde sabit kalır.
- İlk hata: çubuğa dokununca pencere seçili güne kaydı ve kayıtlı gün pencereden çıkınca grafik kayboldu (yeni test yakaladı); pencere sabitlemesi eklendi. İkinci bulgu: birim testinin sahte verisi `energy: null` kullandı; gerçek veride eksik bileşen anahtar olarak hiç yazılmıyor (foods.json'da null 0 adet), test verisi gerçek biçime uyduruldu.
- Kanıt: `npm test` 76/76; Playwright 70/70 (tam koşu 68/70 + düzeltme sonrası B072 ve personal 8/8 PASS); telefonda ekran görüntüsü incelendi.
- Sonraki: **B073** beta.10 yayını (B072).

## B073 · 2026-11-12 · beta.10 yayını
- 1.1.2-beta.10 (B072 haftalık grafik). İki basamaklı beta numarası kontrol edildi: mobil sürüm kodu yalnız major/minor/patch'ten (`mobileVersion`), MSI sürümü 1.1.2 sabit, release-assets sürüm deseni `beta.10`u kabul ediyor. `npm test` 76/76, `native-notices` 446 / eksik 0.
- Sonraki: **B074** Kıyasla ekranında "Hepsi aynı porsiyon" yanında besin başına ölçü (USDA porsiyonu) hızlı seçimi.
- Yayın: release run 43181205058 SUCCESS (commit 6acd3b2). v1.1.2-beta.10 pre-release 2026-11-12T08:20Z; 22 varlık. Cihaz kurulumu NOT_RUN.

## B074 · 2026-11-12 · Kıyasla'da hazır ölçüler
- Karşılaştırma sütunlarındaki miktar denetimine besinin USDA ölçüleri (ör. "1 su bardağı, dilimlenmiş · 150 g") eklendi; dokununca o sütunun gramı ve tablo güncellenir. Önceden boş liste geçiliyordu.
- Kanıt: `npm test` 76/76; Playwright 72/72 PASS (yeni B074 testi: ölçü düğmesi ve tablo başlığındaki gram); telefonda 412 = 412, ekran görüntüsü incelendi.
- Sonraki: **B075** Kıyasla'yı telefonda daha kısa yapmak: miktar denetimini B060'taki gibi tek satır (−10 · gram · +10 · ⚙ Ayarla) hâline getirmek.

## B075 · 2026-11-12 · Kıyasla telefonda kısa
- Kıyasla sütunlarında miktar varsayılan olarak tek satır (−10 · gram · +10 · ⚙ Ayarla; B060 `miniAmount` yeniden kullanıldı); Ayarla kaydırıcıyı, hazır gramları ve USDA ölçülerini açar. Sütun silinince açık durumlar sıfırlanır (indeks kayması yok). Telefonda bölüm düğmeleri yana kayan tek satır, "Besin ekle" kutusu küçüldü.
- Kanıt: `npm test` 76/76; Playwright 72/72 PASS (B074 testi tek satır + ±10 + Ayarla adımlarıyla genişletildi); telefonda 412 = 412, ekran görüntüsü incelendi. Oturum yeniden başlatmaları nedeniyle kayıt sonradan; testler kayıttan önce yeniden koşuldu.
- Kullanıcı yeni istekleri (2026-11-12): (1) hayvansal besinler uygun kategorilerde eklenmeli (CLAUDE.md'deki "yalnız bitkisel" kuralını değiştirir), (2) her besinin kendi küçük simgesi olmalı (şu an kategori simgesi; sebzelerin hepsinde brokoli). Sonraki: **B076** besin başına simge, **B077** hayvansal besinler.

## B077 · 2026-11-12 · hayvansal besinler (kullanıcı kararı)
- Kaan'ın 2026-11-12 isteğiyle "yalnız bitkisel" kuralı değişti (CLAUDE.md güncellendi). Yeni kategoriler: Süt ve süt ürünleri, Yumurta, Kırmızı et ve sakatat, Kümes hayvanları, Balık ve deniz ürünleri; bal "Tatlandırıcılar" içinde `animal: true`. 33 besin / 64 biçim, her biri USDA SR28 kaydıyla (`npm run data`; NDB numaraları FOOD_DES.txt'ten doğrulandı; süt için vitamin eklenmemiş kayıtlar). Yeni alerjenler: süt, yumurta, balık, kabuklu, yumuşakça. Ciğer (A vitamini), ton balığı (cıva), bal (1 yaş altı) notları.
- Arayüz: kart ve ayrıntıda "Hayvansal" etiketi; Ayarlar → Matriks "Hayvansal besinleri göster" (`showAnimal`, varsayılan açık) kapatılınca kategori, liste, arama, benzer besinler ve "en düşük kalan besinler" önerileri yalnız bitkisel. B12/D vitamini için bitkisel öneri yok notu korunur; hayvansal kaynaklar görünürse listelenir. Hakkında metni güncellendi. Geniş USDA kataloğu (ext) değişmedi (yalnız bitkisel gruplar).
- Bulunan ve düzeltilen hatalar: (1) İngilizce telefonda "en düşük kalan besinler" kartındaki uzun adlı öneriler sayfayı 390→426 px genişletip sekme çubuğuna dokunmayı engelledi → satır kaydırma + min-width:0. (2) Telefonda bildirim balonu alt sekme çubuğunu örtüyordu → balon çubuğun üstüne taşındı (pointer-events:none denemesi renk seçici testini bozduğu için geri alındı).
- Kanıt: `npm test` 77/77 (hayvansal kategori/işaret testi, B12 hayvansal kaynak testi); Playwright 74/74 PASS (yeni B077 testi: etiket, alerjen, gizleme ve kalıcılık); telefonda 412 = 412, ekran görüntüsü incelendi.
- Sonraki: **B076** her besine kendi küçük simgesi (kategori simgesi yerine).

## B076 · 2026-11-12 · her besine kendi simgesi
- `src/food-icons.js`: 318 küratörlü besinin her birine simge (sistem emojisi; çevrimdışı, ek dosya/lisans yok). Kartlarda, ayrıntı başlığında, tarif malzemelerinde, koleksiyon ve "son bakılanlar" satırında kategori simgesi yerine besinin simgesi; eşlemesi olmayan (kendi besinlerim, geniş katalog) kategori simgesine düşer. Emoji ayarı kapalıysa simge gösterilmez.
- Sınır (dürüst not): emoji setinde her besinin karşılığı yok; 318 besin için 88 farklı simge var. Tam karşılığı olmayanlarda en yakın görsel (ör. renkli daire, tahıl başağı) kullanıldı; Unicode 15+ simgeler (zencefil, bezelye kabuğu) eski Windows/Android'de görünmediği için seçilmedi. Her besine benzersiz çizim için ayrı bir simge seti (lisansı değerlendirilerek) ya da özel çizim gerekir.
- Kanıt: `npm test` 78/78 (yeni: her besinin simgesi var, fazlası yok, domates ≠ brokoli); Playwright 76/76 PASS (yeni B076 testi); telefonda ekran görüntüsü incelendi, 412 = 412.
- Sonraki: **B078** beta.11 yayını (B075 + B076 + B077).

## B078 · 2026-11-12 · beta.11 yayını
- 1.1.2-beta.11 (B075 kısa Kıyasla, B076 besin simgeleri, B077 hayvansal besinler). Sürüm notları güncellendi (uygulama tanımı artık "bitkisel ağırlıklı"). `npm test` PASS; `native-notices` 446 / eksik 0.
- Sonraki: **B079** geniş USDA kataloğuna (Ayarlar → Geniş katalog) hayvansal USDA gruplarını (süt/yumurta, kümes, et, balık) `showAnimal` ile birlikte eklemek.
- Yayın: release run 43222066446 SUCCESS (commit 7eef0c4). v1.1.2-beta.11 pre-release 2026-11-12T13:01Z; 22 varlık. Cihaz kurulumu NOT_RUN.

## B079 · 2026-11-12 · varsayılan Koyu tema ve sistem yazı tipi
- Kaan'ın isteği: yeni kurulumda tema "Koyu" (`dark`), yazı "Sistem yazısı" (`system`: system-ui, -apple-system, Segoe UI, Roboto). Eski kayıtlı seçimler korunur (yalnız varsayılan değişti); geçersiz tema değeri artık Koyu'ya düşer.
- Bulunan ve düzeltilen hata: telefonda %200 arayüz ölçeğinde Ayarlar sayfası 390→476 px taştı (yazı tipi kartında `minmax(200px, 1fr)`, Birimler ve Yüzde referansı kartlarında satır kırmayan uzun düğmeler); renk seçici penceresindeki düğmelere dokunulamadı. Yazı tipi ızgarası `minmax(min(200px, 100%), 1fr)`, ayar kartlarında min-width:0 ve düğme metni sarmalı → 390 = 390.
- Kanıt: `npm test` 79/79 (yeni varsayılan/geri uyumluluk testi; eski "geçersiz tema → light" beklentisi "dark" oldu); Playwright 76/76 PASS; telefonda ekran görüntüsü: data-theme=dark, font-family system-ui.
- Sonraki: **B080** besin simgelerinde tekrarları azaltmak (aynı emojiyi paylaşan besinler) ve kullanıcıya tam benzersiz resim seçeneklerini sunmak; ardından beta.12.

## B080 · 2026-11-12 · her besine kendine özgü SVG çizimi
- Kaan'ın seçimi (özel çizim SVG): `src/food-art.js` — 26 parametreli şekil şablonu (yuvarlak meyve, armut, salkım, uzun sebze, yapraklı, soğanlı, yumru, baklagil, tahıl, kuruyemiş, tohum, mantar, alg, ot, baharat, şişe, fincan, kavanoz, blok, yumurta, et, balık, kâse, tatlandırıcı, toz, tuz) + her besine özgü renk/biçim. 318 besinin 318'i benzersiz çizim (test ediyor). Çizimler el yapımı kod; dış görsel veya lisanslı set yok, çevrimdışı.
- Arayüz: kartta 40 px, ayrıntı başlığında 48 px, tarif malzemesinde 34 px, "son bakılanlar" düğmesinde 24 px. Açık renkli yuvarlak kart arka planı sayesinde koyu ve açık temada okunur. Çizimi olmayan kayıtlar (kendi besinlerim, geniş katalog) emojiye, o da yoksa kategori simgesine düşer; "emoji" ayarı kapalıysa resim gösterilmez.
- Görsel kontrol: 318 çizimin tamamı galeri sayfasında incelendi; brokoli/karnabahar lahanaya benzediği için çiçek biçimine, filizler soluk olduğu için koyu yeşile çevrildi; koyu temada koyu renkli çizimler kaybolduğu için kart arka planı eklendi.
- Kanıt: `npm test` 80/80 (yeni: 318 benzersiz SVG); Playwright 76/76 PASS (B076 testi çizimlerin farklılığını denetliyor); telefonda ekran görüntüsü incelendi, 412 = 412.
- Sonraki: **B081** beta.12 yayını (B079 + B080).

## B081 · 2026-11-12 · beta.12 yayını
- 1.1.2-beta.12 (B079 varsayılan Koyu tema + sistem yazısı, B080 besin çizimleri). `npm test` PASS; `native-notices` 446 / eksik 0.
- Sonraki: **B082** geniş USDA kataloğuna hayvansal grupları (`showAnimal` ile) eklemek.
- Yayın: release run 43225613166 SUCCESS (commit 47ba525). v1.1.2-beta.12 pre-release 2026-11-12T13:23Z; 22 varlık. Cihaz kurulumu NOT_RUN.

## B082 · 2026-11-12 · geniş katalogta hayvansal USDA grupları
- `scripts/build-data.mjs`: geniş kataloğa USDA SR28 hayvansal grupları eklendi (süt/yumurta 0100, kümes 0500, sığır 1300, kuzu/dana/av 1700, domuz 1000, balık/kabuklu 1500); kayıtlar `a: 1`. Et gruplarında aynı parçanın yağlı/kalite tekrarları ayıklandı (yalnız yağsız kısım; select/prime/ithal varyantları dışarıda) → 1.505 hayvansal kayıt, toplam 4.281; `foods-ext.json` 1,57 → 3,28 MB (yalnız geniş katalog açılınca yüklenir). Bitkisel gruplarda hayvansal içerikli karışık ürünler eskisi gibi ayıklanır.
- `showAnimal` kapalıyken geniş katalog araması ve grup düğmeleri hayvansal kayıtları göstermez; ayrıntıda "Hayvansal" etiketi. Geniş katalog grup adları artık İngilizceye çevriliyor (eski eksik).
- Kanıt: `npm run data` (ext 4281); `npm test` 80/80; Playwright 78/78 PASS (yeni B082 testi: balık grubu, arama, etiket, gizleme).
- Sonraki: **B083** kullanıcı ekran görüntüsü: "besin ekle" penceresindeki kategori düğmeleri simetrik değil (sütunlar eşit değil, yükseklikler karışık).

## B083 · 2026-11-12 · "besin ekle" penceresinde simetrik kategori düğmeleri
- Kaan'ın ekran görüntüsü (Android, Karşılaştırmaya besin ekle): sol/sağ sütun genişlikleri farklı, kutu yükseklikleri karışık. Kök neden: seçici penceresindeki kategori kabı `row` sınıfını kullanıyordu; aynı ad besin tablosu satırları için tanımlı `.row { grid-template-columns: … 1fr auto }` ve daha özgül `:root[data-ui-narrow] .row` kurallarıyla çakışıp 1fr+auto (geniş+dar) ızgara üretiyordu. Sınıf `cats-grid` olarak ayrıldı.
- Yeni düzen: eşit sütunlar (telefonda 2 × 1fr, geniş ekranda otomatik), her düğme aynı yükseklikte (2 satırlık ad için yer ayrılır, daha uzun ad "…" ile kısalır), simge/ad/sayı ayrı hizalı; "Koleksiyonlarım" başlığı ve "yeni koleksiyon" tüm satırı kaplar. Pencere başlığındaki "× Kapat" tek satır.
- Kanıt: Playwright 80/80 PASS (yeni B083 testi: tüm kategori düğmeleri aynı genişlik ve yükseklik, taşma yok); `npm test` 80/80; telefonda ekran görüntüsü incelendi.
- Sonraki: **B084** beta.13 yayını (B082 + B083) ve diğer ekranlarda aynı `row` çakışması var mı taraması.

## B084 · 2026-11-12 · beta.13 yayını
- 1.1.2-beta.13 (B082 geniş katalogta hayvansal gruplar, B083 simetrik seçici). Diğer ekranlarda `row` sınıf çakışması tarandı: yalnız matriks satırları kullanıyor (amaçlanan). `npm test` PASS; `native-notices` 446 / eksik 0.
- Sonraki: **B085** Keşfet'teki kategori şeridini telefonda da isteğe bağlı simetrik ızgara olarak gösterme seçeneği (Ayarlar).
- Yayın: release run 43227131132 SUCCESS (commit 0323563). v1.1.2-beta.13 pre-release 2026-11-12T13:34Z; 22 varlık. Cihaz kurulumu NOT_RUN.

## B085 · 2026-11-12 · Keşfet'te isteğe bağlı simetrik kategori ızgarası
- Ayarlar → Matriks "Keşfet'te kategorileri eşit kutulu ızgara olarak göster" (`catGrid`, varsayılan kapalı; eski kayıtlar etkilenmez). Açıkken telefonda yana kayan şerit yerine B083'teki eşit genişlik/yükseklikte 2 sütunlu ızgara, geniş ekranda kenar sütunda tek sütun.
- Kanıt: `npm test` 80/80; Playwright 82/82 PASS (yeni B085 testi: tüm kategori kutuları aynı genişlik, taşma yok).
- Sonraki: **B086** beta.13 yayın doğrulaması; ardından Aion için yeni bir poz/ifade (ör. hayvansal besin açılınca bilgilendirici ifade değil, nötr kalsın) ve kalan UX gözden geçirmesi.

## B086 · 2026-11-12 · önce temel besin değerleri
- Kaan'ın isteği (ekran görüntüsü): besin seçince önce basit değerler, ayrıntı sonra; Kıyasla ve toplamlarda da aynı mantık. `basicCard` (`src/matrix.js`): Kalori, Protein, Karbonhidrat (lif hariç), Şeker, Yağ, Doymuş yağ, Lif, Tuz — 8 eşit kutu (telefonda 2×4), %referans küçük yazıyla; ölçülmemiş "veri yok", çok malzemeli toplamda kısmi kapsam "≥". Besin ayrıntısında matriksin ilk öğesi; Günlük'te "Günün temel besin değerleri"; tarifte mevcut özet zaten temel değerler olduğu için tekrar eklenmedi. Kıyasla tablosu "Temel besin değerleri" satırlarıyla başlar (ayrıntı bölümlerinde tekrar etmez), bölüm düğmelerine "Temel besin değerleri" eklendi.
- Kanıt: `npm test` 80/80; Playwright 84/84 PASS (yeni B086 testi: temel kart ilk öğe, 8 bileşen, Kıyasla ilk satırlar, Günlük kartı); telefonda ekran görüntüsü incelendi, 412 = 412.
- Sonraki: **B087** kategoriler içinde yaygınlık sırası (yaygın besinler üstte, niş olanlar altta).

## B087 · 2026-11-12 · kategoriler içinde yaygınlık sırası, az bilinenler gizli
- `data/popularity.mjs`: her kategori için Türkiye'de yaygın tüketimden aza editoryal sıra (ölçülmüş istatistik değildir; dosyada yazılı) ve 55 "az bilinen" besin (`niche`). `npm run data` sırayı foods.json'a uygular; yanlış kategori/bilinmeyen kimlik derlemeyi durdurur.
- Arayüz: kategori listeleri ve "Tümü" sayısı varsayılan olarak az bilinenleri göstermez; arama ve kayıtlı tarif/günlük/koleksiyon kayıtları etkilenmez. Ayarlar → Matriks "Az bilinen besinleri de listele" (`showNiche`, varsayılan kapalı). Benzer besinler ve "en düşük kalan" önerileri de az bilinenleri önermez.
- Kanıt: `npm test` 81/81 (yeni sıra/işaret testi); Playwright 86/86 PASS (yeni B087 testi: Meyveler elma-muz-portakal ile başlar, jackfruit listede yok ama aramada var, ayarla görünür).
- Sonraki: **B088** yaygın ama eksik besinler (ekmek çeşitleri, su, taze soğan vb.).

## B088 · 2026-11-12 · yaygın ama eksik besinler
- 12 yeni besin (hepsi USDA SR28 kaydıyla, FOOD_DES.txt'ten doğrulandı): beyaz ekmek (taze/kızarmış), tam buğday ekmeği (taze/kızarmış), çavdar ekmeği, pide/lavaş beyaz ve tam buğday, patlamış mısır (yağsız, tuzsuz), içme suyu, üzüm suyu (şekersiz), taze soğan, fırında patates kızartması, tavuk but, dana biftek. Ekmeklerde "ticari ekmeklerde süt/yumurta olabilir, etikete bak", suda "mineral içeriği bölgeye göre değişir" notu. Toplam 330 küratörlü besin.
- Yaygınlık sırasında yerlerine kondu (Tahıllar beyaz ekmekle, İçecekler suyla başlar). Her biri için yeni SVG çizimler (somun, pide, kızartma, patlamış mısır, su bardağı şablonları), emoji yedeği ve İngilizce adlar.
- İlk hata: yeni tarayıcı testi "Tahıllar" seçiliyken "su" aradı (boş sonuç); test "Tümü"ye geçecek şekilde düzeltildi, uygulama kodu değişmedi.
- Kanıt: `npm run data` (curated 330); `npm test` 81/81 (330 benzersiz çizim, EN kapsamı); Playwright: tam koşu 86/88, düzeltme sonrası B088 2/2 PASS.
- Sonraki: **B089** baştan sona denetim (hata taraması, dil ayarı TR/EN kontrolü) ve beta.14.

## B089 · 2026-11-12 · baştan sona denetim ve Dil kartı
- Çalışma anı denetimi (scratchpad `audit.cjs`, vite preview): telefon 390 px + masaüstü 1280 px × TR/EN × koyu/açık tema; besin seçip tarif/kıyas/günlüğe ekleyerek 6 sekme + besin seçici; her ekranda yatay taşma, konsol/sayfa hatası ve axe (wcag2a/aa) taraması. Tek bulgu: Kıyasla tablosunun kaydırma alanına klavyeyle ulaşılamıyordu (axe scrollable-region-focusable) → `.tablewrap` tabindex=0, role=region, etiketli. Yeniden tarama: TEMİZ (taşma 0, hata 0, axe ihlali 0).
- Veri denetimi: 330 besinde aynı ad yok, makro toplamı 100 g'ı aşan biçim yok; tek eksik "jaggery" (USDA kaydı yok, "veri bekleniyor" etiketli, az bilinen olarak gizli; değerleri "veri yok", 0 değil).
- Dil: seçenek zaten vardı (Görünüm kartında); Kaan isteğiyle Ayarlar'ın en üstüne "🌐 Dil / Language" kartı: 🇹🇷 Türkçe · 🇬🇧 English · Cihaz dili (büyük düğmeler, kalıcı). Dil adları kendi dilinde (`lang` özniteliğiyle); B051 İngilizce taraması `[lang="tr"]` öğelerini atlayacak şekilde güncellendi.
- Kanıt: `npm test` 81/81; Playwright 90/90 PASS (yeni B089 testi; B051/B089 düzeltme sonrası 4/4); denetim betiği TEMİZ.
- Sonraki: **B090** beta.14 yayını (B085–B089).
- Yayın: release run 43271159134 SUCCESS (commit d89bc49). v1.1.2-beta.14 pre-release 2026-11-12T17:51Z; 22 varlık. Cihaz kurulumu NOT_RUN.

## B090 · 2026-11-12 · Vercel: Chrome'da açılmama (service worker sağlamlaştırma)
- Kaan: besinmatriksi.vercel.app Chrome'da açılmıyor, Firefox'ta açılıyor. Bu ortamdan vercel.app'e erişim yok (vekil CONNECT 403; sayfa okuma aracı ENOTFOUND) → canlı site NOT_RUN; Chrome'daki gerçek hata ekranı görülmedi.
- Koddaki olası kök neden: service worker (sw.js) sayfa açılışını dahil her şeyi önce önbellekten veriyordu ve kurulum `cache.addAll` ile yapılıyordu (tek dosya inmezse yeni sürüm hiç kurulamaz). Chrome'da bir kez eski/yarım kopya önbelleğe alınırsa tarayıcı orada takılı kalabilir; önbelleği olmayan Firefox etkilenmez.
- Düzeltmeler: (1) sayfa açılışı önce ağdan (`cache: 'no-store'`), ağ yoksa önbellekteki sayfa; (2) kurulum `Promise.allSettled` + `cache: 'reload'` (tek dosya hatası kurulumu bozmaz); (3) `register('./sw.js', { updateViaCache: 'none' })` + `update()`; güncellemede yeni sürüm devralınca bir kez yenileme; (4) `index.html` açılış bekçisi: uygulama 10 sn'de açılmazsa boş ekran yerine "Önbelleği temizle ve yeniden yükle" (yalnız SW/önbellek; tarif ve ayarlar localStorage'da kalır); (5) `vercel.json`: sw.js ve index önbelleklenmez, assets 1 yıl immutable, manifest türü.
- Kanıt: `npm test` 81/81; Playwright 94/94 (yeni B090 testleri: ana betik engellenince 11 sn sonra kurtarma düğmesi görünür ve tıklanınca uygulama açılır; sw.js ağ-önce/allSettled içerir; çevrimdışı PWA testi geçmeye devam ediyor). B051 İngilizce taraması script/style içeriğini atlayacak şekilde düzeltildi.
- Açık: Chrome'da gerçekte ne göründüğü (boş ekran, Vercel giriş sayfası, hata) Kaan'dan bekleniyor; önizleme bağlantılarında Vercel "Deployment Protection" Vercel'e giriş yapılmamış tarayıcıda giriş ister.
- Sonraki: **B091** beta.15 yayını ve Vercel doğrulaması (Kaan'ın Chrome'daki sonucu).
- B090 ek kanıt (yükseltme senaryosu, telefon görünümü, kalıcı tarayıcı profili, aynı origin): beta.5 (a2a0e39) ve beta.13 (0323563) derlenip kullanıldı (tarif, günlük, kıyas, ayar, son bakılanlar kaydedildi), sonra aynı adreste yeni derleme sunuldu. Her ikisinde: 1. yükleme eski önbellekten eski sürüm, 2. ve 3. yükleme 1.1.2-beta.14, booted=true, konsol/sayfa hatası yok. Eski kayıtlı veri açılışı bozmuyor. Kaan'ın telefonundaki Chrome'da "hiç açılmama" bu kanıtla açıklanmıyor; Chrome'un gösterdiği hata metni (ör. ERR_NAME_NOT_RESOLVED / ERR_CONNECTION_RESET) bekleniyor: bu tür hatalar Firefox'un güvenli DNS'i ile aşılan bir ağ/DNS engeline işaret eder.
- Vercel: commit b5bb3bf (B090 service worker düzeltmesi dahil) için Vercel durumu success "Deployment has completed"; canlı site bu ortamdan erişilemediği için çalışma anı doğrulaması NOT_RUN.

## B091 · 2026-11-12 · beta.15 yayını
- 1.1.2-beta.15 (B090 service worker düzeltmesi ve açılış bekçisi indirilebilir paketlere/PWA'ya). `npm test` PASS; `native-notices` 446 / eksik 0.
- Sonraki: **B092** Kaan'ın Chrome'daki sonucuna göre: hâlâ açılmıyorsa hata metniyle ağ/DNS teşhisi ve gerekirse ikinci barındırma adresi.
- Yayın: release run 43276002011 SUCCESS (commit d686224). v1.1.2-beta.15 pre-release 2026-11-12T18:12Z; 22 varlık. Vercel (d686224): success "Deployment has completed". Canlı site ve cihaz kurulumu NOT_RUN (bu ortamdan erişim yok).

## B092 · 2026-11-12 · Türk mutfak ölçüleri
- `scripts/build-data.mjs` `turkishMeasures`: USDA hacim ölçüsünden (cup 236,6 ml önceliklidir; yoksa tbsp 14,79, tsp 4,93, fl oz 29,57 ml) ml başına gram bulunur; 1 su bardağı (200 ml), 1 yemek kaşığı (15 ml), 1 çay kaşığı (5 ml) gramları hesaplanır (`d: 1`, `src`: kaynak ölçü). Hacim ölçüsü olmayan besinde (ör. ekmek: "1 dilim") uydurma ölçü yok. 355 küratörlü biçim + geniş katalog; foods.json 910→1046 KB, ext 3,27→3,72 MB.
- Arayüz: ölçü düğmelerinde hesaplanan değerler "≈" ile, ipucunda "USDA “1 cup” ölçüsünden hacimle hesaplandı; yaklaşık". İngilizcede "1 Turkish cup (200 ml)".
- İlk hatalar: (1) yeni birim testi derleme betiğini içe aktarıyordu (yan etki: veri dosyası yazma) → kaldırıldı; (2) B074 testi ilk ölçü düğmesinin tam sayı olduğunu varsayıyordu (artık 190,2 g; tablo başlığı yuvarlar) → beklenti yuvarlanmış değere çevrildi.
- Kanıt: `npm run data`; `npm test` 82/82 (nohut 1 su bardağı = 1 cup × 200/236,6, su ≈ 200 g, ekmekte hesaplanmış ölçü yok); Playwright 94/96 → düzeltme sonrası B074/B092 4/4 PASS.
- Sonraki: **B093** Günlük'te hedef çubukları.

## B093 · 2026-11-12 · Günlük hedef çubukları
- `basicCard(r, cfg, title, { goals, energyTarget })`: Günlük'te temel kart karolarına çubuk. Kalori (profil/elle hedef), protein, lif "hedefe doğru" ("kalan X" / "hedefe ulaşıldı ✓", yeşil); şeker, doymuş yağ, tuz "üst sınır" ("üst sınırın %X", aşınca kırmızı "üst sınırı %X aştı"); karbonhidrat ve yağ "referansın %X". Referansı olmayan değerde çubuk yok ("hedef yok"); veri yoksa yalnız "veri yok", çubuk yok. Lif referansı yalnız EFSA/kendi hedef modunda vardır (BRD'de yok). Altta kaynak ve "tıbbi öneri değildir" notu. Besin ekranı değişmedi. TR/EN.
- İlk hata: birim testinin karo yakalayıcısı sınıfı kaçırıyordu; ayrıca veri yokken "hedef yok" da yazılıyordu → yalnız "veri yok".
- Kanıt: `npm test` 83/83; Playwright 98/98 (B093 desktop+phone dahil).
- Sonraki: **B094** Aion: günün saatine göre selam, hedeflere ulaşınca kutlama.

## B094 · 2026-11-12 · Aion: saat selamı ve hedef kutlaması
- `src/aion-moments.js`: `greetingFor(saat)` (05–11 günaydın, 11–17 iyi günler, 17–22 iyi akşamlar, gece "uyku da sağlığın parçası"); `newlyReached`, `celebrationText`.
- Açılışta (ilk tanışma selamından sonraki açılışlarda) günde bir kez saate göre selam (`bm.aion.greetDay`, Aion ipuçları açıksa).
- Günlük'te kalori/protein/lif hedefi "ulaşıldı" olunca Aion kutlama hareketi + balon; gün başına cihazda hatırlanır (`bm.aion.goals`), yeniden açılışta tekrar etmez. Yeni çizim yok; mevcut 5 animasyon (idle, wave, read, sad, celebrate) kullanıldı. Yeni poz (uyku vb.) için kaynak çizim gerekir: PLANNED değil, varlık yok.
- Kanıt: `npm test` 85/85; Playwright 100/100 (B094 desktop+phone: soya izolatı → protein hedefi → balon "protein"; yeniden yüklemede kutlama yok).
- Sonraki: **B095** görünüm cilası (telefon/masaüstü ekran görüntüleriyle hizalama ve boşluk düzeltmeleri).

## B095 · 2026-11-12 · Görünüm cilası
- Telefon (390 px) ve masaüstü (1280 px) için 7 ekranın tam sayfa görüntüsü alındı (Keşfet, ayrıntı, Kıyasla, Günlük, Tarif, Ayarlar, Hakkında) ve şu sorunlar düzeltildi:
  - Kıyasla: besin sütunları eşit genişlikte değildi (uzun biçim adı sütunu şişiriyordu); telefonda ikinci besin ekrandan taşıyordu → `table-layout: fixed`, ilk sütun %34, besin sütunları eşit, en küçük genişlik sütun sayısına göre.
  - Türkçe yüzde biçimi "20%" → "%20" (`pctText`; İngilizcede "20%"). Eksik besin listesi ve amino asit skoru da aynı biçimde.
  - Ayarlar'da dil seçimi iki kez vardı (üstte Dil kartı + Görünüm'de açılır liste) → yalnız Dil kartı.
  - Telefonda üst çubuk yalnız logo gösteriyordu → "Besin Matriksi" adı görünür.
  - Günlük lif karosu BRD modunda "hedef yok" diyordu → "BRD'de lif hedefi yok; Ayarlar'da EFSA seçilebilir".
- Kanıt: `npm test` 85/85; Playwright 102/102 (B095 desktop+phone: kıyas sütun farkı < 2 px, yatay taşma yok, %-biçimi, tek dil seçimi).
- Sonraki: **B096** beta.16 yayını (B093–B095).

## B096 · 2026-11-12 · beta.16 yayını
- 1.1.2-beta.16 (B092 Türk ölçüleri, B093 hedef çubukları, B094 Aion selam/kutlama, B095 görünüm cilası).
- Yayın: release run 43285600923 SUCCESS (commit 3e50caa; 6 iş: web+tarayıcı testleri, Android, iOS imzasız, Linux, Windows, macOS). v1.1.2-beta.16 pre-release 2026-11-12T19:15:58Z; 22 varlık (apk, portable.exe, Setup.exe, msi, dmg, AppImage, deb, rpm, offline.html, web-pwa.zip, source.zip, SHA256SUMS, BUILD_INFO…). Canlı site/cihaz kurulumu NOT_RUN (bu ortamdan erişim yok).
- Sonraki: **B097** Günlük ekranında telefonda gün kartı ve temel değerler profilin üstüne (ekran görüntüsünde temel değerler ~1,5 ekran aşağıdaydı; profil kaydedildiyse katlanır).

## B097 · 2026-11-12 · Temel değerlerde günlük yüzde (ortalama kadın/erkek), kaynak en altta, maliyet ve kül kaldırıldı
- Kaan'ın isteği (ekran görüntüleriyle): temel değer karolarında çubuk + günün ne kadarını karşıladığı; kişisel bilgi yoksa ortalama kadın ve ortalama erkek; tarif, besin ayrıntısı ve Kıyasla'da aynı; kaynak en altta; maliyet hesabı yok; "Kül" satırı kaldırılsın.
- `src/daily-ref.js`: ortalama yetişkin 19–64 yaş (PHE Government Dietary Recommendations 2016): enerji 2000/2500 kcal, protein 45/55,5 g, karbonhidrat 267/333 g, yağ ≤78/≤97 g, doymuş yağ ≤24/≤31 g, lif 30 g, tuz ≤6 g; şeker: PHE değeri serbest şeker olduğu için AB 1169/2011 toplam şeker 90 g. Doğrulama: doymuş yağ 31/24 ve lif 30 arama sonuçlarıyla doğrulandı; PDF bu ortamdan açılamadı (gov.uk proxy 403) → diğer değerler kaynağın bilinen tablosundan, PDF ile birebir kontrol NOT_RUN.
- Profilde cinsiyet varsa yalnız o; enerji tahmini varsa kalori hedefi o; elle hedef (Ayarlar → kendi hedeflerin) varsa onlar. Hedefe doğru (kalori/protein/lif) tüm referanslarda ≥%100 ise yeşil; üst sınırlı (yağ/doymuş yağ/şeker/tuz) herhangi birinde aşılırsa kırmızı.
- Tarif: "Toplam tarif" özeti artık aynı temel değer kartı; maliyet satırı ve kg fiyatı alanı kaldırıldı (eski kayıtlardaki fiyat verisi silinmez, gösterilmez). Kaynak/kapsam dökümü matriksin altına alındı.
- Besin ayrıntısı: kimlik/kaynak kartı, kapsam ve referans notu matriksin en altına taşındı. "Kül (toplam mineral kalıntısı)" matrikste ve Kıyasla'da gösterilmez (veride kalır).
- Kıyasla: temel satırlarda her değerin altında "K %x · E %y"; kaynak notu tablonun altında.
- İlk hatalar: `fmtPct` app.js'e içe aktarılmamıştı (Kıyasla boş kaldı) → eklendi; B093/B094 testleri tek referans varsayıyordu → çift referans kuralına göre güncellendi.
- Kanıt: `npm test` 86/86; Playwright 104/104 (son düzeltmeden sonra B093 2/2 yeniden PASS).
- Sonraki: **B098** beta.17 yayını.

## B099 · 2026-11-12 · Kalori kutusu
- "Su, enerji ve fiziksel özellikler" bölümü → "🔥 Kalori": yalnız kalori satırı (su ve kJ satırı matriks/Kıyasla'da gizli; kJ birimi seçiliyse kcal yerine kJ). Veri değişmedi.
- Kanıt: `npm test` 86/86; Playwright 104/104.

## B100 · 2026-11-12 · Eksik veri: USDA flavonoid/izoflavon; makro pasta grafiği; PHE değerleri PDF'ten doğrulandı
- Kaan: "veri eksiğimiz var, çözmeye çalış" + kalori kutusunun üstüne protein/karbonhidrat/yağ pasta grafiği ve yüzdeler.
- Teşhis: SR28'in 117 bileşeninin 116'sı zaten eşlenmiş (yalnız dihidrofilokinon hariç); boş fitokimyasal/oksalat/ağır metal satırları SR28'de yok. Ortam ağı ars.usda.gov'a kapalıydı → Kaan onayıyla kişisel "besinmatriksi" ortamı (www.ars.usda.gov, data.nal.usda.gov, assets.publishing.service.gov.uk) oluşturuldu.
- Veri: USDA Flavonoid DB 3.3 (2018, CC0) ve İzoflavon DB 2.1 (2015, kamu malı) .accdb indirildi (sha256 `data/raw/USDA_FLAVONOID_SOURCES.json`), mdb-tools ile FLAV_DAT/ISFL_DAT CSV.gz olarak `data/raw`'a alındı; aynı NDB numarasıyla eşlenir. 22 flavonoid + 3 izoflavon bileşeni (yeni: ECG, tearubijinler, teaflavinler toplamı (yalnız 4 bileşen de ölçülmüşse), eriodiktiyol, 6 antosiyanidin, glisitein). Kaynak etiketleri `f` (USDA Flavonoid) / `y` (USDA İzoflavon); geniş katalogda `fs`. 425 küratörlü formdan 205'ine veri geldi (ör. çiğ soğan kuersetin 20,3 mg, portakal hesperetin 27,25 mg). Ölçülmeyen yazılmaz. Lisans bildirimi ve Hakkında güncellendi.
- Oksalat ve ağır metaller için dağıtıma uygun, NDB eşlemeli açık veri bulunamadı → hâlâ "veri yok" (uydurma yok).
- PHE Government Dietary Recommendations PDF'i indirildi; Tablo 2 (19–64) ile `src/daily-ref.js` değerleri birebir doğrulandı (2500/2000 kcal, 55,5/45 g protein, ≤97/78 yağ, ≤31/24 doymuş yağ, ≥333/267 karbonhidrat, 6 g tuz, 30 g lif).
- Pasta: `macroPie` kalori kutusunun hemen üstünde, Atwater 4/4/9/2 ile kalorinin protein/karbonhidrat/yağ/lif payı + gram; makrolardan biri ölçülmemişse çizilmez.
- İlk hatalar: (1) pasta açıklaması telefonda sayfayı 429 px'e genişletti, sekme çubuğu ekran dışına itildi (Playwright telefonda 18 test zaman aşımı) → legend min-width 0 / flex-basis; (2) Hakkında'da veri kaynağı metni İngilizcede çevrilmemişti (B051) → çeviri.
- Kanıt: `npm run data`; `npm test` 88/88; Playwright tam koşu 104/106 → iki düzeltme sonrası B051+B100 4/4 PASS; telefon ekran görüntüsü kontrol edildi.
- Sonraki: **B101** beta.18 yayını.

## B098 · 2026-11-12 · beta.17 yayın kanıtı
- v1.1.2-beta.17 pre-release 2026-11-12T19:55:05Z (commit 3d8771b); 22 varlık (apk, portable.exe, Setup.exe, msi, dmg, AppImage, deb, rpm, offline.html, web-pwa.zip, source.zip, SHA256SUMS…). Cihaz kurulumu NOT_RUN.

## B102 · 2026-11-12 · Pasta grafiği Kıyasla'da da
- Kaan: pasta grafiği Keşfet, Tarif ve Kıyasla'da olsun. Keşfet ve Tarif'te matriks içinde kalori kutusunun üstünde zaten vardı; Kıyasla'ya tablonun üstüne "Kalori nereden geliyor?" kartı: her besin için küçük halka grafik + protein/karbonhidrat/yağ/lif yüzdeleri (`macroPie(..., { compact })`). Makro eksikse "pasta çizilmedi" notu.
- İlk hatalar: (1) dar sütunda "Karbonhidrat" ikiye bölünüyordu → nowrap/küçük yazı; (2) açıklama listesi `flex-basis: 200px` dikey yönde yükseklik oldu (satırlar arası boşluk) → mini'de `flex: 0 0 auto`.
- Kanıt: `npm test` 88/88; Playwright tam koşu 108/108 (CSS son düzeltmesinden önce), sonrasında ilgili 10 test PASS; telefon ekran görüntüsü kontrol edildi.
- Sonraki: **B101** beta.18 yayın kanıtı, ardından **B103** beta.19 (Kıyasla pastaları).

## B101 · 2026-11-12 · beta.18 yayın kanıtı
- v1.1.2-beta.18 pre-release 2026-11-12T20:33:26Z (commit 982d203; flavonoid/izoflavon, kalori kutusu, Keşfet/Tarif pastası). Cihaz kurulumu NOT_RUN.
- B103: beta.19 (Kıyasla pastaları) release.yml tetiklendi.

## B103 · 2026-11-12 · beta.19 yayın kanıtı
- v1.1.2-beta.19 pre-release 2026-11-12T20:53:57Z (commit 1b70f2b; Kıyasla'da besin başına kalori pastaları). Cihaz kurulumu NOT_RUN.
- Sonraki: **B104** Günlük'te telefonda gün kartı ve temel değerler profilin üstüne (B096'da gözlenen uzun kaydırma).

## B104 · 2026-11-12 · Günlük: önce gün, sonra profil
- Günlük ekranında sıra: gün kartı (tarih, plan/tüketilen) → günün temel değerleri (çubuklar) → enerji özeti → kayıtlar → 7 gün → kaynak → matriks; kişisel profil formu en alta (yedek düğmelerinin üstüne) taşındı. Telefonda temel değerler artık ilk ekranda.
- Kanıt: `npm test` 88/88; Playwright 110/110 (B104 desktop+phone: temel kart ve tarih seçici profil kartının üstünde).
- Sonraki: **B105** Kaan'ın geri bildirimine göre; bekleyen yoksa Günlük'te makro pasta grafiği (gün toplamı).

## B105 · 2026-11-12 · Günlük'te gün toplamı pasta grafiği
- Günlük'te günün temel değerlerinin hemen altında "Kalori nereden geliyor?" pastası (gün toplamı; makrolardan biri hiçbir kayıtta yoksa çizilmez). Artık pasta Keşfet, Tarif, Kıyasla ve Günlük'te.
- Kanıt: `npm test` 88/88; Playwright 112/112.
- Sonraki: **B106** beta.20 yayını (B104 + B105).

## B106 · 2026-11-12 · beta.20 yayını
- Run 43317990590 (commit bbecc42): ilk denemede yalnız Android APK işi düştü — Gradle, google-services eklentisinin bağımlılıklarını (guava 33.3.1-jre, kotlin-stdlib-jdk8 2.2.0) Maven Central'dan çözemedi ("Could not find"); Android dosyalarında değişiklik yoktu → geçici depo/ağ hatası. `rerun_failed_jobs` ile yeniden çalıştırıldı → SUCCESS; v1.1.2-beta.20 pre-release 2026-11-12T22:35:54Z. Cihaz kurulumu NOT_RUN.
- Sonraki: **B107** Kaan'ın geri bildirimine göre; bekleyen yoksa Android derlemesine Maven çözümleme yeniden denemesi (Gradle `--refresh-dependencies` yerine adım düzeyinde 1 tekrar) eklemek.

## B107 · 2026-11-12 · Tur vurgusu ve dengeli temel değer karoları
- Kaan: soldaki kesik mor çizgi (tanıtım turu hedef vurgusu) saçma duruyor; temel değer karoları 7+1 diziliyor, dengeli olmalı.
- Tur hedefi: kesikli outline → yumuşak vurgu rengi halka + parıltı (box-shadow). Temel kart: 8 karo kart genişliğine göre 4+4, dar kartta (≤520 px, container query) 2×4.
- Kanıt: `npm test` 88/88; Playwright 114/114 (B107: tur hedefinde dashed yok; karolar satır başına eşit sayıda).

## B108 · 2026-11-12 · Ayarlar dengeli düzen
- Kaan: Ayarlar kutuları dengesiz, boşluklu. Izgara satırları en uzun karta göre yükseldiği için büyük boşluklar kalıyordu → CSS çok sütunlu akış (masonry): `columns: 3 400px`, kartlar bölünmez, arama kutusu tam genişlik. Masaüstü 1600 px'te 3 sütun, telefonda tek sütun.
- Kanıt: Playwright 116/116 (B108: aynı sütunda ardışık kartlar arası boşluk < 40 px, yatay taşma yok); ekran görüntüsü kontrol edildi.

## B109 · 2026-11-12 · Kıyasla tablosu iç kaydırmasız
- Kaan: tablonun sağındaki dikey kaydırma çubuğu saçma. `.tablewrap` `max-height: 75vh` kaldırıldı; tablo tam boyda, sayfa kaydırılır (yatay kaydırma dar ekranda kalır).
- Kanıt: Playwright 118/118 (B109: tablewrap içinde dikey taşma yok, yükseklik > 1000 px).

## B110 · 2026-11-12 · Temel değerler + pasta tek kartta; hesaplanan göstergeler hemen altında; Inter yazı tipi
- Kaan: "Kalori nereden geliyor" ile "Temel besin değerleri" birleşsin (solda pasta, sağda dengeli kutular); "Hesaplanan göstergeler" onun altında; yazı tipi çocuksu, ciddi/klas olsun.
- `basicCard(..., { pie: true })`: tek kart, solda halka grafik + yüzdeler, sağda 8 karo (karo alanı ≥640 px ise 4+4, değilse 2×4; telefonda pasta üstte yatay). Keşfet, Tarif özeti ve Günlük'te. Ayrı pasta kartı ve Hesaplanan göstergelerdeki enerji çubuğu (tekrar) kaldırıldı; Hesaplanan göstergeler matrikste temel kartın hemen altında (gizlenmediyse).
- Yazı: varsayılan Inter; bir kerelik geçiş (`bm.fontV2`): sistem/Nunito/Andika/Lexend → Inter; Atkinson/OpenDyslexic ve sonraki seçimler korunur.
- Kanıt: `npm test` 89/89 (yeni: geçiş testi); Playwright 118/118; masaüstü/telefon ekran görüntüsü kontrol edildi.

## B111 · 2026-11-12 · Eksik veri: USDA FoodData Central Foundation Foods
- Kaan: "veri yok" kalanları araştır, mümkün olduğunca doldur. Ortama `fdc.nal.usda.gov` eklendi (Kaan onaylı ortam düzenlemesi).
- FDC Foundation Foods JSON 2026-10-29 (CC0) indirildi (sha256 `data/raw/USDA_FDC_FOUNDATION_SOURCE.json`); NDB numaralı 424 kayıt sıkıştırılmış olarak `data/raw`'da. Derlemede aynı NDB kaydı için yalnız SR28'de ölçülmemiş bileşenler doldurulur (SR28 asla ezilmez), etiket `F`, kayıtta FDC kimliği. SR numaralarının yanında ek eşleme: biyotin, molibden, iyot (yeni bileşen, BRD 150 µg), toplam şeker, sistein, sitrik/malik/kinik/oksalik asit, lutein, zeaksantin, γ-karoten, rafinoz, stakiyoz.
- Sonuç: 72 küratörlü biçimde 480 yeni değer (+ geniş katalogda eşleşen 88 kayıt). Ör. portakal suyu: sitrik asit 757 mg, malik 160 mg, şeker türleri.
- Kalan boşluklar: oksalat (yalnız 13 FDC kaydı), ağır metaller ve çoğu fitokimyasal için NDB eşlemeli açık veri yok → "veri yok" (uydurma yok).
- Kanıt: `npm run data`; `npm test` 90/90; Playwright 118/118.
- Sonraki: **B112** Keşfet: karşılama metni kaldırılıp seçili kategorinin besinleri sağda periyodik tablo gibi kare ızgara.

## B112 · 2026-11-12 · Keşfet: periyodik tablo gibi besin kareleri
- Seçim yokken sağ panelde seçili kategorinin (ya da aramanın) besinleri kare ızgarada: sıra no, kcal/100 g, simge, ad, protein ve lif. "Tümü"nde kategori başlıklarıyla gruplu. Kareye dokununca matris açılır. Telefonda sağ panel seçim yokken gizli (orta liste kullanılır).

## B113 · 2026-11-12 · Karşılama kartı geri, Aion kapalı, tek temel kart (ayrı Kalori kutusu yok)
- Kaan önce karşılama metnini kaldırmayı istedi, sonra "vazgeçtim, kalsın; ekrana tam sığsın, boşluk kalmasın, soldaki kutularla dengeli olsun" dedi → karşılama kartı sağ panelin üstünde kompakt (adımlar iki sütun), altını periyodik tablo dolduruyor.
- "Sağ alttaki Aion'u kaldır" → `aionEnabled` varsayılan false; mevcut kurulumlarda bir kez kapatılır (`bm.aionOffV1`), Ayarlar → Aion'dan yeniden açılabilir.
- "Üç kutuyu birleştir; kalori iki kez geçmesin" → temel değer kartı (solda pasta, sağda 8 karo) tek kart; ayrı "Kalori" bölümü matriksten ve Kıyasla'dan kaldırıldı (veri CSV'de). Enerji birimi kJ seçiliyse temel kartta kJ gösterilir.
- İlk hata: tek dosya HTML eski derlemeyle test edildi (4 test) → `npm run build:single` sonrası 4/4 PASS.
- Kanıt: `npm test` 91/91; Playwright 120 (116 PASS + yeniden derleme sonrası tek-HTML 4/4 PASS).
- Sonraki: **B114** beta.21 yayını.

## B115 · 2026-11-12 · Çeşitlilik: longevity / vegan mutfak besinleri
- Kaan: su eklenebilsin; besin mayası, buğday glüteni, buğday rüşeymi, karnıyarık otu tohumu, makadamya, Brezilya cevizi yok; çeşitlilik artsın.
- Teşhis: su (İçme suyu), seitan/vital buğday glüteni, buğday rüşeymi zaten katalogda; makadamya, Brezilya cevizi, pekan, goji, kenevir, natto, teff, amarant, sorgum, moringa, maitake, enoki, kelp, wakame, agar, adzuki, nigarili tofu "az bilinen" (NICHE) diye listelerde gizliydi → NICHE'ten çıkarıldı, artık kategorilerde görünür.
- Yeni USDA SR28 besinleri: sirken (11244), şalgam yaprağı (11568), karpuz çekirdeği (12174), altın çilek/Physalis (09138), arpacık soğan (11677), kestane mantarı/crimini (11266), horoz mantarı/chanterelle (11239), İrlanda yosunu/sea moss (11444), soya filizi (11452). Her birine özel çizim, simge, İngilizce ad.
- Besin mayası ve psyllium: SR28, FDC Foundation ve FNDDS 2024'te yok (doğrulandı); değerler markaya göre çok değişir → katalogda açık notla yer alır, değer uydurulmaz; "Etiketten kendi besinim olarak ekle" düğmesi ürün etiketi formunu adıyla açar. Mevcut `besin_mayasi` kaydı aslında kuru ekmek mayasıdır (adı doğru: "Kuru ekmek mayası (aktif)").
- Kanıt: `npm run data` (341 besin); `npm test` 91/91; Playwright 122/122.
- Sonraki: **B116** beta.22 yayını (beta.21 sonucu kontrol edildikten sonra).

## B114 · 2026-11-12 · beta.21 yayın kanıtı
- v1.1.2-beta.21 pre-release 2026-11-12T23:38:57Z (commit bd19671). Cihaz kurulumu NOT_RUN.
- B116: beta.22 (B115) release.yml tetiklendi.

## B117 · 2026-11-13 · İçecekler ve tahıl çeşitliliği
- Kaan: siyez bulguru, siyah pirinç, siyah mercimek, bitki çayları, Türk kahvesi, Americano yok.
- Kırmızı/yeşil mercimek zaten vardı. USDA SR28: hibiskus çayı (14649), papatya dışı bitki çayı (14381), oolong (14185). USDA FNDDS 2021-2023 (CC0; yeni `N` kaynak etiketi, `data/raw/USDA_FNDDS_*`): Türk kahvesi (92101600; FNDDS tarifi demleme kahve + şeker, notla), latte ve cappuccino bitkisel sütle (92101903, 92161002). Derleme `N<kod>` biçimli formları FNDDS'ten okur; porsiyonlar ve Türk ölçüleri dahil.
- Siyez (einkorn), siyah pirinç, siyah (beluga) mercimek ve Americano: SR28, FDC Foundation ve FNDDS'te ölçülmüş kayıt yok (arandı) → açık notla katalogda; değer uydurulmadı; etiketten ekleme / Americano için tarif (espresso + su) yolu.
- Kanıt: `npm run data` (351 besin); `npm test` 92/92; Playwright 124/124.

## B116 · 2026-11-13 · beta.22 yayın kanıtı
- v1.1.2-beta.22 pre-release 2026-11-12T23:59:08Z (commit 782e188). Cihaz kurulumu NOT_RUN.
- B118: beta.23 (B117) release.yml tetiklendi.

## B119 · 2026-11-13 · Kapsam genişletme: deniz ürünleri, mantarlar, hayvansal, Türkiye besinleri, protein tozları, kreatin, lif türleri
- Kaan'ın istekleri (art arda): Gemlik zeytini, taflan, Seylan tarçını, Türkiye'ye özgü besinler; daha çok deniz ürünü; kanlıca, aslan yelesi, reishi; tavada patates kızartması; hayvansal kategorileri zenginleştir; protein tozları (whey, bitkisel, beef…) ve kreatin monohidrat; lif türleri (beta-glukan…).
- USDA SR28 (yeni 21 deniz ürünü: lüfer, istavrit, kefal, kalkan, dil, kılıç, sazan, mezgit, orfoz, yayın, mersin, yılan, balık yumurtası, kalamar, ahtapot, mürekkep, istiridye, deniz tarağı, yengeç, ıstakoz, kerevit; 28 hayvansal: keçi/koyun sütü, kefir, yayık ayranı, keçi peyniri, yağsız yoğurt, cottage, peynir altı suyu, bıldırcın/ördek/kaz yumurtası, kuzu/dana kıyma, keçi eti, kuzu ciğer/böbrek, dana yürek/dil/beyin, işkembe, kurutulmuş dana, tavuk kanat/kıyma/ciğer/taşlık, ördek, kaz, bıldırcın; kuşburnu, ısırgan, kırmızı frenk üzümü, üzüm sirkesi, dereotu tohumu; whey izolat, whey tozu, yumurta akı tozu, jelatin, soya protein tozu). Patates kızartmasına "yağda (restoran)" ve "tavada (rendelenmiş, ev)" biçimleri.
- FDC Foundation'a özgü kayıtlar (`F<ndb>` biçimi; 957 Atwater enerjisi): aslan yelesi, kral istiridye, kayın (shimeji), kavak mantarı (pioppino).
- Yeni kategori "Protein tozları ve takviyeler" (bitkisel); hayvansal tozlar süt/yumurta/et kategorilerinde etiketli.
- Ölçülmüş açık veri yok → açık notla, değer uydurmadan (etiketten ekle): Gemlik zeytini, taflan, Seylan tarçını (kumarin notu), üzüm pekmezi, nar ekşisi, sumak, çörek otu, isot; kanlıca, yumurta mantarı (zehirli benzer uyarısı), reishi (ilaç etkileşimi notu); bezelye/pirinç/kenevir/kabak çekirdeği/karışık bitkisel protein, kazein, sığır proteini, kolajen peptit. TürKomp açık lisanslı değil.
- Kreatin monohidrat: yeni bileşen "Kreatin"; %87,92 kimyasal formülden (149,15 / 131,13 g/mol), kaynak `d` (hesap); enerji yazılmaz.
- Lif türleri: yeni bileşenler beta-glukan, dirençli nişasta, HMWDF, LMWDF; FDC'den çözünür/çözünmez lif de eşlendi (beta-glukan 12 besinde, ör. mantarlar, karabuğday, darı).
- İlk hatalar: kırmızı frenk üzümü/kiraz ve kuzu/dana ciğer çizimleri aynıydı → renk; yeni biçim adlarının EN karşılığı; "kanlıca" EN adında Türkçe harf (B051); test başlığında tırnak.
- Kanıt: `npm run data` (418 besin); `npm test` 95/95; Playwright 126/126.

## B120 · 2026-11-13 · Lifler kutusu; malzeme/kıyas kartında sabit ✕
- (Düzeltme: B119 sonrası katalog 434 besin; B119 kaydındaki 418 sayısı ara derlemeye aitti.)
- "Nişasta ve lif" → "🌾 Lifler (diyet lifi ve türleri)"; nişasta karbonhidrat bölümüne alındı. Lif türleri alt başlığı: beta-glukan, dirençli nişasta, HMWDF, LMWDF + yeni tanımlar pektin, inülin/fruktanlar, arabinoksilan, selüloz, hemiselüloz, lignin (açık kaynaklarda besin bazında ölçüm yok → veri yok; uydurma yok). Lifler kutusu matrikste temel kart ve Hesaplanan göstergelerin hemen altında; Tarif, Günlük ve Kıyasla'da (bölüm çipi "Lifler") aynı.
- Tarif malzeme kartı ve Kıyasla kartında ↑/↓ ve ✕ kartın sağ üst köşesine sabit (mutlak konum); ad uzasa da yer değiştirmez.
- Kanıt: `npm test` 95/95; Playwright 128/128 (B120: matriks sırası temel→hesap→lif; ✕ her kartta aynı konum, sağ üstte).

## B118 · 2026-11-13 · beta.23 yayın kanıtı
- v1.1.2-beta.23 pre-release 2026-11-13T00:18:58Z (commit 98986d6). Cihaz kurulumu NOT_RUN.
- Sonraki: **B121** tarayıcı uyumu CI (Firefox/WebKit/iPhone/iPad) sonucu → düzeltmeler → beta.24 (B119+B120).

## B122 · 2026-11-13 · Günlük: kişisel profil yeniden en üstte
- Kaan (ekran görüntüsüyle): "Kişisel profil bulunduğu sekmede en üstte olmalı, en altta değil." B104'teki sıra tersine çevrildi: profil → gün kartı (tarih, temel değerler + pasta) → kayıtlar → 7 gün → matriks → yedek.
- Kanıt: `npm test` 95/95; Playwright ilgili 18 test PASS (B122: profil kartı tarih seçicinin, o da temel kartın üstünde).

## B123 · 2026-11-13 · Tanıtım turu kaldırıldı; Firefox/WebKit uyum düzeltmeleri
- Kaan: "şu quick tour şeyini kaldır." → tur kartı, hedef vurgusu, Ayarlar'daki "Tanıtım turunu başlat" düğmesi, `src/tour.js` ve testleri kaldırıldı (B070 geri alındı). Karşılama kartı kısa yönergeyi zaten veriyor.
- Tarayıcı uyumu CI (run 43337769454; Firefox, Safari/WebKit, iPhone, iPad; 256 testten 250 PASS): 2 ayrı neden. (1) `page.pdf` yalnız Chromium'da var → A4 testi diğer tarayıcılarda baskı ortamı öykünmesiyle çalışır (ürün hatası değil). (2) WebKit'te periyodik tablo karesi 5 px uzuyordu (aspect-ratio + min-height:auto) → `.pt { min-height: 0; overflow: hidden }`; B112 testi proje adına değil ekran genişliğine bakar (iPhone'da sağ panel gizli).
- Kişisel profilin Günlük'te en üstte olduğu doğrulandı (B122, commit 26c5930).
- Kanıt: `npm test` 94/94; Playwright (Chromium masaüstü+telefon) 128/128. Firefox/WebKit sonucu: CI'da yeniden koşacak (NOT_RUN yerel).

## B124 · 2026-11-13 · Ayran, kaju ayranı (tarif hesabı), Ekmek ve Hazır yemekler kategorileri
- Kaan: ayran, kaju ayranı, ekmek türleri, et/tavuk döner. USDA'da ayran ve kaju ayranı yok → yeni "tarif hesabı" türü: `recipe: [[ndb, gram, 'inert'?], …]`, USDA malzeme değerlerinden ağırlık oranıyla HESAPLANAN TAHMİN, kaynak etiketi `r` "Tahmin (tarif)", kimlik kartında oran ve malzemeler. Bir bileşen yalnız tüm malzemelerde ölçülmüşse yazılır; içme suyu ve sofra tuzu "inert" (ölçülmemiş organik bileşenleri kimyasal olarak yoktur → 0; mineraller USDA'dan).
  - Ayran: %60 tam yağlı yoğurt (01116) + %39,5 su (14411) + %0,5 tuz (02047) → 36,6 kcal, 2,08 g protein /100 g. Kaju ayranı: %20 çiğ kaju (12087) + %79,5 su + %0,5 tuz → 110,6 kcal; fermantasyon etkisi hesaba katılmadı (notta).
- Yeni kategoriler: "🍞 Ekmek ve unlu mamuller" (beyaz/tam buğday/çavdar ekmeği, pide/lavaş buraya taşındı) ve "🍲 Hazır yemekler ve mezeler" (döner vb. USDA FNDDS kayıtları sonraki Forge'da; aday araştırması alt ajan kotası dolduğu için yarım).
- Kanıt: `npm test` 95/95 (B124: oranlar, r etiketi, protein = 0,6 × yoğurt); Playwright B124.

## B125 · 2026-11-13 · Bölüm sırası; gecikmeli selam hatası
- Kaan: "Protein ve amino asitler kutusu Lifler kutusunun üstünde, Lifler Vitaminler kutusunun altında olmalı." → SECTIONS sırası: Kalori, Protein, Karbonhidrat, Yağlar, Vitaminler, **Lifler**, Mineraller…; B120'deki "Lifler en üstte" zorlaması kaldırıldı. Kayıtlı sırası eski varsayılanla birebir aynı olan kullanıcılar yeni sıraya geçer; elle değiştirilmiş sıra korunur. Kıyasla tablosu da aynı bölüm sırasını izler.
- Hata: tur kaldırılınca ilk açılış "Merhaba" selamı 600 ms gecikmeyle, o arada çıkan hedef kutlamasının üzerine yazıyordu (B094 testi aralıklı düşüyordu) → `aionSay(..., { ifIdle: true })`: gecikmeli selam balon boşsa gösterilir.
- Kanıt: `npm test` 96/96; Playwright 130/130 (B094 3 ardışık koşu PASS).
- Alt ajanlar (kod denetimi, besin adayları, eksik veri kaynakları) 5 saatlik kota sınırında yarıda kaldı; kota yenilenince sürdürülecek.
- Sonraki: **B126** FNDDS'ten döner/kebap/mezeler ve ekmek türleri (ekşi mayalı, çok tahıllı…) + beta.24.

## B126 · 2026-11-13 · Ekmek türleri, döner ve mezeler
- Ekmek ve unlu mamuller (USDA SR28): ekşi mayalı/Fransız (18029), yulaf (18039), kepekli (18066), pumpernickel (18044), İtalyan (18033), bagel (18001), mısır ve buğday tortillası (18363, 18364), grissini (18080), yufka/filo (18338), galeta unu (18079), tam buğday kraker (18235), tereyağlı kruvasan (18239, hayvansal); USDA FNDDS: çok tahıllı ekmek (51601020), naan (51108100), çapati/roti (51300175).
- Hazır yemekler ve mezeler (FNDDS tarifleri, `N` etiketli, notta ana malzemeler): falafel, tabule, zeytinyağlı sarma (bitkisel); etli sarma, cacık/tzatziki, cevizli baklava, ıspanaklı börek, kuzu şiş, tavuk şiş (hayvansal, `animal: true`; Ayarlar'dan gizlenince listeden çıkar).
- Döner: USDA'da ölçülmüş döner yok. Et döner (ekmeksiz) = USDA FNDDS gyro tarifindeki oranla %49,6 ızgara kuzu kıyma (17225) + %49,6 ızgara dana kıyma %80 yağsız (23573) + %0,8 tuz → "Tahmin (tarif)". Tavuk döner = en yakın ölçüm, rotisserie tavuk but eti derisiz (05345); adında "yakın USDA kaydı" ve notta açıklama.
- Tarif hesabı porsiyonu yalnız içeceklerde "1 su bardağı".
- İlk hatalar: "Tzatziki (cacık)" EN adında Türkçe harf (B051); telefonda test detaydan listeye dönmeden kategori tıklıyordu.
- Kanıt: `npm run data` (463 besin); `npm test` 96/96; Playwright 129/132 → düzeltme sonrası B051+B126 4/4 PASS.
- Sonraki: **B127** beta.24 yayını; ardından alt ajan bulguları (kod denetimi, ek besin adayları, eksik veri kaynakları — kota yenilenince).

## B127 · 2026-11-13 · Kod denetimi düzeltmeleri
- Kıyasla: filtrelenmiş listede ✕ yanlış besini siliyordu (indeks kayması) → özgün konum korunur; miktar değişince yalnız tablo yenilenir; kJ seçiliyse kJ gösterilir; bölüm sırası SECTIONS'ı izler.
- Performans: matris yenilemesi rAF ile birleştirildi; tarif kaydı 300 ms gecikmeli (pagehide/visibilitychange'te hemen yazılır); başka sekmede değişen veriler `storage` olayıyla yüklenir.
- Arama: İngilizce modda ekranda görünen İngilizce adla bulur; aramada periyodik tablo da süzülür.
- Günlük: tarih gece yarısı kendiliğinden bugüne geçer (elle başka güne gidilince durur).
- Dışa aktarma: CSV/XLSX formül enjeksiyonu önlendi; yeni kaynak etiketleri (r, N, F, f, y) her yerde adıyla gösterilir; NDB/FNDDS/FDC kayıt numarası doğru.
- i18n: kalan sabit Türkçe metinler L() ile.
- Kanıt: `npm test` 97/97; `npm run build && npm run build:single`; Playwright 136/136.
- Sonraki: **B128** eksik veri paketleri (iyot, kolin, proantosiyanidin, SR Legacy) + yeni besin adayları (150 doğrulanmış aday hazır).
- Yayın kanıtı: v1.1.2-beta.24 pre-release 2026-11-13T06:42:14Z (release.yml run 43379363604 success). ci.yml run 43379343063 (commit ddc0b34): "Tarayıcı uyumu (Firefox, Safari/WebKit, iPhone, iPad)" success ve "test" success → çapraz tarayıcı RUNTIME_TESTED.

## B128 · 2026-11-13 · USDA özel veri tabanları: iyot, kolin türleri, proantosiyanidinler, SR Legacy
- 4 kamu malı/CC0 USDA veri tabanı `data/raw/` altına (kaynak, SHA-256, lisans: USDA_SPECIAL_DB_SOURCES.json). `fillFromExtra` FDC'den sonra 4 yerde (SR formları, yalnız-FDC formları, tarif malzemeleri, genişletilmiş katalog); öncelik SR28 > Flavonoid/İzoflavon > FDC > L > I > C > P; yalnız boş hücre. Birim ya da bilinmeyen anahtar uyuşmazlığında derleme durur.
- Yeni 10 bileşen: kolin türleri (serbest, GPC, fosfokolin, fosfatidilkolin, sfingomiyelin) ve proantosiyanidin fraksiyonları (dimer, trimer, 4–6, 7–10, polimer; toplam yazılmaz). Yeni kaynak etiketleri L/I/C/P, Hakkında'da açıklamalarıyla, 4 yeni lisans bildirimi.
- Kazanç (küratörlü 463 besin): iyot +64, kolin türleri/betain +605, proantosiyanidin +578, SR Legacy +119 hücre; genişletilmiş katalogda da.
- Tarif hesabı: iyot organik değil → inert su/tuzda ölçülmemiş iyot 0 sayılmaz. Ayranda iyot ölçülmüş iyotlu sofra tuzundan hesaplandı (Türkiye'de sofra tuzu iyotlu); notta yazılı. Kaju ayranında iyot "veri yok" (kaju ölçülmemiş).
- Purin DB alınmadı (ad eşlemesi, insan incelemesi gerekli).
- İlk hata: testteki varsayım (ayranda iyot yok) yanlıştı; tuz kaydı İyot DB'de ölçülü → test hesaba göre düzeltildi.
- Kanıt: `npm run data`; `npm test` 99/99; `npm run build && npm run build:single`; Playwright 136/136 + B128 2/2 (kakao: "USDA Proantosiyanidin", yumurta: "USDA Kolin" etiketleri).
- Sonraki: **B129** yeni besin adayları (150 doğrulanmış USDA kaydı) + beta.25.

## B129 · 2026-11-13 · 150 yeni USDA besini + 1.1.2-beta.25
- Alt ajan araştırması (candidates.json, validate.py: 0 hata) + çizim/simge/EN meta (alt ajan; 150 benzersiz SVG, render denetimi). integrate.py ile katalog, food-art, food-icons, i18n eklendi; FNDDS alt kümesine 21 yeni tarif kodu (surveyDownload.json 2024-10-31'den; SOURCE extracted_codes güncel). 463 → 613 besin.
- Sütlü çikolata (hayvansal) Tatlılar yerine Süt ürünleri'ne alındı. Hayvansal yemekler (menemen, musakka, sütlaç…) `animal: true`.
- İlk hata: bitkisel ezme/süt/yoğurt adlarındaki "butter/milk/yogurt" hayvansal denetim testinde yanlış alarm → bitkisel istisna listesi genişletildi (kayıtların içerikleri tek tek kontrol edildi).
- Kanıt: `npm run data` (613 besin, ext 2985); `npm test` 100/100; `npm run build && npm run build:single`; Playwright 138/138 + B129 2/2.
- Sürüm 1.1.2-beta.25 (7 dosya + bildirimler), RELEASE_NOTES güncel; release.yml publish+prerelease.
- Sonraki: **B130** purin DB ad eşlemelerinin incelenmesi ya da Türkiye'ye özgü tarif hesapları (simit, lahmacun, mercimek köftesi) — beta.25 yayın doğrulamasından sonra.
- Yayın kanıtı: v1.1.2-beta.25 pre-release 2026-11-13T07:46:49Z (release.yml run 43386967105 success). ci.yml: b751bcf (B128 dahil) run 43385609289 success; 53246fc run 43386956118 07:52'de sürüyordu.
- ci.yml run 43386956118 (53246fc, beta.25): "Tarayıcı uyumu (Firefox, Safari/WebKit, iPhone, iPad)" success, "test" success → RUNTIME_TESTED çapraz tarayıcı.

## B130 · 2026-11-13 · Türk tarif hesapları: mercimek köftesi, etsiz çiğ köfte
- USDA'da kaydı yok → tarif hesabı (`r`, "Tahmin (tarif)"), malzeme oranları ve ikameler notta. Mercimek köftesi pişmiş ağırlıkla (haşlanmış mercimek 16070, pişmiş bulgur 20013, haşlanmış soğan 11283…): ısıyla değişen bileşenler tahmin edilmesin diye pişmiş USDA kayıtları kullanıldı → 126,6 kcal/100 g. Çiğ köfte pişirilmez (kuru bulgur + su + salça + soğan + zeytinyağı + maydanoz + limon + biber + kimyon + tuz) → 206,3 kcal/100 g. İsot ve biber salçası USDA'da yok (cayenne ve domates salçası ikame; notta).
- Simit ve lahmacun bilinçli olarak eklenmedi: fırınlama su kaybı ve ısıyla değişen vitaminler tarif oranıyla dürüst hesaplanamaz (CLAUDE.md: ısıyla değişen bileşenler tahmin edilmez). Pişme verimi + yalnız ısıya dayanıklı bileşenler modeli ayrı Forge ister.
- Kanıt: `npm run data` (615 besin); `npm test` 101/101; build + build:single; Playwright 142/142 (B130 dahil).
- Sonraki: **B131** fırın ürünleri için pişme verimi modeli (yalnız ısıya dayanıklı bileşenler: makrolar, lif, mineraller) → simit, lahmacun, pide; ya da purin DB ad eşleme incelemesi.

## B131 · 2026-11-13 · Pişme verimi modeli; simit ve lahmacun; 1.1.2-beta.26
- `recipeYield` (pişmiş/çiğ ağırlık %): kayıp yalnız su; yalnız HEAT_STABLE bileşenler (enerji, kül, protein, yağ + SFA/MUFA/PUFA, karbonhidrat, lif, Na/K/Ca/P/Mg/Fe/Zn/Cu/Mn/Se) yazılır; vitaminler, şeker türleri, amino asitler, yağ asidi ayrıntısı, iyot "veri yok". Kimlik kartında "Pişme verimi" satırı.
- Simit (%82 verim): 324,2 kcal, su 24,4 g; lahmacun (%75, hayvansal): 258,6 kcal. Pekmez yerine USDA melası (notta).
- İlk hata: su formülünde birim karışıklığı (g/100 g × g ile g) → su + makrolar 100 g'ı aşıyordu (lahmacun su 76,9 g). Düzeltildi; kütle dengesi testi eklendi (her iki besinde 100,0 g).
- Kanıt: `npm run data` (617 besin); `npm test` 102/102; build + build:single; Playwright 144/144.
- Sürüm 1.1.2-beta.26; release.yml publish+prerelease.
- Sonraki: **B132** purin DB ad eşlemelerinin incelenmesi (name_matches_for_review.csv) ya da pide/gözleme/börek gibi diğer fırın tarifleri.
- Yayın kanıtı: v1.1.2-beta.26 pre-release 2026-11-13T09:31:54Z (release.yml run 43400383119 success); ci.yml run 43400364758 (15df88e) success → çapraz tarayıcı RUNTIME_TESTED.

## B132 · 2026-11-13 · USDA Pürin veri tabanı (ad eşlemesi incelendi)
- 53 ad eşlemesi tek tek incelendi (data/raw/USDA_PURINE_R3_NAME_MATCHES.csv): 40 "ok" satır tam ve tekil SR28 ad eşleşmesi → alındı; yinelenen adlar, katalogda olmayan NDB'ler ve T1'de zaten eşleşenlerin T2 tekrarları alınmadı. Tablo 2 değerleri Japonya örnekleri (Kaneko 2014) → kaynak açıklamasında yazılı.
- Yeni 5 bileşen Antinutrientler > "Pürinler": toplam (kaynağın "4 bazın toplamı" sütunu), adenin, guanin, hipoksantin, ksantin. Kaynak etiketi U "USDA Pürin", Hakkında + lisans bildirimi (23). Küratörlü katalogda 145 hücre.
- Bulunan eski hata: B128'de tarif kaynak dökümündeki kayıt numarası listesine L/I/C/P eklenmemişti (dize boşluk farkıyla eşleşmemişti) → düzeltildi, test eklendi.
- Kanıt: `npm run data`; `npm test` 104/104; build + build:single; Playwright 146/146 (B132 dahil).
- Sonraki: **B133** diğer fırın tarifleri (pide, gözleme, ıspanaklı/peynirli börek) ya da denetimin kalan maddeleri (#6 macOS Alt kısayolları, #10 yedeğin iki kez içe aktarılması).

## B133 · 2026-11-13 · Kopyasız yedek içe aktarma; macOS Alt kısayolları; 1.1.2-beta.27
- Denetim #10: içe aktarma her kendi besine yeni kimlik verdiği için aynı yedek ikinci kez kopya üretiyordu → `mergeImport` (store.js): kimlik/zaman damgası dışında içerikçe aynı kendi besin, tarif, profil ve koleksiyon (üst koleksiyon yoluyla) atlanır; atlanan kendi besine bağlı tarif/koleksiyon öğeleri mevcut kayda yönlenir; bildirimde "{n} kopya atlandı".
- Denetim #6: macOS'ta Option+1 `e.key = "¡"` verdiği için Alt kısayolları çalışmıyordu → `shortcutKey(e)` fiziksel tuş kodundan (Digit/Numpad) okur.
- Kanıt: `npm test` 106/106 (B133 birim: 3 aşamalı içe aktarma, shortcutKey); build + build:single; Playwright 148/148 (B133: e.key "£" + Digit3 → Kıyasla).
- Sürüm 1.1.2-beta.27 (B132 Pürin + B133).
- Sonraki: **B134** denetimin kalan performans maddeleri (#11 telefonda gizli periyodik tabloyu kurmamak, #13 NUTRIENT_BY_KEY) ya da pide/gözleme/börek tarifleri.
- Yayın kanıtı: v1.1.2-beta.27 pre-release 2026-11-13T11:32:50Z (release.yml run 43416455204 success); ci.yml run 43416442462 (73c47e2) success → çapraz tarayıcı RUNTIME_TESTED.

## B134 · 2026-11-13 · Performans: gizli periyodik tablo kurulmaz; bileşen araması sabit zamanlı
- Denetim #11: ≤700 px'te seçim yokken `.detail` CSS ile gizliydi ama karşılama kartı + periyodik tablo (yüzlerce karo) her render ve aramada yine kuruluyordu → dar ekranda hiç kurulmaz (`matchMedia`); ekran genişleyince `change` olayıyla kurulur; arama sonrası 150 ms'lik tazeleme de dar ekranda atlanır.
- Denetim #13: 9 `NUTRIENTS.find(...)` (Kıyasla, matris sabitlenenler, Günlük ve tarif kaynak dökümü) → `NUTRIENT_BY_KEY[...]`.
- Test: B112 karşılama kartı denetimi yalnız geniş ekranda (telefonda zaten görünmüyordu); yeni B134 (390 px'te `.periodic` yok, 1280 px'e genişleyince karolar görünür).
- Kanıt: `npm test` 106/106; build + build:single; Playwright 150/150.
- Sonraki: **B135** pide/gözleme/ıspanaklı börek tarifleri (pişme verimi modeliyle) ya da kalan temizlik (#17-20).

## B135 · 2026-11-13 · Gözleme (ıspanaklı, patatesli; peynirsiz); 1.1.2-beta.28
- Pişme verimi modeliyle (%85, sac): ıspanaklı 224,9 kcal, patatesli 244,3 kcal /100 g; kütle dengesi 100,0 g; bitkisel. Pide zaten Ekmek kategorisinde (USDA kaydı) olduğu için tekrar eklenmedi.
- İlk hata: yeni "Sacda" form etiketinin İngilizcesi form sözlüğünde yoktu (i18n testi) → eklendi.
- Kanıt: `npm run data` (619 besin); `npm test` 107/107; build + build:single; Playwright 152/152.
- Sürüm 1.1.2-beta.28 (B134 + B135).
- Sonraki: **B136** kalan temizlik (#17-20: matrix.js ölü dallar, .quick/.split CSS, kullanılmayan dışa aktarımlar) ya da kullanıcı önceliklerinden (3) koleksiyon/alt kategori deneyimi.
- Yayın kanıtı: release.yml run 43448667453 deneme 1 macOS işi runner bulamadan 15 dk sonra iptal (kod hatası değil; diğer 5 platform başarılı) → rerun_failed_jobs; deneme 2 success, v1.1.2-beta.28 pre-release 2026-11-13T15:47:35Z. ci.yml run 43448656370 (c718cc6) success.

## B136 · 2026-11-13 · Vegan Türk tarifleri: kısır, piyaz, fava, ezogelin çorbası
- Kaan: "var mı geliştirecek bir şey". Tarif hesabı (`r`), Hazır yemekler'de, bitkisel: kısır (pişirilmez; 153,6 kcal), piyaz (haşlanmış fasulye + çiğ sebze; 150,9), fava (pişmiş ağırlıkla; 189,8; favizm notu), ezogelin (pişmiş mercimek/bulgur + su; 68,2). Isıyla değişen bileşen tahmini yok: pişmiş malzemelerin USDA ölçümleri kullanıldı. Nar ekşisi, biber salçası, nane USDA'da yok → notta.
- Kanıt: `npm run data` (623 besin); `npm test` 108/108; build + build:single; Playwright 154/154.
- Sonraki: **B137** zeytinyağlılar (taze fasulye, imam bayıldı, enginar) ve bulgur pilavı ya da beta.29.

## B137 · 2026-11-13 · Zeytinyağlılar ve bulgur pilavı; 1.1.2-beta.29
- Tarif hesabı, pişmiş ağırlıkla, USDA haşlanmış/pişmiş ölçümleri: zeytinyağlı taze fasulye domatesli (84,4 kcal), imam bayıldı (120,8; geleneksel kızartmanın yağ emişi dahil değil, notta), zeytinyağlı enginar (120,5), bulgur pilavı domatesli (119,0). Hepsi bitkisel.
- Kanıt: `npm run data` (627 besin); `npm test` 109/109; build + build:single; Playwright 156/156.
- Sürüm 1.1.2-beta.29 (B136 + B137).
- Sonraki: **B138** kalan temizlik (#17-20) ya da kullanıcı önceliği (2) sade UI/UX gözden geçirmesi.

## B138 · 2026-11-13 · Kullanılmayan CSS temizliği (denetim #17-20 kısmen)
- Hiçbir şablonda üretilmeyen `.quick`, `.split`, `.splitbar`, `.legend` kuralları ve `.nav-h` seçici parçası silindi (629 bayt). Dinamik üretilen `.src-*` ve `.sp-*` korundu (tarama `src-${s}` / `sp-${k}` şablonlarını doğruladı).
- Kanıt: `npm test` 109/109; build + build:single; Playwright 156/156.
- Sonraki: **B139** kapsamlı kod + veri denetimi (Kaan: "aynı mantıkla denetle, hata varsa döngüsel geliştir, dataları araştır").

## B139 · 2026-11-13 · Unslop arayüz denetimi (Kaan: "denetle, daha estetik/klas, kullanıcı dostu")
- Yöntem: `git fetch` (dış dallarda yeni commit yok: codex/forge-devam ve ccr-fc2d7af1 tamamen bizde); `npm run build` + yerel önizleme (127.0.0.1); Chromium 1280×800 ve 390×844, Keşfet/besin/Tarif/Kıyasla/Günlük/Ayarlar/Hakkında; konsol hatası, yatay taşma, kesilen metin, iç içe kaydırma ölçümü + ekran görüntüsü.
- PASS: konsol hatası yok; sayfa yatay taşması yok; iç içe gereksiz kaydırma yok; Günlük tablosunun yatay kaydırması bilinçli (`.personal-table-scroll`); "Tarif adı" kesilmesi ekran okuyucu metni (`.sr`), hata değil.
- FAIL → düzeltildi:
  1. Her bileşen satırında aynı "USDA" etiketi tekrarlanıyordu (telefonda her satırı iki satıra çıkarıyordu): değerlerin ≥%50'si tek kaynaktansa o kaynak bir kez üstte ("Etiketsiz değerlerin kaynağı: USDA"), satırlarda yalnız farklı kaynaklar (Proantosiyanidin, FDC, Flavonoid, tahmin…). Nohut Protein bölümü telefonda ~1500 → ~1060 px.
  2. Karşılama kartı "627 besin" diyordu, kategori listesi "590" gösteriyordu (gizli niş besinler) → görünen besin ve biçim sayısı.
  3. Periyodik tablo karolarında anlamı olmayan sıra numaraları (1, 2, 3…) kaldırıldı.
- Test: yeni B139 tarayıcı testi (satırlarda `.src-u` 0, üstte 1; kakaoda `.src-P` satırda; karşılama sayısı = "Tümü" sayısı; `.pt-n` yok). B120 sıra testi kaynak notunu atlar.
- Kanıt: `npm test` 109/109; build + build:single; Playwright tam koşu 156 PASS + 2 B120 (beklenen sıra değişikliği) → düzeltme sonrası B120+B139 4/4 PASS.

## B140 · 2026-11-13 · Kod denetimi: kritik kimlik hatası, kopyasız içe aktarma gerçek veride
- Kaynak: alt ajan kod denetimi (scratchpad/audit/CODE_AUDIT.md, node ile yeniden üretimli).
- KRİTİK #1: `kudret_narı` kimliği (ASCII dışı ı) kayıt kuralına uymuyordu → tarife eklenince yeniden açılışta sessizce siliniyor; günlüğe eklenince `normalizePersonal` hata verip tüm günlük/profil kaydını kilitliyordu. Kimlik `kudret_nari`; `LEGACY_IDS` ile eski kayıtlar (tarif, günlük, koleksiyon, yedek) taşınır; her katalog kimliğinin kurala uyduğunu sınayan test.
- ORTA #2: B133 `mergeImport` gerçek uygulama belleğinde eşleşmiyordu (`setCustomFoods` `_k` ekliyor; oturumda eklenen tarif öğelerinde `pricePerKg` yok) → imzalar `_` alanlarını atar, tarif imzası normalize alanlarla kurulur; testte bellek biçimi.
- Kanıt: `npm run data`; `npm test` 111/111; build + build:single; Playwright 158/158.

## B141 · 2026-11-15 · Yemek odaklı tasarım, kapsam ve denetim
- Kullanıcı: kendi tasarımımızla sıcak yemek kimliği, kahve/fast food/atıştırmalık kapsamı, taşma/örtüşme onarımı; Fragaria Unslop + Unslop + Yazılım Denetle. Tek sınırlı Forge; eski roadmap'teki başka ürün modülleri başlatılmadı.
- Krem/zeytin/kil açık tema, sıcak koyu tema; mevcut kayıtlı seçimler korunur. Özgün yerel tabak/marka SVG'si ve PWA simgeleri. Tek katalog; yinelenen periyodik tablo kaldırıldı.
- Katalog 627→664 (+37). Kahveler / Fast food ve pizza / Atıştırmalıklar. Yeni USDA eşleşmeleri, hayvansal/alerjen işaretleri, TR/EN arama/not/çizimler. Americano ve sütlü kahveler açık tarif tahmini; fincan gramları. Ristretto/lungo/sade Türk kahvesi açıklamalı ölçüm boşluğu; donmuş pizza pişmiş ağırlığı açık.
- AUD-01/B140 devamı: eski kudret_narı koleksiyon ve recent kayıtları ortak validRef ile korunur; önce 2 FAIL, sonra regresyon ve gerçek aç/kaydet/reload PASS.
- UI-02/UI-03: normal 320/390 ve büyük yazı/%200'de sekme hit target'ı, malzeme/karşılaştırma kartı, miktar/preset/Kapat, marka, tarif başlığı, özet ve matriks yüzde/amino asit taşmaları onarıldı. Kök yatay taşma giderildi; iki boyutlu tablonun kendi kaydırması korundu.
- Pages: default dal push tetikleyicisi, test/build kapısı, sabit action SHA'ları, eşzamanlı yayın kilidi; gerçek /besinmatriksi/ alt yolunda manifest/SW/offline/kalıcılık testi. Canlı ilk etkinleştirme yönetici ayarıyla ayrı; 404 başlangıcı doğrulandı. Vercel aynı repo/proje/üretim dalını kullanır. Native Release/store yayını yok.
- Kanıt: `npm run data`; `node scripts/build-notices.mjs --check` 23/23; `npm test` ve açık alt-test koşumu 116/116; `npm run build` + `npm run build:single` PASS. Dev yeni regresyonlar 10/10 PASS; Chromium desktop+phone,320/390/768/1440,normal+28px/%200. Paket tarayıcı ve yayın son sonucu docs/evidence/B141/AUDIT.md içinde.
- Boşluklar: file:// açılışı yönetilen tarayıcı politikasıyla BLOCKED; aynı tek dosya dış isteksiz gerçek uygulama akışı PASS. Fiziksel cihaz/ekran okuyucu ve bu ortamda Firefox/WebKit/native kurulum NOT TESTED.
- Tek sonraki Forge: B142 — fiziksel telefon ve ekran okuyucuyla yeni katalog/ölçek kabulü.

## B142 · 2026-11-15 · Ata tasarım revizyonu ve başlık kimliği
- Kullanıcının onaylı geri bildirimi: gereksiz renkli/yuvarlak kapsayıcılar azaltıldı; hero normal sayfa yüzeyine, katalog hizalı satırlara geçti. Anlamlı form, tablo ve düzenleme sınırları korundu.
- Bricolage Grotesque5.3.0 yerel/OFL başlık fontu. Dört okunabilirlik fontunda başlık da kullanıcının tercihini izler; gövde, ölçek ve kayıtlı ayarlar bağımsız kalır.
- Kanıt: Türkçe cmap ve WOFF2 doğrulaması; gerçek font dosyası/dış istek kontrolü; desktop+phone font kabulü4/4PASS. Normal ve28px/%200 başlık/ana eylem kontrolü. Son paket ve genel test kanıtı B144 raporunda.
- Sonraki tek Forge: B143 (bu çalışma içinde aşağıda tamamlandı).

## B143 · 2026-11-15 · Tam SR28 kaynak kapsamı ve erişim
- 664/810 küratörlü kayıt korundu. 5.097 ek kayıt; geniş liste2.983→8.080; küratörlü709SR28id+geniş8.080=8.789/8.789 kaynak ve25/25grup.
- Ayar açmadan kaynak kataloğu; sayfa başı80; grup/NDB/özgün İngilizce ad araması; görünür2015/arşiv/marka/içerik ayrımı. Unknown kayıtlar hayvansal gizlemede gizlenir, alerjensizlik garanti edilmez.
- Yükleme reddinde gerçek hata ve reload kurtarma; kayıtlar korunur. Yalnız koleksiyonda saklı geniş kayıt için lazy yükleme sorunu gerçekFAIL→root ortak pendinghelper→aynıtest2/2PASS.
- Kanıt: kaynak tamlığı/kimlik/sıfır/boşluk ve25grup testleri; katalog normal akışları, arama/sayfa/grupreset/kayıt/reload. Son web/PWA ve alt yol kabulü B144 raporunda.
- Sonraki tek Forge: B144 (bu çalışma içinde aşağıda tamamlandı).

## B144 · 2026-11-15 · Mikro özeti, kaynak katkıları ve yeniden kullanılabilir Unslop kontrolleri
- 28 yaygın vitamin/mineral için miktar/birim/referans/kapsam; veri yok≠0; kısmi≥ toplam. Tek besin, tarif, günlük; mevcut katkı sahiplerine bağlı satır eylemleri. 244 ayrıntılı tanım/CSV korunur.
- Bilimsel düzeltme: A-RAE otomatik EU-RE yüzdesi kaldırıldı; miktar ve aynı birim özel hedef korunur. Kaynaklar ve Cronometer karşılaştırması docs/evidence/B142-B144/CRONOMETER_RESEARCH.md.
- Reflow, mikro kapalı durumu ve etkileşimsiz toast hit engeli düzeltildi. TR/EN320/390 ve büyük yazı/%200 gerçek tıklama+kapsam+kalıcılık testli.
- Unslop + Fragaria Unslop tam ZIP kaynak paketleri, container/radius/fill/typography/erişilebilirlik ve10senaryoluk kontrollerle geliştirildi;16yapı/17içbağlantı/CRC PASS. Native cloud skill yazma aracı yok: paketler ayrı teslim, yüklü sürümler NOT_APPLIED. Özel skill referansları public repoya konmadı.
- Kanıt: npm run data;24lisans bildirimi; npm test ve açıkalt-test128/128; build+build:singlePASS. Üretim184/184tarayıcıPASS; soncold-sourcehelper sonrası finalpaket fonts+micro-catalog16/16PASS (2yeni+14tekrar), toplam186benzersizkontrol. Açık/koyu micro axe0ihlal. file:// iki yerelkontrol adminpolicyBLOCKED; fiziksel/native ve bu sürümün yerel Firefox/WebKit'i NOT_TESTED.
- Ayrıntılı kabul/ilkFAIL/onarım ve görseller: docs/evidence/B142-B144/AUDIT.md. Vercel üretim aynı bağlı projeden güncellenir; Pages ilk etkinleştirme sınırı ayrı. Native Release/store yok.
- Sonraki tek Forge: B145 — güncel açık Foundation/FNDDS kaynaklarını doğruluk ve performans bütçesiyle büyütme.

## B145 · 2026-11-15 · Kategori ayraçları ve kompakt sıralama
- Kullanıcının düzenlediği görsele göre kategori ayraçlarının emojileri kaldırıldı; 1→1,5rem başlık, 2rem üst boşluk ve 0,5rem üst/alt padding. Besin çizimleri ve gezinme simgeleri korunur.
- Sırala kontrolleri 0,82rem, daha az yatay padding ve normal masaüstünde32px; dokunmatik hedef en az44px, ölçek/density tercihleri korunur.
- Kanıt: 128/128 birim; web+single derlemeleri PASS. Mevcut B057/B059/B141 testleri6/6PASS. TR/EN açık/koyu,1440masaüstü,390telefon,320+28px/%200 olmak üzere6 görünümde emojisiz başlık/boşluk, sınırlar ve gerçek sıralama tıklaması PASS. Fiziksel cihaz/diğer motor/native NOT_TESTED. Ayrıntı docs/evidence/B145/AUDIT.md.
- Önceki önerilen veri genişletmesi son açık kullanıcı isteğiyle ertelendi. Sonraki tek Forge: B146, güncel açık Foundation/FNDDS kaynak kapsamı.

## B146 · 2026-11-15 · Günlük amino asit barları ve kaynaklı eksik hücreler
- Kullanıcı isteği: dokuz esansiyel amino asit için ayrı günlük yüzde/bar; toplam protein ve AA_REF/derive protein kalitesi aynen korunur. WHO/FAO/UNU2007 Tablo23 mg/kg/gün; kayıtlı yetişkin kilosu veya açık70kg örneği. Met/Phe ortak hedefe yalnız kendi katkısı, çocuk/özel bağlamda yetişkin barı yok; kısmi≥, boş≠0. Günlük detay tablosu da aynı referansa bağlı.
- Tam Katalog adı; keşfet ve tarif seçicisinde kategori listesinin sonu. Kaynak/USDA etiketi bilimsel açıklamada korunur.
- Resmî SRLegacy2018 arşivi tekrar indirildi/öncekiSHA256eşleşti. Analitik köken ve tamNDB eşlemesiyle315yeni hücre/72kaynak kaydı;16ana/299geniş. Beta.32 karşılaştırması0eski hücre değişimi. Kaynak/inceleme docs/evidence/B146/RESEARCH.md.
- Kanıt: npm run data; npm run notices;132/132birim;web+singlederlemeleri;26/26tarayıcıtestiPASS. Kilo80kg save/reload, miktar,9bar, toplamprotein, kısmi tarif, veri boşluğu, TR/EN320px28px/%200, eski mikro/katalog hata-kurtarma ve kişisel offline akışı. Ayrıntı docs/evidence/B146/AUDIT.md. Native/fiziksel/diğer motorlar bu turNOT_TESTED; yeniCIayrı.
- Sonraki tek Forge B147: açık Foundation/FNDDS kapsamını doğruluk ve performans bütçesiyle büyütme.

## B147 · 2026-11-15 · Tarif amino asit skoru/grafiği eşitliği
- Kullanıcının ekranındaki kayıp grafik, derive fonksiyonunun tek kısmi AA ölçümünde bütün_aaProtein tabanını silmesinden kaynaklanıyordu. assessAmino ortak sahibi tam/kısmi/bilinmeyen durumları ayırır; dokuz grup satırı matriksten kaybolmaz.
- Tam veride eski skor/sınırlayıcı korunur. Kısmi AA + tamprotein: bilinen AA / TÜMtarifproteini, ≥alt sınır; kesin sınırlayıcı iddia edilmez. Eksik protein: oran/skor yok, bilinenmg/neden var. Eksik malzeme ve bileşenler açılır dökümde; şema/kalıcı kayıt değişmedi. Günlük AA barları ve toplam protein korunur.
- Kanıt:135/135birim;web+singlederlemeleri;28/28masaüstü/telefonTR/ENtarayıcıtesti;son açıklama ve ikinci tam malzeme UI kabulü eklendikten sonra8/8final tarif testi. Tekbesin↔tekmaddeli tarif birebir; karşılıklı tamamlayan profiller toplamda125% (tekbaşına50%); porsiyon/100g kaliteoranı sabit; eksik/sıfırprotein gerçekpuan uydurmaz. Daha önceki kısmi oran güvenliği testi dePASS.
- Ayrıntı docs/evidence/B147/AUDIT.md. Native/fiziksel/diğer motorlarNOT_TESTED. Sonraki tek Forge B148: açık Foundation/FNDDS kapsamını doğruluk/performans bütçesiyle büyütme.

## B148 · 2026-11-15 · Otomatik Günlük Toplam Tarif
- Son kullanıcı isteği önceki veri genişletme önerisinin önüne alındı. Listenin sonunda ayrı hesap görünümü, mevcut tarifleri/adları değiştirmez; kalıcı tarif olarak eklenmez ve kendisini içermez. Heröğün ayrı8temel değerde; altta aynı matris/mikro/AA/kaynak.
- Varsayım: listedeki tüm tarifler, başlangıçta tam miktarları. Görünür1porsiyon alternatifi; recipeTotalBasis ayarı normalleştirme/yedek/sıfırlama sahibine bağlı. Tarih veya gerçek tüketim kaydı uydurulmadı.
- combineRecipes malzemeleri kayıpsız açar; aynı besin farklı öğünde ayrı katkıdır. Eksik kaynak/ağırlık/kapsam, porsiyon katsayısı ve kaynak öğün adı korunur. Pişmiş ağırlık yalnız tüm dolu öğünlerde biliniyorsa toplamlanır.
- Kanıt138/138birim;web+singlederlemeleri;final yeni görünüm8/8Chromium desktop/phone TR/EN (27,6sn), önceki regresyondaki10/10tarif listesi/AA kontrolü. Toplam18benzersiz kontrol; tek18/18koşumu iddiası yok. Axe0ihlal;3öğün masaüstü/mobil görseli incelendi.
- İnceleme docs/evidence/B148/AUDIT.md. Native/fiziksel/diğer motorlarNOT_TESTED;Release yok. Sonraki tek ForgeB149, açık Foundation/FNDDS kapsamı.

## B149 · 2026-11-15 · Genel yazılım ve Unslop denetimi
- Son kullanıcı isteğiyle Foundation/FNDDS genişletmesinin önüne alındı. Super-Unslop, Unslop, Fragaria Unslop ve Yazılım Denetle ana talimatları ile ilgili görsel/davranış/doğrulama kontrol kaynakları okundu. Oyun/mascot işi kapsam dışı; özel skill kaynakları depoya kopyalanmadı.
- Başlangıç 9c7062988ef9f8dd085eb363556cc15eeb72937f / beta.35. İlk 138 birim ve 210 Chromium testi geçti; yeni hata enjeksiyonu kontrolleri eski kapsamın kaçırdığı CSV ve depolama sorunlarını gösterdi.
- Sekiz bulgu grubu düzeltildi: kısmi-AA CSV çökmesi; özel besin/profil/günlükte yanlış kayıt başarısı; genel yedek çoklu grup geri alma; bozuk kişisel kayıtta kurtarma koruması; malzeme ekleme ve seçici tekrar denemesi; günlük sayacı/kalori satırı/tekrar başlık. Ayrıntı ve önem dereceleri docs/evidence/B149/AUDIT.md.
- Kanıt: final 143/143 birim; web/PWA ve tek HTML; 24 lisans bildirimi; npm run data sonrası üç üretilmiş veri dosyasının SHA256 değeri değişmedi. 238/238 geniş Chromium koşumu son iki küçük kontrol kapısından önce; bu kapılardan sonra final kodda 54/54 hedefli TR/EN masaüstü/telefon kontrolü. Dört yeni kontrolle koşumlar arasında 242 benzersiz kabul; tek 242/242 koşumu iddiası yok.
- Açık/koyu günlük toplamda axe WCAG2.1AA sıfır ihlal, masaüstü/mobil görseller incelendi. Yerel file:// iki vaka ortam politikası nedeniyle hariç; Firefox/WebKit, ekran okuyucu ve native/fiziksel cihaz NOT_RUN.
- Pages ve Vercel canlı beta.35 normal girişte doğrulandı; eski Pages engeli kapatıldı. Beta.36 yayın makbuzu teslimde ayrı bildirilecek; yeni native Release/store yayını yok.
- Sonraki tek Forge B150: açık Foundation/FNDDS kapsamını doğruluk ve performans bütçesiyle büyütme.

## B150 · 2026-11-16 · Kompakt beslenme filtresi ve bitkisel kahveler
- Kullanıcının onayladığı tasarım; önceki kaynak genişletmesi B151'e taşındı. Kahve/Fast Food/Atıştırmalıklar üst kategori sırasının sonunda, yinelenen tanıtım bağlantıları kaldırıldı. Fast Food adı sadeleşti.
- Hepçil varsayılan; Vegan/Vejetaryen/Pesketaryen ortak kayıtlı tercih. Vejetaryen seçilince ovo/yumurta ve lakto/süt kutuları menü ile ek filtrelerin arasında. Altı AND içerik kısıtı; yer fıstığı sert kabuklu yemişlerden ayrı. Boş alerjen alanından uygunluk çıkarılmaz; belirsiz ürünler gizli. Kalıcı tarif/günlük/koleksiyonlar silinmez.
- Yulaf/badem/soya ile21 ayrı kahve tarifi tahmini.685 besin/831biçim. Hesap kaynakları/gram oranları ve r etiketi görünür; FDC yulaf malzemesi gerçek kaydıyla desteklenir. Önceki664 kaydın dietary dışındaki bütün alanları/ölçümleri aynı.
- Kanıt147/147 final birim; web/PWA+singleHTML;24bildirim; deterministik veri üretimi.254/254 geniş Chromium koşumu (6,8dk); ardından yalnız yeni kahvelerin İngilizce arama kaynak adları düzeltildi, final147 birim/derlemeler ve12/12özellik UI kabulü (22,5sn) tekrarPASS. Tek266-test koşumu iddiası yok. TR/EN desktop/phone;320px/28px/%200; başarısız tercih yazımı, filtreli boş durum ve ham kayıtların korunması dahil.
- Axe açık/koyu0WCAG2.1AAihlal; gerçek mobil/masaüstü görseller incelendi. İki yerel file:// vaka ortam politikası nedeniyle hariç. Fiziksel/ekranokuyucu/native/yerel diğer motorlarNOT_RUN; beta.37yayın/CI makbuzları teslimde ayrı. B149 CI244+488PASS farklı sürümün tarihi kanıtıdır.
- Ayrıntı docs/evidence/B150/AUDIT.md. Yeni native Release/store yayını yok. Sonraki tek Forge B151: açık Foundation/FNDDS kaynak kapsamı.

## B151 · 2026-11-16 · Meyve/sebze alt grupları ve birleşik İçecekler
- Kullanıcının isteği önceki veri genişletmesini B152'ye taşıdı. Meyve içinde kuru meyve, sebze içinde yaprak/kök; Kahveler yerine İçecekler ve9alt başlık. Parent seçiminde aynı başlık/grid düzeni; arama/sıralama/filtre ve iki besin seçicisi ortak hiyerarşi. Ham kategoriler ve kimlikler taşınmadı; Tümü her besini bir kez gösterir.
-8yeni içecek:4özel bitki demlemesi açık ölçüm boşluğu,4hazır içecek gerçek SR28 kaydıyla. Genel bitki çayı adı açıklaştırıldı; kuru bitki veya farklı tür değerleri kopyalanmadı.693besin/839biçim.685önceki besinin bütün biçimleri/değerleri/kaynakları aynı.4kaynak ana listeye taşındı;713+8076=8789tam kaynak kapsamı.
- Kanıt151/151 final birim;web+singleHTML;24bildirim;deterministik veri üretimi.262/262 genel Chromium(7,6dk), son parentbaşlık ölçeği hizalamasından sonra final151birim/derlemeler+20/20hiyerarşi/beslenmeUI(45,2sn). Tek282-test koşumu iddiası yok. TR/EN desktop/phone;320px/28px/%200; eski kuru kayısı referansı200gile yenilemede korunur.
- Açık/koyu parent sayfasında axe0WCAG2.1AAihlal;gerçek masaüstü/mobil gruplar ve kategori dışı özel etiket aramasının süzülmesi görüldü. İki file://vaka ortam politikasıyla hariç. Fiziksel/ekranokuyucu/native/yerel diğer motorlarNOT_RUN; yayın/CI makbuzları teslimde ayrı. Native Release/store yok.
- Ayrıntı docs/evidence/B151/AUDIT.md. Sonraki tek ForgeB152: açık Foundation/FNDDS kapsamı.

## B152 · 2026-11-16 · Baklagiller altında Soya ürünleri
- Kullanıcının yeni isteği önceki kaynak genişletmesini B153'e taşıdı. Soya üst sekmesi kaldırıldı; Baklagiller, normal baklagil ızgarası ile Soya ürünleri alt başlığını birlikte gösterir. Tümü ve seçili kategori, arama, sıralama, sayaçlar, beslenme filtreleri, tarif/karşılaştırma seçicisi aynı sunum hiyerarşisini kullanır.
- Önceden onaylanan içecek sınıflaması korunur: soya sütleri İçecekler altında. Kimlikler, biçim indeksleri, ölçümler ve ham besin kategorileri değişmedi; veri göçü veya kayıt silme yok.
- Kanıt152/152 birim; web/PWA+singleHTML11,23MB;24bildirim.24/24 hedefli Chromium masaüstü/telefon TR/EN (1,3dk), 320px/28px/%200, vegan filtre, tofu ekleme/tekrar ekleme200g ve yenileme dahil. Geniş262-test koşumu önceki beta.38'in kanıtıdır, bu sürümde tekrarlanmadı.
- Açık/koyu baklagil sayfasında axe0WCAG2.1AAihlal; masaüstü/mobil görseller incelendi. Fiziksel cihaz, ekran okuyucu, diğer yerel motorlar/native NOT_RUN. Yeni native Release/store yok. Yayın makbuzları teslimde ayrı doğrulanır.
- Ayrıntı docs/evidence/B152/VERIFY.md. Sonraki tek ForgeB153: açık Foundation/FNDDS kapsamı.

## B153 · 2026-11-16 · Marka ile ana görünüm ve masaüstü kategori satırları
- Son kullanıcı isteğiyle önceki veri genişletmesi B154'e taşındı. Logo ve marka adı gerçek düğme; Keşfet ana görünümüne döner, arama/kategori/ayrıntıyı kapatır ve sayfa başına gelir. Kaydedilmiş tarifler, beslenme/görünüm tercihleri, diğer taslak ve seçimler değiştirilmez. TR/EN erişilebilir adı, Enter/boşluk ve görünür klavye odağı var.
- 701px üstü varsayılan kategori düğmeleri taşmadan satırlara yerleşir;1440px4satır, yatay kaydırma yok. Uzun ad/büyük yazı kırılır. Telefonun dokunmatik kaydırması ve kullanıcı tarafından seçilen eşit kutulu ızgara korunur. Yeni ayar/bağımlılık/veri göçü yok.
- Kanıt152/152 birim;web/PWA+single11,23MB;24bildirim. İlk koşumda24 mevcut hiyerarşi/beslenme testiPASS,12yeni kontrol test beklentileri nedeniyleFAIL (yanlış atıştırmalık kimliği, sınıf sonu boşluğu, fare odağında klavye halkası beklentisi). Beklentiler düzeltilip yeni12/12 son koddaPASS(1dk); tek36/36koşumu iddiası yok.
- Gerçek girişteTR/EN desktop/phone,768/1024/1440px kategori erişimi;320/960px,28px,%200,emoji kapalı ve her iki ızgara tercihi; bütün sekmelerden dönüş, kayıt ve ayarların ham dizelerinin değişmemesi/yenileme test edildi. Açık/koyu ana görünümde axe0WCAG2.1AAihlal,1440px görsel incelendi.
- Fiziksel cihaz/ekranokuyucu/yerel diğer motorlar/nativeNOT_RUN; yeni Release/store yok. Yayın makbuzları teslimde ayrı. Ayrıntı docs/evidence/B153/VERIFY.md. Sonraki tek ForgeB154: açık Foundation/FNDDS kaynak kapsamı.

## B154 · 2026-11-16 · Kuru kayısı gündelik adı ve kaynak notu
- Kullanıcının son isteği önceki kaynak genişletmesini B155'e taşıdı. Kuru kayısı (kükürtlü) adı Kuru kayısı; İngilizce Dried apricots. Kayısı kurusu ve eski kükürtlü/İngilizce kaynak yazımlarıyla arama korunur. Kükürtsüz/gün kurusu eş anlamlı eklenmedi.
- USDA09032 açıklaması “Apricots, dried, sulfured, uncooked” aynıdır; kaynak işleme bilgisi TR/EN ayrıntı notunda açıklandı. Sülfit alerjen bilgisi ve241kcal değişmedi.693önceki besinin bütün biçimleri/ölçümleri/kaynakları,alerjenleri ve dietary alanları karşılaştırıldı; tek fark kuru_kayisi.tr ve note. Kayıtlı kimlik/biçim sırası korunur.
- Kanıt153/153 birim;web/PWA+single11,24MB;24bildirim;16/16 Chromium TR/EN desktop/phone(48,1sn). Normal arama→ayrıntı→kaynak/sülfit→tarif→yenilemede aynı kimlik ve sade ad; mevcut hiyerarşi/%200 dar ekran regresyonu daPASS. Yeni bağımlılık veya ölçüm yok.
- Fiziksel/ekranokuyucu/yerel diğer motorlar/nativeNOT_RUN; yeni Release/store yok. Yayın makbuzları teslimde ayrı. Ayrıntı docs/evidence/B154/VERIFY.md. Sonraki tek ForgeB155: açık Foundation/FNDDS kaynak kapsamı.

## B155 · 2026-11-16 · Gün kurusu ve kuru meyve kapsamı
- Son kullanıcı isteği önceki Foundation/FNDDS genişletmesini B156'ya taşıdı.14 yeni kuru meyve kimliği;28 kuru meyve kaydı (eski muz tozu niş görünüm tercihiyle gizlenebilir). Toplam707 besin/853 biçim. Gün kurusu kayısı ayrı; günkurusu/gunkursu ve kükürtsüz kuru kayısı eş adları var. Eski kükürtlü kayısı241kcalile aynıdır.
-9 kimlik gerçek SR28 kurutulmuş/hazırlanmış kaydıyla; şeker ilaveli mango/turna yemişi/yaban mersini ve kızartılmış muz cipsi adlarında açık. Armutun sülfit bilgisi korunur.3 kuru kimlik mevcut taze kaydındaki kuru biçimle aynı analizi açıkça paylaşır; eski biçimler/indeksler kaldırılmaz.6 kaynak geniş listeden ana listeye geçti;719+8070=8789.
- Gün kurusu/dut/çilek/ananas/kivi için incelenen yerel kaynaklarda ayrı doğrulanmış bileşim yok: v/s boş, usda null, neden ve etiketten ekleme yolu görünür. Kükürtlü/taze/şekerli ölçümleri bu ürünlere kopyalanmadı. Kaynak araştırmasının sınırı docs/evidence/B155/VERIFY.md'de.
- Kanıt156/156 birim, gerçek ham NUT_DATA enerji/protein eşlemesi;web/PWA+single11,25MB;24bildirim,707tekil yerelSVG.12/12 Chromium TR/EN desktop/phone(33,5sn): kaynaklı/eksik kuru meyveler, arama, mevcut kayısı regresyonu, mango319+ölçümsüz gün kurusunda≥toplam, kayıt/yenilemePASS.
-693 eski besinin tüm alanları aynı;8070 geniş kaynak ve taşınan6 kaynağın tüm besin değerleri aynı; üretim deterministik. Açık/koyu ana katalog axe0WCAG2.1AAihlal, kuru bölüm/mobil veri boşluğu görselleri incelendi. Fiziksel/ekranokuyucu/yerel diğer motorlar/nativeNOT_RUN. Yeni native Release/store yok; yayın makbuzları teslimde ayrı. Sonraki tek ForgeB156: açık Foundation/FNDDS kapsamı.

## B156 · 2026-11-17 · Denetim (ChatGPT B141–B155 sonrası), tarif kartı geometri testi, fast food/atıştırmalık/kahve eklemeleri
- Kaan: "sen yokken ChatGPT'ye verdim, incele, yazılımsal hata varsa düzelt"; "iç içe geçme sorunu, Unslop kullan"; "donmuş pizza, hamburger, cips, çikolata, şeker; espresso, latte, lungo, ristretto, Türk kahvesi, filtre, americano ekle".
- Denetim: `git pull --ff-only` (15 ChatGPT commit'i, B141–B155); `npm test` 156/156; build + build:single; `node scripts/build-data.mjs` deterministik (fark yok); Playwright tam koşu 292/292 PASS. Yazılımsal hata bulunmadı.
- Ekran görüntüsündeki tarif malzeme kartı (↓ ile ✕ üst üste, kart altında boşluk) güncel kodda yeniden üretilemedi: 1440/1280/1024/820/700/600/390/320 px'te düğme çakışması 0, kart altı boşluk = iç dolgu (15 px), açılan kart komşusunu uzatmıyor (`.ings` align-items:start). ChatGPT'nin B141 grid düzeltmesiyle kapanmış. Kalıcı koruma: `tests/browser/ingredient-card.spec.mjs` (5 genişlik × masaüstü/telefon: çakışma yok, düğmeler kart içinde, alt boşluk < 40 px, açılan kart komşusunu uzatmaz, ✕ gerçek tıklamayla siler).
- Kahveler (espresso, lungo, ristretto, latte, americano, Türk kahvesi, filtre, cappuccino, mocha, flat white, cortado, macchiato) ve pizza/hamburger/cips/çikolata/şeker ChatGPT tarafından zaten eklenmişti. Eksikler eklendi (22): sosisli, corn dog, vejetaryen sosisli (FNDDS), taco, fasulyeli burrito (FNDDS, peynirsiz; SR28 21060 kolesterol 2 mg olduğu için seçilmedi), nachos, balık sandviç, salamlı sandviç, çıtır tavuk sandviç, pretzel (kıtır/yumuşak), mikrodalga ve karamelli patlamış mısır, pirinç ve mısır patlağı, çikolatalı ve çilekli dondurma, yarı tatlı ve bademli sütlü çikolata, sebzeli suşi (FNDDS), buzlu mocha (sütlü/bitkisel, FNDDS). Hayvansallık kolesterol/laktozdan doğrulandı.

## B157 · 2026-11-17 · Veri tutarlılık kapıları (veri denetimi bulguları)
- Kaynak: 2026-11-13 veri denetimi (scratchpad/audit/DATA_AUDIT.md); B141–B155 sonrası yeniden doğrulandı, hepsi hâlâ geçerliydi.
- build-data: (1) FDC Foundation dolgusu, aynı NDB'nin FDC numunesi ana bileşimde SR28'den saparsa (yağ/protein >%25 ve >1 g, su >5 g) yapılmaz (humus: FDC yağ 17,1 g vs SR28 9,6 g). (2) Alt bileşenler üst toplamı %10'dan fazla aşarsa üstten farklı kaynaktan gelen alt bileşenler atılır (SFA/MUFA/PUFA tekil yağ asitleri, şeker türleri, HMW/LMW lif, beta-glukan, kolin türleri). (3) Esansiyel amino asit toplamı > 1,2 × protein ise amino asitler gösterilmez (4 FDC mantarı: kuru madde bazlı, proteinin 3–4 katı). Toplam 332 tutarsız hücre ayıklandı; genişletilmiş katalog dahil.
- Katalog: simit/lahmacun/gözlemeler 20081 (ABD zenginleştirilmiş un, Fe 4,64) → 20481 (zenginleştirilmemiş, katalogdaki beyaz un) → simit Fe 4,97 → 2,69 mg. Peksimet, sebze burger, pirinç pilavı (tereyağlı FNDDS), "Vegan mayonez" (kolesterol 24 mg; adı "Soyalı mayonez (imitasyon)") `animal: true` + nedenli not. Kuru nohutta aykırı USDA Mn ortalaması (329 mg'lık numune) `drop` ile gösterilmez, notta açık.
- Test: B157 birim (tüm katalogda EAA ≤ 1,2×protein; karışık kaynaklı şeker/PUFA toplamı üstü aşmaz; un kodu; Mn; hayvansal işaretler); B119 testi shiitake yerine maitake (shiitake beta-glukanı lif toplamını aştığı için artık gösterilmiyor).
- Kanıt (B156+B157): `npm run data` (729 besin; tutarlılık kapısı 332 hücre); `npm test` 158/158; build + build:single; 24 bildirim; Playwright tam koşu 302 PASS + 2 FAIL (B120 shiitake beta-glukanı beklentisi, B157'nin beklenen sonucu) → maitake ile 2/2 PASS; yeni tarif kartı geometri + B156 testleri 12/12.
- Sürüm 1.1.2-beta.43. Sonraki: **B158** veri denetiminin kalanları: USDA "varsayılan sıfır" (Src_Cd 7) değerlerini ayrı etiketle göstermek (seitan B vitaminleri 0 görünüyor), alkol bileşeni (bira/şarap enerjisi), foods-ext'te hayvansal izli ~25 kayıt.
- Yayın kanıtı: v1.1.2-beta.43 pre-release 2026-11-17T13:05:16Z (release.yml run 44086134328 success); ci.yml run 44086122535 (0faaf7e, Firefox/WebKit/iPhone/iPad + Chromium) success; GitHub Pages PWA run 44086122486 success.

## B158 · 2026-11-17 · Alkol bileşeni; USDA "varsayılan sıfır" ayrı etiket
- Alkol (etanol, USDA 221) Karbonhidrat bölümünde "Alkol" alt başlığıyla: bira 3,9 g, kırmızı şarap 10,6 g, beyaz şarap 10,3 g; kütle dengesi 89,5 → 100,0 g. Alkolsüz besinlerde USDA'nın varsayılan 0'ları "veri yok" (yalnız pozitif ölçüm gösterilir).
- NUT_DATA Src_Cd 7 ("assumed zero", ölçülmeden 0 kabul) artık okunur: bu hücreler 'z' etiketi "Varsayılan 0" (kesik çerçeve) taşır, ölçülmüş 0'dan ayrılır. 5.275 küratörlü hücre; ör. seitanın B1/B2/B3/B6/folat/E/K değerleri, bitkilerde kolesterol. Değerler değişmedi (0 kalır), yalnız kaynağı dürüst gösterilir; CSV, tarif kaynak dökümü ve Hakkında etiketleri dahil.
- Kanıt: `npm run data`; `npm test` 159/159 (B158: alkol/kütle, alkolsüzde veri yok, seitan 'z', mercimek kolesterol 'z'); build + build:single; B158 tarayıcı 2/2 (seitan "Varsayılan 0").
- Playwright tam koşu 306/306 PASS. Sonraki: **B159** foods-ext bitkisel gruplarda hayvansal izli ~25 kayıt (kolesterol ≥5 mg veya laktoz >0,5 g → hayvansal) ve marka filtresi (USA/AMP/Monster).

## B159 · 2026-11-17 · Geniş katalog diyet sınıfı: süt bazlı tozlar, marka tanıma
- Veri denetiminin A7 bulgusu yeniden doğrulandı: ChatGPT'nin B150 diyet sınıflaması (kolesterol > 0 veya karma ürün → "belirsiz") denetimdeki ~25 kaydın tamamını zaten "bitkisel" olmaktan çıkarmıştı. Kalan iki açık kapatıldı: "dairy" sözcüğü hayvansal kalıba eklendi (dairy drink mix ×2, dairy based malted drink, Wendy's Frosty → hayvansal; "non-dairy" önce AMBIGUOUS'ta yakalanır); Vitasoy/Nasoya/Mori-Nu/Monster ve büyük harfli AMP marka listesine (16 Vitasoy tofu/soya sütü + AMP ×2 + Monster → marka, içerik doğrulanamadığı için "belirsiz"). Eski listenin büyük/küçük harf duyarsızlığı korundu.
- Fark: marka 1878 → 1897, bitkisel 1387 → 1371, hayvansal 3919 → 3923; diğer kayıtlar değişmedi (kayıt kayıt karşılaştırıldı).
- Kanıt: `npm run data`; `npm test` 160/160 (B159: bitkisel kayıtta kolesterol/laktoz sızıntısı 0); build + build:single; diyet/katalog/ağaç/mikro tarayıcı testleri 38/38.
- Sonraki: **B160** beta.44 (B158+B159) ve veri denetiminin düşük öncelikli kalanları (pide_lavas zenginleştirilmemiş 18413, lor/lor_cottage yinelenen NDB, çapati kopyası).

## B160 · 2026-11-17 · Beyaz pide zenginleştirilmemiş kayıt; 1.1.2-beta.44
- pide_lavas 18041 (ABD zenginleştirilmiş: folik asit 83 µg, Fe 2,62 mg) → 18413 (zenginleştirilmemiş: folik asit 0, Fe 1,4 mg); un/pirinç/makarnadaki zenginleştirilmemiş seçimle tutarlı. Lor/lor_cottage (aynı NDB) ve çapati kopyası kayıtlı referansları bozmamak için şimdilik korundu (birleştirme ayrı göç ister).
- Kanıt: `npm run data`; `npm test` 161/161; build + build:single; Playwright tam koşu 306/306.
- Sürüm 1.1.2-beta.44 (B158 + B159 + B160). Sonraki: **B161** lor/lor_cottage ve çapati yinelenenlerini kimlik göçüyle birleştirmek; sonra kullanıcı önceliklerinden sade UI/UX.
- Yayın kanıtı: v1.1.2-beta.44 pre-release 2026-11-17T15:42:53Z (release.yml run 44114498663 success; derleme işinin içinde Chromium tarayıcı testleri de PASS); GitHub Pages run 44114485946 success; ci.yml run 44114486013 15:54 UTC itibarıyla sürüyor (NOT_RUN sonuç).

## B161 · 2026-11-17 · Yinelenen kayıtlar: lor birleştirildi, çapatiler ayrıldı
- `lor` ile `lor_cottage` biçim 0'da birebir aynı USDA kaydıydı (01012) → `lor` kaldırıldı; `LEGACY_IDS.lor = 'lor_cottage'` eski tarif/günlük/koleksiyon/yedek kayıtlarını aynı biçim indeksiyle taşır; yaygınlık listesinde yerini aldı. Arama "lor" ile "Cottage peynir (lor benzeri)"yi bulur.
- İki "Çapati / roti (tam buğday)" farklı kayıtlardı (FNDDS ev tarifi / SR28 ticari donmuş): adlar "ev tarifi, tam buğday" ve "ticari, donmuş" (TR/EN). Artık aynı TR adlı besin yok (test).
- Kuru meyvelerin taze karşılıklarıyla aynı NDB'yi paylaşması (09163, 09079, 09147) B155'in bilinçli seçimi; değiştirilmedi.
- Kanıt: `npm run data`; `npm test` 162/162 (B161: göç, ad tekilliği); build + build:single; Playwright 306/306.
- Sonraki: **B162** kullanıcı önceliği (2) sade UI/UX: Unslop gözüyle Günlük ve Tarif ekranları (telefon 390/320 px).

## B162 · 2026-11-17 · Unslop: Günlük boş durumu ve tarif düğmeleri
- Tarif ekranında "Kopyala / Sil" günlük toplam kartının altına yapışık duruyordu (hangi şeye ait olduğu belirsizdi) → tarif başlığına "Tarifi kopyala / Tarifi sil" olarak taşındı.
- Boş Günlük, telefonda ~6900 px boyunca "Veri yok 0/0" satırları çiziyordu → günde hiç kayıt yokken bileşen matrisi ve kaynak paneli yerine tek satırlık yönlendirme (`.day-empty`, TR/EN). Kayıt varken "yalnız tüketilenler" süzgeci matrisi gizlemez (Veri yok satırları anlamlı kalır).
- Kanıt: `npm test` 162/162; `npm run build`; Playwright audit-storage + personal + ingredient-card 50/50, tam koşu 308/308 (B149 testi yeni boş duruma uyarlandı; B162 testi eklendi). beta.44 ci.yml run 44114486013 success.
- Sonraki: **B163** kod denetimi kalanları: "Varsayılana dön" onayı ve kcal+kJ "ikisi" görünümü.

## B163 · 2026-11-17 · "Varsayılana dön" onayı; enerji "kcal + kJ" gerçekten ikisini gösterir
- Ayarlar → "Varsayılana dön" tek dokunuşla tüm ayarları ve kişisel hedefleri geri dönüşsüz siliyordu → onay penceresi (Vazgeç ayarları korur; tarif/günlük kayıtlarına dokunulmaz).
- Enerji seçeneği "kcal + kJ" (varsayılan) yalnız kcal gösteriyordu → kalori kutusu ve matriks kalori satırı "89 kcal · 371 kJ"; kJ ölçülmemişse yalnız kcal. 320 px'te taşma yok (doc scrollWidth 320).
- Kanıt: `npm test` 162/162; `npm run build`; Playwright app + ingredient-card 171/171 (B163 testi eklendi; ilk koşuda telefonda arama kutusu gizli kaldığı için test sayfa yeniden yüklemeye çevrildi). Tam koşuda 28 px yazı + %200 ölçek + 320 px üç testte taşma çıktı (kJ eki `nowrap`) → kırılabilir satır içi blok; micro-catalog + polish + recipe-total 30/30.
- Sürüm 1.1.2-beta.45 (B161 + B162 + B163). Yayın kanıtı: v1.1.2-beta.45 pre-release 2026-11-17T19:00:51Z (release.yml run 44151005276 success).
- Sonraki: **B164** beta.45 (B161–B163) ve denetim kalanı #8 1000 g sınırı bildirimi.

## B164 · 2026-11-17 · 1000 g sınırı sessizce kırpılmaz
- Tarifte zaten olan bir besini yeniden eklemek miktarı 1000 g'da sessizce kesiyordu ve bildirim eklenen miktarı ("750 g") söylüyordu → "zaten tarifte; toplam en fazla 1000 g, 1000 g'da kaldı" bildirimi. +10/+1 düğmesi 1000 g'ı aşmak isteyince "En fazla 1000 g (1 kg)" bildirimi (TR/EN).
- Yayın: v1.1.2-beta.45 yayımlandı (yukarıda B163 kaydında kanıt).
- Kanıt: `npm test` 162/162; `npm run build`; Playwright B164 2/2 (masaüstü + telefon); tam koşu 312/312.
- Sonraki: **B165** denetim kalanı #9 koleksiyon sınırı mesajı ve #6 geniş katalog öğelerinin koleksiyonda yüklenmesi.

## B165 · 2026-11-17 · Koleksiyon: geniş katalog kaydı kaybolmaz; sınır mesajları doğru
- Hata: geniş katalog (USDA, `t:'x'`) kapalıyken bir koleksiyondaki USDA kaydı diyet süzgecinde (ör. vegan) "bilinmiyor" sayılıp gizleniyordu; "yükleniyor" satırı hiç çizilmediği için katalog da yüklenmiyor ve kayıt kalıcı olarak görünmez kalıyordu. → Yüklenmemiş USDA kaydı süzgeçten geçer ("yükleniyor" satırı yüklemeyi başlatır); açılışta ve yedek içe aktarmada koleksiyonlarda USDA kaydı varsa katalog istenir. Yüklendikten sonra diyet süzgeci gerçek kayda uygulanır.
- "Yeni koleksiyona ekle" ve "Alt kategori" sınır (60) hatasında "ad yaz" diyordu → nedenine göre mesaj (sınır / geçersiz üst / boş ad). Dolu koleksiyona (300 besin) ekleme sessizce yok sayılıp Aion seviniyordu → "dolu" bildirimi, sevinme yok.
- Kanıt: `npm test` 162/162; `npm run build`; Playwright B165 2/2; düzeltme geri alınınca aynı test düşüyor (NDB 09427 hiç görünmüyor), düzeltmeyle geçiyor; tam koşu 314/314.
- Sonraki: **B166** denetim kalanı #3 görünüm profilinin hedefleri ezmesi ve #7 sekmeler arası ayar eşitleme.

## B166 · 2026-11-17 · Görünüm profili hedefleri ezmez; sekmeler arası ayar eşitleme
- Görünüm profili tüm ayar nesnesini saklayıp aynen geri yüklüyordu: profil kaydedildikten sonra girilen kişisel hedefler, diyet süzgeci, referans (AB/EFSA/özel), sabitlenen besinler ve dil, profil uygulanınca eskisiyle eziliyordu. → `applyProfileSettings`: bu anahtarlar (`PROFILE_PRESERVED_KEYS`) korunur, yalnız görünüm/okuma/erişilebilirlik/matriks gösterimi gelir. Ayarlar'daki açıklama bunu söyler (TR/EN).
- Başka sekmede değişen ayarlar bu sekmeye gelmiyordu (yalnız tarif/günlük/koleksiyon eşitleniyordu); bu sekme sonraki kayıtta eski ayarlarla diğerinin değişikliğini eziyordu → `storage` olayında `bm.settings.v2` yeniden yüklenir ve uygulanır.
- Kanıt: `npm test` 163/163 (B166 profil birimi); `npm run build`; Playwright B166 iki sekme 2/2; tam koşu 316/316.
- Sonraki: **B167** denetim kalanı #10 "kaynak 0" işaretinin diğer kaynaklar için doğruluğu ve #11 GOS kısmi toplamı; ardından beta.46.

## B167 · 2026-11-17 · "kaynak 0" tüm ölçüm kaynaklarında; GOS kısmi toplamı alt sınır
- "kaynak 0" işareti yalnız SR28 / IFCT / etiket için çıkıyordu; FDC, FNDDS, SR Legacy, flavonoid, izoflavon, iyot, kolin, proantosiyanidin ve pürin veritabanlarının ölçülmüş 0'ları işaretsizdi (2684 hücre). → Tüm ölçüm kaynakları işaretlenir; tarif tahmini, hesap ve "Varsayılan 0" işaretlenmez.
- Tolerans kartı rafinoz ailesini 4 şekerden yalnız biri ölçülmüşken de "GOS ölçülmüş: X g" diye toplam gibi yazıyordu (soya sütü, badem sütü) → "en az X g (n/4 şeker ölçülmüş)".
- Kanıt: `npm test` 164/164 (B167 birimi; eski kodda işaret sayısı 0 olur); build + build:single; Playwright tam koşu 316/316.
- Sürüm 1.1.2-beta.46 (B164 + B165 + B166 + B167). Yayın kanıtı: release.yml run 44179695553 ilk denemede macOS/iOS işleri makine bulamayıp iptal (kod hatası değil) → yalnız düşen işler yeniden çalıştırıldı, deneme 2 success; v1.1.2-beta.46 pre-release 2026-11-17T22:17 UTC.
- Sonraki: **B168** beta.46 (B164–B167); ardından kullanıcı önceliği (4) büyük sürüklenebilir gram kaydırıcısının telefonda dokunma alanı denetimi.

## B168 · 2026-11-17 · Gram kaydırıcısı karekök ölçekli; tarifte 44 px dokunma hedefi
- Ölçüm (iPhone SE): doğrusal 1–1000 g kaydırıcı 266 px → 3,76 g/piksel; 10 g ≈ 3 piksel, en sık kullanılan küçük miktarlar (baharat, yağ, kuruyemiş) sürükleyerek seçilemiyordu. Tarif kartındaki kaydırıcı 36 px yüksekti.
- `src/amount-scale.js`: konum 0–1000 → gram karekök eğrisi (sol yarı 1–250 g; 10 g artık ~%9,5 konumda, 100 g ~%31); adım <100 g 1 g, <500 g 5 g, üstü 10 g; tüm hazır miktarlar gidiş-dönüşte aynı gram. `aria-valuetext` gramı söyler. Ölçek etiketleri gerçek konumlarında (1 g · 50 · 250 · 1 kg); dar kutuda (büyük yazı/%200) ara etiketler gizlenir. Tarif kaydırıcısı 44 px.
- Kanıt: `npm test` 166/166 (amount-scale 2 test: uçlar, gidiş-dönüş, adımlar, tekdüzelik); build; Playwright B168 2/2, app + ingredient-card + polish 186/188 → beklenen konum 499 düzeltildi; tam koşu 311. testte arka plan zaman sınırına takıldı (o ana dek 0 hata), kalan recipe-amino + recipe-total 16/16. 390 px ekran görüntüsü incelendi; 320 px + 28 px + %200'de etiket çakışması yok.
- Sonraki: **B169** kullanıcı önceliği (5) Aion: sade UI ilkesiyle ipucu sıklığı ve konum denetimi (telefon 320 px'te içerikle çakışma).

## B169 · 2026-11-17 · Aion birincil kontrolleri engellemez (telefon)
- Ölçüm (iPhone SE, Aion açık): selam baloncuğu tam gram kaydırıcısının üstüne çıkıyor ve "kaydırıcıyı çek" derken kaydırıcıya dokunuşu yutuyordu; 320 px'te Aion gövdesi porsiyon düğmeleri ve "Günlüğe ekle" üzerinde duruyordu.
- Baloncuk artık dokunuş yakalamaz (yalnız × düğmesi); Aion dışına her dokunuş baloncuğu kapatır ve dokunuş alttaki kontrole gider. Dar ekranda (≤600 px) kaydırma/dokunma sırasında Aion yarıya kadar kenara çekilir, soluklaşır ve dokunuşları geçirir; 2,5 sn sonra geri gelir. Telefonda orta/büyük boy 64 px'e sınırlı. Hareket azaltmada geçiş yok.
- B168 düzeltmesi: ölçek etiketlerini gizleyen kap eşiği normal yazıda da (iPhone SE) ara etiketleri gizliyordu → 13em; 320 px normal yazıda 4 etiket çakışmasız, 28 px + %200'de yalnız uçlar (test).
- Kanıt: `npm test` 166/166; build; Playwright B169 2+2 (elementFromPoint ile baloncuk ve kenara çekilmiş Aion altındaki öğe sayfaya ait), app + ingredient-card 180/180; ekran görüntüleri incelendi; Playwright tam koşu 322/322.
- Sinir: Aion'un üstünde durduğu bir düğmeye kaydırmadan ilk dokunuş hâlâ Aion'a gider (selam). Sonraki: **B170** beta.47 (B168 + B169) ve kullanıcı önceliği (2) Keşfet besin kartında "+10" düğmesinin 320 px'te ikinci satıra düşmesi.

## B170 · 2026-11-18 · Miktar düğmeleri telefonda tek satır; 1.1.2-beta.47
- 320 px'te "−10 −1 [değer] +1 +10" satırı esnek sarmayla "+10"u ikinci satıra düşürüyordu (B169 ekran görüntüsü). Kap sorgusu (≤26em): beş sütunlu ızgara, değer kalan alanı alır (1000 g'da "g" alt satıra iner, düğmeler yerinde kalır); büyük yazı/%200 ölçek için mevcut iki sütunlu düzen önceliğini korur.
- Kanıt: `npm test` 166/166; build; Playwright B170 2/2, düzeltme geri alınınca aynı test düşer; 320/390/1280 px ve 22/28 px ölçümleri (taşma yok); 320 px ekran görüntüsü incelendi; Playwright tam koşu 324/324.
- Sürüm 1.1.2-beta.47 (B168 + B169 + B170). Yayın kanıtı: v1.1.2-beta.47 pre-release 2026-11-18T00:45:46Z (release.yml run 44207646101 success, ilk denemede). Sonraki: **B171** kullanıcı önceliği (1) B051: eski ekranlarda kalan TR-only metin taraması (i18n testinin yakalamadığı, `L()` dışındaki sabit metinler).

## B171 · 2026-11-18 · B051 tarama: İngilizce arayüzde görünür Türkçe
- Yöntem: İngilizce modda Keşfet (boş, arama, nohut, kahve, sonuçsuz arama), Tarif (malzeme kartı, günlük toplam), Günlük, Kıyasla, Ayarlar, Bilgi ve kendi besin / koleksiyon / seçici pencereleri açılıp tüm `details` genişletildi; görünür metin, aria-label, title ve placeholder iki ağla tarandı: Türkçe harf (ğşıçöüİ) ve çeviri tablosundaki 918 Türkçe anahtarla birebir eşleşme.
- Bulgu: tek gerçek kaçak, Bilgi'deki kaynak listesinde "USDA Proantosiyanidin" adı (`SOURCES.P.short` `L()` dışında) → düzeltildi. Diğer iki eşleşme bilerek Türkçe harf gösteren yazı tipi örnekleri (izinli).
- Kalıcı koruma: `tests/browser/i18n-scan.spec.mjs` (masaüstü + telefon); düzeltme geri alınınca "USDA Proantosiyanidin" ile düşer.
- Kanıt: `npm test` 166/166; build; i18n-scan 2/2; Playwright tam koşu 326/326.
- Sonraki: **B172** kullanıcı önceliği (3) koleksiyon: koleksiyon içi sürükle-bırak yerine mevcut ↑/↓ taşıma düğmelerinin telefonda dokunma hedefi ve "alt kategoriye taşı" eksikliği denetimi.

## B172 · 2026-11-18 · Alt sekme etiketleri sözcük ortasından bölünmüyor
- Koleksiyon ekranını telefonda (iPhone SE, İngilizce) incelerken: alt gezinme çubuğu "Compar|e", "Setting|s" diye sözcük ortasından ikiye bölüyordu (her ekranda görünür). Neden: dar ekran kısa etiketlerinde `overflow-wrap: anywhere`. → Ölçeklenmemiş dar ekranda sözcük bölünmez, yazı 3,1vw ile hafifçe küçülür (10,2–11,9 px; büyük yazı/ölçek düzeni dokunulmadı).
- Ölçüm (yazı tipi yüklendikten sonra): EN/TR × 320/360/390 px'te en dar pay "Compare" 43/46 px; tek satır, taşma yok. Not: ilk ekran görüntüsü web yazı tipi yüklenmeden alınmıştı (yedek yazı tipi geniş); `document.fonts.ready` sonrası temiz.
- Koleksiyon ↑/↓ düğmeleri 34×86 px (AA 24 px üstünde; değiştirilmedi). "Alt kategoriye taşı" yok: sonraki adaya.
- Kanıt: `npm test` 166/166; build; Playwright B172 2/2, düzeltme geri alınınca "Compare satır=2" ile düşer; Playwright tam koşu 328/328.
- Sonraki: **B173** kullanıcı önceliği (3) koleksiyonda besini alt kategoriye / başka koleksiyona taşı.

## B173 · 2026-11-18 · Koleksiyon öğesini başka koleksiyona / alt kategoriye taşı
- Koleksiyondaki her besinin yanında "Taşı…" seçicisi (yalnız başka koleksiyon varsa; alt kategoriler "↳" ile). `transferRef`: kaynaktan çıkarır, hedefe ekler; hedefte zaten varsa yalnız kaynaktan çıkarır ("zaten vardı"); hedef doluysa (300) hiçbir şey değişmez ve "dolu" der. Saf işlev, girdiyi değiştirmez.
- Düzen: koleksiyon satırındaki düğmeler (↑ ↓ Taşı… ✕) her genişlikte besin adının altında kendi satırında; ilk denemede masaüstü kart sütunlarında seçici adı tek harf genişliğe sıkıştırdı (ekran görüntüsünde görüldü) → düzeltildi; 1280 px ve iPhone SE ekran görüntüleri temiz, yatay taşma yok.
- Kanıt: `npm test` 167/167 (transferRef: taşı/birleştir/dolu/aynı/eksik/değişmezlik); build; Playwright B173 2/2; Playwright tam koşu 330/330.
- Sürüm 1.1.2-beta.48 (B171 + B172 + B173). Yayın kanıtı: v1.1.2-beta.48 pre-release 2026-11-18T03:42:40Z (release.yml run 44230270377 success, ilk denemede).
- Sonraki: **B174** beta.48 (B171–B173) ve kullanıcı önceliği (2) Keşfet ana ekranında boş durum / ilk kullanım akışı denetimi.

## B174 · 2026-11-18 · Keşfet ilk açılış: arama kutusu ilk ekranda
- Unslop (iPhone SE + 1280 px ekran görüntüleri): ilk açılışta en önemli eylem olan arama kutusu tanıtım ve diyet süzgecinin altında kalıyordu (telefonda y=471, alt sekme çubuğunun altında yarı gizli; masaüstünde ekranın dibinde); tanıtımla diyet süzgeci arasında iki çizgi üst üste duruyordu. → Sıra: tanıtım → arama → son aramalar → diyet süzgeci → liste. Telefonda arama y=334 (ilk ekranda), çift çizgi kalmadı.
- Yayın: v1.1.2-beta.48 yayımlandı (B173 kaydında kanıt).
- Kanıt: `npm test` 167/167; build; Playwright B174 2/2 (320×568'de arama görünür ve diyet süzgecinden önce), düzeltme geri alınınca düşer; Playwright tam koşu 332/332.
- Sonraki: **B175** kullanıcı önceliği (4) toplam matriks: Tarif ekranında "Günlük toplam" matrisinin telefonda ilk ekran düzeni (Unslop).

## B175 · 2026-11-18 · Tarif "Günlük Toplam" telefonda ilk ekran (Unslop)
- iPhone SE ekran görüntüsü: seçili "Günlük Toplam Tarif" kartının hemen altında aynı adlı H1 iki satır dev boyutta ilk ekranın üçte birini kaplıyordu; tarif kartları içeriğe göre farklı genişlikteydi.
- H1 telefonda `clamp(1.35rem, 5.5vw, 2.1rem)` (tek satır; masaüstünde değişmez), tarif kartları dar ekranda iki eşit sütun. Öğün tablosu kendi kaydırılabilir bölgesinde (role=region, tabindex) bilinçli yatay kayar; dokunulmadı. Öğün tablosu ilk ekrana 125 px yaklaştı.
- Kanıt: `npm test` 167/167; build; Playwright B175 2/2, düzeltme geri alınınca "oneLine: false" ile düşer; ekran görüntüleri incelendi; Playwright tam koşu 334/334.
- Sonraki: **B176** kullanıcı önceliği (5) Aion özelleştirme: Ayarlar'daki Aion bölümünün sade/anlaşılır olması (seçeneklerin canlı önizlemesi) denetimi.

## B176 · 2026-11-18 · Ayarlar: Aion kapalıyken ölü seçenekler gizli
- Unslop (iPhone SE ekran görüntüsü): Aion kapalıyken hareket, boyut, konum, ipucu ve "Kutlamayı dene" görünüyor ama hiçbiri etki etmiyordu; "Kutlamayı dene" hiçbir şey yapmıyordu (`aionSay` kapalıyken döner) → sahte etkileşim. Aion kapalıyken yalnız açıklama + "Aion'u göster" anahtarı; açınca seçenekler gelir.
- Kanıt: `npm test` 167/167; build; Playwright B176 2/2 + mevcut Aion testleri (app + ingredient-card "Aion|B176") 8/8; Playwright tam koşu 336/336.
- Sürüm 1.1.2-beta.49 (B174 + B175 + B176). Yayın kanıtı: v1.1.2-beta.49 pre-release 2026-11-18T06:43:48Z (release.yml run 44251431646 success, ilk denemede).
- Sonraki: **B177** beta.49 (B174–B176) ve kullanıcı önceliği (2) Kıyasla ekranının telefonda Unslop denetimi.

## B177 · 2026-11-18 · Kıyasla telefonda kısa kartlar; Keşfet sekmesine yeniden dokununca listeye dönüş
- Unslop (iPhone SE, 3 besin): her kıyas kartı ~250 px (ad, biçim, büyük miktar, iki satır −10/+10, Ayarla); asıl karşılaştırma tablosu ~1500 px aşağıda başlıyordu. Dar kartta (≤280px kap) −10 [g] +10 tek satır, daha az dolgu → kart ~182 px (3 besinde ~200 px kazanç); masaüstü değişmedi.
- Telefonda besin ayrıntısındayken etkin "Keşfet" sekmesine dokunmak hiçbir şey yapmıyordu (yalnız "← Liste" geri götürüyordu; ölçüm betiği bu yüzden takıldı). Yaygın mobil davranış: etkin sekmeye yeniden dokunmak listeye döner; kategori ve arama korunur.
- Kanıt: `npm test` 167/167; build; Playwright B177 2/2 (kart <220 px, miktar tek satır, sekme dönüşü, arama değeri korunur), düzeltmeler geri alınınca düşer; ekran görüntüleri incelendi; Playwright tam koşu 338/338.
- Sonraki: **B178** Kıyasla tablosunun (468 px) telefonda kaydırma ipucu ve ilk sütunun sabitlenmesi denetimi.

## B178 · 2026-11-18 · Yana kayan tablolarda devam gölgesi
- Denetim (iPhone SE, 3 besin): Kıyasla tablosu 468 px / 294 px kutu; ilk sütun zaten yapışkan (kaydırınca 12→13 px, yerinde) ve bölge "yana kaydırılabilir" diye etiketli, ama görsel olarak devamı olduğu belli değildi. → `.tablewrap` ve öğün tablosu (`.meal-overview`) için sağ kenar gölgesi: yerel arka plan örtüsüyle sona gelince kaybolur (JS yok). Ekran görüntüleri: başta gölge görünür, sonda yok.
- Kanıt: `npm test` 167/167; build; Playwright B178 2/2 (kayar, iki gradyan + local, ilk sütun yapışkan); Playwright tam koşu 340/340.
- Sonraki: **B179** Kıyasla varsayılan bölümü telefonda "Tümü" (~8900 px tablo) yerine "Temel besin değerleri" olmalı mı: kullanıcı önceliği (2) sadelik; karar ve uygulama.

## B179 · 2026-11-18 · Kıyasla telefonda "Temel besin değerleri" ile açılır
- Karar (kullanıcı önceliği 2, sadelik): telefonda varsayılan "Tümü" iki-üç besinde ~8900 px'lik tablo açıyordu; ilk bakışta istenen kalori/makro karşılaştırması bu yükün içinde kayboluyordu. Dar ekranda (≤600 px) varsayılan "Temel besin değerleri"; masaüstünde geniş tablo sığdığı için "Tümü" kalır. Bölüm şeridi her bölüme tek dokunuşla geçer.
- B109 testi (tablonun kendi içinde dikey kaydırmaması, sayfa boyu açık) telefonda artık "Tümü"ne açıkça geçerek ölçüyor.
- Kanıt: `npm test` 167/167; build; Playwright B109 + B179 4/4 (telefonda Temel seçili ve tablo <1500 px, masaüstünde Tümü ve >1500 px); app + polish + ingredient-card ilk koşuda yalnız B109 telefonu düştü → güncellendi; Playwright tam koşu 342/342.
- Sürüm 1.1.2-beta.50 (B177 + B178 + B179). Yayın kanıtı: v1.1.2-beta.50 pre-release 2026-11-18T09:49:16Z (release.yml run 44276676306 success, ilk denemede).
- Sonraki: **B180** beta.50 (B177–B179) ve kullanıcı önceliği (1)/(2): Hakkında (Bilgi) ekranı telefonda Unslop.

## B180 · 2026-11-18 · Bilgi ekranı telefonda metin duvarı değil
- Unslop (iPhone SE): Bilgi sayfası 7639 px; 12 maddelik veri kaynakları paragrafları ve 24 lisans başlığı, en önemli kısım olan "Veri dürüstlüğü"nün önünde ekranlarca sürüyordu. → Sıra: tanıtım → sürüm/veri satırı → Veri dürüstlüğü (açık) → "Veri kaynakları 12" ve "Lisanslar ve telif bildirimleri 24" katlanır bölümler (başlık özetin içinde, sayı rozetli). Sayfa 1726 px. İçerik silinmedi; lisanslar çevrimdışı okunmaya devam eder.
- Lisans testi (app.spec "lisanslar çevrimdışı okunur") katlanır bölümü önce açacak şekilde güncellendi.
- Kanıt: `npm test` 167/167; build; Playwright B180 2/2 + lisans/B051/i18n/başlık testleri 20/20; ekran görüntüleri incelendi (uzun başlıkta sayı rozeti hizası düzeltildi); Playwright tam koşu 344/344.
- Sonraki: **B181** kullanıcı önceliği (2) Ayarlar ekranı telefonda Unslop (uzunluk ve gruplama).

## B181 · 2026-11-18 · Ayarlar bölüm şeridi
- Ölçüm (iPhone SE): Ayarlar 12 661 px, 16 kart hep açık (Yazı tipi 2148, Matriks bölümleri 1450, Düzen 1444, Kendi temam 1150 px). Kartları katlanır yapmak onlarca testin doğrudan dokunduğu denetimleri gizleyeceği için tek Forge'a sığmayan risk; bunun yerine arama kutusunun altına bölüm şeridi: 16 kart başlığı, dokununca karta atlar (başlık odaklanır), telefonda yana kayar. Arama bir kartı gizlerse onun düğmesi de gizlenir. Etkin Ayarlar sekmesine yeniden dokunmak zaten başa döner.
- Kanıt: `npm test` 167/167; build; Playwright B181 2/2 (düğme sayısı = kart sayısı, "Yedekleme" ekranın üstüne gelir, "aion" aramasında Yedekleme düğmesi gizli); ekran görüntüsü incelendi; Playwright tam koşu 346/346.
- Sonraki: **B182** Ayarlar'da en uzun "Yazı tipi" kartı (2148 px): örnek kartlarının telefonda sadeleşmesi.

## B182 · 2026-11-18 · Yazı tipi kartı telefonda kısaldı
- Ölçüm (iPhone SE): "Yazı tipi" kartı 2148 px; 9 yazı tipi kartı tek sütun, her biri ~125 px (ad, örnek cümle iki satır, açıklama iki satır). Telefonda (ölçeklenmemiş düzen) iki sütun, örnek tek satır, açıklama yalnız seçili yazı tipinde; seçili kart tam genişlik (tam örnek + açıklama), boşluklar `dense` ile dolar. Her ad kendi yazı tipinde görünmeye devam eder. Kart 1434 px.
- İlk denemede "Atkinson Hyperlegibl|e", "OpenDyslex|ic" sözcük ortasından bölündü (ekran görüntüsü) → ad biraz küçüldü, sözcük bölme kapalı; test bunu yakalar.
- Kanıt: `npm test` 167/167; build; Playwright B182 2/2 (iki sütun, bölünen ad yok, seçili tam genişlik + açıklama); Playwright tam koşu 348/348.
- Sürüm 1.1.2-beta.51 (B180 + B181 + B182). Yayın kanıtı: v1.1.2-beta.51 pre-release 2026-11-18T12:48:13Z (release.yml run 44304230078 success, ilk denemede).
- Sonraki: **B183** beta.51 (B180–B182) ve kullanıcı önceliği (2) "Matriks bölümleri" kartı (1450 px) sadeleşmesi.

## B183 · 2026-11-18 · Matriks bölümleri satırları asılı girintili
- Ekran görüntüsü (iPhone SE): 15 bölüm satırında sarılan ad onay kutusunun altına düşüyordu ("Protein ve / amino asitler" kutunun altından başlıyor); satırlar 67–93 px. Onay kutusu + ad esnek satır (asılı girinti), oklar dar ve aynı satırda; kart 1450 → 1327 px. Denetimler görünür kaldı (mevcut testler doğrudan dokunuyor).
- Test ilk yazımda eski hatayı yakalamıyordu (süzgeç sarılan satırı dışarıda bırakıyordu) → yalnız metin düğümleri ölçülerek düzeltildi; şimdi düzeltme geri alınınca "Protein ve amino asitler" vb. ile düşer.
- Yayın: v1.1.2-beta.51 yayımlandı (B182 kaydında kanıt).
- Kanıt: `npm test` 167/167; build; Playwright B183 2/2; Playwright tam koşu 350/350.
- Sonraki: **B184** "Kendi temam" kartı (1150 px) telefonda: renk seçicilerin düzeni (Unslop).

## B184 · 2026-11-18 · Kendi temam renkleri telefonda iki sütun
- Ekran görüntüsü (iPhone SE): 7 renk alanı tek sütun, her biri ~70 px; kart 1150 px. Yalnız tema kartının ızgarasına `theme-colors` sınıfı (`.cu-grid` kendi besin ve profil formlarında da kullanılıyor, onlara dokunulmadı); telefonda iki sütun, nokta ve dolgu biraz küçük. Kart 917 px; adlar sözcük ortasından bölünmüyor.
- Kanıt: `npm test` 167/167; build; Playwright B184 2/2, düzeltme geri alınınca "cols: 1" ile düşer; ekran görüntüsü incelendi; Playwright tam koşu 352/352.
- Sürüm 1.1.2-beta.52 (B183 + B184). Yayın kanıtı: v1.1.2-beta.52 pre-release 2026-11-18T14:54:07Z (release.yml run 44324622511 success, ilk denemede).
- Sonraki: **B185** beta.52 (B183–B184) ve kullanıcı önceliği (3)/(2): Keşfet kategori şeridinde "Koleksiyonlarım" başlığının telefonda görünürlüğü.

## B185 · 2026-11-18 · Koleksiyonlar kategori şeridinin başında
- Ölçüm (iPhone SE, 1 koleksiyon): Keşfet kategori şeridi 5950 px genişliğinde yana kayıyor; "Koleksiyonlarım" 5165. pikseldeydi (≈17 ekran kaydırma). Kullanıcı önceliği (3) koleksiyonlar: koleksiyon varsa grup "Tümü"nün hemen ardından gelir (153. piksel, ilk ekranda); koleksiyon yoksa sıra değişmez (kategoriler önde, "+ Yeni koleksiyon" sonda). Masaüstünde de aynı sıra (satırlar sarıldığı için yalnız konum değişir).
- Kanıt: `npm test` 167/167; build; Playwright B185 2/2 (koleksiyonsuz: ikinci öğe kategori; koleksiyonlu: ikinci öğe grup başlığı, "Kahvaltı" <400 px); Playwright tam koşu 354/354.
- Sonraki: **B186** kullanıcı önceliği (5) Aion: telefonda besin eklendiğinde kutlama baloncuğunun yeri ve süresi (B169 sonrası) denetimi.

## B186 · 2026-11-18 · Telefonda Aion konuşurken kenarda beklemiyor (B169 yan etkisi)
- Denetim (iPhone SE): B169'da her dokunuş Aion'u 2,5 sn kenara çekiyor ve baloncuğu gizliyordu. Aion'u konuşturan şey de bir dokunuş olunca ("Kutlamayı dene", Günlük'te hedef kutlaması) baloncuk 2,5 sn hiç görünmüyordu → telefonda düğme tepkisiz görünüyordu. Kutlamalar yalnız Günlük'te hedefe ulaşınca (celebrateGoals); tarife eklemede baloncuk yok, yalnız bildirim (çakışma yok: bildirim 80–240 px, Aion 277–341 px).
- `aionSay` kenara çekilmeyi hemen kaldırır; kaydırınca yine çekilir (B169 korunur).
- Kanıt: `npm test` 167/167; build; Playwright B186 2/2 (baloncuk 800 ms içinde görünür, kaydırınca yine çekilir), düzeltme geri alınınca düşer; B169 + B176 testleri birlikte 8/8; Playwright tam koşu 356/356.
- Sürüm 1.1.2-beta.53 (B185 + B186). Yayın: release.yml run 44347567828 ilk denemede CI tarayıcı testlerinde tek test ("özel hedef, birimler, tema dosyası…", masaüstü) 30 sn zaman aşımı (355/356); yerelde aynı test 20/20 (--repeat-each 10, iki proje) ve önceki CI koşularında geçiyordu → kararsız (flaky) kabul edildi, yalnız düşen iş yeniden çalıştırıldı: deneme 2 success, v1.1.2-beta.53 pre-release 2026-11-18T17:42:06Z.
- Sonraki: **B187** beta.53 (B185–B186) ve kullanıcı önceliği (2) Günlük ekranı profil formunun telefonda düzeni.

## B187 · 2026-11-18 · Günlük profil formu telefonda kısaldı
- Ekran görüntüsü (iPhone SE): iki satır dev başlık + profil kartı 1523 px (yaş, boy, kilo her biri tam genişlik satır); günün kaydı (ekranın asıl işi) çok aşağıda. Başlık `clamp(1.45rem, 6vw, 2.3rem)`; yaş / boy / kilo telefonda tek satırda üç kısa alan, seçimler tam genişlik. Sayfa 3057 → 2787 px, profil kartı 1314 px. Hiçbir alan gizlenmedi.
- Yayın: v1.1.2-beta.53 yayımlandı (B186 kaydında kanıt; ilk denemede CI'da kararsız test).
- Kanıt: `npm test` 167/167; build; Playwright B187 2/2 (üç alan tek satır, ≥60 px, başlık ≤2 satır, yazma çalışır); ekran görüntüsü incelendi; Playwright tam koşu 358/358.
- Sonraki: **B188** CI'da kararsız çıkan "özel hedef, birimler, tema dosyası" testinin kök nedeni (izleme dosyası yok; olası bildirim / yeniden çizim yarışı) ve sağlamlaştırma.

## B188 · 2026-11-18 · CI kararsız test: yeniden deneme + iz yükleme
- beta.53 ilk CI koşusunda "özel hedef, birimler, tema dosyası…" (masaüstü) kJ düğmesine tıklarken 30 sn takıldı. Yerelde yeniden üretilemedi: --repeat-each 10 (20/20) ve CPU 8× yavaşlatılmış adım adım betik (6/6, tıklama 320–460 ms). release.yml düşen testin izlerini yüklemiyordu (ci.yml yüklüyordu) → kök neden kanıtı yok.
- Playwright CI'da `retries: 1` (yerelde 0): kararsız test "flaky" olarak raporlanır, gizlenmez; CI'da iz yalnız ilk başarısızlıkta saklanır (`retain-on-first-failure`). release.yml'e `if: failure()` ile `test-results/` yükleme (7 gün). Sonraki kararsızlıkta iz incelenip kök neden düzeltilecek.
- Kanıt: `npm test` 168/168 (B188: yapılandırma ve iş akışı denetimi); `playwright test --list` CI=0 ve CI=1 358 test; CI=1 ile hedef test 2/2; release.yml YAML geçerli. Uygulama kodu B187 tam koşusundan (358/358) beri değişmedi.
- Sürüm 1.1.2-beta.54 (B187 + B188). Yayın kanıtı: v1.1.2-beta.54 pre-release 2026-11-18T19:39:05Z (release.yml run 44378490063 success, ilk denemede; tarayıcı testleri geçti, iz yükleme adımı doğru biçimde atlandı).
- Sonraki: **B189** beta.54 (B187–B188) ve kullanıcı önceliği (2) Günlük'te günün kaydı kartı (850 px) telefonda denetimi.

## B189 · 2026-11-18 · Bildirim telefonda yuvarlak topa dönüşmüyor
- Günlük gün kartı denetimi (iPhone SE, 2 kayıt: kart 9373 px; mikro özet 2273, protein 2127, mineral 1525 px açık geliyor; varsayılan açık bölümler testlerle bağlı, bu Forge'da değiştirilmedi). Ekran görüntülerinde asıl kusur: bildirim (toast) ~160 px genişliğinde 5 satırlık koyu bir topa dönüşüp içeriği kapatıyordu (önceki ekran görüntülerinde de vardı). Neden: `left: 50%` + `translateX(-50%)` küçült-sığdır genişliğini ekranın yarısıyla sınırlıyor. → `width: max-content` (en fazla ekran − 32 px), çok satırda yuvarlak dikdörtgen. Telefonda 288 px × 2 satır, masaüstünde tek satır.
- Kanıt: `npm test` 168/168; build; Playwright B189 2/2 (>220 px, ≤3 satır, ekrandan taşmaz), düzeltme geri alınınca düşer; ekran görüntüsü incelendi; Playwright tam koşu 360/360.
- Sonraki: **B190** Günlük gün kartında telefonda varsayılan açık bölümler (mikro özet / protein / mineral) ve ilgili testlerin güncellenmesi.

## B190 · 2026-11-18 · Veri boşlukları ölçüldü; CoFID 2021 kaynağı alındı (Kaan: "eksik dataları bul, USDA'da yoksa başka yerden ekle")
- Boşluk analizi (bitkisel 596 biçim): makrolar tam (protein/yağ/karb/su 1 eksik), şekerler %15, lif %3; Mn %10, Se %6, B12 %5, folat %4, kolin %24, **iyot %88**; **9 temel amino asit %34–36 eksik** (protein >2 g olup amino asidi olmayan 112 biçim: kurutulmuş meyveler, enginar, taze bakla, filizler, roka, semizotu, asma yaprağı…).
- Kaynak taraması: UK CoFID 2021 (Open Government Licence v3, kaynak göstererek serbest) iyot, Mn, Se, şeker, biotin, pantotenat içerir ama **amino asit içermez**. Danimarka Frida amino asit içerir; indirme/yeniden dağıtım lisansı doğrulanamadı → kullanılmadı. www.gov.uk ağ izni kullanıcı tarafından verilmedi; dosya zaten izinli assets.publishing.service.gov.uk'ten indirildi (sha256 kayıtlı).
- `data/raw/CoFID_2021_SUBSET.json.gz` (2886 besin; 'Tr' ve 'N' metin olarak korunur, 0'a çevrilmez), `CoFID_2021_SOURCE.json`, `scripts/extract-cofid.py`. Bitkisel gruplarda (D/F/G) sayısal ölçüm: iyot 351, Mn 760, Se 409, şekerler 892, biotin 459, pantotenat 709.
- Durum: PLANNED (veri henüz uygulamada değil). Sonraki: **B191** CoFID eşlemesi (elle doğrulanmış besin ↔ CoFID kodu; yalnız USDA'da ölçülmemiş hücreler; yeni kaynak etiketi; lisans bildirimi + Bilgi sayfası); ardından **B192** amino asit boşlukları için yalnız USDA'nın aynı besinin başka biçiminden oransal ve "Tahmin" etiketli doldurma değerlendirmesi (ısıyla değişen biçimlerde yapılmaz).

## B191 · 2026-11-18 · UK CoFID 2021 ile ilk boşluk doldurma (54 hücre)
- Kaan: izin sormadan, kullanımı serbest kaynaklardan eksik veri ekle. CoFID 2021 (OGL v3) kullanıldı; yeni ağ izni istenmedi.
- Eşleme elle (`data/cofid-map.mjs`, 22 biçim): ad ve hazırlama biçimi aynı + ana bileşim uyumlu (su ±5 g, protein ±%25/±1 g). Otomatik ad eşleşmesi reddedildi (pak choi→kırmızı lahana, badem→yer fıstığı, tahin→kaju, agar→kombu, taze soğan→turşu soğan, çapati→ekmek pudingi gibi yanlışlar üretti).
- `build-data.mjs` `fillFromCofid`: yalnız boş hücreler; iyot, Mn, Se, biyotin, pantotenik asit, K1; şekerler yalnız toplam ve alt şekerlerin hepsi boşsa birlikte. 'Tr' (iz) ve 'N' kullanılmaz, 0 yazılmaz. Sonuç: 54 hücre (iyot 17, biyotin 16, şeker grubu 6 biçim, Se 2, pantotenik 1); tutarlılık kapısı değişmedi (332).
- Kaynak etiketi "B" (UK CoFID 2021): kaynak çipi, dışa aktarma, tarif kaynak dökümü, "kaynak 0" işareti, Bilgi'de kaynak maddesi (TR/EN), meta kaynak satırı, lisans bildirimi (OGL v3 atıf metni; 25 bildirim).
- Kanıt: `npm run data` (CoFID 54); `npm test` 169/169 (B191: her B hücresi eşlenmiş, değer CoFID ile birebir, hayvansal yok; eşlenen her biçimde su/protein uyumu); build + build:single; Playwright tam koşu 360/360 (Bilgi sayfası İngilizce taraması dahil).
- Sonraki: **B192** CoFID eşlemesini genişletmek (iyot boşluğu %88: sebze, meyve, baklagil, tahıl; her eşleme aynı kurallarla), ardından amino asit boşlukları.

## B192 · 2026-11-18 · CoFID eşlemesi ikinci tur: 92 hücre
- Aynı kurallarla 18 biçim daha (mandalina, dut, ahududu, bektaşi üzümü, mürver, altın çilek, hünnap, kuru erik, salatalık, haşlanmış bezelye ve brokoli, lahana turşusu, havuç, turp, haşlanmış kereviz kökü, tempeh, kuskus, safran). Reddedilen zayıf adaylar: marul (CoFID "ortalama"), taze makarna (USDA kuru makarna), beyaz tortilla (USDA tam buğday), Çin lahanası→beyaz lahana, haşlanmış amarant→çiğ.
- Kanıt: `npm run data` (CoFID 92 hücre); `npm test` 169/169 (B191 testi tüm eşlemelerde su/protein uyumunu ve değer birebirliğini denetler); Playwright tam koşu 360/360.
- Amino asit kaynağı araştırması: CoFID'de amino asit yok; Danimarka Frida (amino asit içerir, kullanım koşulu: her gösterimde kaynak belirtme; açık lisans kimliği yok) bu oturumun ağından erişilemiyor (frida.fooddata.dk çözümlenmiyor/izin dışı) ve Kaan ağ izni istemlerini istemiyor → BLOCKED_ENVIRONMENT. Kuru meyveler için taze karşılıktan oransal "Tahmin" kurulmadı: kurutmada lizin (Maillard) değişir, ısıyla değişen bileşen tahmin edilmez kuralı.
- Sonraki: **B193** CoFID eşlemesi üçüncü tur (baklagil, tahıl, kuruyemiş: farklı adlandırmalar elle aranacak) ve beta.55.

## B193 · 2026-11-18 · GitHub Pages: bağlantı önizlemesi ve açılış ekranı (Kaan: "github pages'te güzel gözüksün")
- Pages iş akışı her push'ta `dist`'i yayımlıyor (son koşular success). Eksikler: bağlantı paylaşılınca önizleme yoktu (Open Graph/Twitter etiketi ve görsel yok); açılışta beyaz zemin üzerinde süssüz "yükleniyor" yazısı.
- `public/og-image.png` 1200×630 (uygulama renkleri, logo, "Tabağında ne var?", nohut kartı: 378 kcal, 20,5 g protein, 12,2 g lif, 557 µg folat; değerler foods.json'dan), kaynağı `scripts/og-image.html`. index.html: og:title/description/url/image(+boyut, alt), og:locale, twitter:card; başlık "Besin Matriksi · çevrimdışı besin matriksi ve tarif hesaplayıcı". Açılış: uygulama zemin rengi (koyu temada koyu), ortada logo + "yükleniyor"; hareket azaltmada animasyon yok.
- Kanıt: `npm test` 170/170 (B193: etiketler, görsel boyutu, açılış); build + build:single (`dist/og-image.png`, mutlak og:image); 1920/1440 px masaüstü ve yavaşlatılmış açılış ekran görüntüleri incelendi; Playwright tam koşu 360/360.
- Sürüm 1.1.2-beta.55 (B189–B193).
- Sonraki: **B194** beta.55 (B190–B193) ve CoFID eşlemesi üçüncü tur.

## B194 · 2026-11-19 · Kıyasla'da doğrudan arama (Kaan: "2 besini kıyaslayacaktım, bulamadım")
- Kıyasla sekmesinde besin eklemenin tek yolu küçük "＋ Besin ekle" kutusu ve açılan seçici penceresiydi; sekme boşken ne yapılacağı belli değildi. Sekmenin en üstüne görünür arama kutusu: yazarken (yeniden çizmeden, odak kaybolmadan) en fazla 10 sonuç, her biçim ayrı satır (ör. Nohut · Kuru / Haşlanmış / Konserve, kcal ile); dokununca varsayılan miktarla eklenir, kutu boşalır ve odakta kalır; eklenmiş biçim ✓ ve pasif; 4 besinde arama yerine "birini çıkar" uyarısı. Boşken kısa yönlendirme. Eski seçici penceresi duruyor.
- Kanıt: `npm test` 170/170; build; Playwright B194 2/2 (iki besin → tablo, eklenmiş biçim pasif, 4'te arama kalkar); iPhone SE ve 1440 px ekran görüntüleri incelendi; Playwright tam koşu 362/362.
- Sonraki: **B195** veri boşlukları (Kaan: eksikleri bul ve tamamla): CoFID eşlemesi genişletme + yeni serbest kaynak araması.

## B195 · 2026-11-19 · CoFID üçüncü tur: 161 hücre
- Aday arama İngilizce besin adıyla (USDA açıklaması yerine); aynı kurallar (ad + biçim aynı, su ±5 g, protein ±%25/±1 g), elle seçim. 44 biçim eklendi (karpuz, şeftali, armut, avokado, ananas, mango, frenk üzümü, papaya, haşlanmış soğan, çiğ taze fasulye, lahana, karnabahar, bamya, balkabağı, enginar, Brüksel lahanası, kuşkonmaz, edamame, kara lahana, hindiba, pancar, kırmızı/yeşil mercimek, kırmızı fasulye, maş, urad, beyaz/esmer pirinç, bulgur, kinoa, buğday kepeği, fındık, badem, kestane, Brezilya cevizi, tahin, maydanoz, havuç suyu…). Reddedilenler: kabuklu limon, kiraz domates, yalnız soğanı olan taze soğan, dondurulmuş/bebek ıspanak, yarı haşlanmış esmer pirinç, çiğ tempeh↔pişmiş.
- Toplam CoFID hücresi 161 (iyot 38, biyotin 66, şekerler 19 biçim + alt şekerler, Se 3, pantotenik 2, Mn 1). Boşluk: iyot 523→485, şeker 92→73. CoFID'de bitkisel iyot çoğunlukla "N"; bu kaynakla ulaşılabilecek sınır bu.
- Kanıt: `npm run data` (CoFID 161); `npm test` 170/170 (B191 testi tüm 106 eşlemede su/protein uyumu ve değer birebirliği); Playwright tam koşu 362/362.
- Sürüm 1.1.2-beta.56 (B194 + B195), Kaan'ın "Yayınla" isteğiyle. Yayın kanıtı: v1.1.2-beta.56 pre-release 2026-11-19T11:44:54Z (release.yml run 44514687755 success, ilk denemede).
- Sonraki: **B196** beta.56 (B194–B195).

## B196 · 2026-11-19 · Yağ asitleri: USDA 18:2 / 18:3 toplamları görünür (plan A1)
- Bulgu (B195 sonrası analiz): linoleik (LA) %89, ALA %84 eksik görünüyordu; omega-3/6 toplamları hiç yok. Neden: yalnız izomer-özel USDA kodları (675, 851; SR28'de ~1900 kayıt) okunuyordu; USDA'nın ölçtüğü 18:2 / 18:3 toplamları (618, 619; ~7200 kayıt) hiç kullanılmıyordu.
- İki yeni satır: "C18:2 toplamı (linoleik ağırlıklı, izomer ayrıştırılmamış)" ve "C18:3 toplamı (bitkilerde çoğunlukla ALA, izomer ayrıştırılmamış)", etiket USDA (u). Bitkisel boşluk %9 / %10. LA ve ALA satırları ayrı kalır; toplamlar LA/ALA'ya kopyalanmadı (izomer ayrımı yok). Omega-3/6 toplamı türetilmedi: 18:3 toplamı GLA gibi n-6 izomerleri de içerebilir; ölçüm olmayan "omega-3 toplamı" yazılmaz (karar: dürüstlük > dolu görünüm).
- Kanıt: `npm run data`; `npm test` 171/171 (B196: boşluk <%15, ceviz 18:2 38,1 g / 18:3 9,08 g USDA, 18:2+18:3 ≤ çoklu doymamış); tarayıcıda ceviz matrisi açılıp satırlar doğrulandı; Playwright tam koşu 41 (B196 + B197): 358/358.
- Sonraki: **B197** miktar sınırı 1 kg → 10 kg (Kaan isteği).

## B197 · 2026-11-19 · Miktar üst sınırı 1 kg → 10 kg (Kaan isteği)
- Tek kaynak `MAX_GRAMS = 10000` (`src/amount-scale.js`): kaydırıcı, +1/+10, tarif birikimi (B164 bildirimi), günlük kaydı doğrulaması ve tariften güne bölme, günden tarife birleştirme, kayıt normalleştirme (records). Kendi besin "etiketteki porsiyon" alanı 1–1000 g kaldı (porsiyon, toplam değil).
- Kaydırıcı küp ölçeğe geçti (karekökte 10 kg küçük miktarları yine sıkıştırırdı): 10 g ≈ %10, 100 g ≈ %22, 1 kg ≈ %46, 10 kg uç; adımlar 1/5/10/50/100 g; tüm hazır miktarlar gidiş-dönüşte aynı gram. Ölçek etiketleri 1 g · 100 · 1 kg · 10 kg. Hazır düğmelere 2 kg, 5 kg, 10 kg eklendi.
- Hata düzeltmesi: hazır düğme etiketi 1000 g ve üstündeki her değeri "1 kg" yazıyordu → `kgLabel` (2 kg, 2,5 kg, 10 kg).
- Testler yeni sınıra uyarlandı (recipe-day bölme 10 kg + 3,5 kg, birleştirme sınırı, records sıkıştırma 10 kg, B164 10 kg bildirimi, B168 küp ölçek konumları); amount-scale birim testleri yeniden yazıldı (+kg etiketi).
- Kanıt: `npm test` 172/172; build; Playwright B164/B168/B169/B170/B089 12/12; iPhone SE ekran görüntüsü (2 kg seçili, karpuz 2 kg = 600 kcal); Playwright tam koşu 41: 358/358 (11,5 dk). Not: önceki tam koşu (B196) bu Forge'un yeniden derlemesiyle çakıştı; düşen 3 test bu çakışmadandı (eski test dosyası / derleme sırasında sayfa yüklenemedi).
- Sonraki: **B198** ana sayfa hızı (691 kart yerine parça parça çizim).

## B198 · 2026-11-19 · Ana sayfa parça parça çizilir (plan B1)
- Ana listede (kategori seçili değilken) ilk 60 kart çizilir; altında "{n} besin daha göster" düğmesi. Düğme görünür alana 600 px yaklaşınca IntersectionObserver kendiliğinden 180 kart daha ekler (kaydırma kesintisiz); düğme klavye ve ekran okuyucu için yerinde kalır. Arama metni veya sıralama değişince sınır 60'a döner; kategori görünümü tam liste.
- Kanıt (iPhone SE öykünmesi, CPU ×4, aynı ölçüm betiği): ana sayfa DOM 8682 → 1095 düğüm; açılış 2,8 sn → 1,6 sn; arama 225 ms. Playwright B198 (60'tan az/eşit ilk kart, kaydırınca artar, arama bulur ve sıfırlar) masaüstü + telefon geçti.
- Sonraki: **B199**.

## B199 · 2026-11-19 · Miktar değişince matris yamanır (plan B2)
- `src/morph.js`: yeni HTML bir şablona çözülür, eski ağaçla düğüm düğüm karşılaştırılır; yalnız değişen metin ve öznitelik yazılır, yapı farklıysa o alt ağaç değişir. `open` özniteliğine dokunulmaz (açık bölümler açık kalır). Keşfet ve tarif matrisinde `innerHTML` yerine kullanılır.
- Kanıt: +10 g dokunuşu (CPU ×4, aynı betik) 275 → 210 ms; sayfa içi tıklamadan yamaya 49–108 ms. Hedef <50 ms tam tutmadı: kalan süre matris HTML'inin üretimi; ileride satır bazlı hesapla düşürülebilir. Playwright B199: enerji hücresi ve kimlik kartı aynı DOM düğümü kalır, değer değişir, 100 g'a dönünce ilk değer geri gelir.
- Sonraki: **B200**.

## B200 · 2026-11-19 · Günlük ve Kıyasla sadeleşti (plan C1)
- Günlük, telefonda (≤700 px): bileşen bölümlerinden yalnız "Su ve enerji" açık, mikro besin özeti kapalı gelir; açıp kapattığın bölüm oturum boyunca hatırlanır. Masaüstü eskisi gibi (enerji, protein, mineral açık). İki besinli günde telefon sayfası 9373 → 4879 px.
- Kıyasla kartında biçim seçimi: çok biçimli besinde (ör. nohut kuru / haşlanmış / konserve) kartın başlığında açılır liste; besini silip yeniden eklemeden biçim değişir, miktar korunur.
- Kanıt: `daySectionOpen` birim testi; Playwright B200 2 test × (masaüstü + telefon).
- Sonraki: **B201**.

## B201 · 2026-11-19 · Grafikler (plan C2)
- Kıyasla "Temel değerler" grafiği: her satır bir değer (kalori, protein, karbonhidrat, şeker, yağ, doymuş yağ, lif, tuz), çubuklar satırdaki en yüksek değere göre (birimler farklı, tek eksen yok); ölçülmemiş = "veri yok" yazısı, çubuk yok; satırın en yükseği kalın. Renkler besin sırasını izler (açık ve koyu tema için ayrı adımlar; dataviz doğrulayıcısı: CVD ΔE en kötü 9,1 / 8,4, geçti; açık temada kontrast uyarısı değer yazılarıyla karşılandı).
- Kıyasla "Amino asit profili": WHO/FAO/UNU 2007 mg/g protein referansına göre %, %100 çizgisi, sınırlayıcı amino asit lejantta; eksik ölçüm "veri yok", kısmi "≥". Telefonda kapalı gelir (sayfa uzamasın).
- Günlük 7 günlük grafik: Enerji / Protein / Lif seçimi; kayıtsız veya ölçümsüz gün "—", 0 değil.
- Kanıt: `tests/compare-chart.test.mjs` (satır içi ölçek, veri yok, tek besinde grafik yok, %100 çizgisi), `renderWeek` testi (protein, lifte 7 "—"); Playwright B201 masaüstü + telefon; telefon ve 1280 px ekran görüntüleri incelendi.
- Sonraki: **B202**.

## B202 · 2026-11-19 · Hafif tek dosya HTML + JSON.parse ile veri (plan B3)
- `npm run build:lite` → `dist-lite/besin-matriksi-hafif.html` 4,14 MB (tam tek dosya 12,56 MB). Geniş USDA kataloğu (8053 kayıt) yerine boş taslak paketlenir; küratörlü besinlerin hepsi var. Hafif sürümde "Tam Katalog" açıklama gösterir (yükleniyor/hata yerine). release.yml derler; yayında `…-offline-lite.html` adıyla.
- Vite `json.stringify`: veri JS nesnesi yerine `JSON.parse` dizesi olarak paketlenir (ayrıştırma daha hızlı).
- Plan maddesi "veriyi koddan ayır" tam yapılmadı: ana paket hâlâ küratörlü veriyi içerir (2,58 MB); geniş katalog zaten ayrı ve tembel yükleniyor. Tam ayrım açılışı eşzamansız yapmayı gerektirir; risk/fayda için ayrı Forge.
- Kanıt: release testi (paket adı, release.yml adımları, vite ayarı, boş taslak); hafif dosya file:// ile açıldı: 0,6–0,9 sn, 60 kart, ceviz 654 kcal, Tam Katalog açıklaması, sayfa hatası yok.
- Sonraki: **B203**.

## B203 · 2026-11-19 · 10 yeni bitkisel besin (USDA SR28)
- Karambola (09060), kumkat (09149), çerimoya (09062), hindiba yaprağı (11152), lima fasulyesi kuru/haşlanmış (16071/16072), bambu filizi çiğ/haşlanmış (11026/11027), nopal çiğ/pişmiş (11963/11964), İsveç şalgamı çiğ/haşlanmış (11435/11436), lotus kökü çiğ/haşlanmış (11254/11255), okara (16130). Az bilinenler "niş" işaretli; her birine simge ve SVG çizimi, İngilizce ad.
- Güvenlik notları: karambola (oksalat + karamboksin; böbrek hastalığında zehirlenme bildirimleri), çiğ bambu filizi (siyanojenik glikozit; haşlanarak).
- Okara'da lif USDA'da ölçülmemiş: "veri yok" kalır. Katalog 738 besin / 889 biçim.
- Kanıt: `npm run data`; `npm test` 177/177 (simge, SVG, İngilizce not testleri dahil).
- Sonraki: **B204** beta.57 yayını (B196–B203), sonra veri: tam kod/veri ayrımı ya da yeni serbest kaynakla amino asit boşlukları.

## B204 · 2026-11-19 · CI yeşil: 47aecca'daki kırmızıların nedeni ve düzeltme
- Neden (yerel tam koşu 42: 361 geçti / 7 düştü; CI aynı testler): (1) B198 parça parça liste, ana sayfada tüm grupları bekleyen B152 testini kırdı → test listeyi sonuna dek açıyor (yarışa dayanıklı, `expect.poll`); (2) Kıyasla grafiği 28 px yazı + %200 ölçekte 320 ve 768 px'te yana taşıyordu (grid min-content) → GERÇEK HATA, CSS düzeltildi (`minmax(0, …)`, etiket sütunu en çok %38); (3) telefonda Günlük mikro özeti kapalı gelince Günlük'te kapatılan özetin Tarif'e taşınması kopmuştu → GERÇEK HATA, paylaşım geri getirildi, test özeti kullanıcı gibi açıyor.
- Kanıt: ilgili testler 40/40; tam koşu 43: 368 geçti / 5 düştü (yenileme varsayımı, B205), 44: 371 / 2 (B185, B207), 45: 375/375.

## B205 · 2026-11-19 · Hash yönlendirmesi, Geri/İleri, besin bağlantısı
- `src/route.js`: `#/food/<id>[/<biçim>]`, `#/usda/<ndb>`, `#/recipes`, `#/diary`, `#/compare`, `#/about`, `#/settings`, `#/`. Her çizimden sonra adres durumu izler (aynıysa dokunmaz; ilk açılış `replaceState`, sonrası `pushState`); `popstate` durumu geri yükler. Bilinmeyen bağlantı Keşfet'e düşer; kendi besinler (cihaza özel) bağlantı almaz. file://, tek dosya ve paketli uygulamada da çalışır (yalnız hash). Android'de donanım Geri tuşu da artık sekmeler/besin arasında geri gider.
- Detayda "🔗 Bağlantı" (yalnız http(s)): bağlantıyı kopyalar; pano yoksa seçilebilir kutuda gösterir.
- Davranış değişikliği: sayfa yenilenince açık sekme/besin korunur (önceden hep Keşfet). Bu varsayıma dayanan 4 test ana adrese gidecek biçimde güncellendi; kalıcılık yine sınanıyor.
- Kanıt: `tests/route.test.mjs` (gidiş-dönüş, bozuk kodlama, bilinmeyen kimlik); Playwright B205 (besin → Kıyasla → Geri → Geri → İleri, `#/food/nohut/1` doğrudan açılış Haşlanmış seçili, `#/settings`, bilinmeyen kimlik).

## B206 · 2026-11-19 · Klavye ve dokunma
- `/` aramaya odaklanır (başka sekmedeysen Keşfet'e geçer); arama kutusunda ↓ ilk sonuca, sonuçlarda ↑/↓ gezinir (ilk sonuçta ↑ aramaya döner); Enter açar (düğme); Esc aramayı temizler, detaydaysa detayı kapatıp odağı listede o besine verir. Yazı alanında ve diyaloglarda kısayollar devre dışı.
- Dokunmatik ekranda (`pointer: coarse`) `--tap` 44 px (yoğunluk "sıkı"/"geniş" seçimi korunur).
- "Son bakılanlar" zaten Keşfet'te arama boşken görünüyordu (B061); ayrı çip eklenmedi.
- Kanıt: Playwright B206 klavye akışı; telefon projesinde `--tap` 44 px, 320 ve 375 px'te yatay taşma yok (liste + detay).

## B207 · 2026-11-19 · Ferah açılış: tek satırlık kategori şeridi
- Keşfet açılışında kategoriler tek satır, yatay kaydırılır, sağ kenarı yumuşak solar; baştaki "Tüm kategoriler ▾" çipi satırlara açar ("Daha az" ile kapanır). Çip şeridin başında: yapışık sağ düğme denendi, son kategorinin üstüne biniyordu (büyük yazı + %200'de tıklanamıyordu) → bırakıldı. Seçili kategori şeritte görünür alana kaydırılır (yalnız şerit). "Kategori ızgarası" tercihi aynen çalışır.
- Karşılama alanı masaüstünde sıkılaştı (tabak 280 → 210 px, boşluklar).
- Kanıt (1440×900): ilk besin kartının üstü 963 → 753 px (artık ilk ekranda); kategori alanı 4 satır → 1 satır. B153 satır testi yeni davranışa çevrildi (B207: tek satır, açınca taşmasız satırlar); %200/28 px reflow testleri geçti.

## B208 · 2026-11-19 · Detay görünümünde tek kaydırma, kart özeti
- Masaüstü detay görünümünde kategori sütunu artık sayfayla akar (kendi kaydırması yok); liste sütunu kendi içinde kayar, çubuğu yalnız üzerine gelince/odakta görünür. Ölçüm: kaydırılabilir alan 2 → 1 (+ sayfa).
- Diyet seçicisi: `min-width: 0`, metin kırpılırsa üç nokta; genişlik sınırı korunur.
- Kart özeti: ölçümü olmayan 38 besin (ör. beluga mercimeği, siyez bulguru, sumak) artık boş kalmıyor, "ölçüm yok" yazıyor (0 değil). Çok biçimli besinde özet ilk ölçümlü biçimden.
- Kanıt: 1440 px ve iPhone SE ekran görüntüleri (öncesi/sonrası) incelendi.

## B209 · 2026-11-19 · Tembel yükleme değerlendirmesi, i18n
- Fontlar zaten tembel: `?url` + `FontFace` ile yalnız seçili font indirilir (web derlemesinde 9 font ayrı dosya; tek dosyada çevrimdışı için gömülü). Değişiklik gerekmedi.
- Lisans metinlerini (54 KB) tembel yükleme denendi ve GERİ ALINDI: ilk açılıştan hemen sonra çevrimdışı kalınca Bilgi sayfası açılmıyordu (test yakaladı). Çevrimdışı-önce ilkesi küçük kazançtan önemli. Diğer ikincil görünümler toplam ~30 KB; ana paketin 2,6 MB'ı veri (foods.json). Kod bölme bu yüzden anlamlı kazanç getirmez; geniş katalog (8,2 MB) zaten ayrı ve tembel.
- Ayarlar'da "Language / Language" tekrarı → dile göre "Dil / Language" ya da "Language / Dil" (aria etiketleri dahil).
- Ayarlar'ı daraltılabilir gruplara bölmek ertelendi: mevcut bölüm şeridi + arama var; çok sayıda test ayar denetimlerine doğrudan erişiyor, ayrı Forge.

## B210 · 2026-11-19 · Dünya mutfağı: 39 yemek (USDA FNDDS 2021-2023, CC0)
- `scripts/extract-fndds.py` (yeni, tekrar üretilebilir): resmî zip SHA-256 doğrulanır, istenen kodlar alt kümeye eklenir (41 → 80 kayıt).
- Asya: sebze/mercimek körisi, dal (ghee'li), samosa, sebzeli ve kuzu etli biryani, pad thai, lo mein, egg roll, vejetaryen ramen, etsiz pho, miso çorbası, bibimbap, somonlu ve California suşi, sebze tempura, congee. Latin Amerika: Meksika fasulye ezmesi, siyah fasulye + pirinç, fasulyeli taco, burrito kâsesi, tamale, pupusa, empanada, guacamole, mole, pozole, vejetaryen chili. Avrupa/Slav/Akdeniz: borş, pierogi, gnocchi, etli lahana sarması, gazpacho, minestrone, ratatouille, paella. Afrika: fufu, injera.
- Her yemekte USDA tarif malzemeleri notta. Hayvansal girdi (yumurta, balık sosu, ghee, peynir, et, bal) içerenler `animal: true` + alerjen. Malzeme kontrolünde "egg" araması "eggplant"i yakaladı; ratatouille elle doğrulandı (bitkisel).
- Arama eş anlamlıları: sushi, maki, borş/barszcz, varenik, frijoles refritos, nyoki, dal/dhal, golubtsy, enjera, tay eriştesi, avokado ezmesi. "Meksika fasulyesi" zaten kırmızı fasulyeyi buluyordu.

## B211 · 2026-11-19 · Anadolu mutfağı + vegan filtresinde tarifler
- 8 ev tarifi hesabı (tahmin, "Tahmin (tarif)" etiketi, malzeme oranları notta): kuru fasulye pilaki, türlü, muhammara, zeytinyağlı biber dolması, nohut yemeği, zeytinyağlı bamya, içli köfte (etsiz, cevizli) ve içli köfte (etli). Kızartmada %8 yağ emilimi ve %15 su kaybı varsayımı notta.
- Vegan filtresi: daha önce TÜM karışık yemekler "bilinmiyor" sayıldığı için kısır, piyaz, fava, çiğ köfte vb. vegan filtresinde görünmüyordu. Artık tarif malzemelerinin hepsi bitkisel USDA kaydıysa (SR28 besin grubu + açıklama süzgeci: hayvansal yağ, yumurta, süt, bal, jelatin elenir; unlu mamuller kabul edilmez) bitkisel sayılır. FNDDS'den yalnız girdi listesi tek tek incelenen 9 yemek bitkisel (guacamole, ratatouille, gazpacho, congee, vejetaryen chili, pho, ramen, minestrone, borş); hazır/restoran bileşenli olanlar (tamale, lo mein, miso çorbası, mole…) bilinmiyor kalır. Sonuç: 27 yemek vegan filtresinde.
- Katalog 785 besin / 936 biçim (B203'te 738 / 889).
- Kanıt: `npm run data`; `npm test` 179/179 (B210/B211 veri testi: FNDDS etiketi, hayvansal işaret, diyet sınıfı, tarif etiketi); Playwright world-foods (sushi, içli köfte, vegan filtresi etsizi gösterir etliyi gizler, "meksika fasulyesi"). Playwright tam koşu 45 (B204–B211 birlikte): 375/375.
- Paket (öncesi 47aecca → sonrası): ana JS 2.575.196 → 2.695.865 bayt (+121 KB = 47 yeni besin verisi; gzip 508 KB), CSS 73,7 → 76,2 KB, tek dosya 12,56 → 12,68 MB, hafif tek dosya ~4,2 MB. Kod tarafı kazanımlar boyut değil çalışma zamanı: ana sayfa DOM 8682 → ~1100, miktar değişiminde yalnız yama.
- Sonraki: **B212**.

## B212 · 2026-11-19 · Ayarlar dört grupta; çapraz tarayıcı kırığı
- Ayarlar'ın üstündeki 16 bölüm düğmesi dört grupta: Genel, Görünüm ve yazı, Erişilebilirlik, Veri ve matriks (başlık metniyle eşlenir, dil bağımsız; eşleşmeyen "Diğer"e). Masaüstünde solda grup adı, sağda düğmeler; telefonda grup adı üstte, düğmeler yana kayar. Kartlar ve denetimler değişmedi.
- CI'daki "Tarayıcı uyumu" işi (Firefox, WebKit, iPhone, iPad; yerelde yalnız Chromium var) 47aecca'da 15 kırmızı veriyordu: B152 / Kıyasla taşması / mikro özet (B204'te düzeltildi) + B169 ve B186 Aion testleri iPhone/iPad'de `mouse.wheel` kullanıyordu (mobil WebKit desteklemiyor; uygulama hatası değil). Testler `window.scrollBy` ile kaydırıyor; aynı kaydırma olayı.
- Kanıt: Playwright B212 (4 grup, her kartın düğmesi, Yedekleme düğmesi kartın başlığına odaklar, taşma yok); B169/B186 Chromium'da geçti; çapraz tarayıcı sonucu CI'da.

## B213 · 2026-11-19 · Dünya mutfağı ikinci tur (14 yemek, USDA FNDDS)
- Güney Hint: sambar, dosa, masala dosa, idli, papad, paratha, pakora, palak paneer. Doğu Avrupa/Yahudi: latke, knish. Latin: chilaquiles, yuca kızartması. Amerika: grits. Avrupa: kuru bezelye çorbası. Girdi listesi incelenen 8'i bitkisel (vegan filtresinde); papad/paratha (hazır ürün) bilinmiyor; palak paneer, chilaquiles, knish, latke hayvansal.
- Eş anlamlılar: vegemite/marmite (maya özü ezmesi zaten katalogda), draniki, mısır lapası.
- Ölçümsüz 38 besin için kaynak taraması: CoFID kuru ananas tazeden hesaplanmış, bitki çayları ve tarçın tür belirtmiyor, kuru maya besin mayası değil, FNDDS kuru ananas taze + şeker hesabı. Kural gereği (başka gıdayla doldurulmaz, tazeden kurutulmuş türetilmez) hiçbiri eklenmedi; "ölçüm yok" kalır.
- Katalog 799 besin. Kanıt: `npm test` 179/179; Playwright tam koşu 46: 377/377.

## B214 · 2026-11-19 · styles.css modüllere bölündü (piksel farksız), app.js'ten ilk saf modül
- `src/styles.css` artık yalnız sıralı `@import` dizini; içerik 10 dosyada (`src/styles/`): tokens, base, explore, matrix, views, responsive, forms-print, aion-collections, components, forge-fixes. Bölme yalnız sütun 0'daki bölüm başlıklarında (üst düzey blok sınırı); sıra korunur.
- Kanıt: kaynak birleştirildiğinde özgün dosyayla aynı (boş satırlar hariç); derlenmiş CSS bayt bayt aynı (`cmp`, aynı içerik özeti `style-CvvuriXA.css`, 76.718 bayt) → piksel farkı yok.
- `src/settings-toc.js`: Ayarlar içindekiler (saf işlev) app.js'ten ayrıldı; birim testi. app.js 1.790 satır.
- app.js'in geri kalanı (liste, detay, tarif, kıyas, günlük) tek bir paylaşılan durum nesnesi `S` ve `render()` ile sıkı bağlı; davranışsız bölmek için önce durum modülü (`state.js`) gerekir. Ayrı Forge olarak planlandı.
- Kanıt: `npm test` 181/181 (styles dizini, settings-toc); Playwright tam koşu 47: 377/377.
- Sonraki: **B215**.
- Yayın kanıtı (B196–B211): v1.1.2-beta.57 pre-release 2026-11-19T17:03:54Z (release.yml run 44567233736 success, ilk denemede; kaynak 9991dc6; 23 dosya, yeni `…-offline-lite.html` 4,5 MB). CI 251 (9991dc6): Chromium işi yeşil; tarayıcı uyumu 744 geçti / 4 düştü, dördü de B212'de düzeltilen `mouse.wheel` Aion testleri (iPhone/iPad); yeni B205–B211 testleri Firefox/WebKit/iPhone/iPad'de geçti.

## B215 · 2026-11-19 · Paylaşılan durum src/state.js'te
- `S` (uygulama durumu) ve açılış yükleme sırası (ayarlar → kişisel → kendi besinler → ayar göçleri → dil → ilk tarif) `src/state.js`'e taşındı; app.js `S`'i içe aktarır. ESM değerlendirme sırası korunsun diye `state.js` app.js'in son içe aktarımı (eski düzende de durum, tüm modüller değerlendirildikten sonra kuruluyordu). `lastSavedPersonal` app.js'te kaldı (yalnız kayıt akışı kullanıyor). Görünüm modülleri artık `S`'e app.js'e dairesel bağımlılık olmadan erişebilir; sonraki adım görünümleri tek tek ayırmak.
- Kanıt: `npm test` 181/181; build + build:single; Playwright tam koşu 48: 377/377 (davranış değişmedi).

## B216 · 2026-11-19 · Balkan, Slav, Orta Asya, yerli Amerikan tarifleri
- 7 ev tarifi hesabı (tahmin): ajvar, pasulj (etsiz), vinegret, plov (kuzu etli, hayvansal), succotash ("üç kız kardeş": mısır + lima fasulyesi + bal kabağı), frybread (kızartma varsayımı notta), şopska salatası (beyaz peynirli, hayvansal).
- Diyet sınıfı: kabartma tozu/karbonat (SR28 1800 grubu, mineral) bitkisel sayılır; frybread vegan filtresine girdi. Kaşa zaten karabuğday "kavrulmuş, pişmiş" biçimi; eş anlamlı eklendi (kaşa, kasha, grechka). Diğer eş anlamlılar: ayvar, shopska, palov/osh/özbek pilavı.
- Katalog 806 besin. Kanıt: `npm run data`; `npm test` 182/182 (B216 veri testi).
- Sürüm 1.1.2-beta.58 (B212–B216).
- Kanıt (B215 + B216 + sürüm): build + build:single; Playwright tam koşu 49: 377/377. CI 252 (d9a05da): Chromium + Firefox/WebKit/iPhone/iPad işleri ikisi de yeşil (Öncelik 0 kapandı).
- Sonraki: **B217** görünümleri app.js'ten tek tek ayırma (önce Kıyasla: renderCompare + compareResults → src/views/compare.js), ardından yeni yemek turu.

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

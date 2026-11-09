# Yol haritası: Besin Matriksi

Durum etiketleri: PLANNED · IN_PROGRESS · DONE (yalnızca test kanıtıyla). Sıra = öneri sırası; her satır bir Forge.

## Özelleştirme (Kaan'ın öne çıkardığı alan)

| ID | Forge | Neden | Durum |
|---|---|---|---|
| B001 | Ayar şeması sürümü (`bm.settings.v2` + göç), yalnızca ayarları dışa/içe aktar, bölüm bazında "varsayılana dön" | Yeni ayarların eski kayıtları bozmaması; cihazlar arası taşıma | DONE (RUNTIME_TESTED) |
| B002 | Matriks bölümlerini göster/gizle ve sürükle-bırak ya da ↑↓ ile **sırala**; "sabitlenen besin öğeleri" (ör. B12, demir, ω-3) en üstte | Herkes farklı şeye bakar | DONE (RUNTIME_TESTED) |
| B003a | Referans profili: AB BRD (varsayılan) / kullanıcının kendi hedefleri (g, mg, µg) | Kişisel hedef ≠ etiket referansı; kaynağı ve yılı kartta | DONE (RUNTIME_TESTED) |
| B004 | Birim tercihleri: kcal/kJ/ikisi, g/oz, µg↔mg otomatik ölçek kapalı/açık, ondalık ayracı virgül/nokta | Okunabilirlik | DONE (RUNTIME_TESTED) |
| B005 | Özel tema oluşturucu (arka plan, yazı, vurgu, kart renkleri) + WCAG kontrast denetimi ve uyarısı; temayı paylaşılabilir kod olarak dışa aktar | 9 hazır tema yetmeyebilir | DONE (RUNTIME_TESTED) |
| B006 | Klavye kısayolları ekranı ve yeniden atama; odak halkası kalınlığı; imleç büyüklüğü | Fare + klavye kullanımı | DONE (RUNTIME_TESTED) |
| B007 | Birden çok ayar profili (ör. "Okuma", "Sunum", "Gece") ve hızlı geçiş | Bağlama göre görünüm | DONE (RUNTIME_TESTED) |

## Kullanılabilirlik ve çıktı

| ID | Forge | Durum |
|---|---|---|
| B010a | CSV ve Türkçe glifli/sayfa numaralı PDF çıktısı | DONE (RUNTIME_TESTED; 100 g muz PDF 24 sayfa) |
| B010b | A4 tablo düzeni ve yazdırma durumunu geri yükleme | DONE (RUNTIME_TESTED; aynı USDA verisiyle 15 → 7 sayfa) |
| B011 | Arama: Türkçe karakter katlama (ı/i, ş/s), eş anlamlılar, son arananlar | DONE (RUNTIME_TESTED) |
| B012 | Tarif: porsiyon başı maliyet (kullanıcı fiyatı girer, TL/kg), etiket tarzı özet kart | DONE (RUNTIME_TESTED) |
| B014 | Tarif/yedek doğrulama, özel besin kimlik çakışması ve eksik malzeme kapsamı | DONE (RUNTIME_TESTED) |
| B013 | Erişilebilirlik denetimi (axe/Playwright duman testi), ekran okuyucu etiketleri | DONE (RUNTIME_TESTED) |

## Veri

| ID | Forge | Durum |
|---|---|---|
| B020a | Tek besin kaynak etiketlerinde veri seti/yıl/kayıt no; kapsam özetinde kısmi malzemeyi ayır | DONE (UNIT_TESTED + BUILT) |
| B020b | Tarif toplamındaki her değerin katkı veren malzeme/kaynak dökümü | DONE (PACKAGED; son kaynak 8e0b317, 43 birim / 28 tarayıcı testi PASS) |
| B021 | Türkiye'ye özgü besinler (TürKomp erişimi ve lisansı araştırılıp kaydedilmeden veri eklenmez) | BLOCKED_SOURCE_VERIFICATION (docs/DATA_RESEARCH.md) |

## Dağıtım

| ID | Forge | Durum |
|---|---|---|
| B030 | Tüm platform paketleri ve README dosya adları | DONE (PACKAGED; run 42586943869, kaynak 8864a29) |
| B031 | Fiziksel Windows/macOS/Linux/Android/iPhone kurulum ve yerel çalışma kabulü | NOT_RUN (cihaz/OS erişimi gerekir) |

## Devam sırası (2026-11-09)

1. **B031**: uygun ortamda native kurulum/çalışma kabulünü dene; mevcut Linux ortamında WebKitGTK 4.1 ve Xvfb yok, yalnız derlenmiş paket test edilmiş sayılmaz. Diğer fiziksel OS/cihaz kabulü hâlâ NOT_RUN.
2. B021: resmî erişim/lisans teyidi, kayıtlı retry_not_before sonrasında tekrar araştırılır; aynı engel günlükten sık tekrarlanmaz.
3. UX-TASKS: görev/saat ekranının kapsamı için kullanıcının yanıtı beklenir; bu istek tamamlandı sayılmaz.

B003b **DONE (PACKAGED)**: 1–99 yaş çocuk/yetişkin,
23 karşılaştırılabilir bileşende 169 PRI/AI kaydı; kapsam/izin/birim istisnaları
DATA_RESEARCH.md'de. Kaynak doğrulama + 49 birim testi, üretim PWA/tek HTML
ve hedefli telefon/masaüstü EFSA tarayıcı kapıları PASS. Son GitHub tam kapısı
30/30 PASS; run 42606995870 altı artifact grubunda kaynak `baaca2b` ile eşleşti. Kalıcı durum kod/paket SHA'larını ayırır.
Kapsam dışı bilimsel tabloları ekleyerek bitişi sürekli öteleme.

## 1.1.1 yayın ve izin düzeltmesi

- B040: **DONE**. IFCT ürün izni asıl NIN metninden kontrol edildi; izin doğrulanmadığı için IFCT CSV/değer/tahmin dağıtımı kaldırıldı. USDA tam bileşen tablosu eklendi, izomer/birim dönüşümleri test edildi. 13 lisans/kaynak metni uygulamaya gömülür.
- B030-release: **CLOSED_USER_SCOPE**. Son talimat yeni herkese açık Release yayınını yasakladı; etiket çalışması 42591741380 iptal edildi. Yeni yayın veya etiket taşıma yok.
- B040b: **DONE (PACKAGED)**. 35 crate/sürüm için özgün kaynak lisansları URL/özet ile saklandı; üç masaüstü kapısında 404 paket / 0 eksik dosya. Run 42593575878, kaynak `a93e8a5903183f560adf0a1c8403dead5740c194`; 38 birim ve 24 tarayıcı testi, altı artifact grubu PASS. Kanıt: `docs/evidence/1.1.1-packages.json`. B020b daha sonra kapandı.
- GitHub Pages etkinleştirme: HTTP 403, entegrasyon yetkisi yok. PWA arşivi ve imzasız IPA sağlanır; Safari için yayımlanmış PWA adresi olduğu iddia edilmez.
- NIN yazılı izin kanıtı olmadan IFCT verileri ve bu veriye dayanan tahminler tekrar eklenmez. Eski Git geçmişi bu turda yeniden yazılmadı.

## Yeni kullanıcı isteği · 9 Kasım 2026

- B005b: **DONE (PACKAGED)**. Ayrıntılı renk seçim penceresi, hazır renkler/HEX ve kart/ikincil yazı/kenarlık renkleri; eski tema dosyaları korunacak.
- Sürüklenen “görev” ve saat alanının Besin Matriksi bölümleri/tarifleri mi ayrı plan ekranı mı olduğu soruldu; yanıt gelmeden bir görev modeli uydurulmaz.

B020b/B005b son kapıları: workflow_dispatch run 42596270782; kaynak `8e0b3178bc41864338a3fdf91afb6cf49e5497be`, altı artifact grubu ve üç masaüstünde 404 Cargo / 0 eksik metin. Test/paket/runtime ayrımı `docs/evidence/B005b-packages.json`. B003b aşağıdaki yeni kapıyla kapandı; UX-TASKS açıklama bekliyor ve tamamlandı sayılmaz.

B003b son kanıtı: `docs/evidence/B003b-packages.json`; 49 birim / 30 tarayıcı testi ve altı paket grubu PASS. Fiziksel/native çalışma zamanı NOT_RUN. Sonraki tek Forge **B031**.

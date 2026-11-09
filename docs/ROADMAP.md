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
| B020b | Tarif toplamındaki her değerin katkı veren malzeme/kaynak dökümü | PLANNED |
| B021 | Türkiye'ye özgü besinler (TürKomp erişimi ve lisansı araştırılıp kaydedilmeden veri eklenmez) | BLOCKED_SOURCE_VERIFICATION (docs/DATA_RESEARCH.md) |

## Dağıtım

| ID | Forge | Durum |
|---|---|---|
| B030 | Tüm platform paketleri ve README dosya adları | DONE (PACKAGED; run 42586943869, kaynak 8864a29) |
| B031 | Fiziksel Windows/macOS/Linux/Android/iPhone kurulum ve yerel çalışma kabulü | NOT_RUN (cihaz/OS erişimi gerekir) |

## Devam sırası (2026-11-09)

1. **B020b**: toplamların kaynağını malzeme başına izlenebilir yap.
2. B003b: EFSA yaş/cinsiyet grup referansları; kaynak/sürüm/AI/PRI ayrımıyla doğrula. B003a'nın elle girilen hedeflerinin üstüne yazma.
3. B021: resmî erişim ve lisans teyidi sağlanınca ilerle; aynı engeli günlükten sık tekrar etme.
4. B031: gerçek cihaz/OS ortamı varsa paketleri smoke test et; derlenmiş olmak cihazda test edilmiş olmak değildir.

B003b henüz PLANNED. Kalıcı durum dosyası, son test ve paket SHA'larını ayırır. Yeni kapsam ekleyerek bitişi sürekli öteleme; bu listedeki uygulanabilir maddeleri doğrulayıp kapanış kaydı bırak.

## 1.1.1 yayın ve izin düzeltmesi

- B040: **DONE**. IFCT ürün izni asıl NIN metninden kontrol edildi; izin doğrulanmadığı için IFCT CSV/değer/tahmin dağıtımı kaldırıldı. USDA tam bileşen tablosu eklendi, izomer/birim dönüşümleri test edildi. 13 lisans/kaynak metni uygulamaya gömülür.
- B030-release: **IN_PROGRESS**. Kullanıcı Releases üzerinden platform dosyalarını indirmeyi açıkça istedi. `v1.1.1` yayın kapısı tüm web/tarayıcı/platform işleridir. Sürüm yayımlanmadan tamamlandı denmez.
- GitHub Pages etkinleştirme: HTTP 403, entegrasyon yetkisi yok. PWA arşivi ve imzasız IPA sağlanır; Safari için yayımlanmış PWA adresi olduğu iddia edilmez.
- NIN yazılı izin kanıtı olmadan IFCT verileri ve bu veriye dayanan tahminler tekrar eklenmez. Eski Git geçmişi bu turda yeniden yazılmadı.

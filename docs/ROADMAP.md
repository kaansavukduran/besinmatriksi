# Yol haritası: Besin Matriksi

Durum etiketleri: PLANNED · IN_PROGRESS · DONE (yalnızca test kanıtıyla). Sıra = öneri sırası; her satır bir Forge.

## Özelleştirme (Kaan'ın öne çıkardığı alan)

| ID | Forge | Neden | Durum |
|---|---|---|---|
| B001 | Ayar şeması sürümü (`bm.settings.v2` + göç), yalnızca ayarları dışa/içe aktar, bölüm bazında "varsayılana dön" | Yeni ayarların eski kayıtları bozmaması; cihazlar arası taşıma | PLANNED |
| B002 | Matriks bölümlerini göster/gizle ve sürükle-bırak ya da ↑↓ ile **sırala**; "sabitlenen besin öğeleri" (ör. B12, demir, ω-3) en üstte | Herkes farklı şeye bakar | PLANNED |
| B003 | Referans profili seçimi: AB BRD (varsayılan) / yaş-cinsiyet grubu için EFSA DRV; %BRD yerine "%hedef" ile kullanıcının kendi hedefleri (g, mg, µg) | Kişisel hedef ≠ etiket referansı; kaynağı ve yılı kartta | PLANNED |
| B004 | Birim tercihleri: kcal/kJ/ikisi, g/oz, µg↔mg otomatik ölçek kapalı/açık, ondalık ayracı virgül/nokta | Okunabilirlik | PLANNED |
| B005 | Özel tema oluşturucu (arka plan, yazı, vurgu, kart renkleri) + WCAG kontrast denetimi ve uyarısı; temayı paylaşılabilir kod olarak dışa aktar | 9 hazır tema yetmeyebilir | PLANNED |
| B006 | Klavye kısayolları ekranı ve yeniden atama; odak halkası kalınlığı; imleç büyüklüğü | Fare + klavye kullanımı | PLANNED |
| B007 | Birden çok ayar profili (ör. "Okuma", "Sunum", "Gece") ve hızlı geçiş | Bağlama göre görünüm | PLANNED |

## Kullanılabilirlik ve çıktı

| ID | Forge | Durum |
|---|---|---|
| B010 | Matriksi yazdır / PDF (Türkçe glifli, sayfa numaralı) ve CSV dışa aktarma | PLANNED |
| B011 | Arama: Türkçe karakter katlama (ı/i, ş/s), eş anlamlılar, son arananlar | PLANNED |
| B012 | Tarif: porsiyon başı maliyet (kullanıcı fiyatı girer, TL/kg), etiket tarzı özet kart | PLANNED |
| B013 | Erişilebilirlik denetimi (axe/Playwright duman testi), ekran okuyucu etiketleri | PLANNED |

## Veri

| ID | Forge | Durum |
|---|---|---|
| B020 | Kaynak kartı: her değerin veri seti, sürüm, yıl, kayıt no; "kapsam özeti"nde COVERED/PENDING | PLANNED |
| B021 | Türkiye'ye özgü besinler (TürKomp erişimi ve lisansı araştırılıp kaydedilmeden veri eklenmez) | PLANNED |

## Dağıtım

| ID | Forge | Durum |
|---|---|---|
| B030 | Release iş akışının son sürümde tüm platform çıktılarını ürettiğini doğrula; README indirme tablosunu gerçek dosya adlarıyla eşle | PLANNED |

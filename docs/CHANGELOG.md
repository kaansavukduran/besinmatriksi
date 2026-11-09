# 1.1.1 · 9 Kasım 2026

- Windows/Linux/macOS/Android/imzasız iOS ve web paketleri Actions / Artifacts üzerinden; kurulum rehberi ve lisans dökümleri. Son talimat uyarınca yeni herkese açık Release yayımlanmadı. ZIP özetleri ve kaynak SHA kanıt kaydında.
- IFCT paketinin MIT etiketi ile NIN asıl yayın izni ayrıldı. Ürün izni doğrulanmadığı için IFCT CSV, değer ve tahminler dağıtımdan çıkarıldı.
- USDA tam ASCII tablosundan amino asit, yağ asidi, şeker, vitamin biçimi, sterol ve küçük bileşik değerleri eklendi. Jaggery açık kaynak boşluğuyla korunur.
- 13 lisans/kaynak metni gömülü ve ayrı dosya olarak sunulur; fontların OFL ve asıl telif metinleri korunur. Native Cargo dökümleri pakete eklenir.
- A4 çıktısı ekranın mobil kırılımlarını kullanmaz. Aynı USDA içeriği eski düzende 15, yeni düzende 7 sayfa. Yazdırma/iptal sonrası bölüm durumları korunur.
- Fiziksel cihaz testi, EFSA grup referansları, tarif kaynak dökümü ve TürKomp lisans teyidi açık kalır.

# 1.1.0 · 9 Kasım 2026

- Ayrı dalda kalan Forge çekirdeği güncel uygulamaya birleştirildi.
- Ayar v2 şeması, eski kayıt göçü, yalnız ayar yedeği ve bölüm sıfırlama.
- Matriks bölümlerini gizleme/sıralama ve 24 besin öğesine kadar sabitleme.
- 12 görünüm profili; hızlı geçiş, güncelleme, silme ve tam yedek.
- Dört renkli tema oluşturucu, WCAG kontrast ölçümü ve tema dosyası.
- AB/TGK etiket referansı veya elle girilen hedef; eksik hedefe BRD atanmaz.
- kcal/kJ, gram/ons gösterimi, birim yükseltme ve ondalık ayracı tercihleri.
- Atanabilir Alt+1…9 sekme kısayolları, odak kalınlığı ve büyük imleç.
- Türkçe eş anlamlılar, sekiz son arama ve geçmişi temizleme.
- TL/kg fiyat, toplam/porsiyon maliyeti ve kısmi fiyat/besin kapsamlı özet.
- Bozuk yedek doğrulama, özel besin kimlik çakışmalarını önleyen eşleme.
- Eksik malzeme ağırlığı korunur; kısmi besinlerden tam oran/skor üretilmez.
- Bilinmeyen etiket/geniş katalog alerjenleri 'bilgi yok' olarak gösterilir.
- Ön yükleme ile modül isteklerinin Vary: Origin farkı çevrimdışı açılışı bozmaz.
- Telefon taşmaları, düşük kontrastlı etiketler ve modal odak/Escape akışı düzeltildi.
- CSV regresyonları, sayfa numaralı Türkçe PDF örneği ve CI tarayıcı kapısı.

Kanıt: 29 birim/veri testi, GitHub CI 20/20 tarayıcı testi, altı platform artifact grubu.
Kod SHA: `8864a29a94e91b5f8093929f82d9c5ffb7d8bc42`.
CI: https://github.com/kaansavukduran/besinmatriksi/actions/runs/42586943816
Paketler: https://github.com/kaansavukduran/besinmatriksi/actions/runs/42586943869

Fiziksel cihaz kabulü, kompakt A4 çıktısı, tarif kaynak dökümü, EFSA grup tabloları
ve TürKomp lisans teyidi açık. Bu sürümün paketlenmesi bütün yol haritasının
bittiği anlamına gelmez. Ayrıntılar ROADMAP.md ve project_state/ içinde.

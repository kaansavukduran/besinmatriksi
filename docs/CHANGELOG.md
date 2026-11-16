# 1.1.2-beta.38 · 16 Kasım 2026

- B151: Meyveler içinde kuru meyveler; Sebzeler içinde yeşil yapraklılar ve kök/yumrular. Üst kategori seçimi bütün alt grupları, Tümü'ndeki gibi başlık ve besin ızgaralarıyla gösterir.
- Kahveler sekmesinin yerini İçecekler aldı. Kahve, çay, bitkisel çay, sıcak/soğuk içecek, meyve/sebze suyu ve bitkisel/sütlü içecekler burada gruplanır. Arama, sıralama, beslenme filtresi ve besin seçicisi aynı hiyerarşiyi kullanır.
- Adaçayı, ıhlamur, nane ve rooibos ayrı demleme kayıtları; türüne ait doğrulanmış ölçümü olmayan değerler başka bitkiden veya kuru baharattan kopyalanmaz.
- USDA kaynaklı sıcak çikolata karışımı, limonlu şekerli buzlu çay, şekersiz hazır yeşil çay ve konsantreden limonata. Toplam693 besin/839biçim; mevcut685 kaydın biçim sırası ve bütün ölçümleri korunur.
- SR28 kapsamı8.789/8.789; dört kaynak kaydı geniş listeden ana kataloğa taşındı (713ana/8.076geniş), yinelenen kaynak eklenmedi.

# 1.1.2-beta.37 · 16 Kasım 2026

- B150: kahve, Fast Food ve Atıştırmalıklar üst kategori sırasının sonuna taşındı; tanıtım içindeki yinelenen bağlantılar kaldırıldı. Fast Food adı sadeleştirildi.
- Kategorilerde ve tarif/karşılaştırma besin seçicisinde ortak, kaydedilen kompakt beslenme filtresi. Hepçil varsayılan; Vegan, Vejetaryen ve Pesketaryen seçenekleri.
- Vejetaryen menüsü altında bağımsız ovo/yumurta ve lakto/süt ürünü kutuları; ek içerik filtrelerinin üstünde yer alır. Glutensiz, laktozsuz, soya, sert kabuklu yemiş, yer fıstığı ve susam filtreleri birlikte seçilebilir.
- Yulaf, badem ve soya içeceğiyle 21 kahve tarifi tahmini; toplam 685 küratörlü besin / 831 tüketim biçimi. Tüm mevcut ölçümler ve kayıt kimlikleri korunur.
- Belirsiz içerik uygun kabul edilmez. Filtreyle gizlenen özel besin/koleksiyonlar boş veya silinmiş gibi gösterilmez; önceki kayıtlar değişmez. Dar ekranda büyük yazı ve yüzde 200 ölçek taşması giderildi.

# 1.1.2-beta.36 · 15 Kasım 2026

- B149: Super-Unslop, Unslop, Fragaria Unslop ve Yazılım Denetle ile genel inceleme. Kısmi amino asit ölçümünde CSV indirme hatası giderildi; alt sınır ve hesaplanamayan skor açıkça ayrılır.
- Depolama yazımı başarısız olduğunda özel besin, görünüm profili, günlük ve malzeme ekleme işlemleri artık başarı mesajı göstermez. Editör/seçici taslakları yeniden deneme için korunur; başarısız günlük/malzeme ekleme bellekte hayalet kayıt bırakmaz.
- Genel yedek içe aktarımında yazılan gruplar hata olursa geri alınır. Geri alma da başarısızsa açık kurtarma uyarısı verilir. Başarısız kişisel yedek kurtarması bozuk kaydın üzerine yazma korumasını kaldırmaz.
- Günlük toplamın sekme sayacı tüm malzemeleri sayar. Tarif kalori satırı adın altında kalır; ortak temel bölüm “Birleşik besin değerleri” olarak ayrılır.
- GitHub Pages canlı erişimi doğrulandı ve eski engel notu güncellendi. Besin ölçümleri, bilimsel referanslar ve kayıt kimlikleri değiştirilmedi.

# 1.1.2-beta.35 · 15 Kasım 2026

- B148: tarif listesinin sonunda otomatik Günlük Toplam Tarif. Üstte her tarif/öğün için ayrı8temel besin değeri; altta tüm malzemelerin ortak matrisi, mikro besinler, amino asit grafikleri ve kaynak dökümü.
- Tariflerin tamamı veya her tariften1porsiyon seçimi; seçim cihazda korunur. Tarif adları ve malzemeler değiştirilmez; özet kaydedilmiş tarif listesine eklenmez ve kendisini toplamaz.
- Malzeme değişimleri yeniden hesaplanır; CSV seçilen toplama aittir. Kaynak satırları katkının hangi tariften geldiğini de gösterir. Eksik veri ve kısmi kapsam korunur.

# 1.1.2-beta.34 · 15 Kasım 2026

- B147: bir malzemenin eksik amino asit ölçümü artık tarifte tüm protein kalitesi grafiğini gizlemiyor. Dokuz referans grubu her zaman görünür; tam veride skor/sınırlayıcı, kısmi veride≥alt sınır ve malzeme/bileşen dökümü.
- Kısmi amino asit oranlarında payda tüm tarifin bilinen toplam proteinidir; yalnız amino asidi ölçülen malzemelerin proteini kullanılmaz. Toplam protein eksikse kesin skor veya sınırlayıcı uydurulmaz, bilinen miktarlar ve neden gösterilir.
- Keşfet↔tek malzemeli tarif eşitliği; birleşen besinler, porsiyon/100g, miktar, silme ve yeniden açılış doğrulandı. Günlük ihtiyaç barları ve toplam protein korunur.

# 1.1.2-beta.33 · 15 Kasım 2026

- B146: dokuz esansiyel amino asit için WHO/FAO/UNU günlük ortalama ihtiyaç çubuğu. Kaydedilmiş yetişkin yaş/kilo profili veya açıkça etiketli70kg yetişkin örneği. Metiyonin/fenilalanin ortak hedefe kendi katkısı olarak etiketlenir; kısmi ölçümlerde≥. Toplam protein ve protein kalitesi hesabı değişmedi.
- Tam Katalog adı ve kategori listesinin sonunda erişim.
- USDA SR Legacy2018 resmî arşivinden315 eksik ölçüm/72kaynak kaydı;16ana katalog,299geniş katalog. Önceki değerler korunur; kaynak etiketiL.

# 1.1.2-beta.32 · 15 Kasım 2026

- B145: katalog kategori ayraçları emojisiz, daha büyük başlık ve üst/alt boşlukla ayrılır. Besin çizimleri korunur.
- Sırala satırındaki kontroller daha küçük yazı ve yatay boşlukla kompaktlaştı; dokunmatik hedefler ve büyük ölçek korunur.

# 1.1.2-beta.31 · 15 Kasım 2026

- B142: başlıklarda yerel/OFL Bricolage Grotesque, okunabilirlik fontu tercihinin önceliği, gereksiz hero/katalog yüzeylerinin kaldırılması ve daha ölçülü kontrol köşeleri.
- B143: USDA SR28 kaynak kapsamı 3.692→8.789/8.789 kayıt; geniş katalog 2.983→8.080. Kaynak yılı, karma içerik ve tanınan marka bilgisi açık; her grup ve kayıt aramayla/sayfalamayla erişilebilir. Katalog yükleme hatasında kayıtları koruyan geri dönüş.
- B144: tek besin, tarif ve günlükte 28 yaygın vitamin/mineral özeti; miktar/birim, kaynak, referans ve kısmi kapsam ayrımı. Tarif/günlük satırından katkı dökümü açılır. A vitamini RAE, RE referansına otomatik bölünmez.
- Dar ekranda büyük başlık ve miktar çıktısı, mikro bölümünün kapalı durumunu koruma ve bildirimin tıklamayı engellemesi düzeltildi.
- Unslop/Fragaria Unslop için tam kaynak güncelleme ZIP'leri ayrı teslim edildi; yüklü cloud skill sürümleri bu oturumdan değiştirilemedi.
- Web/PWA ve tek dosya çıktısı doğrulandı. Native paket/Release dağıtımı bu artışa dahil değil.

# 1.1.2-beta.30 · 15 Kasım 2026

- B141: sıcak krem/zeytin/kil renkleri, özgün tabak ve marka çizimi, tek besin kataloğu; yeni kurulum açık tema, mevcut tercihler korunur.
- Kahveler, Fast food ve pizza, Atıştırmalıklar: 37 yeni besin; toplam 664 kayıt. Americano/sütlü kahveler oranları gösterilen tarif tahmini; ristretto, lungo ve sade Türk kahvesi için doğrulanmamış değer üretilmez.
- Tarif ve karşılaştırma kartları dar ekran/yüksek ölçek için yeniden akar; büyük yazıda sekmeler, eylemler ve besin satırları birbirini örtmez.
- B140 kimlik göçü koleksiyon/son bakılanlara da uygulanır; eski favoriler kaybolmaz.
- GitHub Pages üretim dalına otomatik yayın ve alt yol/çevrimdışı PWA kabul testi; ilk Pages etkinleştirmesi depo yönetici ayarıdır.
- Web/PWA/tek dosya çıktısı bu çalışmada doğrulanır; yeni native paket/Release yayımlanmaz.

# 1.1.1 · 9 Kasım 2026

- B003b: EFSA grup PRI/AI referansları; 23 bileşen / 169 kaynak kaydı. Yaş/cinsiyet ve açık demir/çinko koşulları, görüş yılı/DOI, özgün birimler ve CSV dökümü; kişisel hedefler korunur. UL/AR/RI/SSI ve uyumsuz biçimlere yüzde atanmaz. EFSA yeniden kullanım/kaynak bildirimi çevrimdışı gömülür.

- B020b: tarifte seçilen bileşenin malzeme katkısı, veri boşluğu/sıfır ayrımı, USDA kayıt/etiket kaynağı ve hesap girdileri; porsiyon/100 g ile eşzamanlı.
- B005b: yedi ayrı tema rengi; hazır renkli seçim penceresi, sistem renk alanı, HEX, canlı önizleme, iptal/kaydet ve kontrast denetimi. Eski dört renkli v1 dosyası korunur; yeni v2 dosyası yedi rengi taşır.

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

# B146 · Kaynak incelemesi

15 Kasım2026; önceki sürümc2e29de9e7f62f203c624af2b3413d8d26ef6a00, beta.32.

## Günlük amino asit referansı

WHO/FAO/UNU2007, Technical Report Series935, Tablo23, basılısayfa150 (PDF163). Günlük ortalama yetişkin gereksinimi mg/kg/gün: histidin10, izolösin20, lösin39, lizin30, metiyonin+sistein15, fenilalanin+tirozin25, treonin15, triptofan4, valin26. Protein kalitesinde kullanılan mg/gprotein örüntüsünden ayrıdır. Ortalama referans, kişisel yeterlilik teşhisi veya RDA/güvenli alım düzeyi değildir. Sindirilebilirlik/emilim düzeltmesi yok.

Asıl kayıt https://iris.who.int/handle/10665/43411 ve WHO PDF uçları bu ortamda403 döndü. Birincil WHO raporunun şu aynasındaki tam metin ve Tablo23 okundu: https://lenews.ch/wp-content/uploads/2017/03/WHO_TRS_935_eng_Protein.pdf . Yayın kimliği resmî WHO kütüphane/PubMed18330140 kaydıyla karşılaştırıldı. PDF uygulamaya kopyalanmadı; yalnız olgusal sayılar ve atıf kullanılır.

Barın payı o satırın ölçülmüş miktarıdır. Metiyonin ve fenilalanin, bağımsız gereksinim uydurulmadan ortak hedefe yalnız o amino asidin katkısını gösterir. Örnek:80kg yetişkinde metiyonin250mg / ortak hedef1200mg. Sistein veya tirozin gizlice paya eklenmez. Bu açıklama hem satırda hem bölüm notunda görünür.

Kayıtlı profil yetişkin ve geçerli kiloluysa o kilo; yoksa açıkça belirtilen70kg yetişkin örneği. Çocuk veya specialContext profilinde yetişkin barları gösterilmez. Özel elle hedefler önceki sahibinde kalır. Mevcut toplam protein barı ve AA_REF/derive protein kalitesi hesabı değişmedi. Kısmi tarif/günlük toplamlarının yüzdesi≥; bilinmeyen ölçüm0değildir. Gösterge seçilen besin miktarını/tarif hesap tabanını gösterir, kendiliğinden tüketildi saymaz.

## Eksik ölçümler

Resmî güncel indirme listesi https://fdc.nal.usda.gov/download-datasets/ kontrol edildi. Foundation10/2026 zaten depoda entegre; bu turda yeniymiş gibi sayılmadı. SR Legacy04/2018 resmî CSV arşivi yeniden indirildi; SHA256b80817294b8850530aaedf2e515c02593b1824f763a0ff356e5c2081643e6fd0 önceki kayıtla aynı.

Arşiv içindeki sr_legacy_food.NDB_number→katalogNDB kimliği, food_nutrient.nutrient_id→nutrient.nutrient_nbr→data/usda-nutrients.mjs ve derivation_id→food_nutrient_derivation.source_id bağlantıları incelendi. Yalnız1/4/9/10 analitik köken kabul edildi. İsim benzerliğiyle eşleştirme yapılmadı; imputed/calculated/assumed-zero kayıtlar alınmadı. g→mg dönüşümleri ve gerçek ölçülmüş0korunur.

315yeni hücre,72kaynak kaydı: ana katalogda3form/16hücre; geniş katalogda69kayıt/299hücre. Beta.32 değerlerinin tamamı karşılaştırıldı:0eski hücre değişimi. Dokuz esansiyel amino asit ölçümü NDB01275 CHOBANI vanilyalı yağsız süzme yoğurtta tamamlandı (ör.his0,259g→259mg/100g). Eski marka kaydı güncel ürün etiketi sayılmaz. Diğer kazançlar betain, E/K alt türleri, yağ asitleri, şekerler ve bazı vitamin/mineraller. Tüm eksik verinin bulunduğu iddia edilmez.

Ham seçki ve kanıt: data/raw/USDA_SR_LEGACY_2018_B146_FILL.csv.gz; satır başına NDB, nutrient_key,birim,değer,FDC ve derivation_id. Kaynak ve CSVözeti data/raw/USDA_SR_LEGACY_B146_SOURCE.json. Var olan CC0/SRLegacy lisans bildirimi geçerli; yeni bağımlılık yok.

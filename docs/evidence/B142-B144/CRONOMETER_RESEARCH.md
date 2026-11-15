# Mikro besin ve kaynak kapsamı karşılaştırması

15 Kasım 2026; başlangıç `34aa20f`. Cronometer tasarım/kapsam davranışı incelendi; ürünün görsel tasarımı veya kapalı kataloğu kopyalanmadı.

Cronometer'ın [hedef özeti](https://support.cronometer.com/hc/en-us/articles/360018069532-Nutrient-Targets-Summary) ve [günlük raporu](https://support.cronometer.com/hc/en-us/articles/32689033683220-Mobile-Daily-Report), kategorili mikro listesi ve satırdan katkı veren besinlere ulaşma yaklaşımını destekliyor. Besin Matriksi'nde mevcut hesap ve kaynak sahipleri korunarak 28 yaygın mikro besin için aynı işi kolaylaştıran özgün bir görünüm yapıldı. AB BRD veya EFSA PRI/AI üst sınır/sağlık puanı sayılmadı.

Cronometer'ın [kaynak açıklaması](https://support.cronometer.com/hc/en-us/articles/360018239472-Data-Sources), genel/laboratuvar kaynakları ile marka etiketlerinin mikro kapsamının farklı olabildiğini açıklıyor. [Eksik bileşen açıklaması](https://support.cronometer.com/hc/en-us/articles/360000329986-Are-there-nutrients-missing-from-Cronometer) az bulunan ölçümlerin toplamı eksik bırakabildiğini belirtiyor. NCC veritabanı [lisanslanıyor](https://www.ncc.umn.edu/food-and-nutrient-database/); herkese açık bir tam Cronometer listesi elde edilmedi. Bu nedenle tüm Cronometer kayıtlarıyla eşitlik doğrulanamadı.

USDA [FDC kullanım/lisans açıklaması](https://fdc.nal.usda.gov/api-guide/) ve [veri indirmeleri](https://fdc.nal.usda.gov/download-datasets/) açık kaynak kapsamını büyütmek için esas alındı. Bu çalışmada zaten depoda bulunan SR28 kaynağındaki tüm kayıtlar erişilebilir yapıldı:

| Ölçüm | Önce | Sonra |
|---|---:|---:|
| Küratörlü besin | 664 | 664 |
| Küratörlü biçim | 810 | 810 |
| Geniş kaynak kataloğu | 2.983 | 8.080 |
| Erişilebilir benzersiz SR28 kaydı | 3.692 | 8.789 |
| Tam SR28 kaynağına göre kapsam | 3.692/8.789 | 8.789/8.789 |
| Kaynak grubu | 14 | 25 |

709 benzersiz SR28 kaydı küratörlü biçimlerde, kalan 8.080 kayıt geniş listede. Besin adı ile hazırlamaya özel kaynak kaydı farklı sayımlardır. Marka tanıma heuristiği tam marka tespit garantisi değildir. Bütün geniş kayıtlar 2015 kaynak arşivi olarak açıklanır. Hayvansal veya içeriği belirsiz kayıtlara veganlık/alerjensizlik garantisi verilmez.

Geniş katalogda değer bulunan kayıt sayıları: demir 2.978→7.936, B12 2.884→6.908, iyot 121→266, kolin 1.822→4.270. Bunlar birbirinden farklı gıdalar için kayıt sayılarıdır; kişisel alım veya her besinin tam mikro profili değildir.

Küratörlü biçimlerin veri boşlukları korunuyor: biyotin63/810, iyot111/810, molibden25/810; krom ve toplam K2 ölçümü yok. MK-4 ayrıca91 biçimde mevcut, toplam K2 ile eşitlenmedi. Ölçüm yokluğu sıfıra çevrilmedi.

A vitamini düzeltmesinin birincil kaynakları: [NIH ODS RAE açıklaması](https://ods.od.nih.gov/factsheets/vitamina-HealthProfessional/) ve [Finlandiya Gıda Otoritesi RE etiket açıklaması](https://www.ruokavirasto.fi/en/foodstuffs/food-sector/food-information/labelling/nutrition-labelling/vitamin-a-reporting/). RAE ve RE'nin karotenoid eşdeğerlikleri farklıdır. Otomatik EU referansı kaldırıldı; RAE miktarı ve kendi birimindeki elle girilmiş hedef korundu.

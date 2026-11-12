# Kaynak araştırması · 2026-11-09

## EFSA (B003b) · 9 Kasım 2026

Resmî DRV Finder İngilizce veri tablosu canlı okundu:
https://multimedia.efsa.europa.eu/drvs/assets/data/languages/en/data.json
Resmî açıklama: https://www.efsa.europa.eu/en/topics/topic/dietary-reference-values
Yeniden kullanım: https://www.efsa.europa.eu/en/legalnotice

EFSA kaynak gösterilmesi koşuluyla web sitesi içeriğinin yeniden kullanımına izin
veriyor; tekil belgelerin özel koşulları ayrıca geçerli olabilir. Bu Forge yalnız
resmî web JSON sayısal verisinin açıkça belirtilen bir alt kümesini dönüştürür;
jurnal PDF/şekil, logo veya üçüncü taraf fotoğrafı dağıtılmaz. Kaynak dosyası,
erişim anı, SHA-256 ve özgün bildirim `data/references/EFSA_SOURCE.json` ile
`EFSA_REUSE_NOTICE.txt` içinde; kod MIT etiketi bu materyali MIT yapmaz.

Tablo 578 kaynak satırından oluşuyor; sağlayıcı sürüm numarası sunmuyor.
Bu yüzden “en yeni 2017 sürümü” denmedi: 2026-11-09 tarihli SHA ile sabitlenmiş
DRV Finder görüntüsü kullanılır. Eski özet PDF de incelendi:
https://www.efsa.europa.eu/sites/default/files/assets/DRV_Summary_tables_jan_17.pdf
Dosya adı jan_17 olsa da içerik v4/Eylül 2017; sodyum/klorürü henüz devam eden
inceleme olarak gösteriyor. Bu arşiv, canlı Finder yerine üretim kaynağı sayılmadı.

Kapsam: mevcut matriks alanlarıyla biçim ve birimi eşleşen 23 bileşen, çocuk ve
yetişkin 1–99 yaş için 169 sayısal PRI/AI kaydı. Her kayıtta özgün satır no,
yaş aralığı/cinsiyet bayrağı, koşul, referans türü, özgün birim/değer, dönüşüm,
görüş yılı ve DOI tutulur. Florür mg → µg ×1000 olarak açıkça dönüştürülür.
Folat yalnız DFE alanına; E yalnız alfa-tokoferole; K yalnız K1'e bağlanır.
D2+D3 için AI'nin en düşük deri sentezi varsayımı görünür.

Yetişkin çinko için 300/600/900/1200 mg/gün fitat koşulu seçilmeden PRI yüzdesi
yok. Yetişkin kadın demirinde pre/postmenopoz yaştan çıkarılmaz; seçilen koşul
ve kaydın yaş sınırı birlikte uygulanır. Eşleşme yoksa veya birden çoksa yüzde
üretilmez; AB BRD'sine sessiz geri dönüş yapılmaz. PRI/AI türleri görünür ve
CSV'de tür, değer/birim, yıl, grup ve kaynak taşınır. Elle girilen hedefler korunur.

Kapsam dışı: bebeklik ve gebelik/emzirme; vücut ağırlığı/enerji tabanı gerektiren
protein/tiamin/niasin ve yağ/karbonhidrat RI değerleri; A vitamini RE→RAE,
L su→g su, tek bileşene EPA+DHA toplamı; SSI ve UL/AR; matrikste tanımı
olmayan iyot. Bunlar eksik veri yerine sıfır veya hedef olarak eklenmez.
Bu referanslar kişisel ihtiyaç/öneri, emilim veya sağlık kanıtı değildir.

Derleyici: `scripts/build-efsa.mjs`; `npm run data` çevrimdışı yeniden üretir.
Kaynak/bildirim özeti uyuşmazlığında kapı hata verir. Yeni bağımlılık eklenmedi.
TürKomp'un değişmemiş erişim engeline bu tur yeniden istek yapılmadı.

## TürKomp (B021)

Resmî adres: https://turkomp.gov.tr/
9 Kasım 2026 erişim denemesi zaman aşımıyla sonuçlandı. Arama, indirilebilir veri
seti için doğrulanabilir bir yeniden dağıtım lisansı sağlamadı. Bu sonuç sitenin
herkes için kapalı olduğunu veya verinin lisanssız olduğunu göstermez.

Durum: BLOCKED_SOURCE_VERIFICATION. Son deneme yalnız gün olarak kaydedildiği
için aynı değişmemiş engel en erken 11 Kasım 2026 00:00 UTC sonrasında yeniden
denenir; bu arada ilerletilebilir diğer Forge yapılır. TürKomp verisi içe aktarılmadı, USDA kaydı
Türkiye'ye özgü bir ürünmüş gibi yeniden adlandırılmadı. Sonraki adım resmî erişimi
ve çevrimdışı uygulamada yeniden dağıtım koşullarını doğrulamak; ardından hazırlama
biçimi ve 100 g yenebilir kısım temeli eşleşen kayıtları küratörlü eklemektir.

12 Kasım 2026 yeniden deneme: bu bulut ortamının ağ kuralı turkomp.gov.tr ve turkomp.tarimorman.gov.tr adreslerini reddetti (vekil CONNECT 403; sayfa okuma aracında izinli alan dışı). Site koşulları okunamadı; durum BLOCKED_ENVIRONMENT. Kullanıcı ortam ağ ayarlarında bu alanı açarsa ya da resmî koşul sayfasını sağlarsa yeniden doğrulanır. Veri içe aktarılmadı.

## Mevcut katalog

1.1.1 dağıtımı USDA SR28 tam bileşen tablosuyla yeniden üretildi. IFCT değerleri ve IFCT tabanlı tahminler NIN ürün izni doğrulanmadığı için çıkarıldı (docs/LICENSE_AUDIT.md). Kullanıcı etiket
kayıtları ayrı tutulur. Tooltiplerde veri seti/yıl ve mevcut kayıt kimliği gösterilir.
Tarifte eksik malzeme kaydı ağırlıktan silinmez; besin toplamı kısmi kapsam taşır.
Eksik girdilerden tam ölçüm izlenimi veren oran veya amino asit skoru üretilmez.

## B050 enerji modeli · 2026-11-09

Mifflin 1990 DOI 10.1093/ajcn/51.2.241 / PMID 2305711 katsayıları ve çalışma yaşları 19–78, Europe PMC resmî API yanıtıyla doğrulandı. PubMed doğrudan isteği özet yerine ara sayfa verdi; aynı engel yeniden denenmedi. API URL/erişim anı/yanıt SHA ve katsayılar `data/references/ENERGY_MODEL_SOURCE.json` içinde. Makale/özet kopyası dağıtılmaz; yalnız bibliyografik olgular ve denklem kullanılır. PAL 1.4/1.6/1.8/2.0 EFSA enerji açıklamasıyla kaynaklanır (2013, DOI 10.2903/j.efsa.2013.3005). Sonuç bireysel ölçülmüş ihtiyaç değildir. Cihaz dinlenme enerjisi girdisi ayrı kullanıcı tahmini olarak tutulur; yağ yüzdesi bu denkleme sokulmaz. Yeni gıda ölçümü veya IFCT tabanlı tahmin eklenmedi. TürKomp bekleme sınırı değişmedi.

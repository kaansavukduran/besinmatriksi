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

## B254 eksik veri envanteri ve kaynaklı doldurma · 2026-11-22

### Doğrulanıp eklenen kayıtlar
- **Siyah pirinç (`siyah_pirinc`, kuru):** `USDA FoodData Central Foundation Foods` (2026-10-29, CC0, yerel `data/raw/USDA_FDC_FOUNDATION_2026-10-29.min.json.gz`), `FDC 2710825` (`ffNdb: 100349`, `Rice, black, unenriched, raw`): 23 analitik/hesaplı bileşen (enerji 370 kcal Atwater genel, protein 7,57 g, yağ 3,44 g, karbonhidrat 77,2 g, nişasta 71,4 g, lif 4,18 g, biyotin 4,88 µg, mineraller ve B vitaminleri). Tamamen verisiz form sayısı **37 → 36** oldu.
- **UK CoFID 2021 (Open Government Licence v3.0, `data/raw/CoFID_2021_SUBSET.json.gz`) 4. tur — 13 eşleme, 18 yeni hücre** (yalnız USDA'da boş olan biyotin ve iyot; aynı ad + hazırlama biçimi + su ±5 g + protein ±%25 veya ±1 g kapısıyla doğrulandı; `'Tr'` ve `'N'` hücreleri dışlandı):
  - `elma:cig` (`14-319`, biotin 1,1 µg), `domates:cig` (`13-517`, biotin 1,4 µg), `patates:cig` (`13-489`, iodine 1 µg, biotin 0,3 µg), `patates:haslanmis` (`13-490`, iodine 1 µg, biotin 0,3 µg), `sogan:cig` (`13-499`, biotin 1 µg), `kivi:cig` (`14-371`, iodine 2 µg), `kiraz:cig` (`14-382`, biotin 0,42 µg), `uzum:cig` (`14-350`, biotin 0,2 µg), `greyfurt:cig` (`14-384`, biotin 0,68 µg), `patlican:cig` (`13-161`, iodine 1 µg), `kabak:cig` (`13-627`, iodine 5 µg, biotin 3,1 µg), `yulaf:kuru` (`11-788`, biotin 19 µg), `hurma:kurutulmus` (`14-394`, iodine 17 µg, biotin 1,5 µg).

### Yeniden denetlenen dış kaynak erişimi (2026-11-22)
- **TürKomp (`https://turkomp.gov.tr/`):** 8 sn zaman aşımı (HTTP 000, erişim engelli / yanıt yok). Lisans ve yeniden dağıtım koşulları doğrulanamadığı için veri aktarılmadı.
- **USDA FDC canlı API (`DEMO_KEY`):** HTTP 429 hız sınırı; çevrimdışı doğrulanmış tam yerel arşivler (`SR28`, `Foundation 2026-10-29`, `FNDDS 2021-2023`, `CoFID 2021`) kullanıldı.
- **IFCT 2017 & Monash FODMAP:** Lisans engelli; dağıtıma eklenmedi.

### Açık kalan 36 verisiz formun durumu (sessiz aktarım yapılmadı)
- **Tür/çeşit veya işleme farkı nedeniyle mevcut yerel açık kaynaklarda tam eşleşmesi bulunmayanlar (26):** `siyez_bulguru` (FDC'de yalnız çiğ tam siyez buğdayı `2710827` var, bulgura aktarılmadı), `siyah_mercimek`, `gemlik_zeytini`, `taflan`, `gun_kurusu_kayisi` (kükürtlü kayısı aktarılmadı), `kuru_dut`, `kuru_cilek`, `kuru_ananas` (CoFID `14-396` enerji/karbonhidrat içermiyor, eksik profil eklenmedi), `kuru_kivi`, `psyllium`, `kanlica`, `yumurta_mantari`, `reishi`, `seylan_tarcini` (genel cassia/cinnamon aktarılmadı), `sumak`, `corek_otu`, `isot`, `adacayi_demleme`, `ihlamur_cayi`, `nane_cayi`, `rooibos_cayi` (kuru yaprak demlemeye aktarılmadı), `uzum_pekmezi`, `nar_eksisi`, `turk_kahvesi_sade`, `lungo`, `ristretto`.
- **Marka/formülasyon bağımlı takviye ve protein tozları (9):** `kazein`, `sigir_proteini`, `kolajen_peptit`, `bezelye_proteini`, `pirinc_proteini`, `kenevir_proteini`, `kabak_cek_proteini`, `karisik_bitkisel_protein`, `besin_mayasi_z` (marka/zenginleştirme etiketi gerekir; "Kendi besinlerim" yolu açık).
- **Lisans engelli boşluk (1):** `jaggery` (IFCT 2017 NIN yazılı izni yok).

## B258 bitkisel CoFID 2021 5. tur doğrulaması · 2026-11-22

- **UK CoFID 2021 (OGL v3.0) 5. tur — 21 yeni bitkisel eşleme, +25 yeni hücre** (`cofidFilledCells`: 178 → **203**; B191 gereği yalnız bitkisel besinler; 1:1 tür + hazırlanma biçimi + su ±5 g + protein ±%25/±1 g + yağ ±%30/±1,5 g doğrulaması; `'Tr'` ve `'N'` hariç; B157 kuru nohut Mn düşürme kuralı korundu):
  - `patates:firin` (`13-491`), `kabak:haslanmis` (`13-628`), `limon:suyu` (`14-277`), `frenk_uzumu_kirmizi:cig` (`14-249`), `kuru_uzum:kurutulmus` (`14-393`), `ispanak:haslanmis` (`13-573`), `nohut:haslanmis` (`13-662`), `misir:haslanmis` (`13-508`), `yerfistigi:cig` (`14-877`), `fistik_ezmesi:macun` (`14-892`), `soya_unu:toz` (`11-898`), `tam_bugday_unu:toz` (`11-889`), `tam_bugday_makarna:kuru` (`11-718`), `siyah_cay:demleme` (`17-165`), `elma_suyu:icecek` (`14-331`), `uzum_suyu:suyu` (`17-745`), `domates_suyu:icecek` (`13-382`), `kahve:demleme` (`17-833`), `kirmizi_sarap:icecek` (`17-752`), `beyaz_sarap:icecek` (`17-756`), `bira:icecek` (`17-749`).



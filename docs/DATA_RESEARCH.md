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


## B264 kapsam denetimi ve katalog eklemeleri

23 Kasım 2026. Taban `main/2bc46d6`. Küratörlü katalog 875 besin ve 1.027 tüketim biçiminden 884 besin ve 1.042 biçime çıktı. Bileşimi tamamen boş biçimler 36’dan 35’e indi. Hazırlama biçimlerini ve kaynak kimliklerini karşılaştırdım. Önceden kayıtlı sayısal değerler değişmedi ve mevcut biçim indeksleri korundu. Eski biçimlere 85 yeni sayısal hücre eklendi. Altı SR28 kaydı Tam Katalog’dan küratörlü kataloğa taşındı. Eski `t:x` kayıtları aynı NDB numarasıyla çözülür.

### Makro, mikro ve diğer bileşenlerin kapsamı

Sayılar en az bir kayıtlı sayı bulunan tüketim biçimlerini gösterir. Kaynakta varsayılan sıfırlar bu sayılara dahildir ve arayüzde `Varsayılan 0` etiketi taşır. 248 tanımlı matriks satırına hesaplanan değerler de dahildir.

| Bileşen | Önce (1.027 biçim) | Sonra (1.042 biçim) | Kalan boşluk |
| --- | ---: | ---: | ---: |
| Enerji, protein veya yağ (her biri) | 990 | 1.006 | 36 |
| Toplam lif | 958 | 974 | 68 |
| Toplam şeker | 844 | 858 | 184 |
| Potasyum | 988 | 1.004 | 38 |
| Kolin | 763 | 772 | 270 |
| Biyotin | 157 | 161 | 881 |
| İyot | 161 | 163 | 879 |
| Molibden | 25 | 25 | 1.017 |
| Klorür | 0 | 53 | 989 |
| Histidin | 616 | 623 | 419 |
| Lizin | 623 | 630 | 412 |
| Kafein | 786 | 796 | 246 |
| Çözünür veya çözünmez lif (her biri) | 7 | 7 | 1.035 |
| Dirençli nişasta | 1 | 1 | 1.041 |
| MK-4 | 84 | 84 | 958 |

- Kalori, protein, karbonhidrat, yağ ve lif birlikte 974 biçimde bulunur. Esansiyel dokuz amino asidin tamamı 610 biçimde bulunur. Tek MK-4 değeri tüm K2 biçimlerini temsil etmez. Krom, nikel, kobalt ve partiye özgü ağır metal satırları için küratörlü katalogda sayısal değer yok.
- Klorür CoFID’nin mg/100 g inorganik tablosundan gelir. Mevcut eşlemelerde aynı yiyecek ve hazırlama biçimi aranır. Sayısal CoFID ve USDA sodyumu arasında en çok 5 mg/100 g veya %25 fark kabul edilir. Sodyumdan klorür hesaplanmaz. 52 eşlenmiş biçim ve CoFID kuru ananas profiliyle 53 değer görünür. Örnek olarak çiğ elma 44 mg ve kuru ananas hesabı 127 mg. Tarifte, günlükte ve karşılaştırmada mevcut miktar ve kısmi kapsam kuralları geçerlidir. 800 mg günlük etiket referansı AB Ek XIII’ten gelir. [CoFID 2021](https://www.gov.uk/government/publications/composition-of-foods-integrated-dataset-cofid) · [AB 1169/2011 Ek XIII](https://eur-lex.europa.eu/eli/reg/2011/1169/oj/eng)
- Beş eşleme eklendi: çiğ portakal `14-327`, çiğ badem `14-896`, çiğ ceviz `14-879`, tuzsuz haşlanmış pırasa `13-625` ve pişmiş inci arpa `11-003`. USDA kayıtlarına yapılan CoFID dolguları 203’ten 263’e çıktı. Bunlar yeni tek-kaynaklı ananas profilinden ayrı sayılır. Kaynaktaki `Tr` (iz) ve `N` (bildirilmemiş) nümerik sıfıra dönüşmez.
- Foundation Foods enerji alanında USDA `208` için `kcal` birimi eşleştirildi. Kırmızı soğan kaydındaki 44 kcal/100 g bu alandan gelir. Var olan birim dönüşümü ve SR28 önceliği geçerlidir. [Foundation Foods yöntemleri](https://fdc.nal.usda.gov/Foundation_Foods_Documentation/)

### Eklenen besinler ve hazırlama biçimleri

Öncelik günlük sebze, baklagil ve tahıllara, sonra tüketim biçimini değiştiren konserve ve hazırlanmış ürünlere verildi. Sıra editoryaldir. TÜBER 2022 ve Sağlık Bakanlığının örnek öğünleri Türkiye bağlamına yön verdi. [TÜBER 2022](https://hsgm.saglik.gov.tr/media/attachments/2025/05/12/turkiye-beslenme-rehberi-2022.pdf) · [Sağlık Bakanlığı örnek öğünleri](https://orduism.saglik.gov.tr/TR-339805/ramazan-ayinda-beslenme-onerileri.html)

| Besin veya biçim | Kaynak kaydı |
| --- | --- |
| Çiğ kırmızı soğan | Foundation FDC 790577 |
| Konserve, süzülüp durulanmış nohut | SR28 NDB 16359 |
| Tuzsuz haşlanmış pırasa | SR28 NDB 11247 |
| Çiğ, taşta öğütülmüş tahin | SR28 NDB 12198 |
| Pişmiş glutensiz mısır makarnası | SR28 NDB 20092 |
| Kılçıklı, domates sosunda konserve sardalya (süzülmüş) | SR28 NDB 15089 |
| Süzülmüş konserve mantar | SR28 NDB 11264 |
| Tavada yağ eklenmeden hazırlanmış yumurta | FNDDS 31105010, FDC 2707156 |
| Laktozsuz inek sütü, dört yağ seçeneği | FNDDS 11114350, 11114330, 11114300, 11114320. ABD’de vitamin eklenmiş süt esaslı profiller. Ayrı laktoz miktarı bildirilmemiş |
| Şekerli kuru ananas | FNDDS 62120100, FDC 2709210. Girdiler ananas ve toz şeker |
| Yağı azaltılmış mayonez | FNDDS 83204000, FDC 2710220 |
| Nohut patlağı | Foundation FDC 2779255 |
| Şeker eklenmemiş kuru ananas | CoFID `14-396`. Taze `14-376` kaydından hesaplanmış profil |

CoFID kuru ananasta 100 g için 303 kcal, 75,7 g kullanılabilir karbonhidrat ve 8 g lif bildirir. Kullanılabilir karbonhidrat kendi alanına aktarılır. Sodyum ve iyot iz düzeyinde bildirildiğinden sayısal alanları boş kalır. CoFID çalışma kitabının ve 5.432 kayıtlık FNDDS arşivinin SHA-256 özeti, depodaki kaynak kaydıyla birebir eşleşti. CoFID alt kümesinde yalnız `14-396` satırı genişletildi. [USDA veri indirmeleri](https://fdc.nal.usda.gov/download-datasets/) · [USDA CC0](https://fdc.nal.usda.gov/api-guide/) · [CoFID açık lisansı](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/)

### Kalan boşluklar ve sıradaki araştırma

1. **Yaygın ve ürün tanımı önemli.** Gün kurusu kayısı, kuru dut ve çilek, sade Türk kahvesi, ıhlamur, nane, adaçayı ve rooibos, nar ekşisi ve üzüm pekmezi. Sade Türk kahvesinde laboratuvar çalışması kafeini mg/100 mL olarak bildiriyor. Bu konsantrasyon çalışma örneklerine özgüdür ve 100 g profiline dönüştürülmedi. FNDDS’nin Türk kahvesi satırı şeker içeriyor. [Türk kahvesi kafein çalışması](https://pmc.ncbi.nlm.nih.gov/articles/PMC11496285/)
2. **Yeni yerel hazır ürünler.** Tarhana çorbası, şalgam suyu, boza ve laktozsuz yoğurt. Tarhananın kuru ve hazırlanmış biçimlerini, şalgam suyunda tuz düzeyini, bozada ilave şekeri ayrı takip et. TürKomp’un resmî dizininde üzüm pekmezi ve kuru tarhana kayıtları bulunuyor. Kullanım sayfası doğrudan açılışta zaman aşımına uğradı. Resmî arama dizinindeki koşullar çevrimdışı yeniden dağıtım iznini doğrulamadığından veri aktarılmadı. [TürKomp veri bankası](https://turkomp.tarimorman.gov.tr/database) · [TürKomp veri kullanımı](https://turkomp.tarimorman.gov.tr/useofdata)
3. **Mevcut besinleri derinleştirme.** Önce iyot, biyotin ve molibden için aynı besin ve hazırlama biçimini aramak en çok boşluğu hedefler. Ardından lif fraksiyonları, esansiyel amino asitler, ilave şeker ve K2 biçimleri. Toplam şeker ilave şekerin yerine kullanılamaz. Ağır metal verileri eşleşen parti, birim ve analiz yöntemiyle değerlendirilir. [USDA veri türleri ve ölçüm yöntemleri](https://fdc.nal.usda.gov/data-documentation/)
4. **Ürün etiketi gerekenler.** Protein tozları ve zenginleştirilmiş besin mayası dahil dokuz tamamen boş biçimde içerik formülasyona bağlı. Cevizdeki veya bezelyedeki tam besin profili protein tozuna taşınmaz. Jaggery için IFCT yazılı dağıtım izni bekliyor.

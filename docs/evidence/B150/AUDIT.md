# B150 · Kompakt beslenme filtresi ve bitkisel kahveler · beta.37

16 Kasım 2026. Başlangıç: `2cc61d3787f3ce2d23456939e8173cf8f19c0e76`
(B149/beta.36), üretim dalı `ccr-1e1934aa-iv8aev`.
Kullanıcının onayladığı kompakt menü ve son vejetaryen alt tercih isteği,
önceden önerilen Foundation/FNDDS genişletmesinin önüne alındı.

## Son davranış

- Kahveler, Fast Food ve Atıştırmalıklar kategori sırasının sonunda, mevcut
  kategorilerle aynı gezinme alanında. Tanıtımdaki tekrar bağlantılar kaldırıldı.
  Liste görünümünde masaüstünde de üst kategori sırası kullanılır. Dar ekranda
  bu sıra yatay kaydırılır; kategori kaydırma konumu yeniden çizimde korunur.
- Varsayılan Hepçil. Vegan, Vejetaryen, Pesketaryen seçimleri kategori değişiminde,
  yenilemede ve tarif/karşılaştırma besin seçicisinde aynı tercihi kullanır.
- Vejetaryen seçildiğinde menü ile Ek tercihler arasında iki bağımsız kutu açılır:
  Yumurta tüketiyorum (ovo), Süt ürünleri tüketiyorum (lakto). İkisi başlangıçta
  seçilidir. Biri kapatılınca ilgili içerik dışlanır; ikisi açıkken ovo-lakto.
  İkisini kapatmak Vegan ile eşit değildir; bal vejetaryen kapsamda kalır.
- Ek tercihler: glutensiz, laktozsuz, soya, sert kabuklu yemiş, yer fıstığı ve
  susam içermeyen. Bunlar AND ile birlikte uygulanır. Yer fıstığı sert kabuklu
  yemişlerle aynı sayılmaz. Yalnız alerjen alanının boş olması uygunluk değildir.
- Filtreler arama, kategori sayıları, son bakılanlar, benzer öneriler, koleksiyon
  içeriği, özel besin listesi ve seçicilere bağlandı. Kayıtlı tarifler, günlük
  ve koleksiyonların ham içeriği değiştirilmez. Gizlenen kayıtlar yanlışlıkla
  “hiç kaydın yok / koleksiyon boş” diye sunulmaz; filtreyi temizleme yolu vardır.
- Ayar yazımı başarısızsa önceki seçim korunur ve hata gösterilir; bellek ile
  depolama ayrışmaz. Filtre değişiminde çoklu seçimde gizlenen besinler seçili
  bırakılmaz. Varsayılanlar, normalleştirme, ayar yedeği ve sıfırlama aynı sahibin
  parçasıdır; v2 ayar kayıtlarının kimliği/şeması değişmedi.

## Veri kapsamı ve sınırlar

Yulaf, badem ve soya içeceğiyle yedi kahvenin ayrı sürümleri: latte, cappuccino,
flat white, cortado, espresso macchiato, mocha ve buzlu latte. **21 yeni kayıt;
685 küratörlü besin / 831 tüketim biçimi.** Kaynak SR28 kapsamı yine
8.789/8.789; 709 benzersiz SR28 kaydı ana biçimlerde, 8.080 ayrı geniş kayıtta.
Yeni tarif adları yeni kaynak ölçümü sayılmaz.

Bu kahveler `r` etiketli tarif tahminleridir. Sütlü tarife ait gram oranları
korunur, inek sütü uygun bitkisel kaynakla değiştirilerek değerler tekrar
hesaplanır. Buz ve mocha'nın kakao/şekeri kaynak dökümünde kalır. Yulaf içeceğinin
mevcut Foundation kaydı tarif hesabında desteklenir; dökümde gerçek FDC kimliği
saklanır, yanlış bir NDB numarası üretilmez. Bir besin öğesi ancak gereken bütün
malzemelerde biliniyorsa hesaplanır. Eksik mikro/AA miktarı sıfır yapılmaz.
İngilizce arama adları yalnız gerçek bitkisel içeriği belirtir.

`data/diet-profiles.mjs` içerik sınıflandırmasının kaynağıdır. Kontrollü sade
besin kategorileri, tanımlı içecekler ve açık kahve tarifleri sınıflandırılır;
içeriği belirsiz karma ürünler unknown kalır. 685 kaydın 533'ünde bir beslenme
sınıfı vardır; bu sayı hepsinin altı alerjen kısıtında da uygun olduğu anlamına
gelmez. Geniş katalogdaki mevcut bitkisel kaynak sınıfı beslenme biçiminde
kullanılır; buradan alerjen bulunmadığı çıkarılmaz. Özel kullanıcı etiketi ve
belirsiz hazır üründe gerekli bilgi yoksa etkin kısıt altında gösterilmez.

Bitkisel süt ürün adından tüm diğer bileşenler/çapraz bulaşma çıkarılmaz.
Örneğin yulaflı kahve otomatik glutensiz değildir; badem/soya kahvesinin de
bağımsız gluten/diğer alerjen yokluğu bilinmiyorsa bu filtreyi geçtiği iddia
edilmez. Sade/olgun peynir veya ghee, laktoz bilinmediği halde laktozsuz sayılmaz.
Filtre ürün sertifikası ya da alerjik reaksiyon güvenliği vaat etmez; bu sınır
etkin filtre altında görünür. Vejetaryen etiketi belirsiz peynir/enzim kaynağı
veya hazır yemekler kendiliğinden uygun yapılmadı.

Mevcut 664 kaydın yeni `dietary` alanı dışındaki **tüm alanları**, biçimleri,
ölçümleri ve kaynakları başlangıçla birebir aynı olduğu makineyle karşılaştırıldı.
Bütün mevcut kimlikler korunur. Geniş katalog ve EFSA üretimi değişmedi.

## Doğrulama

- PASS **147/147** birim testi. Dört yeni birim kabulü: varsayılan/göç/yedek/
  sıfırlama; bağımsız ovo/lakto ve bal/balık/et ayrımı; bilinen içerik ile veri
  yokluğu ve ayrı alerjenler; 21 kahvenin gram oranı, kaynak kimliği, r etiketi,
  eksik miktarı koruma ve tekrar hesaplanan enerji.
- PASS **12/12** final özellik tarayıcı kabulü; TR/EN, Chromium masaüstü ve
  telefon. Normal girişten kategori sırası/adı, kutuların doğru konumu,
  ovo/lakto değişimi, vegan kahve seçimi, çoklu kısıt, yeniden açılış, tarif ve
  karşılaştırma seçicisi, yazım hatası, filtreli özel besin/koleksiyon sayısı ve
  ham kayıtların değişmemesi. 320px + 28px yazı + yüzde200 ölçek dahil.
- PASS **254/254** genel Chromium regresyonu (6,8 dakika). Ardından yalnız yeni
  kahvelerin İngilizce arama kaynak adları düzeltildi; final veri yeniden üretildi,
  147 birim, iki derleme ve 12/12 özellik tarayıcı kabulü tekrar PASS (22,5 saniye).
  Tek 266-test koşumu yapıldığı iddia edilmez. Yerel file:// iki vaka yönetilen
  ortam politikası nedeniyle hariçtir; bu dışlama ürün hatası sayılmaz.
- PASS web/PWA ve tek HTML derlemeleri; 24 lisans/kaynak bildirimi; diff boşluk
  kontrolü; veri üretiminin tekrarında foods, foods-ext ve EFSA SHA256 aynı.
- PASS açık ve koyu tema bütün sayfa axe WCAG2.1AA: **0 ihlal**, pageerror0.
  Masaüstü ve telefon görüntüleri `/workspace/b150-evidence/` altında incelendi.
- İlk yeni testler büyük yazı/ölçekte CSS grid'in içerik genişliğine büyüdüğünü
  gösterdi. Minmax(0,1fr), daralabilir alanlar ve metin sarılmasıyla düzeltildi;
  tıklamayı zorlamak veya zaman aşımını artırmakla test geçirtme yapılmadı.
- Sürüm yükseltmede kalan Linux RPM release alanı beta.37 ile eşleştirildi;
  final paket metadata testi PASS. Bu native paket üretildiği anlamına gelmez.

```sh
npm run data
node --test --test-isolation=none tests/*.test.mjs
npm run build
npm run build:single
node scripts/build-notices.mjs --check
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/browser/diet.spec.mjs --workers=2 --reporter=line
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test --workers=2 --grep-invert 'tek HTML dosyası internet olmadan yerelden açılır' --reporter=line
git diff --check
```

Fiziksel cihaz, ekran okuyucu ve beta.37 yerel Firefox/WebKit: NOT_RUN.
B149'un sonradan tamamlanan CI'ı ayrı kanıttır: 244 Chromium + 488 diğer motor/
cihaz benzetimi PASS; bu sonuç beta.37'ye taşınmış gibi sunulmaz. Yeni Vercel,
Pages ve CI yayın makbuzu teslim sırasında ayrı doğrulanır. Native Release/store
yayını bu çalışmanın kapsamında değil.

Sonraki tek Forge **B151**: açık Foundation/FNDDS kapsamını kaynak doğruluğu ve
performans bütçesiyle büyütme.

```text
GPT/Codex'e verilecek prompt
B150 beta.37'yi bu rapor ve CURRENT_STATE.json ile doğrula. Bu kapsamda kalan doğrulanmış bir kusur bildirilmedi. Tekrar kabulde npm test ve diet.spec.mjs kullan; beslenme filtrelerinin kayıtlı tarifleri/günlüğü silmediğini, ovo/lakto kutularının bağımsızlığını ve belirsiz içeriğin uygun sayılmadığını koru. Denenmemiş fiziksel cihaz kontrollerini kusur gibi yazma.
```

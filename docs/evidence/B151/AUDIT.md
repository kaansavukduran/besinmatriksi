# B151 · Kategori hiyerarşisi ve birleşik İçecekler · beta.38

16 Kasım 2026. Başlangıç `e1e2088491bb1e8a97307651ce1dfb5c65e31e0c`
(beta.37), dal `ccr-1e1934aa-iv8aev`. Kullanıcının son düzenleme isteği önceki
Foundation/FNDDS genişletme önerisinin önüne alındı; o öneri B152'dir.

## Sonuç ve veri sahipliği

- Meyveler, meyve ve kuru meyve gruplarını; Sebzeler, sebze, yeşil yapraklı ve
  kök/yumru gruplarını içerir. Alt grupların ayrı üst sekmeleri kaldırıldı.
  Seçilen üst kategori aynı sayfada başlıklar ve besin ızgaraları gösterir.
- Kahveler üst sekmesinin yerine İçecekler geldi. Kahve, çay, bitkisel çay,
  diğer sıcak içecek, soğuk içecek, meyve/sebze suyu, bitkisel süt, sütlü içecek
  ve alkollü içecek alt başlıkları var. Buzlu latte çeşitleri soğuk içeceklerdedir.
  Soya sütü ve sade süt gibi içecekler de bu görünümde bulunur; sirke içecek
  sayılmayıp Diğer'e gider. Tek besin Tümü listesinde bir kez gösterilir.
- Parent/child eşlemesi `src/catalog-tree.js` içinde sunum katmanıdır. Kayıtlı
  besin kimlikleri, kaynak kategorileri ve biçim indeksleri değiştirilmez.
  Ayrıntı ekranında doğru üst/alt kategori yolu gösterilir. Eski dahili kahve
  kategori eşlemesi okunabilir kalır; gizli veya işlevsiz üst düğme eklenmedi.
- Arama bütün alt grupları kapsar ve seçili kategorinin dışındaki özel/uzak
  kayıtları karıştırmaz. Kategori aramasında sonuçlar ilgili alt başlıkta kalır.
  Üst kategori seçiliyken sıralama her alt başlığın içindedir; bu görünür bir
  açıklamayla belirtilir. Tümü'nün mevcut genel sıralama davranışı korunur.
- Beslenme filtreleri, kategori sayıları, tarif ve karşılaştırma seçicisi aynı
  sınıflandırmayı kullanır. Yeni kayıt veya ara kategori oluşturmak için mevcut
  tarif/günlük/koleksiyon verisine yazılmaz. Tarife kuru kayısı ekleme ve tekrar
  ekleyip200g'a yükseltme, aynı eski referans ve tek satırla kaydolur.
- Parent başlığı ve alt başlıkların yazı ölçeği tutarlıdır. Önceki emojisiz,
  boşluklu bölüm ayraçları, yerel başlık fontu ve kullanıcı okuma tercihleri
  korunur; yeni kart veya iç içe kutu eklenmedi.

## İçecek kapsamı

Sekiz yeni kayıt: Adaçayı (demlenmiş), Ihlamur çayı, Nane çayı, Rooibos çayı,
hazır karışımdan suyla sıcak çikolata, limonlu şekerli buzlu çay, içime hazır
şekersiz yeşil çay ve konsantreden suyla hazırlanmış limonata.

Dört özel bitki çayı için katalogdaki kaynaklarda doğrulanmış ayrı bileşim
ölçümü yoktur. Bu kayıtların miktar alanları boş ve nedeni görünürdür.
Kuru adaçayının, taze/kuru nanenin veya genel bitki çayının ölçümleri bu dört
adı doldurmak için kullanılmadı. Mevcut genel bitki çayı kaydı açıkça “genel
USDA kaydı” olarak adlandırıldı; eski kimliği ve ölçümleri korunur.

Diğer dört içecek zaten dağıtılan USDA SR28 kaynağına doğrudan bağlanır:
14194,14199,14261,14293. Hazır karışım/konsantre tanımı ad ve açıklamalarda
korunur; evde hazırlanmış tarif ya da vegan/alerjensiz ürün sertifikası
uydurulmaz. Hazır yeşil çayda ölçülmüş enerji0 korunur, ölçülmemiş enerji0 yapılmaz.

Toplam **693 küratörlü besin /839 biçim**. Dört SR28 kaydı geniş listeden ana
listeye geçti: **713 ana kaynak kaydı +8.076 geniş =8.789/8.789**. Kaynak yılı
2015 ve özgün USDA tanımları korunur. Kayıt çift sayılmadı veya arşivden silinmedi.
Başlangıçtaki **685 besinin bütün biçimleri, sıraları, değerleri ve kaynakları**
birebir aynı olduğu JSON karşılaştırmasıyla doğrulandı. Yalnız genel bitki
çayının kullanıcıya görünen adı açıklığa kavuşturuldu.

## Kabul kanıtları

- PASS151/151 birim: dört yeni test, bütün besinlerin tek parent üyeliği ve tek
  Tümü gösterimi; meyve/sebze alt grupları; içecek/sirke ve sıcak/soğuk ayrımı;
  özel demlemede boş ölçüm ile ölçülmüş0 ayrımı. Dokuz içecek başlığı TR/EN.
- PASS262/262 genel Chromium masaüstü/telefon regresyonu (7,6dk). Sonrasında
  yalnız parent başlığının yazı boyutu bölüm başlıklarıyla eşitlendi; final
 151/151 birim, web/tek HTML derlemeleri ve20/20 yeni hiyerarşi+mevcut beslenme
  kabulü tekrar PASS (45,2sn). Tek282-test koşumu yapıldığı iddia edilmez.
- Normal girişten TR/EN: meyveye gir→kuru meyveyi bul→A–Z'de gruplar korunur→
  kuru kayısı ara→tarife ekle→sebzede yaprak/kök başlıkları→içeceklerde bitki/
  sıcak/soğuk başlıkları→ıhlamurun veri boşluğu ve doğru kategori yolu→tarif
  seçicisinde meyve/kuru meyve→aynı eski referansın200g ile kaydı→yenile.
- Telefon ve masaüstü;320px+28px yazı+%200 ölçek, vegan filtre ve kayıtlı
  tercihlerin korunması. Beklentiler kaldırılmadı, tıklamalar zorlanmadı.
  Eski süt/kahve testleri yeni İçecekler yolunu izler. Masaüstünde Liste'ye
  dönüş düğmesi gizliyken doğrudan görünür kategori kontrolü kullanılır.
- PASS web/PWA ve11,23MB tek HTML;24 lisans/kaynak bildirimi; diff boşluk
  denetimi. Veri üretimi tekrarlanıp üç üretilmiş dosyanın SHA256 değeri aynı.
- Açık/koyu parent sayfası axe WCAG2.1AA0 ihlal; scoped custom search ve
  pageerror0 kontrolleri. Gerçek görüntüler `/workspace/b151-evidence/` altında:
  meyve+kuru meyve, bitki çayları ve telefon yeşil yapraklı bölümü incelendi.

```sh
npm run data
node --test --test-isolation=none tests/*.test.mjs
npm run build
npm run build:single
node scripts/build-notices.mjs --check
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/browser/catalog-tree.spec.mjs tests/browser/diet.spec.mjs --workers=2 --reporter=line
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test --workers=2 --grep-invert 'tek HTML dosyası internet olmadan yerelden açılır' --reporter=line
git diff --check
```

İki yerel file:// vaka yönetilen ortam politikası nedeniyle genel koşumdan
hariçtir; ürün kusuru sayılmaz. Yerel Firefox/WebKit, fiziksel telefon,
ekran okuyucu ve native kurulum NOT_RUN. Yeni native Release/store yayını yok.
Vercel, GitHub Pages, Cloudflare Pages ve yeni CI makbuzları yayımdan sonra ayrı
kontrol edilir; eski sürüm kanıtı yeni sürüme taşınmış sayılmaz.

Sonraki tek Forge **B152**: açık Foundation/FNDDS kapsamını kaynak doğruluğu ve
performans bütçesiyle büyütme.

```text
GPT/Codex'e verilecek prompt
B151 beta.38'de bu kapsamda kalan doğrulanmış kusur bildirilmedi. catalog-tree ve diet kabul testleriyle aynı parent/child üyeliğini, tek Tümü gösterimini, eski kayıt kimliklerini ve boş ölçüm/ölçülmüş0 ayrımını koru. Özel bitki çaylarını genel çay veya kuru baharat verisiyle doldurma. Fiziksel cihaz gibi denenmemiş kontrolleri kusur olarak yazma.
```

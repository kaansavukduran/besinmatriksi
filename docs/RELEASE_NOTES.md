# 🫐 Besin Matriksi 1.1.2 Beta 29 · Kısır, piyaz, fava, ezogelin ve zeytinyağlılar

Besinlerin ayrıntılı besin matriksini gösteren, **internetsiz çalışan** uygulama (bitkisel ağırlıklı; hayvansal besinler ayrı ve etiketli).
Pembe-mavi aksolotl **Aion** artık rehberin: dokununca ipucu verir, besin ekleyince sevinir.

## ⬇️ Hangi dosyayı indireyim?

Aşağıdaki **Assets** listesinden cihazına uygun dosyaya tıkla:

| Cihazın | İndir | Nasıl açılır |
|---|---|---|
| **Windows (en kolay)** | `…-windows-x64-portable.exe` | Kurulum yok. Çift tıkla, açılır. SmartScreen uyarısında **Ek bilgi → Yine de çalıştır**. |
| Windows (kurulumlu) | `…-windows-x64-Setup.exe` | Çift tıkla, **İleri → Yükle**. Başlat menüsünden aç. |
| **Android** | `…-android.apk` | Telefonda aç, “bilinmeyen kaynaklara izin ver” de, **Yükle**. |
| macOS (Intel + M çip) | `…-macos-universal-unsigned.dmg` | Aç, uygulamayı **Uygulamalar** klasörüne sürükle. İlk açılışta sağ tık → **Aç**. |
| Linux | `…-linux-x86_64.AppImage` | `chmod +x` ile çalıştırılabilir yap, çift tıkla. (`.deb` / `.rpm` da var.) |
| **Her bilgisayar (kurulumsuz)** | `…-offline.html` | Çift tıkla, tarayıcıda açılır. İnternet gerekmez. |
| iPhone | Şimdilik `offline.html` dosyasını Dosyalar uygulamasından Safari ile aç | Apple imzası olmadan `.ipa` kurulamaz; App Store/TestFlight sürümü bekliyor. |

`SHA256SUMS.txt` dosya bütünlüğünü, `BUILD_INFO.json` kaynak commit'ini kaydeder.

## ✨ Bu sürümde yeni

- **Vegan Türk mutfağı (tarif hesabı):** Kısır, piyaz, fava, ezogelin çorbası, zeytinyağlı taze fasulye (domatesli), imam bayıldı, zeytinyağlı enginar, bulgur pilavı. USDA'nın pişmiş/çiğ ölçümlerinden, “Tahmin (tarif)” etiketli; USDA'da olmayan malzemeler (nar ekşisi, biber salçası, nane) notta.
- **Gözleme (ıspanaklı ve patatesli, peynirsiz):** Tarif hesabı, sacda pişme verimiyle; yalnız ısıya dayanıklı değerler.
- **Telefonda daha hafif:** Keşfet'te görünmeyen periyodik tablo artık arka planda kurulmuyor; bileşen aramaları hızlandı.
- **Pürinler:** USDA Pürin veri tabanından (2026) adenin, guanin, hipoksantin, ksantin ve toplam; 40 besinde (ör. kurutulmuş shiitake, maydanoz, brokoli). Gut/ürik asit açısından Antinutrientler bölümünde. Adla eşlenen kayıtlar tek tek incelendi; bir kısmı Japonya örnekleri (kaynakta yazılı).
- **Yedek iki kez içe aktarılırsa kopya oluşmaz:** Aynı tarif, kendi besin, profil ve koleksiyonlar atlanır; yeni olanlar eklenir.
- **macOS'ta Option+rakam kısayolları** artık sekmeleri açar.
- **Türk mutfağı (tarif hesabı):** Simit, lahmacun, mercimek köftesi ve etsiz çiğ köfte; USDA'da kayıtları olmadığı için malzeme oranlarından hesaplanır, “Tahmin (tarif)” etiketli, ikameler notta yazılı.
- **Pişme verimi:** Fırın ürünlerinde kaybolan ağırlık su sayılır; yalnız ısıya dayanıklı değerler (kalori, makrolar, lif, mineraller) hesaplanır, vitaminler “veri yok” kalır.
- **613 besin (+150):** Mercimek çorbası, şehriyeli/mercimekli pilav, menemen, musakka, sütlaç, lokma, tahin helvası; badem, kaju ve ayçiçeği ezmesi; yulaf sütü, kombucha, soya/badem/hindistancevizi yoğurdu, TVP; tam buğday makarna, yulaf lapası; kurutulmuş ve konserve domates, çarliston biber; pişmiş yumurta, kuzu pirzola, hindi göğsü, konserve ton ve füme somon… (USDA SR28/FNDDS/FDC; hayvansallar etiketli ve gizlenebilir).
- **Daha az “veri yok”:** USDA İyot 4.0, Kolin 2, Proantosiyanidin 2.1 ve SR Legacy veri tabanlarıyla yaklaşık 1.370 boş hücre ölçümle doldu. Yeni: kolin türleri (fosfatidilkolin…) ve proantosiyanidin fraksiyonları (kakao, tarçın, fındık…). Ölçülmeyen yine “veri yok”, 0 değil.
- **Hata düzeltmeleri:** Kıyasla'da süzülmüş listede ✕ artık doğru besini siler; İngilizce modda İngilizce adla arama; Günlük tarihi gece yarısı kendiliğinden bugüne geçer; CSV/Excel dışa aktarmada formül güvenliği; daha akıcı yenileme.
- **463 besin:** Yeni “Ekmek ve unlu mamuller” (ekşi mayalı, çok tahıllı, yulaf, kepekli, pumpernickel, bagel, naan, çapati, tortilla, yufka…) ve “Hazır yemekler ve mezeler” (et ve tavuk döner, falafel, sarma, cacık, baklava, ıspanaklı börek, şiş kebap) kategorileri.
- **Ayran ve kaju ayranı:** USDA malzemelerinden tarif oranıyla hesaplanır, “Tahmin (tarif)” etiketiyle.
- **Deniz ürünleri ve hayvansal ürünler:** Lüfer, istavrit, kalkan, kalamar, ahtapot, yengeç, kerevit…; keçi/koyun sütü, kefir, sakatat, ördek, bıldırcın…
- **Mantarlar:** Aslan yelesi, kral istiridye, kayın, kavak mantarı (USDA FDC); kanlıca ve reishi açıklamalı.
- **Protein tozları ve kreatin:** Whey, soya, yumurta akı tozu; bitkisel tozlar etiketten; kreatin formülden.
- **Lifler kutusu:** Beta-glukan, dirençli nişasta ve diğer lif türleri; Vitaminler kutusunun altında.
- Tanıtım turu kaldırıldı; Kişisel profil Günlük'te en üstte; Safari/iPad'de kare karolar düzeltildi.
- **Çaylar ve kahveler:** Hibiskus, bitki çayı (ıhlamur, adaçayı…), oolong; Türk kahvesi (orta şekerli), bitkisel sütlü latte ve cappuccino (USDA FNDDS).
- **Siyez bulguru, siyah pirinç, siyah mercimek, Americano:** USDA'da ölçüm olmadığı için açıklamalı; etiketten ya da tarifle (Americano = espresso + su) eklenir.
- **Daha çok çeşit:** Makadamya, Brezilya cevizi, pekan, goji, kenevir tohumu, natto, teff, amarant, moringa, enoki, kelp, wakame artık listelerde görünür. Yeni: sirken, şalgam yaprağı, karpuz çekirdeği, altın çilek, arpacık soğan, kestane mantarı, horoz mantarı, İrlanda yosunu (sea moss), soya filizi (USDA).
- **Besin mayası ve psyllium:** USDA tablolarında olmadığı için açıklamalı; “Etiketten kendi besinim olarak ekle” ile ürün etiketinden girilir.
- **Tek temel kart:** Solda kalori pasta grafiği, sağda 8 temel değer kutusu (dengeli 4+4 / 2×4); ayrı Kalori kutusu yok. Hesaplanan göstergeler hemen altında.
- **Periyodik tablo görünümü:** Keşfet'te kategori seçince besinler sağda kare kare (kcal, protein, lif).
- **Daha az “veri yok”:** USDA FoodData Central (Foundation Foods, 2026) ile biyotin, molibden, iyot, sitrik/malik asit, şeker türleri gibi eksik değerler dolduruldu.
- **Ciddi, net yazı:** Varsayılan yazı tipi Inter.
- **Daha sade:** Aion varsayılan kapalı (Ayarlar → Aion'dan açılır); Ayarlar kartları boşluksuz sütunlarda; Kıyasla tablosu iç kaydırmasız.
- **Günlük önce gün:** Günlük açılınca en üstte tarih ve günün temel değerleri; kişisel profil formu en altta.
- **Günlük'te pasta grafik:** Günün toplam kalorisinin protein, karbonhidrat, yağ ve liften gelen payı.
- **Daha az “veri yok”:** USDA Flavonoid (3.3) ve İzoflavon (2.1) veri tabanları eklendi: kuersetin, kaempferol, kateşinler, EGCG, hesperetin, antosiyanidinler, daidzein, genistein… 205 besin biçiminde ölçüm geldi (ör. soğanda kuersetin, portakalda hesperetin).
- **Kalori pasta grafiği:** Keşfet ve Tarif'te kalori kutusunun üstünde, Kıyasla'da her besin için yan yana; kalorinin yüzde kaçı protein, karbonhidrat, yağ ve liften geliyor; gramlarıyla.
- **Kalori kutusu:** “Su, enerji ve fiziksel özellikler” yerine yalnız kalori.
- **Günün ne kadarı?** Besin, tarif, Kıyasla ve Günlük'te temel değerlerin (kalori, protein, karbonhidrat, şeker, yağ, doymuş yağ, lif, tuz) yanında çubuk ve yüzde: kişisel bilgi girilmediyse **ortalama kadın** ve **ortalama erkek** için ayrı ayrı (kaynak: PHE 2016, 19–64 yaş). Profilde cinsiyet/kalori varsa sana göre.
- **Kaynaklar en altta:** Besin ve tarifte kaynak/kapsam bilgisi artık sayfanın sonunda.
- **Daha sade tarif:** Maliyet hesabı ve fiyat alanı kaldırıldı; “Kül” satırı gösterilmiyor.
- **Türk mutfak ölçüleri:** Besin ayrıntısında 1 su bardağı (200 ml), 1 yemek kaşığı, 1 çay kaşığı düğmeleri; gram USDA hacim ölçüsünden hesaplanır ve “≈” ile gösterilir.
- **Günlük hedef çubukları:** Günlük'te kalori, protein ve lif için “kalan” çubuğu; şeker, doymuş yağ ve tuz için üst sınır çubuğu (aşınca kırmızı). Tıbbi öneri değildir.
- **Aion canlandı:** Günün saatine göre selam (günaydın / iyi akşamlar / iyi geceler) ve Günlük hedefine ulaşınca kutlama.
- **Görünüm cilası:** Kıyasla'da eşit sütunlar (telefonda taşma yok), Türkçe yüzde biçimi (%20), Ayarlar'da tek dil seçimi, telefonda uygulama adı.
- **Daha güvenilir açılış (web/Chrome):** Sayfa artık önce internetten yüklenir; tarayıcı eski bir kopyada takılı kalmaz. Uygulama açılamazsa boş ekran yerine “Önbelleği temizle ve yeniden yükle” düğmesi çıkar (tarif ve ayarlar silinmez).
- **Önce temel değerler:** Besin açınca en üstte Kalori, Protein, Karbonhidrat, Şeker, Yağ, Doymuş yağ, Lif, Tuz; ayrıntılar altta. Kıyasla ve Günlük de temel değerlerle başlar.
- **Yaygın besinler önce:** Kategorilerde en çok tüketilenler üstte (elma, muz, portakal…); az bilinenler (ör. jackfruit, teff) listede gizli, aramada bulunur (Ayarlar'dan açılır).
- **Yeni yaygın besinler:** Beyaz/tam buğday/çavdar ekmeği, pide/lavaş, içme suyu, taze soğan, tavuk but, dana biftek, patates kızartması, patlamış mısır, üzüm suyu.
- **Dil kartı:** Ayarlar'ın en üstünde 🇹🇷 Türkçe / 🇬🇧 English.
- Keşfet kategorileri için isteğe bağlı simetrik ızgara (Ayarlar → Matriks).
- **Simetrik “besin ekle” penceresi:** Kategori düğmeleri artık eşit genişlikte ve aynı yükseklikte (sağ-sol dengeli).
- **Geniş katalogta hayvansal gruplar:** USDA süt/yumurta, kümes, sığır, kuzu/dana, domuz, balık grupları (1.505 kayıt; Ayarlar'dan gizlenebilir).
- **Her besinin kendi resmi:** 318 besinin hepsine uygulamaya özel çizilmiş küçük bir resim (hepsi farklı; internetsiz).
- **Koyu tema ve sistem yazısı varsayılan:** Yeni kurulumda tema Koyu, yazı cihazının kendi yazı tipi. Daha önce seçtiğin tema/yazı korunur.
- %200 arayüz ölçeğinde telefonda Ayarlar ekranının taşması düzeltildi.
- **Hayvansal besinler:** Süt ürünleri, yumurta, kırmızı et, kümes hayvanları, balık ve deniz ürünleri kendi kategorilerinde (33 besin, USDA verisi); bal da eklendi. Hepsi **“Hayvansal”** etiketli; Ayarlar → Matriks'ten tek dokunuşla gizlenir.
- **Kısa Kıyasla:** Telefonda her besin tek satır (−10 · gram · +10 · ⚙ Ayarla); hazır ölçüler Ayarla'nın altında.
- **Son 7 gün:** Günlük'te son 7 günün enerji çubukları; kayıtsız gün “—” (0 değil), eksik veride “≥”. Çubuğa dokun, o gün açılsın.
- **Tanıtım turu:** İlk açılışta 3 kısa adım (kategori → besin ve gram kaydırıcısı → tarif). İstediğin an “Turu atla”; Ayarlar → Aion'dan yeniden başlat.
- **Benzer besinler:** Bir besini açınca aynı kategoriden enerji, protein, karbonhidrat, yağ ve lif profili en yakın 6 besin; dokun, aç. (Vitamin ve mineraller farklı olabilir.)
- **Ayarlarda ara:** Ayarlar'ın üstündeki kutuya “tema”, “yazı”, “Aion” yaz; yalnız ilgili kartlar kalır.
- **Tarif listesi:** Her tarifte porsiyon başı kcal; 4+ tarifte arama ve A–Z / kcal sıralaması.
- **Tarifi günlüğe ekle:** Tarifte **📒 Günlüğe ekle** → kaç porsiyon yediğini yaz; her malzeme bugünün günlüğüne doğru gramla eklenir.
- **Günü tarife çevir:** Günlük'te **🥣 Bu günü tarif olarak kaydet** → o günün yediklerinin toplam matriksini tarif olarak gör.
- **Son bakılanlar:** Keşfet'in üstünde son açtığın 8 besin; dokun, aç.
- **Çoklu seçim:** Keşfet'te **☑ Çoklu seç**e bas, istediğin besinlere dokun, **Tarife ekle (her biri 100 g)** ile hepsini tek seferde ekle.
- **Sade tarif:** Her malzeme tek satır: −10 · gram · +10 ve porsiyon başı gram. Kaydırıcı, hazır gramlar ve fiyat **⚙ Ayarla**nın altında.
- **Kartlarda kısa özet:** Her besinde 100 g için kcal · protein · lif tek bakışta (veri yoksa yazılmaz). Ayarlar → Matriks'ten kapatılabilir.
- **En düşük kalan besinler:** Tarifte referansa göre en geride kalan 3 besin ve onları 100 g'da en çok veren besinler; dokununca o besin açılır. B12 ve D vitamini için “zenginleştirilmiş ürün veya takviye” notu. Veri olmayan bileşenler sayılmaz.
- **Sıralama:** Listeyi A–Z, enerji, protein ya da life göre sırala; veri olmayanlar sonda.
- **Güncellemeler:** Ayarlar → Güncellemeler yüklü sürümü gösterir ve sürüm sayfasını açar (masaüstünde dış tarayıcıda).
- **Koleksiyonlarım:** Kendi kategorilerini ve alt kategorilerini oluştur (ör. Kahvaltılıklar → Smoothie). Bir besinde **☆ Koleksiyon** düğmesine dokunup istediğin koleksiyona ekle ya da çıkar. Yeniden adlandır, alt kategori ekle, sil; yedek dosyasına dahil.
- **Daha sade ekran:** Besin seçince önce biçim ve **büyük, kolay sürüklenen gram kaydırıcısı** (1 g – 1 kg ölçekli) gelir; altında tek sıra eylemler. Telefonda ikincil düğmeler simgeye döner, hazır gram düğmeleri yana kayar, altı sekmenin hepsi sığar. Ayarlar en sağda.
- **Tam İngilizce:** 285 besin adı, kategoriler, matriks, tarif, karşılaştırma, ayarlar ve CSV iki dilde (Ayarlar → Dil).
- **Aion maskotu:** Drive'daki pembe-mavi Aion pozlarından kare kare (sprite sheet) animasyon. Ekrana göre el sallar, matriksi okur, veri yoksa üzülür, tarife besin eklenince zıplar. Ayarlar → **Aion** bölümünden gizle, sabit poza al, küçült/büyüt, sola/sağa taşı.
- Kişisel profil, günlük plan/tüketim matriksi, %80–200 arayüz ölçeği, bağımsız yazı ayarları, yedi renkli tema seçici (önceki beta).

## Bilinen sınırlar

- Windows/macOS paketleri imzasız; ilk açılışta sistem uyarı verebilir.
- Android APK geliştirici imzalı; iPhone `.ipa` imzasız olduğu için doğrudan kurulamaz.
- Otomatik güncelleme henüz yok; Ayarlar → Güncellemeler seni bu sayfaya getirir. Tarif ve ayarların cihazında kalır.

---

# Besin Matriksi 1.1.2 Beta 24 · Breads, doner, mezes and much more

Offline plant-based food composition matrix. Download the file for your device from **Assets**: Windows `portable.exe` (no install) or `Setup.exe`, Android `.apk`, macOS `.dmg`, Linux `.AppImage`/`.deb`/`.rpm`, or `offline.html` for any browser. New: 463 foods with Breads & bakery and Prepared dishes & mezes categories (doner, falafel, stuffed grape leaves, baklava…), ayran and cashew ayran as labelled recipe estimates, more seafood/animal foods, lion's mane and other mushrooms, protein powders and creatine, a Fibre box; the quick tour was removed. Also hibiscus, herbal and oolong teas; Turkish coffee and plant-milk latte/cappuccino (USDA FNDDS); einkorn, black rice, beluga lentils and americano listed with guidance. Also more foods visible (macadamia, Brazil nut, hemp, natto, teff, moringa…) and 9 new USDA foods (lambsquarters, watermelon seeds, groundcherry, chanterelle, sea moss…); nutritional yeast and psyllium can be added from your product label. Also one key-facts card with the calorie pie, a periodic-table food grid in Explore, more values from USDA FoodData Central Foundation Foods, Inter as the default font, Aion off by default. Also the log opens with the day and its key values (profile form at the bottom) and a calorie pie for the day. Also USDA flavonoid and isoflavone data (quercetin, catechins, anthocyanidins, daidzein…), a calorie pie chart (protein/carbs/fat/fibre) in Explore, Recipe and per food in Compare, a calories-only box. Also daily percentage bars for key nutrients against average adult women and men (PHE 2016) in food, recipe, Compare and log; sources at the bottom; recipe cost and ash row removed. Also Turkish kitchen measures (cup 200 ml, tablespoon, teaspoon), daily goal bars in the log, Aion greets by time of day and celebrates reached goals, polished Compare layout. Also more reliable start-up in Chrome (network-first page load, recovery button). Also key nutrition facts first, common foods first within categories, more everyday foods (breads, water…), a language card at the top of Settings. Also symmetric food picker, animal groups in the extended USDA catalogue. Also a unique hand-made picture for every food, dark theme and system font by default. Also animal foods in their own labelled categories (can be hidden), a dedicated icon for every food, a compact Compare screen. Also a 7-day energy chart in the log. Also a skippable 3-step quick tour on first launch. Also similar foods in food details. Also settings search, recipe list search/sort with kcal per serving. Also add a recipe to today's log by servings, turn a logged day into a recipe, recently viewed foods. Also multi-select to add several foods at once, one-line recipe ingredients with per-serving grams (⚙ Adjust for slider and price). Also per-100 g kcal/protein/fibre on food cards, sorting by name/energy/protein/fibre, a 'lowest nutrients' card in recipes with the richest plant sources, an Updates section in Settings. Earlier: your own collections with subcategories (add/remove foods with ☆), a calmer screen with a large gram slider, and full English UI. Also: Aion, the pink-and-blue axolotl mascot with frame-by-frame sprite animation. Known limits: packages are unsigned; no in-app updater yet.

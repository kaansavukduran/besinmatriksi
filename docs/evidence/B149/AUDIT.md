# B149 · Genel denetim · beta.36

15 Kasım 2026; kaansavukduran/besinmatriksi, üretim dalı ccr-1e1934aa-iv8aev.
Başlangıç: `9c7062988ef9f8dd085eb363556cc15eeb72937f` (beta.35).
İnceleme bu başlangıç ile B149 çalışma farkını kapsar. Yeni yayın makbuzu teslimde
ayrıca doğrulanır; bu rapor kendi commit kimliğini önceden bildiğini iddia etmez.

## Kapsam ve yöntem

İstenen dört skill uygulandı: Super-Unslop, Unslop, Fragaria Unslop,
Yazılım Denetle. Ana talimatlar ile görsel kalite, davranış, genişletilmiş
arayüz, kontrol listesi ve doğrulama/checkpoint kaynakları okundu.
Bu projede görsel hiyerarşi, gereksiz tekrar, dar ekran, klavye/erişilebilirlik,
kalıcı durum, yanlış başarı, hata sonrası tekrar deneme, CSV, yedek ve bilimsel
veri sınırları denetlendi. Oyun animasyonu/karakter kanonu bu ürüne uygulanmadı.
Skill paketleri proje kaynaklarına kopyalanmadı veya bu çalışmada değiştirilmedi.

Var olan krem/zeytin kimliği, yerel Bricolage başlıkları, kullanıcı okuma
fontu tercihi ve emojisiz kategori ayraçları korundu. Besin ölçümleri veya
referans ihtiyaçlar değiştirilmedi; eksik değerler sıfıra dönüştürülmedi.
Yeni bağımlılık, sunucu veya analitik eklenmedi.

Önce var olan testler çalıştırıldı: 138 birim ve 210 Chromium kabulü geçti.
Ardından hata yolları için yeni kontroller eklendi. Başlangıç testlerinin
geçmesi aşağıdaki kusurların bulunmadığını göstermiyordu.
Kontrollü kayıt hataları yalnız ayrı test tarayıcılarındaki sentetik verilerle
üretildi; gerçek kullanıcının sağlık kaydı okunmadı/değiştirilmedi.

## Bulgular ve düzeltmeler

| Kimlik | Önem | Tetikleyici ve önceki davranış | Düzeltme / final kanıt |
|---|---|---|---|
| B149-CSV01 | Orta | Bir malzemede AA ölçümü/protein eksik → CSV, null sınırlayıcı etiketini çevirmeye çalışıp `null.replace` hatasıyla indirmeyi kesiyordu. Önceki iki TR/EN birim kontrolü FAIL. | `src/export.js`: tam/kısmi/bilinmeyen ayrımı. Kısmi skor alt sınır etiketli; bilinmeyende veri yok. `audit-output.test.mjs` ve `recipe-amino.spec.mjs` gerçek indirme kontrolü PASS. |
| B149-CUSTOM01 | Orta | Depolama yazımı başarısız olsa bile özel besin belleğe ekleniyor, editör kapanıyor ve hata “Kaydedildi” ile örtülüyordu. Silme de kayıt sonucunu kullanmıyordu. Önceki UI kontrolü FAIL. | Önce kaydet, sonra belleği/görünümü değiştir. Hata halinde ad/değer taslağı ve editör kalır; oluştur/düzenle/sil ve tekrar deneme TR/EN PASS. |
| B149-PROFILE01 | Orta | Profil kaydet/güncelle/sil ve uygula yazım sonucunu yeterince kullanmıyordu. Başarısız kayıtta girilen ad silinebiliyor; profil uygulamasında ekranda açık tema, depoda koyu tema ve başarı bildirimi kalabiliyordu. UI/manual önceki kanıt var. | Aday profili/ayarları önce kaydet; başarıdan sonra belleğe ve ekrana geçir. Hata halinde önceki tema/profil/ad korunur. `audit-storage` ve `audit-controls` gerçek tekrar deneme ve yenileme PASS. |
| B149-DAY01 | Orta | Günlüğe ekle işlemi yazılamasa da başarı bildiriyor ve bellekte hayalet satır bırakıyordu. Önceki UI kontrolü FAIL. | Son başarılı kişisel durum kopyası; başarısız yazımda belleği geri al, başarı/animasyonu yalnız başarılı yazımda göster. Tek besin ve tarif ekleme, tekrarda tek kayıt, bağımsız kalıcı kayıt okuması PASS. |
| B149-IMPORT01 | Orta | Genel yedek grupları ayrı yazılıyor, hata sonuçları yok sayılıyordu; yarım yedek başarı olarak bildirilebiliyordu. Statik önceki yol ve yeni hata enjeksiyonu ile sınandı. | `saveImportState`: ham eski kayıtları al, grupları yaz, hatada yazılanları ters sırayla geri al. Geri alma da başarısızsa açık kurtarma uyarısı. Üç birim testi; profiles aşamasında hata/ham kayıtların eski haline dönmesi/tek başarılı retry UI PASS. |
| B149-RECOVERY01 | Yüksek | Bozuk kişisel kayıt kurtarılırken yazım başarısız olsa bile koruma bayrağı önceden kaldırılıyordu. Sonraki normal yazım kurtarılmamış kaydın üzerine yazabilirdi. Önceki yol statik olarak doğrulandı; bu özel senaryo için eski runtime FAIL kaydı yoktur. | Kişisel içeriği kaydetmeden belleğe alma/korumayı kaldırma yok. Bozuk ham kayıt + başarısız kurtarma + sonradan depolama açılması + günlük ekleme denemesi ham kaydı koruyor; geçerli tekrar kurtarma PASS. |
| B149-RECIPE01 | Orta | Tekli/toplu malzeme ekleme hatası başarı mesajıyla örtülüyordu. Toplu ekleme parça parça yazılıyor; seçici başarısız eklemede kapanıyordu. Önceki seçici kapanması manuel doğrulandı. | Tek ekleme başarısızsa malzemeleri geri al; toplu seçim bir yazımla kaydolur, hata halinde seçili liste kalır. Seçici hata halinde açık kalır; başarılı tekrar yalnız bir malzeme ekler ve yenilemede korunur. UI PASS. |
| B149-UI01 | Düşük | Günlük toplam sekme sayacı son açık tarifin malzeme sayısını gösteriyordu. Kalori satırı tarif adı/sayısıyla sıkışabiliyor; ortak kart başlığı sayfa başlığını yineliyordu. | Sayaç sanal toplamda tüm tarifleri sayar. Kalori ayrı alt satır; ortak kart “Birleşik besin değerleri”. Günlük toplam TR/EN testleri ve açık/koyu/mobil görüntü kontrolü PASS. |

Genel yedek için geri alma bir localStorage işlem taklididir; tarayıcı çoklu
anahtarları gerçek bir veri tabanı transaction'ı gibi atomik yazmaz. Geri alma
engellenirse kullanıcıya bunun olabileceği açıkça bildirilir. Kişisel yedek
kanalında bu çalışmanın doğruladığı güvence bozuk kayıt korumasıdır; o kanalın
bütün anahtarlarının tek atomik işlem olduğu iddia edilmez.

`persistRecipes` çağıran her bağımsız düzenleme eyleminin başarısız disk yazımında
taslağını aynı şekilde geri aldığı iddia edilmez. Bu artışın kabul kapsamı tekli,
seçici ve toplu **malzeme ekleme** işlemleridir. Çevrimdışı depolama dolu olduğunda
uygulama hata gösterebilir; sonsuz/garantili kalıcı alan vaat edilmez.

## Doğrulama sırası ve sonuçlar

1. Başlangıç kodu: 138/138 birim ve 210/210 Chromium masaüstü/telefon kabulü.
2. Kusur kanıtı: `/tmp/bm-audit-csv-before.log` iki FAIL;
   `/tmp/bm-audit-storage-before.log` özel besin/profil FAIL;
   `/tmp/bm-audit-personal-before.log` yanlış günlük başarısı FAIL.
   Profil uygulaması ve seçici kapanması ayrıca gerçek UI'da gözlendi.
3. Ana düzeltmelerden sonra geniş Chromium koşumu **238/238 PASS** (6,4 dakika):
   `/tmp/bm-audit-verified-browser.log`. Komut aşağıda.
4. Bunun ardından son iki kapı eklendi: profil uygulamasında başarısız ayar yazımı
   ve seçicide başarısız malzeme ekleme. **Final kod** yeniden derlendi;
   **143/143 birim**, **54/54 hedefli Chromium kontrolü PASS** (1,7 dakika).
   Son koşum TR/EN, masaüstü ve telefonu; profil/özel besin/günlük/yedek,
   seçici, AA/CSV ve günlük toplamı kapsar.
5. Son dört yeni UI kabulüyle koşumlar arasında 242 benzersiz vaka gözlendi.
   Bu, final kod üzerinde tek seferde 242/242 tam koşum yapıldığı anlamına gelmez.

```sh
node --test --test-isolation=none tests/*.test.mjs
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test --workers=2 --grep-invert 'tek HTML dosyası internet olmadan yerelden açılır' --reporter=line
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test --workers=2 tests/browser/audit-controls.spec.mjs tests/browser/audit-storage.spec.mjs tests/browser/recipe-amino.spec.mjs tests/browser/recipe-total.spec.mjs tests/browser/personal.spec.mjs --reporter=line
npm run build
npm run build:single
npm run data
node scripts/build-notices.mjs --check
git diff --check
```

- Final web/PWA ve yaklaşık 11,1 MB tek HTML derlemeleri PASS.
- 24 üçüncü taraf bildirimi PASS. Yalnız ürün sürüm bildirimleri güncellendi.
- Veri üretimi PASS; foods.json, foods-ext.json, efsa.json SHA256 değerleri aynı.
- Günlük toplam açık ve koyu tema bütün sayfa axe WCAG2.1AA: **0 ihlal**.
  Otomatik sonuç manuel ekran okuyucu kabulü yerine geçmez.
- Gerçek masaüstü/mobil görüntüler incelendi:
  `/workspace/b149-evidence/daily-light.png`, `daily-dark.png`, `daily-phone.png`.
  Dar ekranda öğün karşılaştırması kendi yatay kaydırma bölgesini kullanır;
  büyük yazı/%200 koşulu mevcut regresyon paketinde korunur.
- İlk günlük hata testi boş günlüğün besin satırlarını tamamen kaldırmasını
  bekliyordu; ürün doğru olarak “veri yok” satırını koruyor. Test gerçek giriş
  sayısı ve ham kalıcı kayıt üzerinden düzeltildi. Bu bir ürün hatası değildi.
- Sürüm yükseltilirken bildirimin henüz yeniden üretilmediği ara derleme
  uyumsuzluğu finalde temizlendi; final lisans kapısı PASS.

## Yayın ve kalan sınırlar

Her iki normal giriş adresi beta.35 üzerinde, yeni yayın öncesinde doğrulandı:
https://besinmatriksi.vercel.app/ ve
https://kaansavukduran.github.io/besinmatriksi/ . HTTP200; nohut seçimi, besin
değeri ve sayfa hatası olmaması gerçek tarayıcıda görüldü. Pages artık etkindir;
eski yetki engeli güncel durumu temsil etmiyordu. Beta.36 canlı kontrolü teslimde
ayrı bildirilir. İki alan adı aynı kişisel depolamayı paylaşmaz.

Yerel Firefox/WebKit kurulu değil; bu motorlar ve yeni CI sonucu bu yerel
kanıta dahil değildir. Yönetilen Chromium'un file:// politikası nedeniyle iki
vaka geniş koşumdan çıkarıldı; tek HTML derlemesi ve olağan web/çevrimdışı
akışlar ayrıca sınandı. Native paket, fiziksel cihaz, gerçek ekran okuyucu ve
baskı kabulü **NOT_RUN**. Yeni herkese açık native Release/store yayını yok.
Katalog hâlâ önceki 8.789 SR28 kaynak kaydı kapsamındadır; Cronometer'ın kapalı
kataloğuyla tam eşitlik veya her besinde eksiksiz ölçüm iddia edilmez.

Sonraki tek Forge: **B150**, açık Foundation/FNDDS kapsamını kaynak doğruluğu ve
performans bütçesiyle büyütme. Bu öneri bu çalışmada veri eklenmiş sayılmaz.

```text
GPT/Codex’e verilecek prompt
B149 beta.36 denetimini docs/evidence/B149/AUDIT.md ve CURRENT_STATE.json üzerinden sürdür. Sekiz bulgu grubu giderildi; 143 final birim, 238 geniş tarayıcı ve son iki kapıdan sonra 54 hedefli kabul var. Başarısız kayıtta başarı gösterme, kurtarılmamış bozuk kaydın korumasını kaldırma, eksik ölçümü sıfıra çevirme. Yayın/CI ve yerel kanıtları ayır. Sonraki tek Forge B150; veri genişletmeden önce kaynak izni, ölçüm biçimi ve performansı doğrula.
```

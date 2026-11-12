# 🫐 Besin Matriksi 1.1.2 Beta 12 · Her besinin kendi resmi

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

# Besin Matriksi 1.1.2 Beta 12 · A picture for every food

Offline plant-based food composition matrix. Download the file for your device from **Assets**: Windows `portable.exe` (no install) or `Setup.exe`, Android `.apk`, macOS `.dmg`, Linux `.AppImage`/`.deb`/`.rpm`, or `offline.html` for any browser. New: a unique hand-made picture for every food, dark theme and system font by default. Also animal foods in their own labelled categories (can be hidden), a dedicated icon for every food, a compact Compare screen. Also a 7-day energy chart in the log. Also a skippable 3-step quick tour on first launch. Also similar foods in food details. Also settings search, recipe list search/sort with kcal per serving. Also add a recipe to today's log by servings, turn a logged day into a recipe, recently viewed foods. Also multi-select to add several foods at once, one-line recipe ingredients with per-serving grams (⚙ Adjust for slider and price). Also per-100 g kcal/protein/fibre on food cards, sorting by name/energy/protein/fibre, a 'lowest nutrients' card in recipes with the richest plant sources, an Updates section in Settings. Earlier: your own collections with subcategories (add/remove foods with ☆), a calmer screen with a large gram slider, and full English UI. Also: Aion, the pink-and-blue axolotl mascot with frame-by-frame sprite animation. Known limits: packages are unsigned; no in-app updater yet.

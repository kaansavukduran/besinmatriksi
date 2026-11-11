# 🫐 Besin Matriksi 1.1.2 Beta 4 · Hızlı özet ve sıralama

Bitkisel besinlerin ayrıntılı besin matriksini gösteren, **internetsiz çalışan** uygulama.
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

# Besin Matriksi 1.1.2 Beta 4 · Quick facts & sorting

Offline plant-based food composition matrix. Download the file for your device from **Assets**: Windows `portable.exe` (no install) or `Setup.exe`, Android `.apk`, macOS `.dmg`, Linux `.AppImage`/`.deb`/`.rpm`, or `offline.html` for any browser. New: per-100 g kcal/protein/fibre on food cards, sorting by name/energy/protein/fibre, a 'lowest nutrients' card in recipes with the richest plant sources, an Updates section in Settings. Earlier: your own collections with subcategories (add/remove foods with ☆), a calmer screen with a large gram slider, and full English UI. Also: Aion, the pink-and-blue axolotl mascot with frame-by-frame sprite animation. Known limits: packages are unsigned; no in-app updater yet.

# 🫐 Besin Matriksi 1.1.2 Beta 2 · Aion geldi!

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

- **Aion maskotu:** Drive'daki pembe-mavi Aion pozlarından kare kare (sprite sheet) animasyon. Ekrana göre el sallar, matriksi okur, veri yoksa üzülür, tarife besin eklenince zıplar. Ayarlar → **Aion** bölümünden gizle, sabit poza al, küçült/büyüt, sola/sağa taşı.
- Kişisel profil, günlük plan/tüketim matriksi, %80–200 arayüz ölçeği, bağımsız yazı ayarları, yedi renkli tema seçici (önceki beta).

## Bilinen sınırlar

- Bazı eski ekranlarda İngilizce çeviri henüz tamamlanmadı (sıradaki iş).
- Windows/macOS paketleri imzasız; ilk açılışta sistem uyarı verebilir.
- Android APK geliştirici imzalı; iPhone `.ipa` imzasız olduğu için doğrudan kurulamaz.
- Uygulama içi otomatik güncelleme henüz yok; yeni sürümü bu sayfadan indir. Tarif ve ayarların cihazında kalır.

---

# Besin Matriksi 1.1.2 Beta 2 · Meet Aion! (English)

Offline plant-based food composition matrix. Download the file for your device from **Assets**: Windows `portable.exe` (no install) or `Setup.exe`, Android `.apk`, macOS `.dmg`, Linux `.AppImage`/`.deb`/`.rpm`, or `offline.html` for any browser. New: Aion, the pink-and-blue axolotl mascot with frame-by-frame sprite animation and settings (hide, still pose, size, side). Known limits: some legacy screens are not fully translated yet; packages are unsigned; no in-app updater yet.

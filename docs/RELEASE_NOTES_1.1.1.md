> Yayımlanmamış taslak. Son kullanıcı talimatıyla yeni herkese açık Release yayını yapılmaz; paketler yalnız workflow_dispatch artifact çıktısıdır.

## İndir ve dene

| Platform | İndirilecek dosya |
|---|---|
| Windows, kurulumsuz | `BesinMatriksi-portable-x64.exe` |
| Windows, kurulum | `Besin Matriksi_1.1.1_x64-setup.exe` veya `.msi` |
| Linux | `.AppImage`, `.deb` veya `.rpm` |
| macOS Intel + Apple Silicon | `Besin Matriksi_1.1.1_universal.dmg` |
| Android | `BesinMatriksi.apk` |
| iPhone | `BesinMatriksi-unsigned.ipa` (Apple imzası gerektirir) |
| Tarayıcı / her platform | `besin-matriksi-tek-dosya.html` |
| Web/PWA dağıtımı | `besin-matriksi-web-pwa.zip` |

iPhone IPA imzasızdır ve doğrudan kurulamaz. Safari/PWA alternatifi ve tüm
kurulum adımları `KURULUM.md` dosyasındadır. Windows/macOS paketleri de geliştirici
sertifikasıyla imzalanmamıştır. Android anahtar yoksa debug imzalıdır.

## Bu sürümde

- Çevrimdışı besin matriksi, tarif toplamları, maliyet ve karşılaştırma.
- Tema/font/görünüm profilleri, disleksi seçenekleri, özel hedefler ve birimler.
- A4 çıktısı için tablo düzeni; yazdırma sonrasında bölüm durumunu koruma.
- USDA SR28 tam bileşim tablosundan amino asitler, şekerler, yağ asitleri,
  D2/D3, fitosteroller, kafein ve betain gibi ek alanlar.
- MIT yazılım ve OFL yazı tipi bildirimleri uygulamaya gömülüdür; ayrı metin
  dosyaları da indirmelere dahildir.

Önemli veri değişikliği: IFCT paketinin MIT etiketi, NIN'in asıl veri yayınının
ürün kullanım iznini doğrulamıyor. NIN yazılı izni doğrulanmadığı için IFCT
verileri ve IFCT tabanlı tahminler bu sürümde çıkarıldı. USDA'da bulunmayan
fitat, oksalat, polifenol ve benzeri değerler **veri yok** olarak görünür.
Jaggery kaydı kaynak boşluğuyla korunur. Yağ asidi izomerleri ve toplamları
birbirinin yerine kullanılmaz. Kodun MIT lisansı diğer materyalleri MIT yapmaz.

Derleme kapıları: birim/veri/lisans testleri, masaüstü/telefon tarayıcı testleri,
PWA ve tek HTML üretimi. Native paketlerin fiziksel cihaz kabulü henüz yapılmadı.
`SHA256SUMS.txt` dosyası indirme bütünlüğünü kontrol etmek içindir.

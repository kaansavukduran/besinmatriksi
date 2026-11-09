# Besin Matriksi 1.1.1 kurulumu

Paketler: https://github.com/kaansavukduran/besinmatriksi/actions/workflows/release.yml

GitHub hesabınla oturum aç; başarılı çalışmanın Artifacts bölümünde platform arşivini indir. Son talimat yeni herkese açık Release yayımlanmamasını istediği için bu sürüm Actions çıktısı olarak sunulur.

- Windows: `BesinMatriksi-portable-x64.exe` kurulumsuz açılır. Alternatif setup EXE veya MSI. WebView2 çalışma zamanı gerekir; olmayan cihazda Microsoft'un WebView2 kurulumu gerekir.
- Linux: `.AppImage` dosyasını yürütülebilir yapıp aç (`chmod +x dosya.AppImage`). Debian/Ubuntu için `.deb`, RPM tabanlı sistemler için `.rpm` de bulunur.
- macOS: universal `.dmg`, Intel ve Apple Silicon içindir. Geliştirici imzası olmadığı için macOS ilk açılışta onay isteyebilir; yalnız bu resmî repo kaynağından indirdiğin dosyayı aç.
- Android: `BesinMatriksi.apk` dosyasını indirip aç. Gerekirse yalnız kullandığın indirme kaynağına uygulama yükleme izni ver. Geliştirici anahtarı tanımlı değilse paket debug imzalıdır; mağaza sürümü değildir.
- iPhone: `BesinMatriksi-unsigned.ipa` imzasızdır; doğrudan dokunup kurulan bir App Store uygulaması değildir. Kendi Apple geliştirici imzanla imzalayıp uygun Apple araçlarıyla yükleyebilirsin. Safari üzerinden PWA kurulumu daha kolaydır; PWA arşivini kendi HTTPS sunucuna koyarak Safari ile açabilirsin. Bu repoda GitHub Pages henüz etkin değil; bağlı entegrasyon Pages oluşturma isteğini HTTP 403 ile reddetti.
- Her platformda tek dosya: `besin-matriksi-tek-dosya.html` dosyasını indirip tarayıcıda aç. Fontlar, lisanslar ve veriler dosyada gömülüdür; ağ gerekmez. Mobil dosya görüntüleyicileri JavaScript'i kapatabiliyorsa PWA sürümünü kullan.
- Web/PWA: `besin-matriksi-web-pwa.zip` arşivini bir HTTPS sunucusuna aç. İlk çevrimiçi yükleme tamamlandıktan sonra çevrimdışı çalışır.

Manuel Actions arşivleri `SHA256SUMS.txt` içermez. Güncel kaynak SHA ve ZIP
özetlerinin kanıt dosyası `project_state/CURRENT_STATE.json` içindeki
`package_evidence_file` alanında belirtilir. `THIRD_PARTY_NOTICES.txt`,
platforma ait Rust bildirimleri ve `LICENSE.txt` lisans kayıtlarıdır.

Bu sürümde USDA SR28 açık verileri ve kullanıcı etiket kayıtları kullanılır.
IFCT verileri ve bunlardan türetilmiş tahminler dağıtılmaz. Sürüm notlarındaki
veri kapsamı ve test sınırlarını oku. Paketlerin derlenmiş olması fiziksel
cihazda kabul testlerinin tamamlandığı anlamına gelmez.

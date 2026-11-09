# 🫐 Besin Matriksi

Türkçe, çevrimdışı, özelleştirilebilir bitkisel besin matriksi ve tarif hesaplayıcı.
Windows · macOS · Linux · Android · iPhone · tarayıcı/PWA · tek HTML.

**[Paketleri indir: Actions / Artifacts](https://github.com/kaansavukduran/besinmatriksi/actions/runs/42593575878)** ·
[Kurulum adımları](docs/INSTALL.md) · [Geliştirme PR #2](https://github.com/kaansavukduran/besinmatriksi/pull/2)

## İndirip dene

Başarılı **Derle ve yayınla** çalışmasını aç, **Artifacts** bölümünden platform arşivini indir ve içindeki dosyayı aç. GitHub hesabınla oturum açman gerekir.
Son kullanıcı talimatı yeni herkese açık Release yayınına izin vermediği için bu sürüm yalnız Actions çıktısıdır:

| Platform | Dosya |
|---|---|
| Windows, kurulumsuz | `BesinMatriksi-portable-x64.exe` |
| Windows, kurulum | `Besin Matriksi_1.1.1_x64-setup.exe` veya `Besin Matriksi_1.1.1_x64_en-US.msi` |
| macOS Intel + Apple Silicon | `Besin Matriksi_1.1.1_universal.dmg` |
| Linux | `Besin Matriksi_1.1.1_amd64.AppImage`, `.deb` veya `.rpm` |
| Android | `BesinMatriksi.apk` |
| iPhone | `BesinMatriksi-unsigned.ipa`, Apple imzası gerekir |
| Her platformda tarayıcı | `besin-matriksi-tek-dosya.html` |
| HTTPS sunucusuna kurulan PWA | `besin-matriksi-web-pwa.zip` |

iPhone IPA **imzasızdır, doğrudan dokunup kurulamaz**; kendi Apple imzanla yükleme gerekir.
Windows ve macOS paketleri de geliştirici sertifikasıyla imzalanmamıştır.
Android anahtar tanımlı değilse debug imzalı APK üretilir.
Windows WebView2 gerektirir. Fiziksel cihaz kabulü henüz tamamlanmamıştır.

## Kullanım

- **Keşfet:** kategori → besin → tüketim biçimi → 1–1000 g. Hazır miktarlar, kaydırıcı, ±1/±10 ve kaynakta varsa ev ölçüleri. İsteğe bağlı ons gösterimi.
- **Tarif oluştur:** malzemeleri ekle, porsiyon veya pişmiş son ağırlık seç. Toplam/1 porsiyon/son ürünün 100 g'ı, TL/kg fiyat ve porsiyon maliyeti. Eksik fiyat veya besin bilgisi kısmi kapsamla gösterilir.
- **Karşılaştır:** 2–4 besini aynı miktar ve biçimde yan yana incele. En yüksek değer vurgusu sağlık açısından 'en iyi' anlamına gelmez.
- **Ayarlar:** 9 tema ve özel tema/kontrast ölçümü; 8 gömülü font ve sistem fontu; OpenDyslexic, Atkinson, Lexend; punto ve aralıklar; okuma cetveli; büyük imleç; atanabilir kısayollar; 12 görünüm profili.
- **Kendi matriksin:** bölümleri gizle/sırala, 24 öğeye kadar sabitle. AB/TGK etiket BRD'si veya elle girilen hedef. kcal/kJ ve sayı/birim tercihleri.
- **Yedek/çıktı:** tarif/etiket/profil yedeği; ayrı ayar veya tema dosyası; CSV; Türkçe karakterli ve sayfa numaralı A4 yazdırma/PDF. Yazdırmadan sonra bölüm durumları korunur.
- **Hakkında:** lisans ve telif bildirimleri internet olmadan okunabilir.

Veriler ve tercihler cihazda tutulur; uygulama çalışma anında CDN, analitik veya uzak veri servisi kullanmaz.
PWA'nın ilk çevrimiçi yüklemesi önbelleğe alınmalıdır; tek HTML dosyasında veri ve fontlar gömülüdür.

## Veri kapsamı ve lisanslar

**1.1.1 dağıtımı USDA SR28 tam ASCII bileşen tablosunu kullanır.**
285 Türkçe besin / 363 tüketim biçimi; 1672 ek bitkisel USDA kaydı.
Kaynakta bulunan amino asitler, şekerler, yağ asitleri, vitamin biçimleri,
fitosteroller, kafein ve betain gibi ayrıntılar dahil edilmiştir.

**IFCT 2017 verileri ve IFCT tabanlı tahminler bu sürümde dağıtılmaz.**
İkincil npm paketinin MIT etiketi, NIN'in asıl yayınındaki elektronik ürün kullanım
iznini doğrulamıyor. Resmî NIN metni ürün oluşturma için yazılı izin istiyor;
bu izin doğrulanmadı. [İnceleme ve kaynaklar](docs/LICENSE_AUDIT.md).

USDA'da olmayan fitat, oksalat, lif fraksiyonları ve birçok fitokimyasal alan
**'veri yok'** gösterir; 0 değildir. Jaggery kaydı kaynak boşluğuyla korunur.
İzomer ayrımı olmayan yağ asitleri özel izomer adıyla, MK-4 toplam K2 olarak
sunulmaz. Kaynakta eksik pişmiş değerler çiğ profilden tahmin edilmez.

Kod **MIT**: [LICENSE](LICENSE). Fontlar **SIL OFL 1.1**; Capacitor kendi MIT
koşullarıyla dağıtılır. Özgün metinler [THIRD_PARTY_NOTICES.txt](public/THIRD_PARTY_NOTICES.txt)
ve uygulamanın Hakkında bölümündedir. Native Rust bağımlılık dökümleri sürüm
indirmelerine ayrıca eklenir. MIT etiketi bütün veri/font/bağımlılıkları MIT yapmaz.

Bu uygulama eğitim amaçlıdır. Besinin varlığı, miktarı, emilimi ve sağlık etkisi farklı kanıtlardır.

## Geliştirme

```bash
npm ci
npm run data            # yerel USDA ham dosyalarından tekrar üret
npm run notices         # kurulu paketlerden özgün telif/lisans metinlerini üret
npm test
npm run build
npm run build:single
npx playwright install chromium
npm run test:browser
npm run dev
```

Masaüstü paketleri Tauri, mobil paketler Capacitor ile üretilir.
`release.yml` önce web/veri/tarayıcı kapılarını çalıştırır; ardından Windows,
macOS, Linux, Android ve iOS paketlerini kendi runner'larında oluşturur.
`v*` etiketi tüm kapılar başarılıysa GitHub Release yayımlar.
`workflow_dispatch` yalnız test/paket artifact'leri üretir.
Her artifact lisans metinleri ve kurulum rehberini içerir. Doğrulanan ZIP özetleri, kaynak SHA ve test/paket/çalışma zamanı ayrımı [kanıt kaydında](docs/evidence/1.1.1-packages.json).

USDA ham kaynak URL'si, arşiv özeti ve dönüşümler `data/raw/USDA_SR28_SOURCE.json`
içindedir. `NUT_DATA.txt.gz` yalnız geliştirme için sıkıştırılmış ham kaynaktır;
uygulama hazır JSON'u kullanır. Besin eklerken doğru USDA kayıt ve tüketim biçimini
`data/catalog.mjs` içinde eşle; kaynağı olmayan alanı doldurma.

Devam dalı `codex/forge-devam`. Önce `project_state/CURRENT_STATE.json`, sonra
[ROADMAP](docs/ROADMAP.md) ve Forge günlüğü okunur. Saatlik görev de aynı kalıcı
kayıtlardan ilerler; çalışma ortamı ve kullanım limitleri geçerlidir.

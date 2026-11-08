# 🫐 Besin Matriksi

Bitkisel (vegan) besinlerin **ayrıntılı besin matriksini** gösteren, **tamamen çevrimdışı** çalışan, fareyle (veya dokunarak) kullanılan, disleksi dostu ve özelleştirilebilir uygulama.

**Windows · macOS · Linux · Android · iPhone · tarayıcı (PWA) · tek dosya HTML**

## Neler yapar?

| Sekme | Ne işe yarar |
|---|---|
| 🔎 **Keşfet** | Kategori → besin → biçim (çiğ / haşlanmış / kavrulmuş…) → miktar (1 g – 1 kg). Hazır düğmeler (1, 5, 10, 25, 50, 100, 150, 200, 250, 500, 750 g, 1 kg), kaydırıcı, ±1 / ±10 ve USDA ev ölçüleri (1 su bardağı, 1 orta boy…). |
| 🥣 **Tarif oluştur** | İstediğin kadar malzeme ekle (ör. muz + yaban mersini), toplam matriksi gör. Porsiyon sayısı, pişmiş son ağırlık, “toplam / 1 porsiyon / son ürünün 100 g’ı” görünümleri. Tarifler cihazda saklanır, JSON olarak dışa/içe aktarılır. |
| ⚖️ **Karşılaştır** | 2–4 besini aynı miktarda yan yana koy; her satırda en yüksek değer vurgulanır. |
| 🎨 **Ayarlar** | 9 tema, vurgu rengi, 9 gömülü yazı tipi (**OpenDyslexic**, Atkinson Hyperlegible, Lexend, Andika, Nunito, Inter, Literata, Noto Sans Mono, sistem), yazı boyutu, satır/harf/sözcük aralığı, kalın yazı, yoğunluk, köşe yuvarlaklığı, **okuma cetveli**, animasyon azaltma, emoji aç/kapa ve hazır ön ayarlar (*Disleksi dostu*, *Az görme*, *Sakin*, *Pastel*). |

### Matrikste gösterilenler

1. **Kimlik:** ad, bilimsel ad, biçim, incelenen kısım ve atılan oran, ölçüm temeli, kaynak kayıtları
2. **Su, enerji (kcal + kJ), kül**
3. **Protein ve 18 amino asit** (esansiyel / koşullu esansiyel)
4. **Karbonhidrat ve şekerler:** fruktoz, glikoz, sakkaroz, maltoz, laktoz, rafinoz, stakiyoz, verbaskoz, ajugoz
5. **Nişasta ve lif:** toplam, çözünür, çözünmez
6. **Yağlar:** doymuş / tekli / çoklu / trans, ω-3 / ω-6 / ω-9, ~30 tekil yağ asidi (LA, ALA, EPA, DHA, erusik…), fitosteroller
7. **Vitaminler ve biçimleri:** A (RAE, retinol, karotenler), B1–B12, folat biçimleri, C, D2/D3, 4 tokoferol + 4 tokotrienol, K1/K2, kolin
8. **Mineraller:** Na, K, Ca, P, Mg, Fe, Zn, Cu, Mn, Se, Cr, Mo, Co, Ni, Li, tuz eşdeğeri
9. **Organik asitler:** sitrik, malik, tartarik, süksinik, fumarik, kinik, akonitik
10. **Fitokimyasallar:** toplam polifenol, 15 fenolik asit, flavonoller, flavonlar, flavanonlar, kateşinler (EGCG…), izoflavonlar, resveratrol, karotenoidler (likopen, lutein, zeaksantin…)
11. **Antinutrientler:** fitat, toplam/çözünür/çözünmez oksalat, saponinler
12. **Toksik metaller (ölçülen parti):** Al, As, Cd, Pb, Hg
13. **Hesaplanan göstergeler:** enerji dağılımı, protein yoğunluğu, PRAL, ω-6:ω-3, Na:K, fitat:Zn / fitat:Fe / fitat:Ca ve oksalat:Ca molar oranları, **amino asit skoru** ve sınırlayıcı amino asit
14. **Alerji ve tolerans:** AB-14 alerjenleri, gluten, FODMAP (GOS), besine özgü uyarılar
15. **Hazırlama ve emilim** notları, **kalıntılar / kapsam dışı** başlıklar ve **kapsam özeti**

Her satırda: miktar, birim, %BRD çubuğu (AB 1169/2011 & TGK), kaynak etiketi (**USDA / IFCT / Tahmin / Hesap**), varsa ikinci kaynağın değeri ve standart sapma.

## Veri ve dürüstlük ilkeleri

- **USDA SR28** (8 789 kayıt, kamu malı): temel bileşim, pişmiş formlar dahil.
- **IFCT 2017** (NIN-ICMR, Hindistan; `@ifct2017/compositions` MIT paketi): amino asitler, yağ asitleri, şeker türleri, polifenoller, fitat, oksalat, iz ve toksik mineraller (çiğ/kuru örnekler).
- **Tahmin:** pişmiş formlarda amino asit ve yağ asidi profili, aynı besinin çiğ IFCT ölçümünden protein/yağ oranıyla ölçeklenir ve açıkça “Tahmin” etiketlenir. Isıyla değişen bileşenler (vitaminler, polifenoller, fitat) **tahmin edilmez**.
- Ölçülmemiş bileşen **“veri yok”** yazar, **asla 0 sayılmaz**. Tariflerde eksik malzeme verisi **“kısmi n/m”** olarak işaretlenir.
- Küratörlü katalog: **285 Türkçe adlı besin, 363 biçim**, tamamı bitkisel/mantar/alg. İsteğe bağlı **geniş katalog**: USDA’dan ~1 900 bitkisel kayıt (İngilizce ad, hayvansal ve marka ürünler ayıklanmış).
- Veri yok: glisemik indeks, FODMAP porsiyon eşikleri, pestisit/mikotoksin, iyot, florür, biyojen aminler (açık veri setlerinde yok).

> Bu uygulama eğitim amaçlıdır; tıbbi veya diyetisyen tavsiyesi değildir.

## İndirme ve kurulum

Hazır paketler GitHub **Releases** sayfasında (`v*` etiketiyle otomatik derlenir) veya **Actions → “Derle ve yayınla” → Artifacts** altında:

| Platform | Dosya | Not |
|---|---|---|
| Windows | `BesinMatriksi-portable-x64.exe` | Kurulumsuz, çift tıkla çalışır (Windows 10/11 yerleşik WebView2) |
| Windows | `Besin Matriksi_x.y.z_x64-setup.exe` / `.msi` | Kurulum sihirbazı |
| macOS | `.dmg` (Intel + Apple Silicon) | İmzasız: ilk açılışta sağ tık → **Aç** |
| Linux | `.AppImage`, `.deb`, `.rpm` | AppImage: `chmod +x` sonra çalıştır |
| Android | `BesinMatriksi.apk` | “Bilinmeyen kaynaklardan yükleme” izni gerekir |
| iPhone | `BesinMatriksi-unsigned.ipa` | AltStore / Sideloadly ile kendi Apple kimliğinle imzalayıp yükle |
| iPhone / Android (en kolay) | PWA | Pages sürümünü Safari’de aç → Paylaş → **Ana Ekrana Ekle**; ilk açılıştan sonra çevrimdışı çalışır |
| Her yer | `besin-matriksi-tek-dosya.html` | Tek dosya, çift tıkla tarayıcıda açılır, internet gerekmez |

## Geliştirme

```bash
npm install
npm run dev            # http://localhost:5173
npm test               # veri ve hesaplama testleri
npm run build          # dist/ (PWA + service worker)
npm run build:single   # dist-single/besin-matriksi.html
npm run data           # data/raw → src/data (ham kaynaktan yeniden üret)
npx tauri build        # masaüstü paketi (Rust + platform bağımlılıkları gerekir)
npx cap add android && node scripts/mobile-icons.mjs android && npx cap sync android
```

- Besin eklemek: `data/catalog.mjs` içine USDA NDB numarası ve (varsa) IFCT kodu ile bir satır ekle, `npm run data` çalıştır. Kod yoksa derleyici hata verir.
- Android imzası (isteğe bağlı): repo sırlarına `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` eklenirse imzalı release APK üretilir; yoksa debug imzalı APK.

## Lisans

Kod: MIT. Veriler: USDA SR28 kamu malı; IFCT 2017 verisi `@ifct2017/compositions` (MIT) paketinden, kaynak: Longvah T. ve ark., *Indian Food Composition Tables 2017*, NIN-ICMR. Yazı tipleri: SIL Open Font License (Fontsource üzerinden).

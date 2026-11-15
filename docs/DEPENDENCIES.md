# Geliştirme bağımlılıkları

2026-11-09: Tarayıcı regresyonları için `@playwright/test` (Apache-2.0) ve
`@axe-core/playwright` (MPL-2.0) yalnızca geliştirme bağımlılığı olarak seçildi.
Playwright Microsoft tarafından, axe Deque tarafından bakımı yapılan projelerdir.
Chromium ile Linux CI ve yerel test; Windows/macOS geliştirme ortamları desteklenir.
Bu paketler Vite üretim paketine veya Tauri/Capacitor uygulamasına girmez.
Çalışma anında CDN, analitik veya ağ servisi eklenmez. Kilitli sürümler package-lock.json içindedir.

## Bricolage Grotesque başlık yazısı · 2026-11-15

Kullanıcının Fragaria başlık kimliği isteği için `@fontsource/bricolage-grotesque`
**5.3.0** seçildi. npm kayıt bilgisi aynı gün doğrulandı: lisans **OFL-1.1**,
bakım/dağıtım kaynağı [Fontsource font-files](https://github.com/fontsource/font-files/tree/main/fonts/google/bricolage-grotesque).
Paket yalnız yazı tipi ve CSS kaynakları içerir; yeni çalışma zamanı kodu veya servis eklemez.
Vite yalnız kullanılan normal 700 ağırlığının Latin ve Latin Extended WOFF2 dosyalarını
uygulamaya paketler. Web/PWA, tek dosya HTML, Tauri ve Capacitor aynı yerel dosyaları kullanır;
CDN veya Google Fonts isteği yapılmaz. Fontsource'un OFL lisansı ve özgün telif metni
mevcut üçüncü taraf bildirim üretimine dahil edilir.

Başlık yazısı gövde fontundan ayrıdır. Atkinson Hyperlegible, OpenDyslexic, Lexend veya
Andika seçildiğinde başlıklar da kullanıcının okunabilirlik tercihini izler. Bu değişiklik
kayıtlı font, ölçek veya yazı boyutu ayarını değiştirmez. Türkçe büyük/küçük harflerin
çevrimdışı dosyalarda bulunması ve tarayıcıda gerçek başlık akışı ayrıca doğrulanır.

Glif doğrulaması: Latin + Latin Extended 700 dosyalarının birleşik cmap'inde
`ÇĞİÖŞÜçğıöşü` karakterlerinin tamamı vardır. FontTools ile aynı paketin WOFF
cmap'i, Fontconfig `fc-scan` ile üretimde paketlenen iki WOFF2'nin cmap'i ayrı
kontrol edildi. FontTools'un WOFF2 okuyucusu bu ortamda isteğe bağlı Brotli Python
modülünü bulamadığı için WOFF2 kontrolünde mevcut Fontconfig kullanıldı. Bu
kontrol var olmayan bir glifi sistem fontuyla tamamlamaz.

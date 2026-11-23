# B261 · Besin Matriksi ilk kullanım önizlemesi

Taban `main/c716487`, yayımlı `1.1.2-beta.70`. B260 CI, GitHub Pages ve Release aynı commit üzerinde tamamlandı. B261 yerel çalışma ağacındaki önizlemedir. [B260 CI](https://github.com/kaansavukduran/besinmatriksi/actions/runs/45087277902) · [Canlı beta.70](https://kaansavukduran.github.io/besinmatriksi/) · [Release](https://github.com/kaansavukduran/besinmatriksi/releases/tag/v1.1.2-beta.70)

## Denemeler

- Arama, doğrudan miktar, ilk besin değerleri ve açık tarihli günlük kaydı gerçek kullanıcı girişlerinden denendi. Günlük depolama hatası ve tekrar deneme, geri alma, klavye odağı ve eski WebView seçici davranışı için tarayıcı testleri eklendi.
- Beslenme filtreleri, kategori düzeni, Tam Katalog, mevcut kayıt ve yedek biçimleri yeniden kullanıldı. Tarif ve Günlük Toplam Tarif aynı hesapları, amino asit skoru ve günlük referansları kullanır.
- `node --test --test-isolation=none tests/*.test.mjs` 357/357 geçti. `npm run build`, `npm run build:single`, `npm run build:lite` ve `node scripts/build-notices.mjs --check` geçti.
- İlk Chromium taramasında 396 senaryo geçti ve dokunmatik cihaza özgü bir masaüstü senaryosu atlandı. Başarısız 23 senaryonun tamamı değişen kontroller, yerel koşu koşulları veya binlik ayırıcılı miktar düzeltmesinden sonra son üretim derlemesindeki 38/38 hedefli koşuda doğrulandı. İlk kullanım ve gezinme için ayrı koşu 24/24 geçti. Küçük ekran ve büyük metin, kayıt hatası, geri alma, PDF ve 10 kg sınırı kapsandı.
- 390 × 844 Chromium telefon görünümünde ilk besin satırı 603 px yerine 311 px’den başlıyor.
- Son tek HTML dosyası Chromium’da çevrimdışı açıldı. 150 g muz ve 5 kg nohut doğru miktarla kaydedildi ve HTTP isteği oluşmadı. Yerel önizleme SHA-256 `22e2d4c9b2c13b875147bb9fcb6a383637f49729ca8647a1ef7b06beba3966e1`.
- Firefox ve WebKit’te Tarif ve Karşılaştırma gerçek girişlerinden denendi. WebKit’te arama, miktar, Günlük’e kayıt, Escape ve odağın geri dönmesi de doğrulandı. Bunlar masaüstü tarayıcı ve emülasyon denemeleridir.

## Ürün kabulü

Katılımcıya düğme ve sekme adlarını söylemeden üç görev verilir. 150 g muzun değerlerini bul, bugüne bir besin kaydet, iki malzemeli tarifin toplamını bul. Her görevde yardımsız tamamlama, süre ve ilk duraksama kaydedilir. Hedef her görev için 4/5 yardımsız tamamlama. Katılımcı, fiziksel cihaz ve ekran okuyucu denemeleri bekliyor. Kullanıcı B262’de web yayınına açık yetki verdi.

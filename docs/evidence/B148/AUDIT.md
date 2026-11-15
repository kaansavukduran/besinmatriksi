# B148 · beta.35

Depo kaansavukduran/besinmatriksi, dal ccr-1e1934aa-iv8aev; başlangıçf11117e13ad8a6fb673d5037d3f7bca9e779d3d6.

## Sonuç

Yeni Günlük Toplam Tarif her zaman son tarif öğesidir; arama/sıralama onu gizlemez veya ara tarifler arasına taşımaz. Kaydedilen tarif listesine eklenmez; normal ad/düzenleme/silme sahipleri korunur. İki,üç,beş veya daha fazla tarifte aynı döngü çalışır. Üstte adları değişmeden heröğün, enerji/protein/karbonhidrat/şeker/yağ/doymuşyağ/lif/tuz; altta ortak temel kart, matris, mikro, amino asit kalitesi ve kaynak. Satır adından özgün tarife dönülebilir.

Başlangıç varsayımı listedeki tüm tariflerin tam miktarıdır. Kullanıcı görünür Her tariften1porsiyon seçeneğine geçebilir; miktarlar her tarifin kendi porsiyon sayısına bölünür. Yeni recipeTotalBasis varsayılan/enum/ayar yedeği/reset sahibiyle kaydedilir; eski tercihler korunur. Görünüm kişisel günlüğe otomatik tüketim eklemez. Boş tarif yeni ölçüm veya0değer yaratmaz. Bulunamayan malzeme gramı/kısmi kapsam korunur. Aynı besin farklı öğünlerde ayrı katkı olarak kalır.

CSV, mikro kaynak bağlantısı ve kaynak bileşeni seçimi aynı sanal toplam sahibine bağlandı; arka plandaki son tek tarif yanlışlıkla dışa aktarılmaz. Kaynak dökümü öğün adını da gösterir. Grafikler B147deki aynı hesap sahibinden gelir. Pişmiş ağırlık yalnız tüm dolu tariflerde tanımlıysa bilinen toplam kabul edilir.

## Kabul

- PASS node --test --test-isolation=none tests/*.test.mjs138/138. Üç tarifin600kcal toplamı/550kcal porsiyon toplamı, kaynak ad/ID değişmezliği, yinelenen malzeme katkıları, boş/eksik kayıt kapsamı ve yeniayar doğrulama/yedek.
- PASS npm run build; npm run build:single; git diff --check. Web/PWA ve tek HTML üretildi.
- Mevcut tarif listesi arama/sıralama testinin gerçek tarif seçicisi data-rname ile kapsamlandı; otomatik görünüm ayrı testte her zaman görünür ve sonda.
- Önceki18-test regresyonunda10mevcut tarif listesi/amino kontrolü ve4yeni reflow geçti. Yeni anaakış testi önce kaynak metninin yuvarlanmamış422,5olmasını bekledi; arayüzün doğru423gösterimiyle uyumlandı (CSV422,5korundu). Sonraki testin addInitScript'i yeniden açılışta ayarı kendisi sıfırlıyordu; ilk kurulumla sınırlandırıldı. Bunlar uygulama kusuru olarak raporlanmadı.
- Final paket PASS PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/browser/recipe-total.spec.mjs --reporter=line8/8 (27,6sn). TR/EN, masaüstü1440×1000/telefon390×844; ek320×900+28px/%200. Önceki10kontrolle18benzersiz kabul vardır; tek18/18koşumu iddia edilmez.
- Normal girişten iki tarif oluştur/adlandır→467kcal bütün toplam→her tariften1porsiyon423gösterim(422,5ham)→kaynakta herikiöğün→CSV→yenile ve kapsam tercihi korunur→öğün adına tıkla/gram artır→toplam güncellenir→beştarifeçıkar→arama eşleşmese de toplam görünür ve5satır var. Kalıcı listede yalnız2/5gerçek tarif; sanal özet yok. pageerror0.
- Eksikristretto kaydı→≥toplam ve belirsizprotein AA görünümü; tablo tek yatay kaydırma bölgesinde,320px/%200kök taşması yok. Tablo satırından tarif düzenleme ana eylemi erişilebilir.
- PASS yeni toplam görünümünde axeWCAG2.1AA0ihlal. Üçöğün1440×1200ve390×844gerçek görüntüler /workspace/b148-evidence altında incelendi.
- NOT_TESTED fiziksel cihaz, ekran okuyucu, Firefox/WebKit ve native kurulum bu sürümde. Yazdır düğmesi mevcut yazdırma sahibine bağlı; yeni fiziksel baskı kabulü yapılmadı. Native Release/store yayını yok. YeniCI ve Vercel canlı kabulü yerelden ayrı, teslimde bildirilir.

Tek sonraki ForgeB149.

```text
GPT/Codex için: B148 otomatik günlük tarif toplamı tamamlandı. Sanal özeti savedrecipes içine ekleme; aynı öğünü iki kez veya özeti kendisine dahil etme. Kapsam tam tarif/1porsiyon açıkça seçilir ve kaydedilir. 138birim+8final yeni UI+10mevcut regresyon kabulü. SonrakiB149.
```

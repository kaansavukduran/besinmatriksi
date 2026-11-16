# B154 · Kuru kayısı adı ve kaynak açıklığı · beta.41

16 Kasım 2026. Başlangıç `07bba0f9fa433d1325027dc0cf9019840edbc082`,
dal `ccr-1e1934aa-iv8aev`. Son kullanıcı isteği önceliklidir; önceki kaynak
genişletmesi B155'e taşınmıştır.

Görünen ad Kuru kayısı / Dried apricots. Kayısı kurusu ve eski kükürtlü adının
araması çalışır. Kükürtsüz/gün kurusu eş anlamlı olarak eklenmedi. USDA09032
kaynağının özgün açıklaması “Apricots, dried, sulfured, uncooked”; kükürt
dioksitle işlenmiş ürün ölçümü olduğu TR/EN ayrıntı notunda açıklanır. Sülfit
alerjen bilgisi silinmedi, kükürtsüz ürün için ölçüm varmış gibi sunulmadı.

153/153 birim testi; web/PWA ve tek HTML11,24MB;24 lisans bildirimi PASS.
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/browser/apricot-name.spec.mjs tests/browser/catalog-tree.spec.mjs`:16/16 PASS(48,1sn).
TR/EN desktop/phone: arama→sade ad→ayrıntı→kaynak notu/sülfit→241kcal→tarif→
yenileme; eski `{t:'c',id:'kuru_kayisi',f:0}` referansı ve görünür ad korunur.
Mevcut meyve/sebze/soya/içecek hiyerarşisi ve320px/28px/%200 regresyonu PASS.

693önceki besinin bütün forms,allergens ve dietary alanları tam karşılaştırıldı.
Yalnız kuru_kayisi.tr ve note değişti; biçim sırası/besin değerleri/kaynaklar
aynı. src/data/foods-ext.json ve EFSA verisi değişmedi. Veri üretimi tekrarında
üretilmiş dosyalar aynı; git diff --check PASS.

Fiziksel cihaz/ekran okuyucu/yerel diğer motorlar/native NOT_RUN. Yeni
bağımlılık, ölçüm, native Release veya mağaza yayını yok. Web yayınları kod
gönderiminden sonra canlı sürüm/akış üzerinden ayrıca doğrulanır.

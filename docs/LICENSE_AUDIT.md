# Lisans ve kaynak incelemesi · 9 Kasım 2026

Bu kayıt incelenen kaynakları, yapılan değişiklikleri ve inceleme sınırını açıklar;
tüm geçmiş veya gelecekteki kullanımlar için hukuki uygunluk garantisi değildir.

## Uygulama kodu

Depodaki LICENSE: MIT, Copyright (c) 2026 Kaan Savukduran.
MIT kullanıma, değiştirmeye ve dağıtıma izin verir; telif ve izin metninin ilgili
kopyalarda korunmasını ister. MIT diğer bileşenlerin lisansını değiştirmez.
Resmî metin: https://opensource.org/license/mit

## USDA

Resmî lisans açıklaması: https://fdc.nal.usda.gov/api-guide/ (Licensing).
USDA verileri public domain / CC0 olarak açıklanır; kaynak gösterilmesi istenir.
SR28 resmî arşivi ve kullanım belgeleri:
https://www.ars.usda.gov/northeast-area/beltsville-md-bhnrc/beltsville-human-nutrition-research-center/methods-and-application-of-food-composition-laboratory/mafcl-site-pages/sr11-sr28/

Tam ASCII arşivi indirildi. Kaynak URL/özet ve dosya dönüşümleri
`data/raw/USDA_SR28_SOURCE.json` içinde kayıtlıdır. Bileşen kimliği/birim eşlemesi
özgün NUTR_DEF tablosuna karşı test edilir. Özel izomer ile toplam/ayrıştırılmamış
ölçüm aynı alanmış gibi birleştirilmez.

## IFCT 2017: dağıtımdan çıkarıldı

İkincil `@ifct2017/compositions` paketi MIT metni içeriyordu; bu tek başına
asıl veri yayınının ürün kullanım koşullarını karşılamıyor.

Resmî NIN yayını:
https://www.nin.res.in/ebooks/IFCT2017_16122024.pdf
PDF'nin ikinci fiziksel sayfası, kaynak belirtilerek kişisel çoğaltmaya izin
verirken elektronik bir ürün oluşturma amacıyla depolama/çoğaltma için NIN'in
önceden yazılı iznini şart koşuyor. Dosya 9 Kasım 2026'da indirilip bu sayfa
okundu. Yazılı izin elde edildiğine ilişkin kanıt yok.

1.1.1 güncel dağıtım ağacından ham IFCT CSV, derlenmiş IFCT değerleri, ikinci
kaynak değerleri/standart sapmalar ve IFCT oranlarından türetilmiş tahminler
çıkarıldı. Yerlerine USDA'nın formun kendisine ait kaydı varsa o kullanılır;
yoksa açık veri boşluğu kalır. Bir besinin verisi farklı bir besinle doldurulmaz.
Beş yağ mevcut doğru USDA kayıtlarıyla ve açık varyant adıyla eşlendi; Jaggery
kaydı sıfır değer uydurmadan korundu.

Eski Git geçmişi ve eski Actions çıktıları bu işlemle silinmedi. Bu sürüm kaydı,
geçmiş sürümlere geriye dönük izin sağlandığı anlamına gelmez. NIN izni
belgelenmeden otomasyon IFCT verisini yeniden eklememelidir.

## Font ve yazılım bildirimleri

Kurulu sekiz `@fontsource/*` paketinin LICENSE dosyası OFL-1.1 olarak doğrulandı;
yazar telifleri ve tam metinleri değiştirilmeden üretime taşınır.
OpenDyslexic'in Reserved Font Name bildirimi korunur; font dosyaları değiştirilmez.
Capacitor core/android/ios MIT metinleri ve uygulamanın MIT metni de dahil edilir.

`scripts/build-notices.mjs` 13 kaynak/lisans kaydını üretir. Tam metinler
`src/data/notices.json` ile uygulamaya gömülür ve
`public/THIRD_PARTY_NOTICES.txt` olarak PWA/native içeriğine eklenir. Tek HTML'de
Hakkında bölümünden çevrimdışı okunur. CI özgün metinlerin güncelliğini denetler.

Native derleme, Cargo'nun çözdüğü bağımlılıkların SPDX/kaynak ve bulunan özgün
lisans dosyalarını platforma ait ek metinlerde toplar. Tam metni bulunmayan
paketler açıkça sayılır; metadata dökümü bütün işletim sistemi/kütüphane lisansları
hakkında genel bir hukuki denetim yerine geçmez. Gelecek bağımlılık/font/veri
eklemelerinde aynı koşul ve kaynak kontrolü yeniden yapılmalıdır.

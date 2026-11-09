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

`scripts/build-notices.mjs` EFSA bildirimiyle birlikte 14 kaynak/lisans kaydını üretir. Tam metinler
`src/data/notices.json` ile uygulamaya gömülür ve
`public/THIRD_PARTY_NOTICES.txt` olarak PWA/native içeriğine eklenir. Tek HTML'de
Hakkında bölümünden çevrimdışı okunur. CI özgün metinlerin güncelliğini denetler.

Native derleme, Cargo'nun çözdüğü bağımlılıkların SPDX/kaynak ve bulunan özgün
lisans dosyalarını platforma ait ek metinlerde toplar. Tam metni bulunmayan
paketler açıkça sayılır; metadata dökümü bütün işletim sistemi/kütüphane lisansları
hakkında genel bir hukuki denetim yerine geçmez. Gelecek bağımlılık/font/veri
eklemelerinde aynı koşul ve kaynak kontrolü yeniden yapılmalıdır.

## Native kaynak metni eksikleri (B040b)

İlk Cargo dökümü 404 paket arasında tam dosyası bulunmayan 36 kayıt gösterdi.
`COPYRIGHT-RUST.txt` gibi dosyalar da taramaya dahil edildi. Diğer eksiklerin
kaynak depoları ve crate arşivlerindeki `.cargo_vcs_info.json` commit'leri
incelendi. Gerekli metinler `data/licenses/native/` altında URL ve SHA-256 ile
saklanır; kaynakta olmayan yazar/telif metni uydurulmaz. R-efi'nin AUTHORS dosyası
MIT koşullarını içerir; selectors'ın MPL başlığı ve Mozilla'nın resmî MPL metni
korunur. Git VCS metadata'sı olmayan winapi GNU destek paketleri için upstream
0.3.9 kaynak referansı ayrıca `crate_vcs_verified: false` olarak işaretlidir;
exact crate commit'i doğrulanmış gibi gösterilmez.

Metin özeti değişirse veya yeni bir bağımlılığın lisans metni bulunamazsa native
paket kapısı hata verir. Bu denetim sistem kütüphaneleri veya hukuki risklerin
bütünü için garanti değildir. Her platform artifact arşivine uygulama MIT ve
font/Capacitor bildirimleri de eklenir.

## EFSA DRV Finder (B003b)

9 Kasım 2026 resmî web yeniden kullanım bildirimi ve Finder JSON tablosu okundu.
Copyright © European Food Safety Authority – EFSA; kaynak gösterilerek yeniden
kullanım yetkilidir. Tekil belgelerin özel koşulları ayrıca geçerlidir. İzin metni
ve ürünün bağımsız dönüşüm açıklaması `data/references/EFSA_REUSE_NOTICE.txt`
içinde korunur; Hakkında/tek HTML/PWA/native indirme bildirimlerine gömülür.
Bu materyal MIT veya CC0 diye etiketlenmez; EFSA onayı iddia edilmez.

Yalnız resmî web JSON'undaki bir sayısal PRI/AI alt kümesi dönüştürülür. Görüş
PDF/şekilleri, EFSA logosu ve üçüncü taraf fotoğraflar içe alınmaz. Kaynak/bildirim
SHA'ları ve erişim anı EFSA_SOURCE.json'dadır. Kaynak dosyaları checkout sırasında
satır sonu dönüşümüyle değişmesin diye `.gitattributes` bu dosyaları byte olarak korur.

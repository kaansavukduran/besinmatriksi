# Kişisel profil ve günlük / Personal profile and diary

**Günlük ve profil** sekmesinde yaş, boy, kilo ve aktiviteyi gir, **Profili kaydet** düğmesine bas. İsteğe bağlı Tanita bölümüne yağ/su yüzdesi, kas/kemik kg, viseral seviye (yüzde değildir), metabolik yaş, cihaz bazal enerji tahmini, ölçüm tarihi ve not yazılabilir. Bu alanlar birbirinden türetilmez. Taslak değişiklik kaydedilene kadar gerçek günlük hesabını değiştirmez.

**Keşfet** ekranında besin/biçim ve 1–1000 g seç, günlüğe ekle. Eklemek tüketildi demek değildir: günlükte açıkça tüketildi işaretle. Tarih ve planlanan/tüketilen filtresini seç. Silmeyi geri alabilirsin. Bileşen grubunu açınca miktarı, ölçümlü kayıt kapsamını, kullanılabilir referansı ve farkı görürsün; kaynak ayrıntısı USDA kaydı ve katkı girdilerini açar.

Enerji: Mifflin ve arkadaşları (1990), DOI **10.1093/ajcn/51.2.241**: `9.99 × kg + 6.25 × cm − 4.92 × yaş + 166 × erkek − 161`. Çalışma yaşları 19–78. Günlük enerji, dinlenme tahmini × açıkça seçilen PAL (1.4/1.6/1.8/2.0; EFSA 2013, DOI **10.2903/j.efsa.2013.3005**). Gerekli bilgi yoksa veya kapsam dışı yaş/özel durum seçilmişse tahmin gösterilmez. Cihaz enerji girdisi ayrı kaynak olarak etiketlenir; laboratuvar ölçümü sayılmaz. Yağ oranı bu denkleme katılmaz. Kaynak doğrulama kaydı: `data/references/ENERGY_MODEL_SOURCE.json`; makale/özet yeniden dağıtılmaz.

Referans farkı tanı veya güvenli üst sınır değildir. PRI/AI ve etiket BRD'si farklı türlerdir. Tam ölçüm kapsamı yoksa “eksik/fazla” sonucu üretilmez. Ölçülmemiş amino asit/yağ asidi/polifenol sıfır değildir; tanımlı hedef bulunmayan bileşene hedef uydurulmaz. Kişisel enerji hedefi günlükte ayrı gösterilir. EFSA grubuna profil aktarmak açık bir seçimdir; demir/fitat koşulları yine ayrıca seçilir, elle hedefler korunur.

**Ayarlar → Görünüm**: dil, sistem/açık/koyu/yüksek kontrast tema, arayüz ölçeği %80–200 (5 adım, hazır düğmeler, %135 elle), ölçeği ayrı sıfırlama, bağımsız font/yazı boyutu/satır/harf/kelime boşluğu. Yedi renk alanı hazır renk/HEX/sistem renk seçimi ve kontrastla düzenlenir. Büyük ölçekte telefonda sayfa dikey kaydırılır; besin tabloları odaklanabilir yatay kaydırma alanıdır. Yeni ekranlar TR/EN; eski matriks/tarif/EFSA ayrıntılarında Türkçe kalan metinler B051'de açıktır.

Sakin keşif ilerlemesi varsayılan kapalıdır. Profil kaydetme, plan ekleme ve kaynağı inceleme adımlarını sayar; yeme/kalori/kilo hedefi, ceza veya seri yoktur. Animasyon ayrı kapatılabilir, sistemin azaltılmış hareket tercihi uygulanır.

Kişisel/günlük JSON dışa aktarma ve içe aktarma cihazlar arasında taşıma içindir; aynı yedek iki kez yüklenince kayıtlar çoğalmaz. Kullanıcı besin kimliği çakışması korunur. Tüm kayıtlar cihazda tutulur; sağlık verileri GitHub'a/Drive'a gönderilmez. Tarayıcı depolama izni yoksa açılış ve bellek içinde kullanım sürer, kalıcı kayıt hatası bildirilir. İçe aktarma için çalışır yerel depolama gerekir.

## English quick start

Open **Daily & profile**, enter age, height, weight and activity, then save. Optional device fields remain distinct user entries. The energy result is an estimate within the stated age/special-context scope, using either the cited Mifflin equation or your separately labeled device estimate and a chosen PAL.

In **Explore**, choose a food/form and 1–1000 g, then add it to the diary. Entries start as planned; explicitly mark them consumed. Open nutrient groups to see amounts, source coverage, references and supported differences. Missing measurements are never zero. Undefined amino-acid/polyphenol targets remain undefined; differences are not diagnoses or upper limits.

Appearance settings offer TR/EN, system theme, UI scale 80–200%, independent typography and seven custom colors. Optional discovery progress and animations can be turned off. Export personal JSON locally for backup; imports preserve existing records and avoid duplication. Legacy screens still have untranslated Turkish strings. No health data are transmitted.

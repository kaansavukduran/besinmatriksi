// B191: UK CoFID 2021 (Open Government Licence v3) ile elle doğrulanmış besin eşlemesi.
// Kural: ad + hazırlama biçimi aynı olmalı VE ana bileşim (su ±5 g, protein ±%25 veya ±1 g) USDA kaydıyla uyuşmalı.
// Değerler YALNIZ USDA'da (ve ABD özel veritabanlarında) ölçülmemiş hücreleri doldurur; 'Tr' (iz) ve 'N' (ölçülmemiş) kullanılmaz.
// Otomatik ad eşleşmesi güvenilmezdi (ör. pak choi→kırmızı lahana, badem→yer fıstığı, tahin→kaju, agar→kombu); bu yüzden liste elle.
export const COFID_MAP = {
  portakal: { suyu: '14-369' },
  ayva: { cig: '14-241' },
  nektarin: { cig: '14-380' },
  bogurtlen: { cig: '14-388' },
  kuru_incir: { kurutulmus: '14-395' },
  kuru_longan: { kurutulmus: '14-137' },
  biber_kirmizi: { cig: '13-524' },
  sari_biber: { cig: '13-526' },
  taze_fasulye: { haslanmis: '13-515' },
  kirmizi_lahana: { cig: '13-190' },
  brokselahanasi: { cig: '13-177' },
  domates_konserve: { konserve: '13-530' },
  balkabagi_butternut: { firin: '13-644' },
  tatli_patates: { cig: '13-463' },
  yerfistigi: { kavrulmus: '14-878' },
  kirmizi_fasulye_konserve: { konserve: '13-660' },
  pilavlik_pirinc: { kuru: '11-863' },
  irmik: { toz: '11-903' },
  kaju: { cig: '14-811' },
  kultur_mantari: { haslanmis: '13-506' },
  dereotu: { taze: '13-824', kurutulmus: '13-825' },
  // B192: ikinci tur (aynı kurallar)
  mandalina: { cig: '14-326' },
  dut: { cig: '14-168' },
  ahududu: { cig: '14-375' },
  bektasi: { cig: '14-103' },
  murver: { cig: '14-089' },
  altin_cilek: { cig: '14-207' },
  hunnap: { cig: '14-122' },
  kuru_erik: { kurutulmus: '14-398' },
  salatalik: { cig: '13-523' },
  bezelye: { haslanmis: '13-439' },
  brokoli: { haslanmis: '13-503' },
  lahana_tursusu: { konserve: '13-336' },
  havuc: { cig: '13-448' },
  turp: { cig: '13-656' },
  kereviz_kok_haslanmis: { haslanmis: '13-585' },
  tempeh: { cig: '13-118' },
  kuskus: { kuru: '11-901' },
  safran: { kurutulmus: '13-852' },
};
// CoFID alanı → uygulama anahtarı (birimler aynı: µg / mg)
export const COFID_KEYS = { iodine: 'iodine', mn: 'mn', se: 'se', biotin: 'biotin', b5: 'panto', k1: 'vitk' };
// Şekerler yalnız toplam ve alt şekerler birlikte boşsa doldurulur (üst/alt aynı kaynaktan kalsın)
export const COFID_SUGARS = { sugars: 'sugars', fructose: 'fructose', glucose: 'glucose', sucrose: 'sucrose' };

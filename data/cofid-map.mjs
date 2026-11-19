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
  taze_fasulye: { haslanmis: '13-515', cig: '13-514' },
  kirmizi_lahana: { cig: '13-190' },
  brokselahanasi: { cig: '13-177', haslanmis: '13-630' },
  domates_konserve: { konserve: '13-530' },
  balkabagi_butternut: { firin: '13-644', cig: '13-355' },
  tatli_patates: { cig: '13-463' },
  yerfistigi: { kavrulmus: '14-878' },
  badem: { kavrulmus: '14-897' },
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
  havuc: { cig: '13-448', haslanmis: '13-497' },
  turp: { cig: '13-656' },
  kereviz_kok_haslanmis: { haslanmis: '13-585' },
  tempeh: { cig: '13-118' },
  kuskus: { kuru: '11-901' },
  safran: { kurutulmus: '13-852' },
  // B195: üçüncü tur (İngilizce besin adıyla arama + aynı kurallar)
  karpuz: { cig: '14-296' }, seftali: { cig: '14-299' }, armut: { cig: '14-365' }, avokado: { cig: '14-386' },
  ananas: { cig: '14-376' }, mango: { cig: '14-378' }, frenk_uzumu: { cig: '14-053' }, papaya: { cig: '14-390' },
  sogan: { haslanmis: '13-500' },
  lahana: { cig: '13-509', haslanmis: '13-584' }, karnabahar: { cig: '13-512', haslanmis: '13-513' },
  bamya: { haslanmis: '13-652' }, balkabagi: { cig: '13-326', haslanmis: '13-549' }, enginar: { cig: '13-153' },
  kuskonmaz: { cig: '13-157' }, edamame: { pismis: '13-667' }, karalahana: { cig: '13-234', haslanmis: '13-649' },
  hindiba: { cig: '13-240' }, pancar: { haslanmis: '13-633' }, kirmizi_mercimek: { kuru: '13-657' },
  yesil_mercimek: { haslanmis: '13-661' }, kirmizi_fasulye: { haslanmis: '13-659' }, mas: { haslanmis: '13-664' },
  urad: { kuru: '13-056' }, pirinc_beyaz: { pismis: '11-862' }, bulgur: { kuru: '11-904' }, pirinc_esmer: { pismis: '11-869' },
  kinoa: { kuru: '14-843' }, bugday_kepegi: { kuru: '11-906' }, findik: { cig: '14-874' }, kestane: { cig: '14-813' },
  brezilya_cevizi: { cig: '14-871' }, tahin: { macun: '14-847' }, maydanoz: { taze: '13-844' }, havuc_suyu: { icecek: '13-607' },
};
// CoFID alanı → uygulama anahtarı (birimler aynı: µg / mg)
export const COFID_KEYS = { iodine: 'iodine', mn: 'mn', se: 'se', biotin: 'biotin', b5: 'panto', k1: 'vitk' };
// Şekerler yalnız toplam ve alt şekerler birlikte boşsa doldurulur (üst/alt aynı kaynaktan kalsın)
export const COFID_SUGARS = { sugars: 'sugars', fructose: 'fructose', glucose: 'glucose', sucrose: 'sucrose' };

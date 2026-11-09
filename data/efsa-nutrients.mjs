// EFSA tablosundaki kimyasal biçim ve özgün birim, matriks alanıyla eşleşmeli.
export const EFSA_NUTRIENTS = {
  'Dietary Fibre': ['fiber', 'g/day', 1],
  Calcium: ['ca', 'mg/day', 1], Copper: ['cu', 'mg/day', 1],
  Fluoride: ['fluoride', 'mg/day', 1000],
  Iron: ['fe', 'mg/day', 1], Magnesium: ['mg', 'mg/day', 1],
  Manganese: ['mn', 'mg/day', 1], Molybdenum: ['mo', 'μg/day', 1],
  Phosphorus: ['p', 'mg/day', 1], Potassium: ['k', 'mg/day', 1],
  Selenium: ['se', 'μg/day', 1], Zinc: ['zn', 'mg/day', 1],
  Biotin: ['biotin', 'μg/day', 1], Choline: ['choline', 'mg/day', 1],
  'Cobalamin (vitamin B12)': ['b12', 'μg/day', 1],
  Folate: ['folate_dfe', 'μg DFE/day', 1],
  'Pantothenic acid': ['panto', 'mg/day', 1], Riboflavin: ['riboflavin', 'mg/day', 1],
  'Vitamin B6': ['b6', 'mg/day', 1], 'Vitamin C': ['vitc', 'mg/day', 1],
  'Vitamin D': ['vitd', 'μg/day', 1], 'Vitamin E': ['vite', 'mg/day', 1],
  'Vitamin K as phylloquinone': ['vitk', 'μg/day', 1],
};
export const EFSA_NOTES = {
  fe: 'Premenopoz grubundaki PRI yaklaşık %95 kapsamla türetilmiştir; menopoz grubu yaştan otomatik belirlenmez.',
  zn: 'Yetişkin PRI değeri günlük toplam fitat düzeyine bağlıdır; seçilen besinin fitatı veya emilen çinko anlamına gelmez. Çocuk değerleri karma diyet varsayımındadır.',
  choline: 'Serbest ve esterleşmiş kolin biçimlerini kapsar.',
  folate_dfe: 'DFE: diyet folat eşdeğeri. EFSA: µg DFE = µg gıda folatı + 1,7 × µg folik asit. Toplam folatla aynı alan değildir.',
  riboflavin: 'Serbest riboflavin, flavin mononükleotit ve flavin adenin dinükleotit biçimleri.',
  b6: 'Piridoksin, piridoksal, piridoksamin ve fosforillenmiş biçimleri.',
  vitd: 'D2 + D3; deri yoluyla D vitamini sentezinin en düşük düzeyde olduğu varsayımıyla AI belirlenmiştir.',
  vite: 'Yalnız alfa-tokoferol; diğer tokoferol ve tokotrienoller bu referansa eklenmez.',
  vitk: 'Yalnız filokinon (K1); K2/menakinonlar bu AI değerine eklenmez.',
};

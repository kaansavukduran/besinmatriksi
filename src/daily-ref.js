// Temel besin değerleri için günlük karşılaştırma referansları.
// Kişisel bilgi yoksa ortalama yetişkin kadın ve erkek (19–64 yaş) değerleri gösterilir.
// Kaynak: Public Health England, "Government Dietary Recommendations" (2016), Tablo 2, 19–64 yaş.
// Şeker: PHE değeri "serbest şeker" içindir; uygulamadaki değer toplam şeker olduğundan AB 1169/2011 toplam şeker referansı (90 g) kullanılır.
// Bu değerler nüfus ortalamasıdır; kişisel ihtiyaç veya tıbbi öneri değildir.
export const AVG_REF = {
  energy: { female: 2000, male: 2500, kind: 'goal' },
  protein: { female: 45, male: 55.5, kind: 'goal' },
  carb_avail: { female: 267, male: 333, kind: 'ref' },
  sugars: { female: 90, male: 90, kind: 'limit', src: 'eu' },
  fat: { female: 78, male: 97, kind: 'limit' },
  sfa: { female: 24, male: 31, kind: 'limit' },
  fiber: { female: 30, male: 30, kind: 'goal' },
  salt: { female: 6, male: 6, kind: 'limit' },
};

// persona: { sex: 'female'|'male'|null, energy: kişisel enerji hedefi (kcal) | null, custom: elle hedefler | null }
// Dönüş: [{ who: 'female'|'male'|'you', value }] veya [] (referans yok)
export function dailyRefs(key, persona = {}) {
  const a = AVG_REF[key];
  const custom = persona.custom?.[key];
  if (custom > 0) return [{ who: 'you', value: custom }];
  if (!a) return [];
  if (key === 'energy' && persona.energy > 0) return [{ who: 'you', value: persona.energy }];
  if (persona.sex === 'female' || persona.sex === 'male') return [{ who: persona.sex, value: a[persona.sex] }];
  return a.female === a.male ? [{ who: 'both', value: a.female }] : [{ who: 'female', value: a.female }, { who: 'male', value: a.male }];
}
export const refKind = (key) => AVG_REF[key]?.kind || 'ref';

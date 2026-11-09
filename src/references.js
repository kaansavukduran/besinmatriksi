import EFSA from './data/efsa.json' with { type: 'json' };
export const EFSA_META = EFSA.meta;
export const EFSA_TYPES = { PRI: 'Toplum referans alımı', AI: 'Yeterli alım' };

export function efsaGroupLabel(settings) {
  const sex = settings.efsaSex === 'female' ? 'kadın grubu' : settings.efsaSex === 'male' ? 'erkek grubu' : 'cinsiyet grubu seçilmedi';
  return `${settings.efsaAge} yaş · ${sex}`;
}

export function efsaReference(nutrient, settings) {
  const empty = reason => ({ label: '%EFSA', title: reason, reason });
  const age = settings.efsaAge, sex = settings.efsaSex;
  if (!Number.isInteger(age) || age < 1 || age > 99 || !['male', 'female'].includes(sex)) return empty('EFSA karşılaştırması için yaş ve kaynağın cinsiyet grubunu seç.');
  if (nutrient.key === 'zn' && age >= 18 && !['300', '600', '900', '1200'].includes(settings.efsaPhytate)) return empty('Yetişkin çinko PRI değeri için kaynaktaki günlük fitat düzeyini ayrıca seç.');
  if (nutrient.key === 'fe' && age >= 18 && sex === 'female' && !['pre', 'post'].includes(settings.efsaIronGroup)) return empty('Yetişkin kadın demir PRI değeri için kaynağın menopoz grubunu ayrıca seç.');
  const candidates = EFSA.records.filter(r => r.key === nutrient.key && r.unit === nutrient.unit && r.from <= age && age <= r.to && r[sex] &&
    (age < 18 ? r.population === 'child' : r.population === 'adult') &&
    (!r.condition || (r.key === 'zn' ? r.condition === settings.efsaPhytate : r.key === 'fe' ? r.condition === settings.efsaIronGroup : false)));
  // Birden çok/hiç eşleşme varsa sessiz bir varsayım veya BRD geri dönüşü yok.
  if (candidates.length !== 1) return empty('Bu bileşen/yaş/kaynak koşuluna uygun karşılaştırılabilir EFSA PRI/AI kaydı yok.');
  const row = candidates[0];
  const range = row.to === 999 ? `${row.from} yaş ve üzeri` : `${row.from}–${row.to} yaş`;
  const condition = row.key === 'zn' && row.condition ? ` · günlük fitat ${row.condition} mg` : row.condition === 'pre' ? ' · premenopoz' : row.condition === 'post' ? ' · postmenopoz' : '';
  return { value: row.value, type: row.kind, label: '%' + row.kind, year: row.year, row: row.row,
    sourceValue: row.sourceValue, sourceUnit: row.sourceUnit, doi: row.doi, note: row.note,
    title: `EFSA ${row.year} · ${row.kind} (${EFSA_TYPES[row.kind]}) · ${range}, ${sex === 'female' ? 'kadın' : 'erkek'} grubu${condition} · ${row.sourceValue} ${row.sourceUnit} · ${row.doi} · DRV Finder görüntüsü ${EFSA.meta.snapshot}${row.note ? ' · ' + row.note : ''}; kişisel ihtiyaç veya tıbbi öneri değildir` };
}

export function referenceLabel(settings) {
  if (settings.referenceMode === 'efsa') return `%EFSA (PRI/AI): ${efsaGroupLabel(settings)}. PRI toplum referans alımı, AI yeterli alımdır; farklı kanıt türleridir. Bunlar kişisel ihtiyaç, emilim veya yeterlilik ölçümü değildir. Eşleşmeyen kayıt/koşulda yüzde gösterilmez. DRV Finder görüntüsü ${EFSA.meta.snapshot}.`;
  return settings.referenceMode === 'custom' ? '%hedef: elle girilen hedefler, öneri değildir. Hedef girilmeyen bileşenlerde yüzde gösterilmez.' : '%BRD: AB 1169/2011 (2011) yetişkin etiket referansı / TGK. Kişisel ihtiyaç değildir.';
}

export function percentColumnLabel(settings) { return settings.referenceMode === 'efsa' ? '%EFSA (PRI/AI)' : settings.referenceMode === 'custom' ? '%hedef' : '%BRD'; }

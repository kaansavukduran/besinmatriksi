import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { EFSA_NUTRIENTS, EFSA_NOTES } from '../data/efsa-nutrients.mjs';
import { NUTRIENTS } from '../src/nutrients.js';
const root = fileURLToPath(new URL('../', import.meta.url));
export function buildEfsa() {
  const dir = path.join(root, 'data/references');
  const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'EFSA_SOURCE.json'), 'utf8'));
  for (const [file, digest] of [[manifest.file, manifest.sha256], [manifest.license_notice_file, manifest.license_notice_sha256]]) {
    if (createHash('sha256').update(fs.readFileSync(path.join(dir, file))).digest('hex') !== digest) throw Error('EFSA kaynak özeti eşleşmedi: ' + file);
  }
  const source = JSON.parse(fs.readFileSync(path.join(dir, manifest.file), 'utf8'));
  const records = [];
  source.forEach((row, i) => {
    const mapping = EFSA_NUTRIENTS[row.Name];
    if (!mapping || !['Children', 'Adults'].includes(row['Target population']) || row['Age Unit'] !== 'y') return;
    const [key, sourceUnit, factor] = mapping;
    const n = NUTRIENTS.find(n => n.key === key);
    if (!n) throw Error('Bilinmeyen EFSA alanı: ' + key);
    const candidates = [['PRIs', 'PRI'], ['AIs', 'AI']].filter(([field]) => typeof row[field] === 'number' && row[field] > 0 && Number.isFinite(row[field]));
    if (candidates.length > 1) throw Error('Aynı satırda birden çok PRI/AI: ' + (i + 1));
    for (const [field, kind] of candidates) {
      if (row[field + ' Unit'] !== sourceUnit) throw Error('EFSA birimi değişmiş: ' + (i + 1));
      const url = row['Scientific Opinion ' + field + ' LINK'];
      const doi = url?.match(/10\.2903\/j\.efsa\.(\d{4})\.\d+/)?.[0];
      if (!doi) throw Error('EFSA görüş kaynağı eksik: ' + (i + 1));
      const description = row['Target population Description'];
      const phytate = description.match(/LPI (\d+) mg\/day/)?.[1];
      const condition = key === 'fe' && description === 'Premenopausal women' ? 'pre' : key === 'fe' && description === 'Postmenopausal women' ? 'post' : phytate || '';
      records.push({ row: i + 1, key, kind, value: row[field] * factor, unit: n.unit, sourceValue: row[field], sourceUnit, factor,
        from: row['From Age'], to: row['To Age'], population: row['Target population'] === 'Children' ? 'child' : 'adult',
        male: row.Male === 1, female: row.Female === 1, condition,
        year: Number(doi.match(/efsa\.(\d{4})/)[1]), doi, url, note: key === 'fe' && condition !== 'pre' ? '' : EFSA_NOTES[key] || '' });
    }
  });
  return { meta: { attribution: manifest.source, snapshot: manifest.snapshot, sourceUrl: manifest.source_url, sourceSha256: manifest.sha256, licenseUrl: manifest.license_url, mappedNutrients: Object.keys(EFSA_NUTRIENTS).length }, records };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const data = buildEfsa();
  fs.writeFileSync(path.join(root, 'src/data/efsa.json'), JSON.stringify(data, null, 2) + '\n');
  console.log(`EFSA: ${data.meta.mappedNutrients} bileşen, ${data.records.length} PRI/AI kaydı; UL/AR/RI/SSI yok.`);
}

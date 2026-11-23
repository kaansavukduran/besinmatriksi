// Resmî İngilizce foods.json çıktısından elle eşlenen iki profili çıkarır.
// node scripts/extract-matvaretabellen.mjs /yol/foods.json
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { NUTRIENT_BY_KEY } from '../src/nutrients.js';

const input = fs.readFileSync(process.argv[2]);
const sha256 = createHash('sha256').update(input).digest('hex');
const source = {
  name: 'Norwegian Food Composition Table (Matvaretabellen)',
  publisher: 'Norwegian Food Safety Authority',
  url: 'https://www.matvaretabellen.no/api/en/foods.json',
  dataDocs: 'https://www.matvaretabellen.no/en/api/',
  licence: 'CC BY 4.0',
  licenceURL: 'https://creativecommons.org/licenses/by/4.0/',
  sourceTerms: 'https://www.mattilsynet.no/en/food-and-beverages/matvaretabellen/download-the-norwegian-food-composition-table',
  checkedOn: '2026-11-23', sha256: '89b8f5f494a79731bf7d8d98065ee66c55263ccdbb519e7c87941218be6c948d',
};
if (sha256 !== source.sha256) throw new Error('Matvaretabellen kaynak özeti uyuşmuyor.');

const names = { '05.465': 'Psyllium husk', '06.256': 'Lentils, black, beluga, uncooked' };
const columns = {
  Vann: 'water', Protein: 'protein', Fett: 'fat', Karbo: 'carb_avail', Fiber: 'fiber',
  Stivel: 'starch', 'Mono+Di': 'sugars', Mettet: 'sfa', Enumet: 'mufa', Flerum: 'pufa',
  'Omega-3': 'n3', 'Omega-6': 'n6', Trans: 'trans', Kolest: 'cholesterol',
  Ca: 'ca', Mg: 'mg', P: 'p', K: 'k', Na: 'na', Fe: 'fe', Zn: 'zn', Cu: 'cu', Se: 'se', I: 'iodine',
  BIOT: 'biotin', MO: 'mo', Retinol: 'retinol', 'B-karo': 'bcarotene',
  'Vit B1': 'thiamin', 'Vit B2': 'riboflavin', Niacin: 'niacin', 'Vit B6': 'b6',
  Folat: 'folate', 'Vit B12': 'b12', 'Vit C': 'vitc', 'Vit D': 'vitd', VITK1: 'vitk', MK4: 'mk4',
};
const byId = new Map(JSON.parse(input).foods.map(row => [row.foodId, row]));
const records = Object.entries(names).map(([id, expectedName]) => {
  const row = byId.get(id);
  if (row?.foodName !== expectedName || row.ediblePart.percent !== 100) throw new Error('Besin eşleşmedi: ' + id);
  const values = {};
  const add = (key, entry) => {
    if (!key || entry.quantity == null || entry.sourceId === '50' || entry.sourceId === '10') return;
    if (!Number.isFinite(entry.quantity) || entry.quantity < 0 || entry.unit !== NUTRIENT_BY_KEY[key]?.unit) {
      throw new Error(`Matvaretabellen birim/değer uyuşmuyor: ${id}/${key}`);
    }
    values[key] = { amount: entry.quantity, unit: entry.unit, origin: entry.sourceId };
  };
  add('energy', row.calories);
  add('energy_kj', row.energy);
  for (const entry of row.constituents) add(columns[entry.nutrientId], entry);
  return { id, name: row.foodName, url: row.uri, values };
});
const out = new URL('../data/raw/MATVARETABELLEN_SUBSET.json', import.meta.url);
fs.writeFileSync(out, JSON.stringify({ source, records }, null, 2) + '\n');

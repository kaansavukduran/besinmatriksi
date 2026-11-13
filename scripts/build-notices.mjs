import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function collectNotices(base = root) {
  const read = file => fs.readFileSync(path.join(base, file), 'utf8').trim();
  const packageNotice = (name, label) => {
    const dir = `node_modules/${name}`;
    const pkg = JSON.parse(read(dir + '/package.json'));
    return { id: name, name: label || name, version: pkg.version, license: pkg.license, text: read(dir + '/LICENSE') };
  };
  return [
    { id: 'app', name: 'Besin Matriksi', version: JSON.parse(read('package.json')).version, license: 'MIT', text: read('LICENSE') },
    ...['andika', 'atkinson-hyperlegible-next', 'inter', 'lexend', 'literata', 'noto-sans-mono', 'nunito', 'opendyslexic'].map(n => packageNotice('@fontsource/' + n)),
    ...['core', 'android', 'ios'].map(n => packageNotice('@capacitor/' + n)),
    { id: 'usda', name: 'USDA SR28 (2015)', version: 'SR28 full ASCII', license: 'Public domain / CC0', text: 'Source: U.S. Department of Agriculture, Agricultural Research Service, National Nutrient Database for Standard Reference, Release 28.\nData are in the public domain. USDA licensing statement: https://fdc.nal.usda.gov/api-guide/\nDataset and documentation: https://www.ars.usda.gov/northeast-area/beltsville-md-bhnrc/beltsville-human-nutrition-research-center/methods-and-application-of-food-composition-laboratory/mafcl-site-pages/sr11-sr28/' },
    { id: 'usda-fdc', name: 'USDA FoodData Central — Foundation Foods (2026-10-29)', version: 'FoundationFoods JSON 2026-10-29', license: 'CC0 1.0', text: 'Source: U.S. Department of Agriculture, Agricultural Research Service. FoodData Central, Foundation Foods. fdc.nal.usda.gov\nFoodData Central data are in the public domain (CC0 1.0). https://fdc.nal.usda.gov/api-guide/' },
    { id: 'usda-fndds', name: 'USDA FoodData Central — Survey (FNDDS 2021-2023)', version: 'Survey JSON 2024-10-31', license: 'CC0 1.0', text: 'Source: U.S. Department of Agriculture, Agricultural Research Service. Food and Nutrient Database for Dietary Studies 2021-2023, via FoodData Central. Public domain (CC0 1.0).' },
    { id: 'usda-flav', name: 'USDA Flavonoid Database, Release 3.3 (2018)', version: 'Flav_R03-3', license: 'CC0 1.0', text: 'Source: Bhagwat S, Haytowitz DB. USDA Database for the Flavonoid Content of Selected Foods, Release 3.3 (March 2018). U.S. Department of Agriculture, Agricultural Research Service, Nutrient Data Laboratory.\nhttps://www.ars.usda.gov/nutrientdata/flav' },
    { id: 'usda-isoflav', name: 'USDA Isoflavone Database, Release 2.1 (2015)', version: 'Isoflav_R2-1', license: 'Public domain (US Government work)', text: 'Source: Bhagwat S, Haytowitz DB, Wasswa-Kintu SI, Holden JM. USDA Database for the Isoflavone Content of Selected Foods, Release 2.1 (2015). U.S. Department of Agriculture, Agricultural Research Service.\nhttps://www.ars.usda.gov/ARSUserFiles/80400535/Data/isoflav/Isoflav_R2-1.pdf' },
    { id: 'usda-srlegacy', name: 'USDA FoodData Central — SR Legacy (2018-04)', version: 'SR Legacy CSV 2018-04', license: 'CC0 1.0', text: 'Source: U.S. Department of Agriculture, Agricultural Research Service. FoodData Central, SR Legacy (April 2018). Public domain (CC0 1.0). https://fdc.nal.usda.gov/api-guide/' },
    { id: 'usda-iodine', name: 'USDA, FDA and ODS-NIH Iodine Database, Release 4.0 (2024)', version: 'Iodine R4.0', license: 'Public domain (US Government work)', text: 'Source: USDA, FDA and ODS-NIH Database for the Iodine Content of Common Foods, Release 4.0 (October 2024). U.S. Department of Agriculture, Agricultural Research Service.\nhttps://www.ars.usda.gov/ARSUserFiles/80400535/Data/Iodine/IODINE_DATABASE_RELEASE_4_DOCUMENTATION.pdf' },
    { id: 'usda-choline', name: 'USDA Choline Database, Release 2 (2008)', version: 'Choln02', license: 'Public domain (US Government work)', text: 'Source: Patterson KY, Bhagwat SA, Williams JR, Howe JC, Holden JM. USDA Database for the Choline Content of Common Foods, Release 2 (2008). U.S. Department of Agriculture, Agricultural Research Service.\nhttps://www.ars.usda.gov/ARSUserFiles/80400535/Data/Choline/Choln02.pdf' },
    { id: 'usda-pa', name: 'USDA Proanthocyanidin Database, Release 2.1 (2018)', version: 'PA02-1', license: 'Public domain (US Government work)', text: 'Source: Haytowitz DB, Wu X, Bhagwat S. USDA Database for the Proanthocyanidin Content of Selected Foods, Release 2.1 (2018). U.S. Department of Agriculture, Agricultural Research Service.\nhttps://www.ars.usda.gov/ARSUserFiles/80400535/Data/PA/PA02-1.pdf' },
    { id: 'efsa', name: 'EFSA DRV Finder', version: '2026-11-09 snapshot', license: 'Re-use with EFSA source acknowledgement', text: read('data/references/EFSA_REUSE_NOTICE.txt') },
  ];
}
export function noticesText(notices) {
  return notices.map(n => `${n.name}\nVersion: ${n.version}\nLicense: ${n.license}\n\n${n.text}`).join('\n\n========================================\n\n') + '\n';
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const notices = collectNotices();
  const outputs = { 'src/data/notices.json': JSON.stringify(notices, null, 2) + '\n', 'public/THIRD_PARTY_NOTICES.txt': noticesText(notices) };
  for (const [name, text] of Object.entries(outputs)) {
    const file = path.join(root, name);
    if (process.argv.includes('--check')) {
      if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== text) throw new Error('Lisans bildirimi güncel değil: ' + name);
    } else fs.writeFileSync(file, text);
  }
  console.log(`${notices.length} lisans/kaynak bildirimi ${process.argv.includes('--check') ? 'doğrulandı' : 'üretildi'}.`);
}

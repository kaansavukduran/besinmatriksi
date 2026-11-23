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
    ...['andika', 'atkinson-hyperlegible-next', 'bricolage-grotesque', 'inter', 'lexend', 'literata', 'noto-sans-mono', 'nunito', 'opendyslexic'].map(n => packageNotice('@fontsource/' + n)),
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
    { id: 'usda-purine', name: 'USDA and ODS-NIH Purine Database, Release 3 (2026)', version: 'Purine R3 (Sept 2026)', license: 'Public domain (US Government work); compiled values cite original papers', text: 'Source: USDA and ODS-NIH Database for the Purine Content of Foods, Release 3 (September 2026). U.S. Department of Agriculture, Agricultural Research Service. Table 2 values are compiled from published studies (e.g. Kaneko K, et al. Biol Pharm Bull. 2014;37(5):709-721).\nhttps://www.ars.usda.gov/ARSUserFiles/80400535/Data/Purine/PURINEDATABASEDOCUMENTATION2026.pdf' },
    { id: 'uk-cofid', name: "McCance and Widdowson's The Composition of Foods Integrated Dataset 2021", version: 'CoFID 2021 (19 March 2021)', license: 'Open Government Licence v3.0', text: "Contains public sector information licensed under the Open Government Licence v3.0. Source: Public Health England (2021). McCance and Widdowson's The Composition of Foods Integrated Dataset 2021. https://www.gov.uk/government/publications/composition-of-foods-integrated-dataset-cofid\nLicence: https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/\nManually verified food matches fill gaps in USDA records. The catalogue also uses the CoFID-calculated profile for dried pineapple (14-396). See data/cofid-map.mjs." },
    { id: 'efsa', name: 'EFSA DRV Finder', version: '2026-11-09 snapshot', license: 'Re-use with EFSA source acknowledgement', text: read('data/references/EFSA_REUSE_NOTICE.txt') },
    { id: 'matvaretabellen', name: 'The Norwegian Food Composition Table', version: '2026-11-23 snapshot', license: 'CC BY 4.0', text: 'The Norwegian Food Safety Authority. www.matvaretabellen.no (matvaretabellen.no)\nSource: https://www.matvaretabellen.no/api/en/foods.json\nLicence: https://creativecommons.org/licenses/by/4.0/\nAn extracted subset of the original, with selected constituents and application nutrient keys. See data/raw/MATVARETABELLEN_SUBSET.json.' },
    { id: 'anses-ciqual', name: 'Anses–Ciqual French Food Composition Table', version: '2025 (2025-11-03 workbook)', license: 'CC BY 4.0', text: 'Anses. Du Chaffaut, L., Oseredczuk, M. and Gauvreau-Béziat, J. Table de composition nutritionnelle des aliments Ciqual 2025. https://doi.org/10.57745/RDMHWY\nEnglish workbook: https://doi.org/10.5281/zenodo.17550133\nLicence: https://creativecommons.org/licenses/by/4.0/\nAdapted subset with selected positive numerical values and app nutrient keys. See data/raw/CIQUAL_2025_SUBSET.json.' },
    { id: 'apricot-kuus-tr', name: 'Unsulphured sun-dried apricot measurements', version: '2026, sample KUus-tr', license: 'CC BY 4.0', text: 'Smanalieva J., Iskakova J., Shaikieva N., Foerster A., Hellwig A., Schwarzenbolz U. and Henle T. Comparative Analysis of the Nutrient Composition and Polyphenol Content of Organic and Sulphured Dried Apricots From Central Asia. International Journal of Food Science (2026). https://doi.org/10.1155/ijfo/7273055\nLicence: https://creativecommons.org/licenses/by/4.0/\nSelected means for sample KUus-tr from Tables 2–4 and ascorbic acid from Figure 1. Amino acids converted from g to mg. See data/raw/APRICOT_KUUS_TR_2026.json.' },
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

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

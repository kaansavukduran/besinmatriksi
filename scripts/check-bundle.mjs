// B253: paket boyutu bütçesi (gzip). `npm run build` sonrası CI'da çalışır; bütçe aşılırsa hata verir.
// Bütçeler 2026-11-26 ölçümünün (main, beta.76) ~%20 üstündedir: beklenmedik büyümeyi yakalar, yeni besin eklemeyi engellemez.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

// ilk yük = Türkçe açılış (index + content + catalog + style); İngilizce sözlük (i18n-ui) yalnız İngilizcede tembel yüklenir
export const BUDGETS_KB = { index: 115, content: 85, catalog: 360, 'i18n-ui': 70, 'foods-ext': 1700, style: 26, initial: 580 };

export function checkBundle(dir) {
  const assets = path.join(dir, 'assets');
  const sizes = {};
  for (const f of fs.readdirSync(assets)) {
    const m = f.match(/^(index|content|catalog|i18n-ui|foods-ext|style)-[\w-]+\.(js|css)$/);
    if (!m) continue;
    sizes[m[1]] = (sizes[m[1]] || 0) + zlib.gzipSync(fs.readFileSync(path.join(assets, f))).length / 1024;
  }
  sizes.initial = (sizes.index || 0) + (sizes.content || 0) + (sizes.catalog || 0) + (sizes.style || 0);
  const over = Object.entries(BUDGETS_KB).filter(([k, b]) => sizes[k] != null && sizes[k] > b).map(([k, b]) => `${k}: ${sizes[k].toFixed(1)} KB > ${b} KB`);
  const missing = ['index', 'catalog'].filter((k) => sizes[k] == null);
  return { sizes, over, missing };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const { sizes, over, missing } = checkBundle(process.argv[2] || 'dist');
  for (const [k, v] of Object.entries(sizes)) console.log(`${k.padEnd(10)} ${v.toFixed(1).padStart(8)} KB gzip (bütçe ${BUDGETS_KB[k] ?? '-'} KB)`);
  if (missing.length) { console.error('Eksik parça: ' + missing.join(', ')); process.exit(1); }
  if (over.length) { console.error('Paket bütçesi aşıldı:\n' + over.join('\n')); process.exit(1); }
}

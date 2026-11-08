// `npx cap add android|ios` sonrası uygulama simgelerini yerleştirir.
// Kullanım: node scripts/mobile-icons.mjs android | ios
import fs from 'node:fs';
import path from 'node:path';

const target = process.argv[2];
const cp = (from, to) => { fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(from, to); console.log('→', to); };

if (target === 'android') {
  const src = 'src-tauri/icons/android';
  const res = 'android/app/src/main/res';
  if (!fs.existsSync(res)) throw new Error('Önce: npx cap add android');
  for (const dir of fs.readdirSync(src)) {
    for (const f of fs.readdirSync(path.join(src, dir))) cp(path.join(src, dir, f), path.join(res, dir, f));
  }
  // Uyarlanabilir simge arka planı (marka rengi)
  fs.writeFileSync(path.join(res, 'values/ic_launcher_background.xml'),
    '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n  <color name="ic_launcher_background">#9A58D6</color>\n</resources>\n');
} else if (target === 'ios') {
  const set = 'ios/App/App/Assets.xcassets/AppIcon.appiconset';
  if (!fs.existsSync(set)) throw new Error('Önce: npx cap add ios');
  cp('mobile/icon-1024.png', path.join(set, 'AppIcon-512@2x.png'));
} else {
  throw new Error('Hedef: android veya ios');
}

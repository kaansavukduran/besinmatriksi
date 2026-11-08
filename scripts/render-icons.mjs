// public/icon.svg -> PNG simgeler (Playwright Chromium ile). Kullanım: node scripts/render-icons.mjs
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright'); // NODE_PATH=$(npm root -g) ile global kurulum da çalışır
import fs from 'node:fs';
const svg = fs.readFileSync('public/icon.svg', 'utf8');
const browser = await chromium.launch();
const page = await browser.newPage();
// Kare (köşesiz) sürüm: iOS/Android maskeleri ve PWA "maskable" için
const square = svg.replace('rx="112"', 'rx="0"');
for (const [size, out, src] of [[192, 'public/icon-192.png', svg], [512, 'public/icon-512.png', svg], [512, 'public/icon-maskable.png', square], [1024, 'src-tauri/app-icon.png', svg], [1024, 'mobile/icon-1024.png', square]]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:transparent">${src.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
  fs.mkdirSync(out.split('/').slice(0, -1).join('/'), { recursive: true });
  await page.screenshot({ path: out, omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
  console.log('yazıldı', out);
}
await browser.close();

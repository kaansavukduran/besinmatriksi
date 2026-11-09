// Derleme sonrası:
//  (varsayılan) dist/sw.js: tüm dosyaları önbelleğe alan çevrimdışı service worker
//  --single     dist-single/besin-matriksi.html: her şeyi içeren tek dosya (çift tıkla aç)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const single = process.argv.includes('--single');

function walk(dir, base = dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p, base) : [path.relative(base, p).split(path.sep).join('/')];
  });
}

if (!single) {
  const dir = 'dist';
  const files = walk(dir).filter((f) => f !== 'sw.js');
  const hash = crypto.createHash('sha256');
  for (const f of files) hash.update(f).update(fs.readFileSync(path.join(dir, f)));
  const version = hash.digest('hex').slice(0, 12);
  const sw = `// Otomatik üretildi (scripts/postbuild.mjs)
const CACHE = 'besin-matriksi-${version}';
const FILES = ${JSON.stringify(['./', ...files.map((f) => './' + f)])};
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('besin-matriksi-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      // Modül isteğinin Origin başlığı, ön yüklemedekinden farklı olabilir
      // (Vite Vary: Origin gönderir). Tüm kayıtlar aynı origin'den gelir.
      const hit = await cache.match(e.request, { ignoreSearch: true, ignoreVary: true });
      if (hit) return hit;
      try { return await fetch(e.request); }
      catch {
        if (e.request.mode === 'navigate') return (await cache.match('./index.html', { ignoreVary: true })) || Response.error();
        return Response.error();
      }
    })
  );
});
`;
  fs.writeFileSync(path.join(dir, 'sw.js'), sw);
  console.log(`sw.js: ${files.length} dosya, önbellek ${version}`);
} else {
  const dir = 'dist-single';
  let html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  html = html.replace(/<script type="module" crossorigin src="\.\/([^"]+)"><\/script>/g, (_, src) => {
    const js = fs.readFileSync(path.join(dir, src), 'utf8').replace(/<\/script/gi, '<\\/script');
    return `<script type="module">${js}</script>`;
  });
  html = html.replace(/<link rel="stylesheet" crossorigin href="\.\/([^"]+)">/g, (_, href) => `<style>${fs.readFileSync(path.join(dir, href), 'utf8')}</style>`);
  const icon = fs.readFileSync('public/icon.svg', 'utf8');
  html = html
    .replace(/<link rel="icon"[^>]*>/, `<link rel="icon" href="data:image/svg+xml;base64,${Buffer.from(icon).toString('base64')}">`)
    .replace(/<link rel="apple-touch-icon"[^>]*>\s*/, '')
    .replace(/<link rel="manifest"[^>]*>\s*/, '');
  if (/src="\.\/assets|href="\.\/assets/.test(html)) throw new Error('Tek dosyada dış bağlantı kaldı');
  const out = path.join(dir, 'besin-matriksi.html');
  fs.writeFileSync(out, html);
  for (const f of walk(dir)) if (f !== 'besin-matriksi.html') fs.rmSync(path.join(dir, f));
  for (const d of fs.readdirSync(dir)) if (fs.statSync(path.join(dir, d)).isDirectory()) fs.rmSync(path.join(dir, d), { recursive: true });
  console.log(`${out}: ${(fs.statSync(out).size / 1024 / 1024).toFixed(2)} MB`);
}

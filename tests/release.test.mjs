import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { prepareReleaseAssets } from '../scripts/release-assets.mjs';
import { mobileVersion, applyMobileVersion } from '../scripts/mobile-version.mjs';

test('Linux RPM beta sürümü geçerli sayısal version ve ayrı release alanı taşır', () => {
  const version = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url))).version;
  const linux = JSON.parse(fs.readFileSync(new URL('../src-tauri/tauri.linux.conf.json', import.meta.url)));
  assert.equal(linux.version, mobileVersion(version).marketing);
  assert.equal(linux.bundle.linux.rpm.release, '0.' + version.split('-')[1]);
  assert.match(linux.version, /^\d+\.\d+\.\d+$/);
  assert.match(linux.bundle.linux.rpm.release, /^[a-zA-Z0-9.]+$/);
});

test('mobil yerel sürüm alanları uygulamayla eşleşir; derleme numarası her sürümde monoton artar (B252)', () => {
  const version = '1.1.2-beta.69';
  assert.deepEqual(mobileVersion(version), { name: version, marketing: '1.1.2', code: 10102169 });
  assert.ok(mobileVersion('1.1.2-beta.1').code > 1001002, 'önceki yayımlanan 1001002 değerinden geriye düşmez');
  const seq = ['1.1.2-alpha.1', '1.1.2-beta.67', '1.1.2-beta.68', '1.1.2-beta.69', '1.1.2-rc.1', '1.1.2', '1.1.3-beta.1', '1.1.3', '1.2.0', '2.0.0'];
  for (let i = 1; i < seq.length; i++) {
    assert.ok(mobileVersion(seq[i]).code > mobileVersion(seq[i - 1]).code, `${seq[i]} > ${seq[i - 1]}`);
  }
  const android = applyMobileVersion('android', 'applicationId "io.example.app"\nversionCode 1\nversionName "1.0"', version);
  assert.match(android, /applicationId "io.example.app"/); assert.match(android, /versionCode 10102169/); assert.match(android, /versionName "1.1.2-beta.69"/);
  assert.match(applyMobileVersion('ios', 'MARKETING_VERSION = 1.0; CURRENT_PROJECT_VERSION = 1;', version), /MARKETING_VERSION = 1.1.2; CURRENT_PROJECT_VERSION = 10102169;/);
  assert.throws(() => applyMobileVersion('android', 'unknown layout', version));
});
test('release eksik pakette durur; adlar, kaynak SHA ve özetler gerçek dosyaları gösterir', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'besin-release-')), input = path.join(root, 'in'), output = path.join(root, 'out');
  fs.mkdirSync(input);
  try {
    assert.throws(() => prepareReleaseAssets(input, output, '1.1.2-beta.1', 'a'.repeat(40)), /Paket eksik/);
    const names = ['App_1.1.2_x64-setup.exe', 'App.msi', 'BesinMatriksi-portable-x64.exe', 'App.AppImage', 'App.deb', 'App.rpm', 'App_universal.dmg', 'BesinMatriksi.apk', 'BesinMatriksi-unsigned.ipa', 'besin-matriksi-tek-dosya.html', 'besin-matriksi-hafif.html', 'besin-matriksi-web-pwa.zip', 'LICENSE.txt', 'THIRD_PARTY_NOTICES.txt', 'THIRD_PARTY_NOTICES-RUST-windows.txt', 'THIRD_PARTY_NOTICES-RUST-macos.txt', 'THIRD_PARTY_NOTICES-RUST-linux.txt', 'KURULUM.md', 'ANDROID-SIGNING.txt'];
    for (const name of names) fs.writeFileSync(path.join(input, name), 'content:' + name);
    const files = prepareReleaseAssets(input, output, '1.1.2-beta.1', 'a'.repeat(40));
    prepareReleaseAssets(input, output, '1.1.2-beta.1', 'a'.repeat(40));
    assert.ok(files.includes('BesinMatriksi-1.1.2-beta.1-windows-x64-Setup.exe'));
    assert.ok(files.includes('BesinMatriksi-1.1.2-beta.1-ios-UNSIGNED-NOT-INSTALLABLE.ipa'));
    assert.ok(files.includes('BesinMatriksi-1.1.2-beta.1-offline-lite.html')); // B202 hafif tek dosya
    assert.equal(JSON.parse(fs.readFileSync(path.join(output, 'BUILD_INFO.json'))).source_sha, 'a'.repeat(40));
    for (const line of fs.readFileSync(path.join(output, 'SHA256SUMS.txt'), 'utf8').trim().split('\n')) {
      const [digest, file] = line.split('  '); assert.equal(digest, createHash('sha256').update(fs.readFileSync(path.join(output, file))).digest('hex'));
    }
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('B188 CI tarayıcı testleri: kararsız test bir kez yeniden denenir, yerelde denenmez; release.yml düşen testin izlerini yükler', async () => {
  const cfg = fs.readFileSync(new URL('../playwright.config.mjs', import.meta.url), 'utf8');
  assert.match(cfg, /retries:\s*process\.env\.CI\s*\?\s*1\s*:\s*0/);
  const wf = fs.readFileSync(new URL('../.github/workflows/release.yml', import.meta.url), 'utf8');
  const i = wf.indexOf('npm run test:browser'); const j = wf.indexOf('name: Paketle', i);
  assert.ok(i > 0 && j > i);
  assert.match(wf.slice(i, j), /if: failure\(\)[\s\S]*path: test-results\//);
});

test('B193 GitHub Pages: bağlantı önizlemesi (Open Graph) ve 1200×630 görsel; açılış ekranı uygulama renklerinde', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  for (const p of ['og:title', 'og:description', 'og:image', 'og:url']) assert.match(html, new RegExp(`property="${p}" content="[^"]+"`), p);
  assert.match(html, /og:image" content="https:\/\/[^"]+\/og-image\.png"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  const png = fs.readFileSync(new URL('../public/og-image.png', import.meta.url));
  assert.equal(png.readUInt32BE(16), 1200); assert.equal(png.readUInt32BE(20), 630);
  assert.match(html, /<div class="boot" role="status">/);
  assert.match(html, /html \{ background: #f7f4ec;/);
});

test('B202 hafif tek dosya: release.yml derler ve paketler; vite veriyi JSON.parse ile açar', () => {
  const yml = fs.readFileSync('.github/workflows/release.yml', 'utf8');
  assert.match(yml, /npm run build:lite/);
  assert.match(yml, /dist-lite\/besin-matriksi-hafif\.html out\/besin-matriksi-hafif\.html/);
  const cfg = fs.readFileSync('vite.config.js', 'utf8');
  assert.match(cfg, /json: \{ stringify: true \}/);
  assert.match(cfg, /foods-ext-lite\.json/);
  assert.deepEqual(JSON.parse(fs.readFileSync('src/foods-ext-lite.json', 'utf8')).foods, []);
});

// B237: Pages derleme ve yayın ayrı işler; yayın işi derlemeyi bekler ve kendi artifact'ını yüklemez
test('B237 Pages iş akışı: build → deploy ayrı işler, yayın derlemeye bağlı', () => {
  const y = fs.readFileSync(new URL('../.github/workflows/pages.yml', import.meta.url), 'utf8');
  const build = y.slice(y.indexOf('\n  build:'), y.indexOf('\n  deploy:'));
  const deploy = y.slice(y.indexOf('\n  deploy:'));
  assert.match(build, /upload-pages-artifact@[0-9a-f]{40}/);
  assert.match(build, /npm run data && git diff --exit-code -- src\/data/);
  assert.match(build, /build-notices\.mjs --check/);
  assert.match(build, /npm test/);
  assert.match(deploy, /needs: build/);
  assert.match(deploy, /deploy-pages@[0-9a-f]{40}/);
  assert.doesNotMatch(deploy, /upload-pages-artifact|npm (ci|test|run)/);
  assert.match(deploy, /environment: \{ name: github-pages/);
  assert.match(y, /branches: \[main\]/); // B256: tek kanonik yayın dalı main
  assert.match(y, /if: github\.event_name == 'workflow_dispatch' \|\| github\.ref_name == 'main'/);
});

// B246: veri (catalog) ve metin/çizim sözlükleri (content) koddan ayrı parçalar; tek dosya sürümünde bölme yok
test('B246 vite parça ayrımı: catalog ve content grupları, tek dosyada kapalı', () => {
  const cfg = fs.readFileSync('vite.config.js', 'utf8');
  assert.match(cfg, /name: 'catalog', test: \/src\[\\\\\/\]data\[\\\\\/\]foods\\\.json\//);
  assert.match(cfg, /name: 'content'/);
  assert.match(cfg, /single \? \{ output: \{ codeSplitting: false \} \}/);
});

// B250: bağlantı önizlemesindeki besin sayısı gerçek katalogla çelişmez (eskiden "690+" yazıyordu)
test('B250 og:description besin sayısı katalogdan büyük değil ve 100\'ün altında eskimiş değil', async () => {
  const { decodeDB } = await import('../src/foods-codec.js');
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const n = Number(html.match(/og:description" content="(\d+)\+/)[1]);
  const total = decodeDB(JSON.parse(fs.readFileSync(new URL('../src/data/foods.json', import.meta.url), 'utf8'))).foods.length;
  assert.ok(n <= total && total - n < 100, `${n}+ / ${total}`);
});

// B257: İngilizce arayüz sözlüğü (181 KB) Türkçe açılışta statik içe aktarılmaz; yalnız İngilizce seçilince yüklenir
test('B257 İngilizce arayüz sözlüğü tembel yüklenir (Türkçe açılışta statik bağımlılık yok)', () => {
  const i18n = fs.readFileSync(new URL('../src/i18n.js', import.meta.url), 'utf8');
  assert.doesNotMatch(i18n, /^import\s+\{[^}]*UI_EN[^}]*\}\s+from\s+['"]\.\/i18n-ui\.js['"]/m);
  assert.match(i18n, /import\(['"]\.\/i18n-ui\.js['"]\)/);
  const cfg = fs.readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');
  assert.doesNotMatch(cfg, /i18n-\[a-z-\]\+\\\.js/);
});

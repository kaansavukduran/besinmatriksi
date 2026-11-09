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

test('mobil yerel sürüm alanları uygulamayla eşleşir; kimlik ve mevcut ayarlar değişmez', () => {
  const version = '1.1.2-beta.1';
  assert.deepEqual(mobileVersion(version), { name: version, marketing: '1.1.2', code: 1001002 });
  const android = applyMobileVersion('android', 'applicationId "io.example.app"\nversionCode 1\nversionName "1.0"', version);
  assert.match(android, /applicationId "io.example.app"/); assert.match(android, /versionCode 1001002/); assert.match(android, /versionName "1.1.2-beta.1"/);
  assert.match(applyMobileVersion('ios', 'MARKETING_VERSION = 1.0; CURRENT_PROJECT_VERSION = 1;', version), /MARKETING_VERSION = 1.1.2; CURRENT_PROJECT_VERSION = 1001002;/);
  assert.throws(() => applyMobileVersion('android', 'unknown layout', version));
});
test('release eksik pakette durur; adlar, kaynak SHA ve özetler gerçek dosyaları gösterir', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'besin-release-')), input = path.join(root, 'in'), output = path.join(root, 'out');
  fs.mkdirSync(input);
  try {
    assert.throws(() => prepareReleaseAssets(input, output, '1.1.2-beta.1', 'a'.repeat(40)), /Paket eksik/);
    const names = ['App_1.1.2_x64-setup.exe', 'App.msi', 'BesinMatriksi-portable-x64.exe', 'App.AppImage', 'App.deb', 'App.rpm', 'App_universal.dmg', 'BesinMatriksi.apk', 'BesinMatriksi-unsigned.ipa', 'besin-matriksi-tek-dosya.html', 'besin-matriksi-web-pwa.zip', 'LICENSE.txt', 'THIRD_PARTY_NOTICES.txt', 'THIRD_PARTY_NOTICES-RUST-windows.txt', 'THIRD_PARTY_NOTICES-RUST-macos.txt', 'THIRD_PARTY_NOTICES-RUST-linux.txt', 'KURULUM.md', 'ANDROID-SIGNING.txt'];
    for (const name of names) fs.writeFileSync(path.join(input, name), 'content:' + name);
    const files = prepareReleaseAssets(input, output, '1.1.2-beta.1', 'a'.repeat(40));
    prepareReleaseAssets(input, output, '1.1.2-beta.1', 'a'.repeat(40));
    assert.ok(files.includes('BesinMatriksi-1.1.2-beta.1-windows-x64-Setup.exe'));
    assert.ok(files.includes('BesinMatriksi-1.1.2-beta.1-ios-UNSIGNED-NOT-INSTALLABLE.ipa'));
    assert.equal(JSON.parse(fs.readFileSync(path.join(output, 'BUILD_INFO.json'))).source_sha, 'a'.repeat(40));
    for (const line of fs.readFileSync(path.join(output, 'SHA256SUMS.txt'), 'utf8').trim().split('\n')) {
      const [digest, file] = line.split('  '); assert.equal(digest, createHash('sha256').update(fs.readFileSync(path.join(output, file))).digest('hex'));
    }
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

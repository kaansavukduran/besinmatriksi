import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export function prepareReleaseAssets(input, output, version, sha) {
  if (!/^\d+\.\d+\.\d+(?:-[a-z0-9.-]+)?$/.test(version) || !/^[a-f0-9]{40}$/.test(sha)) throw Error('Geçersiz sürüm veya kaynak SHA');
  fs.mkdirSync(output, { recursive: true });
  const files = fs.readdirSync(input);
  const prefix = `BesinMatriksi-${version}`;
  const required = [
    [/_x64-setup\.exe$/, `${prefix}-windows-x64-Setup.exe`],
    [/\.msi$/, `${prefix}-windows-x64.msi`],
    [/^BesinMatriksi-portable-x64\.exe$/, `${prefix}-windows-x64-portable.exe`],
    [/\.AppImage$/, `${prefix}-linux-x86_64.AppImage`],
    [/\.deb$/, `${prefix}-linux-amd64.deb`],
    [/\.rpm$/, `${prefix}-linux-x86_64.rpm`],
    [/_universal\.dmg$/, `${prefix}-macos-universal-unsigned.dmg`],
    [/^BesinMatriksi\.apk$/, `${prefix}-android.apk`],
    [/^BesinMatriksi-unsigned\.ipa$/, `${prefix}-ios-UNSIGNED-NOT-INSTALLABLE.ipa`],
    [/^besin-matriksi-tek-dosya\.html$/, `${prefix}-offline.html`],
    [/^besin-matriksi-web-pwa\.zip$/, `${prefix}-web-pwa.zip`],
  ];
  for (const [pattern, destination] of required) {
    const matches = files.filter(file => pattern.test(file));
    if (matches.length !== 1 || !fs.statSync(path.join(input, matches[0])).size) throw Error('Paket eksik veya belirsiz: ' + destination);
    fs.copyFileSync(path.join(input, matches[0]), path.join(output, destination));
  }
  for (const name of ['LICENSE.txt', 'THIRD_PARTY_NOTICES.txt', 'THIRD_PARTY_NOTICES-RUST-windows.txt', 'THIRD_PARTY_NOTICES-RUST-macos.txt', 'THIRD_PARTY_NOTICES-RUST-linux.txt', 'KURULUM.md', 'ANDROID-SIGNING.txt']) {
    fs.copyFileSync(path.join(input, name), path.join(output, name));
  }
  fs.writeFileSync(path.join(output, 'BUILD_INFO.json'), JSON.stringify({ version, tag: 'v' + version, source_sha: sha, source_branch: 'codex/forge-devam', ios: 'Unsigned development artifact; not directly installable. App Store/TestFlight signing pending.', macos: 'Universal Intel + Apple Silicon; unsigned, not notarized.', android_signing: 'See ANDROID-SIGNING.txt; debug certificate is not a production signing continuity guarantee.', native_device_acceptance: 'NOT_RUN' }, null, 2) + '\n');
  const sums = fs.readdirSync(output).filter(file => file !== 'SHA256SUMS.txt').sort().map(file => createHash('sha256').update(fs.readFileSync(path.join(output, file))).digest('hex') + '  ' + file);
  fs.writeFileSync(path.join(output, 'SHA256SUMS.txt'), sums.join('\n') + '\n');
  return fs.readdirSync(output).sort();
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const version = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
  console.log(prepareReleaseAssets(process.argv[2], process.argv[3], version, process.env.GITHUB_SHA).join('\n'));
}

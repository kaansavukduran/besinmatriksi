import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export function mobileVersion(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-[a-z0-9.-]+)?$/.exec(version);
  if (!match) throw Error('Geçersiz mobil sürüm');
  const [major, minor, patch] = match.slice(1).map(Number);
  const code = major * 1000000 + minor * 1000 + patch;
  if (minor > 999 || patch > 999 || code < 1 || code > 2100000000) throw Error('Mobil sürüm kodu sınır dışında');
  return { name: version, marketing: `${major}.${minor}.${patch}`, code };
}
export function applyMobileVersion(platform, text, version) {
  const v = mobileVersion(version);
  if (platform === 'android') {
    if (!/versionCode\s+\d+/.test(text) || !/versionName\s+"[^"]+"/.test(text)) throw Error('Android sürüm alanları bulunamadı');
    return text.replace(/versionCode\s+\d+/g, 'versionCode ' + v.code).replace(/versionName\s+"[^"]+"/g, 'versionName "' + v.name + '"');
  }
  if (platform === 'ios') {
    if (!/MARKETING_VERSION = [^;]+;/.test(text) || !/CURRENT_PROJECT_VERSION = [^;]+;/.test(text)) throw Error('iOS sürüm alanları bulunamadı');
    return text.replace(/MARKETING_VERSION = [^;]+;/g, 'MARKETING_VERSION = ' + v.marketing + ';').replace(/CURRENT_PROJECT_VERSION = [^;]+;/g, 'CURRENT_PROJECT_VERSION = ' + v.code + ';');
  }
  throw Error('Bilinmeyen platform');
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const platform = process.argv[2], file = platform === 'android' ? 'android/app/build.gradle' : 'ios/App/App.xcodeproj/project.pbxproj';
  const version = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
  fs.writeFileSync(file, applyMobileVersion(platform, fs.readFileSync(file, 'utf8'), version));
  console.log(platform, mobileVersion(version));
}

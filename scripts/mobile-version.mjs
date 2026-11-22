import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export function mobileVersion(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-(alpha|beta|rc)\.(\d+))?$/.exec(version);
  if (!match) throw Error('Geçersiz mobil sürüm');
  const [major, minor, patch] = match.slice(1, 4).map(Number);
  const channel = match[4] || null;
  const preNum = match[5] != null ? Number(match[5]) : null;
  if (minor > 99 || patch > 99) throw Error('Mobil sürüm bileşenleri sınır dışında');
  let offset = 999; // kararlı sürüm, aynı major.minor.patch ön sürümlerinden daima büyüktür
  if (channel === 'alpha') {
    if (!(preNum >= 1 && preNum <= 99)) throw Error('Alpha sürüm numarası 1–99 aralığında olmalı');
    offset = preNum;
  } else if (channel === 'beta') {
    if (!(preNum >= 1 && preNum <= 799)) throw Error('Beta sürüm numarası 1–799 aralığında olmalı');
    offset = 100 + preNum;
  } else if (channel === 'rc') {
    if (!(preNum >= 1 && preNum <= 98)) throw Error('RC sürüm numarası 1–98 aralığında olmalı');
    offset = 900 + preNum;
  }
  // Önceki yayımlanmış 1001002 değerinin üstünde ve her sürümde kesin monoton artan derleme numarası
  const code = (major * 10000 + minor * 100 + patch) * 1000 + offset;
  if (code < 1 || code > 2100000000) throw Error('Mobil sürüm kodu sınır dışında');
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

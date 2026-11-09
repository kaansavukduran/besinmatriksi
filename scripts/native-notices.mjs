// Cargo'nun gerçekten çözdüğü bağımlılıklardan kaynak/lisans dökümü oluşturur.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
export function nativeNotices(metadata) {
  const sections = [];
  let missing = 0;
  for (const pkg of [...metadata.packages].sort((a, b) => a.name.localeCompare(b.name) || a.version.localeCompare(b.version))) {
    const dir = path.dirname(pkg.manifest_path);
    const files = fs.readdirSync(dir).filter(n => /^(licen[sc]e|copying|notice)([._-]|$)/i.test(n) && fs.statSync(path.join(dir, n)).isFile());
    if (pkg.license_file && !files.includes(pkg.license_file)) files.push(pkg.license_file);
    if (!pkg.source && pkg.name === 'besin-matriksi' && !files.length) files.push('../LICENSE');
    const texts = files.sort().map(file => `${path.basename(file)}\n${fs.readFileSync(path.join(dir, file), 'utf8').trim()}`);
    if (!texts.length) missing++;
    sections.push(`${pkg.name} ${pkg.version}\nSPDX: ${pkg.license || 'see license file'}\nSource: ${pkg.repository || pkg.source || 'https://github.com/kaansavukduran/besinmatriksi'}\n\n${texts.join('\n\n') || 'Full license text was not present in this package archive; see the source above.'}`);
  }
  return { text: sections.join('\n\n========================================\n\n') + '\n', count: sections.length, missing };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = spawnSync('cargo', ['metadata', '--locked', '--format-version', '1', '--manifest-path', 'src-tauri/Cargo.toml'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(result.stderr || 'cargo metadata başarısız');
  const data = nativeNotices(JSON.parse(result.stdout));
  const output = process.argv[2]; if (!output) throw new Error('Çıktı yolu gerekli');
  fs.mkdirSync(path.dirname(output), { recursive: true }); fs.writeFileSync(output, data.text);
  console.log(`Cargo: ${data.count} paket; tam lisans dosyası bulunmayan ${data.missing}.`);
}

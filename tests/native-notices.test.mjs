import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { nativeNotices } from '../scripts/native-notices.mjs';
test('Cargo lisans dosyası, telif sahibi ve lisans metni olmayan paket ayrı raporlanır', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'bm-notices-'));
  try {
    for (const name of ['present', 'missing']) fs.mkdirSync(path.join(root, name));
    const file = path.join(root, 'present', 'TERMS.txt'); fs.writeFileSync(file, 'Copyright (c) Sample Contributor\nPermission granted for testing.');
    const result = nativeNotices({ packages: [
      { name: 'present', version: '1.0.0', manifest_path: path.join(root, 'present', 'Cargo.toml'), license: 'MIT', license_file: file, repository: 'https://example.org/source' },
      { name: 'missing', version: '2.0.0', manifest_path: path.join(root, 'missing', 'Cargo.toml'), license: 'Apache-2.0', source: 'registry+https://example.org' },
    ] });
    assert.equal(result.count, 2); assert.equal(result.missing, 1);
    assert.match(result.text, /Sample Contributor/); assert.match(result.text, /SPDX: MIT/); assert.match(result.text, /Full license text was not present/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
test('pakette bulunmayan lisans özgün commit kaydından alınır; değişmiş metin reddedilir', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'bm-license-fallback-'));
  try {
    const pkg = { name: 'dlopen2', version: '0.8.2', manifest_path: path.join(root, 'Cargo.toml'), license: 'MIT', repository: 'https://github.com/OpenByteDev/dlopen2' };
    const result = nativeNotices({ packages: [pkg] });
    assert.equal(result.missing, 0); assert.match(result.text, /cc80e4a0a90d499b677fdf7743699b4b3a43a989/);
    assert.match(result.text, /Permission is hereby granted/);
    fs.writeFileSync(path.join(root, 'changed.txt'), 'wrong notice');
    assert.throws(() => nativeNotices({ packages: [pkg] }, { directory: root, manifest: { 'dlopen2@0.8.2': { records: [{ file: 'changed.txt', url: 'https://example.org', sha256: 'bad' }] } } }), /özeti eşleşmedi/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
test('tüm kaynak lisans kayıtları kilitli crate sürümüyle ve dosya özetiyle eşleşir', async () => {
  const { createHash } = await import('node:crypto');
  const base = new URL('../data/licenses/native/', import.meta.url);
  const manifest = JSON.parse(fs.readFileSync(new URL('manifest.json', base)));
  const lock = fs.readFileSync(new URL('../src-tauri/Cargo.lock', import.meta.url), 'utf8');
  for (const [id, entry] of Object.entries(manifest)) {
    const [name, version] = id.split('@');
    assert.ok(lock.includes(`name = "${name}"\nversion = "${version}"`), id);
    for (const record of entry.records) {
      const bytes = fs.readFileSync(new URL(record.file, base));
      assert.equal(createHash('sha256').update(bytes).digest('hex'), record.sha256, id);
      assert.ok(record.url.includes(entry.commit) || record.url.startsWith('https://www.mozilla.org/media/MPL/'), record.url);
    }
  }
});

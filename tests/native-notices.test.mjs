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

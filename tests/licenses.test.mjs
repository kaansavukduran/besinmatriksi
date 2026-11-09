import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { collectNotices, noticesText } from '../scripts/build-notices.mjs';
test('gömülü sekiz fontun asıl OFL telifleri ve yazılım MIT bildirimleri eksiksiz taşınır', () => {
  const notices = collectNotices();
  const fonts = notices.filter(n => n.id.startsWith('@fontsource/'));
  assert.equal(fonts.length, 8);
  for (const n of fonts) { assert.equal(n.license, 'OFL-1.1'); assert.match(n.text, /Copyright/i); assert.match(n.text, /OPEN FONT LICENSE/i); }
  const text = noticesText(notices);
  assert.match(text, /Kaan Savukduran/); assert.match(text, /Abbie Gonzalez/); assert.ok(notices.some(n => n.id === '@capacitor/core' && n.text.includes('Permission is hereby granted')));
  assert.deepEqual(JSON.parse(fs.readFileSync(new URL('../src/data/notices.json', import.meta.url))), notices);
  assert.equal(fs.readFileSync(new URL('../public/THIRD_PARTY_NOTICES.txt', import.meta.url), 'utf8'), text);
});

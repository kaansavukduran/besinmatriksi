import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { encodeDB, decodeDB, CODEC_VERSION } from '../src/foods-codec.js';

// B245: katalog kayıpsız sıkıştırılır; açılmış hâl değer, birim, kaynak ve anahtar sırasıyla birebir aynıdır
const packedText = fs.readFileSync(new URL('../src/data/foods.json', import.meta.url), 'utf8');

test('B245 paketlenmiş katalog sıkıştırılmış biçimde ve açılınca yeniden paketlemeyle birebir aynı', () => {
  const packed = JSON.parse(packedText);
  assert.equal(packed.codec, CODEC_VERSION);
  assert.ok(packed.foods.every((f) => f.forms.every((fm) => !('v' in fm) && !('s' in fm))));
  const plain = decodeDB(JSON.parse(packedText));
  assert.equal(JSON.stringify(encodeDB(JSON.parse(JSON.stringify(plain)))), packedText);
});

test('B245 açılan biçimde değerler sayı, kaynak kodları değerlerle aynı anahtar ve sırada', () => {
  const db = decodeDB(JSON.parse(packedText));
  const nohut = db.foods.find((f) => f.id === 'nohut').forms[0];
  assert.equal(typeof nohut.v.protein, 'number');
  assert.deepEqual(Object.keys(nohut.s), Object.keys(nohut.v));
  assert.ok(nohut.portions.every((p) => typeof p.g === 'number' && typeof p.label === 'string'));
  for (const f of db.foods) for (const fm of f.forms) for (const x of Object.values(fm.v || {})) assert.equal(typeof x, 'number');
});

test('B245 gidiş-dönüş: küçük örnek, eksik ölçüm (anahtar yok) ve sıra korunur; eski biçim olduğu gibi geçer', () => {
  const db = { meta: { n: 1 }, foods: [{ id: 'a', forms: [{ key: 'cig', portions: [{ g: 5, label: 'x', en: 'x' }, { g: 7, label: 'x', en: 'x' }], v: { fat: 0, protein: 1.25 }, s: { fat: 'u', protein: 'r' } }, { key: 'kuru', unavailable: true }] }] };
  const copy = JSON.parse(JSON.stringify(db));
  const out = decodeDB(JSON.parse(JSON.stringify(encodeDB(copy))));
  assert.equal(JSON.stringify(out), JSON.stringify(db));
  assert.equal('vitc' in out.foods[0].forms[0].v, false); // ölçülmemiş = yok (0 değil)
  assert.equal(out.foods[0].forms[0].v.fat, 0); // ölçülmüş sıfır korunur
  assert.equal(decodeDB(db), db);
  assert.throws(() => encodeDB({ foods: [{ id: 'b', forms: [{ v: { a: 1 }, s: { b: 'u' } }] }] }), /eşleşmiyor/);
});

test('B245 geniş katalog da sıkıştırılmış; açılıp yeniden paketlenince birebir aynı, değerler sayı', async () => {
  const { encodeExt, decodeExt } = await import('../src/foods-codec.js');
  const text = fs.readFileSync(new URL('../src/data/foods-ext.json', import.meta.url), 'utf8');
  const packed = JSON.parse(text);
  assert.equal(packed.codec, CODEC_VERSION);
  const plain = decodeExt(JSON.parse(text));
  assert.equal(plain.foods.length, packed.foods.length);
  assert.ok(plain.foods.every((f) => !('V' in f) && Object.values(f.v).every((x) => typeof x === 'number')));
  assert.equal(JSON.stringify(encodeExt(JSON.parse(JSON.stringify(plain)))), text);
  const lite = JSON.parse(fs.readFileSync(new URL('../src/foods-ext-lite.json', import.meta.url), 'utf8'));
  assert.equal(decodeExt(lite), lite); // hafif sürüm taslağı olduğu gibi geçer
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeCollections, createCollection, renameCollection, deleteCollection, toggleRef, removeRef, collectionTree, collectionRefs, hasRef, MAX_COLLECTIONS } from '../src/collections.js';

const muz = { t: 'c', id: 'muz', f: 0 }, yulaf = { t: 'c', id: 'yulaf', f: 0 }, kendi = { t: 'u', id: 'abc' };

test('koleksiyon ve alt kategori oluşturulur; üçüncü düzeye izin verilmez', () => {
  let { list, created: kahvalti } = createCollection([], '  Kahvaltılıklar ');
  assert.equal(kahvalti.name, 'Kahvaltılıklar');
  const r = createCollection(list, 'Smoothie', kahvalti.id); list = r.list;
  assert.equal(r.created.parent, kahvalti.id);
  assert.throws(() => createCollection(list, 'Derin', r.created.id), /bad-parent/);
  assert.throws(() => createCollection(list, '   '), /empty-name/);
  const tree = collectionTree(list);
  assert.equal(tree.length, 1); assert.equal(tree[0].children[0].name, 'Smoothie');
});

test('besin ekleme/çıkarma aç-kapa çalışır, yineleme olmaz ve özgün dizi değişmez', () => {
  const { list } = createCollection([], 'A');
  const id = list[0].id;
  const a = toggleRef(list, id, muz);
  assert.equal(list[0].items.length, 0);
  assert.ok(hasRef(a[0], muz));
  const b = toggleRef(toggleRef(a, id, yulaf), id, { ...muz });
  assert.deepEqual(b[0].items, [yulaf]);
  assert.deepEqual(removeRef(b, id, yulaf)[0].items, []);
});

test('üst koleksiyon kendi + alt kategorilerin kayıtlarını tekilleştirerek gösterir; silme altları da siler', () => {
  let { list, created: p } = createCollection([], 'Üst');
  const r = createCollection(list, 'Alt', p.id); list = r.list;
  list = toggleRef(list, p.id, muz); list = toggleRef(list, r.created.id, muz); list = toggleRef(list, r.created.id, kendi);
  assert.deepEqual(collectionRefs(list, p.id), [muz, kendi]);
  assert.deepEqual(deleteCollection(list, p.id), []);
  assert.equal(renameCollection(list, p.id, '  ').find((c) => c.id === p.id).name, 'Üst');
  assert.equal(renameCollection(list, p.id, 'Yeni').find((c) => c.id === p.id).name, 'Yeni');
});

test('bozuk veya eski kayıt güvenle normalleşir', () => {
  const out = normalizeCollections([
    { id: 'a', name: 'Geçerli', items: [muz, muz, { t: 'z' }, null, kendi] },
    { id: 'a', name: 'Yinelenen kimlik' },
    { id: 'b', name: '', items: [] },
    { id: 'c', name: 'Yetim alt', parent: 'yok' },
    { id: 'd', name: 'Alt', parent: 'a' },
    { id: 'e', name: 'Torun', parent: 'd' },
    'çöp',
  ]);
  assert.deepEqual(out.map((c) => c.id), ['a', 'c', 'd', 'e']);
  assert.deepEqual(out[0].items, [muz, kendi]);
  assert.equal(out.find((c) => c.id === 'c').parent, null);
  assert.equal(out.find((c) => c.id === 'd').parent, 'a');
  assert.equal(out.find((c) => c.id === 'e').parent, null);
  assert.deepEqual(normalizeCollections('bozuk'), []);
  assert.ok(normalizeCollections(Array.from({ length: 99 }, (_, i) => ({ id: 'x' + i, name: 'K' + i }))).length <= MAX_COLLECTIONS);
});

test('yedek: koleksiyonlar yeni kimlikle döner, alt kategori bağı ve kendi besin eşlemesi korunur', async () => {
  globalThis.localStorage ??= { getItem: () => null, setItem: () => {} };
  const { exportPayload, parseImport } = await import('../src/store.js');
  const custom = [{ id: 'eski', name: 'Etiket içeceği', v: { energy: 40 } }];
  const cols = [{ id: 'p', name: 'Üst', items: [muz] }, { id: 'k', name: 'Alt', parent: 'p', items: [{ t: 'u', id: 'eski' }] }];
  const out = parseImport(exportPayload([], {}, custom, [], cols));
  assert.equal(out.collections.length, 2);
  const [p, k] = out.collections;
  assert.notEqual(p.id, 'p'); assert.equal(k.parent, p.id);
  assert.equal(k.items[0].id, out.custom[0].id);
  assert.notEqual(k.items[0].id, 'eski');
  // Eski yedekler (koleksiyonsuz) sorunsuz açılır
  assert.deepEqual(parseImport(exportPayload([], {}, [], [])).collections, []);
});

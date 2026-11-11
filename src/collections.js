// Kullanıcı tanımlı koleksiyonlar: kategori → alt kategori (en fazla 2 düzey) ve içlerindeki besin kayıtları.
// Saf fonksiyonlar; depolama store.js'te. Hiçbir işlem verilen diziyi değiştirmez.
import { uid } from './util.js';

export const MAX_COLLECTIONS = 60;
export const MAX_ITEMS = 300;

const refKey = (ref) => (ref.t === 'c' ? `c:${ref.id}:${ref.f}` : ref.t === 'u' ? `u:${ref.id}` : `x:${ref.n}`);
const validRef = (r) => r && typeof r === 'object' && (
  (r.t === 'c' && typeof r.id === 'string' && Number.isInteger(r.f) && r.f >= 0) ||
  (r.t === 'u' && typeof r.id === 'string') ||
  (r.t === 'x' && typeof r.n === 'string'));

export function normalizeCollections(input) {
  if (!Array.isArray(input)) return [];
  const out = [];
  const ids = new Set();
  for (const c of input) {
    if (!c || typeof c.id !== 'string' || ids.has(c.id) || typeof c.name !== 'string') continue;
    const name = c.name.trim().slice(0, 40);
    if (!name) continue;
    const seen = new Set();
    const items = (Array.isArray(c.items) ? c.items : []).filter(validRef).filter((r) => {
      const k = refKey(r); if (seen.has(k)) return false; seen.add(k); return true;
    }).slice(0, MAX_ITEMS).map((r) => ({ ...r }));
    out.push({ id: c.id, name, icon: typeof c.icon === 'string' ? c.icon.slice(0, 4) : '', parent: typeof c.parent === 'string' ? c.parent : null, items });
    ids.add(c.id);
    if (out.length >= MAX_COLLECTIONS) break;
  }
  // Alt kategori yalnız var olan bir üst koleksiyona bağlanır; üst düzey dışına (3. düzey) çıkılmaz.
  for (const c of out) {
    const parent = out.find((p) => p.id === c.parent);
    if (!parent || parent.parent) c.parent = null;
  }
  return out;
}

export function createCollection(list, name, parent = null) {
  const clean = String(name || '').trim().slice(0, 40);
  if (!clean) throw new Error('empty-name');
  if (list.length >= MAX_COLLECTIONS) throw new Error('too-many');
  const p = parent ? list.find((c) => c.id === parent) : null;
  if (parent && (!p || p.parent)) throw new Error('bad-parent');
  const c = { id: uid(), name: clean, icon: '', parent: p ? p.id : null, items: [] };
  return { list: [...list, c], created: c };
}

export function renameCollection(list, id, name) {
  const clean = String(name || '').trim().slice(0, 40);
  if (!clean) return list;
  return list.map((c) => (c.id === id ? { ...c, name: clean } : c));
}

// Silme alt kategorileri de siler (hangilerinin silindiği arayüzde önceden gösterilir).
export function deleteCollection(list, id) {
  return list.filter((c) => c.id !== id && c.parent !== id);
}

export function hasRef(c, ref) { return c.items.some((r) => refKey(r) === refKey(ref)); }

export function toggleRef(list, id, ref) {
  return list.map((c) => {
    if (c.id !== id) return c;
    if (hasRef(c, ref)) return { ...c, items: c.items.filter((r) => refKey(r) !== refKey(ref)) };
    if (c.items.length >= MAX_ITEMS) return c;
    return { ...c, items: [...c.items, { ...ref }] };
  });
}

export function removeRef(list, id, ref) {
  return list.map((c) => (c.id === id ? { ...c, items: c.items.filter((r) => refKey(r) !== refKey(ref)) } : c));
}

// Üst düzey koleksiyonlar ve altlarındaki alt kategoriler (eklenme sırasıyla)
export function collectionTree(list) {
  return list.filter((c) => !c.parent).map((c) => ({ ...c, children: list.filter((x) => x.parent === c.id) }));
}

// Bir koleksiyonun kendi + alt kategorilerinin benzersiz kayıtları
export function collectionRefs(list, id) {
  const ids = new Set([id, ...list.filter((c) => c.parent === id).map((c) => c.id)]);
  const seen = new Set(), out = [];
  for (const c of list) if (ids.has(c.id)) for (const r of c.items) { const k = refKey(r); if (!seen.has(k)) { seen.add(k); out.push(r); } }
  return out;
}

// Silinen kendi besinine işaret eden kayıtlar korunur (arayüz "bulunamadı" der); içe aktarmada kimlik eşlemesi uygulanır.
export function remapCustomRefs(list, idMap) {
  return list.map((c) => ({ ...c, items: c.items.map((r) => (r.t === 'u' && idMap[r.id] ? { ...r, id: idMap[r.id] } : r)) }));
}

// Bir dizide öğeyi bir adım yukarı/aşağı taşır (sınırda değişiklik yapmaz).
export function moveIndex(arr, index, dir) {
  const j = index + dir;
  if (index < 0 || index >= arr.length || j < 0 || j >= arr.length) return arr;
  const out = arr.slice();
  [out[index], out[j]] = [out[j], out[index]];
  return out;
}
export function moveRef(list, id, index, dir) {
  return list.map((c) => (c.id === id ? { ...c, items: moveIndex(c.items, index, dir) } : c));
}

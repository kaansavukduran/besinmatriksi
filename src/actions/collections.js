// B232: koleksiyon (kendi kategorilerin) tıklama eylemleri app.js'ten ayrıldı. render ve iletişim kutusu bindCollectionActions ile verilir.
import { S } from '../state.js';
import { L } from '../i18n.js';
import { saveCollections } from '../store.js';
import { createCollection, renameCollection, deleteCollection, toggleRef, removeRef, hasRef, moveRef, MAX_COLLECTIONS, MAX_ITEMS } from '../collections.js';
import { aionPlay } from '../aion.js';
import { toast } from '../views/ui.js';

let render = () => {}, uiDialog = async () => null;
const $ = (sel) => document.querySelector(sel);

export function bindCollectionActions(deps) {
  ({ render, uiDialog } = deps);
}

// B165: koleksiyon hatası nedenine göre bildirilir (sınır ≠ boş ad)
export function collectionError(err) {
  if (err?.message === 'too-many') return L("En fazla {m} koleksiyon olabilir; yer açmak için birini sil.", { m: MAX_COLLECTIONS });
  if (err?.message === 'bad-parent') return L("Alt kategori yalnız bir üst koleksiyonun altına eklenebilir.");
  return L("Koleksiyon için bir ad yaz");
}

export function persistCollections() { if (!saveCollections(S.collections)) toast(L("Kaydedilemedi: cihaz depolaması kullanılamıyor")); }

export const COLLECTION_ACTIONS = {
  'col-pick': async (b) => { S.colPicker = true; render(); return; },
  'col-pick-close': async (b) => { S.colPicker = false; render(); return; },
  'col-toggle': async (b) => {
      const before = S.collections.find((c) => c.id === b.dataset.id);
      const added = before && !hasRef(before, S.sel);
      if (added && before.items.length >= MAX_ITEMS) { toast(L("“{c}” dolu: bir koleksiyonda en fazla {m} besin olabilir.", { c: before.name, m: MAX_ITEMS })); return; }
      S.collections = toggleRef(S.collections, b.dataset.id, S.sel); persistCollections(); render();
      if (added) aionPlay('celebrate');
      return;
    },
  'col-create-add': async (b) => {
      const name = $('#col-new-name')?.value || '';
      try { const r = createCollection(S.collections, name); S.collections = toggleRef(r.list, r.created.id, S.sel); persistCollections(); render(); aionPlay('celebrate'); }
      catch (err) { toast(collectionError(err)); }
      return;
    },
  'col-new': async (b) => {
      const name = await uiDialog(L("Yeni koleksiyonun adı:"), { input: '', line: true, ok: L("Oluştur"), cancel: L("Vazgeç") });
      if (name == null) return;
      try { const r = createCollection(S.collections, name); S.collections = r.list; S.cat = 'col:' + r.created.id; persistCollections(); render(); }
      catch (err) { toast(collectionError(err)); }
      return;
    },
  'col-sub': async (b) => {
      const name = await uiDialog(L("Alt kategorinin adı:"), { input: '', line: true, ok: L("Oluştur"), cancel: L("Vazgeç") });
      if (name == null) return;
      try { const r = createCollection(S.collections, name, b.dataset.id); S.collections = r.list; S.cat = 'col:' + r.created.id; persistCollections(); render(); }
      catch (err) { toast(collectionError(err)); }
      return;
    },
  'col-rename': async (b) => {
      const c = S.collections.find((x) => x.id === b.dataset.id);
      const name = c && await uiDialog(L("Yeni ad:"), { input: c.name, line: true, ok: L("Kaydet"), cancel: L("Vazgeç") });
      if (name) { S.collections = renameCollection(S.collections, c.id, name); persistCollections(); render(); }
      return;
    },
  'col-delete': async (b) => {
      const c = S.collections.find((x) => x.id === b.dataset.id);
      if (!c) return;
      const subs = S.collections.filter((x) => x.parent === c.id).length;
      const msg = subs ? L("“{n}” ve {s} alt kategorisi silinsin mi? Besinlerin kendisi silinmez.", { n: c.name, s: subs }) : L("“{n}” silinsin mi? Besinlerin kendisi silinmez.", { n: c.name });
      if (!(await uiDialog(msg, { ok: L("Sil"), cancel: L("Vazgeç") }))) return;
      S.collections = deleteCollection(S.collections, c.id); S.cat = null; persistCollections(); render(); return;
    },
  'col-move': async (b) => { S.collections = moveRef(S.collections, b.dataset.id, +b.dataset.i, +b.dataset.d); persistCollections(); render(); return; },
  'col-remove-item': async (b) => { S.collections = removeRef(S.collections, b.dataset.id, JSON.parse(b.dataset.ref)); persistCollections(); render(); return; },
};

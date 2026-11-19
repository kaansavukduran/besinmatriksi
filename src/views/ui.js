// B223: uygulama geneli küçük yardımcılar (bildirim, etkin tarif, kayıt, geniş katalog yükleme). Görünüm modülleri app.js'e bağlanmadan kullanır.
// Yeniden çizim app.js'te; açılışta setRenderer(render) ile kaydedilir (döngüsel içe aktarma yok).
import { S } from '../state.js';
import { L } from '../i18n.js';
import { resolve, loadExt, extLoaded, isLite } from '../data.js';
import { saveRecipes } from '../store.js';

let renderFn = () => {};
export function setRenderer(fn) { renderFn = fn; }
export function rerender() { renderFn(); }

export function toast(msg) {
  document.querySelectorAll('.toast').forEach((x) => x.remove());
  const t = document.createElement('div');
  t.className = 'toast';
  t.setAttribute('role', 'status');
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('out'), 1800);
  setTimeout(() => t.remove(), 2300);
}
let extLoading = false;
export function requestExtCatalog() {
  if (extLoaded() || extLoading || S.extError) return;
  extLoading = true;
  loadExt().then(() => { extLoading = false; rerender(); }).catch(() => { extLoading = false; S.extError = true; rerender(); });
}

export function catalogPending() {
  requestExtCatalog();
  if (isLite()) return `<span class="catalog-pending" role="status">${L("Bu hafif tek dosya sürümünde 8.000 kaydı aşan USDA tam kataloğu yok; küratörlü besinlerin hepsi var. Tam katalog için uygulamayı ya da büyük tek dosyayı kullan.")}</span>`;
  return S.extError
    ? `<span class="catalog-pending" role="alert">${L("USDA kataloğu yüklenemedi. Bağlantını kontrol edip sayfayı yenile; kayıtların korunur.")} <button class="btn" data-action="ext-reload">${L("Sayfayı yenile")}</button></span>`
    : `<span class="catalog-pending" role="status">${L("USDA kataloğu yükleniyor…")}</span>`;
}

export const activeRecipe = () => S.recipes.find((r) => r.id === S.activeRecipe) || S.recipes[0];
export const recipeItemCount = () => S.recipeDaily ? S.recipes.reduce((sum, r) => sum + r.items.length, 0) : activeRecipe()?.items.length || 0;
export function persistRecipes() {
  const rc = activeRecipe();
  const updated = rc?.updated;
  if (rc) rc.updated = Date.now();
  if (!saveRecipes(S.recipes)) { if (rc) rc.updated = updated; toast(L("Kaydedilemedi: cihaz depolaması kullanılamıyor")); return false; }
  return true;
}

export function servingKcal(r) {
  let sum = 0, known = 0;
  for (const it of r.items) { const item = resolve(it.ref); if (item?.v?.energy != null) { sum += (item.v.energy * it.g) / 100; known++; } }
  if (!known) return null;
  return { v: sum / (r.servings || 1), partial: known < r.items.length };
}

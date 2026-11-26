import './styles.css';
import { start } from './app.js';
import { S } from './state.js';
import { ensureLanguage, preferredLanguage, L } from './i18n.js';

window.__APP_VERSION__ = __APP_VERSION__;
if (preferredLanguage(S.settings.language) === 'en') {
  // İngilizce sözlük yüklenemezse (bağlantı yok, yayından sonra eski parça adı) uygulama yine açılır; metinler Türkçe kalır
  ensureLanguage('en').then(() => {
    if (S.recipes.length === 1 && !S.recipes[0].items.length && S.recipes[0].name === 'İlk tarifim') S.recipes[0].name = L("İlk tarifim");
  }, () => {}).then(() => {
    start();
    window.__bmBooted = true;
  });
} else {
  start();
  window.__bmBooted = true;
}

// PWA: yalnızca http(s) üzerinden sunulduğunda (masaüstü/mobil paketlerde gerekmez)
const isNativeShell = !!(window.__TAURI_INTERNALS__ || window.Capacitor?.isNativePlatform?.());
if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !isNativeShell && !import.meta.env.DEV && !__SINGLE__) {
  // Güncellemede (önceden bir denetleyici varken) yeni sürüm devralınca aktif taslak yoksa bir kez yenile;
  // taslak açıksa (özel besin / kaydedilmemiş profil / metin girişi) veri kaybını önlemek için bildirim göster.
  const hadController = !!navigator.serviceWorker.controller;
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloaded) return;
    if (window.__bmHasActiveDraft?.()) {
      window.__bmNotifyUpdateReady?.();
      return;
    }
    reloaded = true;
    location.reload();
  });
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).then((r) => r.update().catch(() => {})).catch(() => {}));
}

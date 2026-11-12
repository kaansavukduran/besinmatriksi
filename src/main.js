import './styles.css';
import { start } from './app.js';

window.__APP_VERSION__ = __APP_VERSION__;
start();
window.__bmBooted = true;

// PWA: yalnızca http(s) üzerinden sunulduğunda (masaüstü/mobil paketlerde gerekmez)
const isNativeShell = !!(window.__TAURI_INTERNALS__ || window.Capacitor?.isNativePlatform?.());
if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !isNativeShell && !import.meta.env.DEV && !__SINGLE__) {
  // Güncellemede (önceden bir denetleyici varken) yeni sürüm devralınca bir kez yenile; sw.js HTTP önbelleğinden okunmaz
  const hadController = !!navigator.serviceWorker.controller;
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadController && !reloaded) { reloaded = true; location.reload(); } });
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).then((r) => r.update().catch(() => {})).catch(() => {}));
}

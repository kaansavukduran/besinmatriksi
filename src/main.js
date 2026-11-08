import './styles.css';
import { start } from './app.js';

window.__APP_VERSION__ = __APP_VERSION__;
start();

// PWA: yalnızca http(s) üzerinden sunulduğunda (masaüstü/mobil paketlerde gerekmez)
const isNativeShell = !!(window.__TAURI_INTERNALS__ || window.Capacitor?.isNativePlatform?.());
if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !isNativeShell && !import.meta.env.DEV && !__SINGLE__) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}

# Geliştirme bağımlılıkları

2026-11-09: Tarayıcı regresyonları için `@playwright/test` (Apache-2.0) ve
`@axe-core/playwright` (MPL-2.0) yalnızca geliştirme bağımlılığı olarak seçildi.
Playwright Microsoft tarafından, axe Deque tarafından bakımı yapılan projelerdir.
Chromium ile Linux CI ve yerel test; Windows/macOS geliştirme ortamları desteklenir.
Bu paketler Vite üretim paketine veya Tauri/Capacitor uygulamasına girmez.
Çalışma anında CDN, analitik veya ağ servisi eklenmez. Kilitli sürümler package-lock.json içindedir.

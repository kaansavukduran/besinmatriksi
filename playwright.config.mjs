import { defineConfig, devices } from '@playwright/test';
// Varsayılan: Chromium masaüstü + telefon. PW_BROWSERS=all ile Firefox (masaüstü), WebKit/Safari (masaüstü + iPhone, iPad) da koşar (CI "Tarayıcı uyumu" işi).
const chromiumLaunch = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {};
const base = [
  { name: 'desktop', use: { browserName: 'chromium', viewport: { width: 1440, height: 1000 }, launchOptions: chromiumLaunch } },
  { name: 'phone', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, launchOptions: chromiumLaunch } },
];
const extra = [
  { name: 'firefox', use: { browserName: 'firefox', viewport: { width: 1440, height: 1000 } } },
  { name: 'safari', use: { browserName: 'webkit', viewport: { width: 1440, height: 1000 } } },
  { name: 'iphone', use: { ...devices['iPhone 13'] } },
  { name: 'ipad', use: { ...devices['iPad (gen 7)'] } },
];
export default defineConfig({
  // B188: CI'da kararsız bir test bir kez yeniden denenir (Playwright "flaky" diye raporlar, gizlemez); yeniden denemede iz kaydedilir. Yerelde yeniden deneme yok.
  testDir: './tests/browser', fullyParallel: false, workers: 1, timeout: 30000, retries: process.env.CI ? 1 : 0,
  use: { baseURL: 'http://127.0.0.1:4173', locale: 'tr-TR', trace: process.env.CI ? 'retain-on-first-failure' : 'retain-on-failure' },
  projects: process.env.PW_BROWSERS === 'all' ? [...base, ...extra] : base,
  webServer: { command: 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort', url: 'http://127.0.0.1:4173', reuseExistingServer: false },
});

import { test, expect } from '@playwright/test';

// D1–D3: İngilizce sözlük parçası yüklenemezse uygulama yine açılır (Türkçe metinle); bağlantı dönünce dil seçimi yeniden dener
test.use({ locale: 'en-US', serviceWorkers: 'block' });

test('D1 İngilizce sözlük yüklenemezse uygulama açılır; yeniden açılış İngilizceyi yükler', async ({ page }) => {
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  let blocked = true;
  await page.route(/i18n-ui-[\w-]+\.js$/, (route) => (blocked ? route.abort() : route.continue()));
  await page.goto('/');
  await expect.poll(() => page.evaluate(() => window.__bmBooted === true), { timeout: 8000 }).toBe(true);
  await expect(page.locator('#q')).toBeVisible();
  await expect(page.locator('nav.tabs [data-tab="kesfet"]').first()).toHaveText('Keşfet'); // sözlük yok → Türkçe

  // dil seçimi yeniden dener; tarayıcı başarısız modülü aynı sayfada hatırlayabilir, ama hata yakalanır ve uygulama çalışır kalır
  await page.goto('/#/settings');
  await page.locator('[data-action="set"][data-k="language"][data-v=\'"en"\']').click();
  await expect(page.locator('#q, .settings').first()).toBeVisible();
  expect(errors).toEqual([]); // D3: yakalanmamış Promise reddi yok

  // bağlantı dönünce yeniden açılış İngilizce sözlüğü yükler
  blocked = false;
  await page.reload();
  await expect(page.locator('nav.tabs [data-tab="kesfet"]').first()).toHaveText('Explore');
  expect(errors).toEqual([]);
});

import { test, expect } from '@playwright/test';

test('B205 adres çubuğu: sekme ve besin bağlantısı, Geri/İleri, doğrudan açılış', async ({ page }) => {
  const errors = []; page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.locator('#q').fill('nohut');
  await page.locator('#foodlist [data-id="nohut"]').click();
  await expect(page).toHaveURL(/#\/food\/nohut$/);
  await page.locator('.tabs [data-action="tab"][data-tab="karsilastir"]').first().click();
  await expect(page).toHaveURL(/#\/compare$/);
  await page.goBack();
  await expect(page).toHaveURL(/#\/food\/nohut$/);
  await expect(page.locator('#food-title')).toContainText('Nohut');
  await page.goBack();
  await expect(page).toHaveURL(url => url.pathname === '/' && ['', '#/'].includes(url.hash));
  await expect(page.locator('#matrix')).toHaveCount(0);
  await page.goForward();
  await expect(page.locator('#food-title')).toContainText('Nohut');
  // paylaşılan bağlantıyla doğrudan açılış (biçim dahil), bilinmeyen bağlantı Keşfet'e düşer
  await page.goto('/#/food/nohut/1');
  await expect(page.locator('#food-title')).toContainText('Nohut');
  await expect(page.locator('.forms [aria-pressed="true"]')).toHaveText(/Haşlanmış/);
  await page.goto('/#/settings');
  await expect(page.locator('.settings')).toBeVisible();
  await page.goto('/#/food/boyle-bir-sey-yok');
  await expect(page.locator('#foodlist')).toBeVisible();
  expect(errors).toEqual([]);
});

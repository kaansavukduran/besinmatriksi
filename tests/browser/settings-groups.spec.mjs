import { test, expect } from '@playwright/test';

test('B212 Ayarlar bölüm düğmeleri dört grupta; her düğme kendi kartına götürür; taşma yok', async ({ page }) => {
  const errors = []; page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/#/settings');
  const groups = page.locator('.settings-toc .toc-group');
  await expect(groups).toHaveCount(4);
  const chips = page.locator('.settings-toc [data-action="settings-jump"]');
  const n = await chips.count();
  expect(n).toBeGreaterThanOrEqual(14);
  expect(await page.locator('.settings .card[id^="set-"]').count()).toBe(n); // her kartın bir düğmesi var
  await page.locator('.settings-toc [data-action="settings-jump"]').filter({ hasText: /Yedekleme|Backup/ }).click();
  await expect(page.locator(`#${await page.locator('.settings-toc [data-action="settings-jump"]').filter({ hasText: /Yedekleme|Backup/ }).getAttribute('data-id')} h2`)).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
});

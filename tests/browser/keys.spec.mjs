import { test, expect } from '@playwright/test';

test('B206 klavye: / aramaya, ↓/↑ sonuçlarda, Enter açar, Esc kapatır ve temizler', async ({ page }) => {
  const errors = []; page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/#/settings');
  await page.locator('body').click({ position: { x: 5, y: 5 } }).catch(() => {});
  await page.keyboard.press('/');
  await expect(page.locator('#q')).toBeFocused();
  await page.keyboard.type('mercimek');
  await expect(page.locator('#foodlist button.food').first()).toBeVisible();
  await page.keyboard.press('ArrowDown');
  const first = page.locator('#foodlist button.food').first();
  await expect(first).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#foodlist button.food').nth(1)).toBeFocused();
  await page.keyboard.press('ArrowUp'); await page.keyboard.press('ArrowUp');
  await expect(page.locator('#q')).toBeFocused();
  await page.keyboard.press('ArrowDown');
  const id = await first.getAttribute('data-id');
  await page.keyboard.press('Enter');
  await expect(page.locator('#matrix')).toBeVisible();
  await page.locator('.detail h2').click();
  await page.keyboard.press('Escape');
  await expect(page.locator('#matrix')).toHaveCount(0);
  await expect(page.locator(`#foodlist [data-id="${id}"]`)).toBeFocused();
  await page.locator('#q').focus();
  await page.keyboard.press('Escape');
  await expect(page.locator('#q')).toHaveValue('');
  expect(errors).toEqual([]);
});

test('B206 dokunmatik ekranda dokunma hedefi 44 px, yatay taşma yok', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'phone', 'yalnız dokunmatik projede');
  for (const width of [320, 375]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--tap').trim())).toBe('44px');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.locator('#foodlist [data-id]').first().click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
});

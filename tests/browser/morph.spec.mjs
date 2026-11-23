import { reveal } from './navigation.mjs';
import { test, expect } from '@playwright/test';

test('B199 miktar değişince matris düğümleri korunur, yalnız sayılar değişir', async ({ page }) => {
  const errors = []; page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.locator('#q').fill('ceviz');
  await page.locator('#foodlist [data-id="ceviz"]').click();
  const energy = page.locator('#matrix [data-overview="energy"]');
  await expect(energy).toBeVisible();
  const before = await energy.textContent();
  await page.evaluate(() => { document.querySelector('#matrix [data-overview="energy"]').__mark = 1; document.querySelector('#matrix .idcard').__mark = 2; });
  await reveal(page, '[data-amount="ex"] .amount-options'); await page.locator('[data-amount="ex"] [data-val="250"]').click();
  await expect(energy).not.toHaveText(before);
  expect(await page.evaluate(() => [document.querySelector('#matrix [data-overview="energy"]').__mark, document.querySelector('#matrix .idcard').__mark])).toEqual([1, 2]);
  // açık bölüm açık kalır, tekrar 100 g'a dönünce ilk değer geri gelir
  await reveal(page, '[data-amount="ex"] .amount-options'); await page.locator('[data-amount="ex"] [data-val="100"]').click();
  await expect(energy).toHaveText(before);
  expect(errors).toEqual([]);
});

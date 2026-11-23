import { reveal } from './navigation.mjs';
import { test, expect } from '@playwright/test';

test('B141 kahve porsiyonu, dondurulmuş pizza ve cips gerçek arama yoluyla kullanılır', async ({ page }) => {
  const errors = []; page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  const pick = async (query, id) => {
    if (await page.locator('[data-action="ex-back"]').isVisible()) await page.locator('[data-action="ex-back"]').click();
    await page.locator('#q').fill(query);
    await page.locator(`#foodlist [data-id="${id}"]`).click();
    await reveal(page, '[data-amount="ex"] .amount-options'); await page.locator('[data-amount="ex"] [data-val="100"]').click();
  };
  await pick('latte', 'latte_sutlu');
  const cup = page.locator('[data-amount="ex"] [data-val="180"]');
  await expect(cup).toContainText('1 fincan (tarif)');
  await cup.click();
  await expect(page.locator('[data-amtval="ex"]')).toContainText('180');
  await expect(page.locator('#matrix [data-basic="energy"]')).toContainText('94');
  await expect(page.locator('#matrix .idcard')).toContainText('Tahmin (tarif)');

  await pick('donmuş pizza', 'dondurulmus_pizza_peynirli');
  await expect(page.locator('#matrix [data-basic="energy"]')).toContainText('268');
  await expect(page.locator('.detail')).toContainText('pişirilmiş ağırlığı');

  await pick('cips', 'patates_cipsi');
  await expect(page.locator('#matrix [data-basic="energy"]')).toContainText('532');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
});

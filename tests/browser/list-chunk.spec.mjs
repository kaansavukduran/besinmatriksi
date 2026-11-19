import { test, expect } from '@playwright/test';

test('B198 ana liste parça parça çizilir; daha göster ve kaydırma ekler, arama sıfırlar', async ({ page }) => {
  const errors = []; page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  const cards = page.locator('#foodlist [data-id]');
  await expect(cards.first()).toBeVisible();
  const first = await cards.count();
  expect(first).toBeLessThanOrEqual(240);
  const more = page.locator('#foodlist .list-more');
  await expect(more).toHaveCount(1);
  await expect(more).toContainText(/besin daha göster|more foods/);
  await more.scrollIntoViewIfNeeded();
  await expect.poll(() => cards.count()).toBeGreaterThan(first);
  // arama tam listeyi sıfırlar ve sonuç yine bulunur
  await page.locator('#q').fill('ceviz');
  await expect(page.locator('#foodlist [data-id="ceviz"]')).toBeVisible();
  await page.locator('#q').fill('');
  await expect.poll(() => cards.count()).toBeLessThanOrEqual(240);
  expect(errors).toEqual([]);
});

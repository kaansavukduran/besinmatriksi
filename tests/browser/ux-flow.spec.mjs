import { category, filters } from './navigation.mjs';
import { test, expect } from '@playwright/test';

// B247: boş sonuçta nedeni ve tek dokunuşluk çıkışlar
test('B247 boş arama: temizle, kategoriyi genişlet ve beslenme filtresini sıfırla', async ({ page }) => {
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.locator('#q').fill('xyzqq');
  await expect(page.locator('#foodlist .empty-state')).toBeVisible();
  await page.locator('#foodlist .empty-state [data-action="ex-clear"]').click();
  await expect(page.locator('#q')).toHaveValue('');
  await expect(page.locator('#foodlist [data-action="ex-pick"]').first()).toBeVisible();

  // kategori daraltıyorsa: tüm kategorilerde ara (arama korunur)
  await category(page, 'meyve');
  await page.locator('#q').fill('mercimek');
  await page.locator('#foodlist .empty-state [data-action="ex-cat"]').click();
  await expect(page.locator('#q')).toHaveValue('mercimek');
  await expect(page.locator('#foodlist [data-id="kirmizi_mercimek"]')).toBeVisible();

  // beslenme filtresi gizliyorsa: neden + sıfırla
  await filters(page); await page.locator('#ex-diet-pattern').selectOption('vegan');
  await page.locator('#q').fill('simit');
  await expect(page.locator('#foodlist .empty-state')).toContainText('Beslenme filtresi açık');
  await page.locator('#foodlist .empty-state [data-action="diet-reset"]').click();
  await expect(page.locator('#ex-diet-pattern')).toHaveValue('omnivore');
  await expect(page.locator('#foodlist [data-id="simit"]')).toBeVisible();
  expect(errors).toEqual([]);
});

// B248: telefonda ana sayfanın ilk ekranında en az bir besin görünür (alt menünün üstünde)
test('B248 telefon ilk ekran: ilk besin alt menünün üstünde, yatay taşma yok', async ({ page }) => {
  for (const vp of [{ width: 390, height: 844 }, { width: 360, height: 740 }]) {
    await page.setViewportSize(vp);
    await page.goto('/');
    const food = page.locator('#foodlist [data-action="ex-pick"]').first();
    await expect(food).toBeVisible();
    const top = (await food.boundingBox()).y;
    const nav = await page.locator('nav.tabs').boundingBox();
    const limit = nav && nav.y > vp.height / 2 ? nav.y : vp.height; // masaüstünde menü üstte
    expect(top + 40, `${vp.width}×${vp.height}`).toBeLessThan(limit);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
});

// B270: besin listesindeki ekran dışı gruplar sonradan çizilir; kaydırınca görünür, yazdırmada hepsi çizilir
test('B270 besin grupları content-visibility: kaydırınca ve yazdırmada görünür', async ({ page }) => {
  await page.goto('/');
  const groups = page.locator('#foodlist .foods');
  await expect(groups.first()).toBeVisible();
  expect(await groups.first().evaluate((e) => getComputedStyle(e).contentVisibility)).toBe('auto');
  const far = page.locator('#foodlist .food').last();
  await far.scrollIntoViewIfNeeded();
  await expect(far).toBeVisible();
  await page.emulateMedia({ media: 'print' });
  expect(await groups.last().evaluate((e) => getComputedStyle(e).contentVisibility)).toBe('visible');
});

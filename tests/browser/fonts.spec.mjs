import { tab } from './navigation.mjs';
import { test, expect } from '@playwright/test';


test('başlık kimliği yerel Bricolage dosyalarıyla Türkçe karakterleri yükler', async ({ page, baseURL }) => {
  const externalFonts = [];
  const appOrigin = new URL(baseURL).origin;
  page.on('request', request => {
    if (request.resourceType() === 'font' && new URL(request.url()).origin !== appOrigin) externalFonts.push(request.url());
  });
  await page.goto('/');
  const heading = page.locator('h1').first();
  await expect(heading).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await expect(heading).toHaveCSS('font-family', /BM Bricolage Grotesque/);
  await page.evaluate(() => document.fonts.load('700 32px "BM Bricolage Grotesque"', 'ÇĞİÖŞÜçğıöşü'));
  const fontState = await page.evaluate(() => ({
    faces: [...document.fonts].filter(font => font.family.replace(/^"|"$/g, '') === 'BM Bricolage Grotesque').map(font => ({ weight: font.weight, status: font.status })),
    turkishReady: document.fonts.check('700 32px "BM Bricolage Grotesque"', 'ÇĞİÖŞÜçğıöşü'),
  }));
  expect(fontState.faces).toEqual([{ weight: '700', status: 'loaded' }, { weight: '700', status: 'loaded' }]);
  expect(fontState.turkishReady).toBe(true);
  expect(externalFonts).toEqual([]);
});

test('okunabilirlik fontu seçimi başlıkta da uygulanır ve yeniden açılışta korunur', async ({ page }) => {
  await page.goto('/');
  for (const [id, family] of [['atkinson', 'BM Atkinson'], ['opendyslexic', 'BM OpenDyslexic'], ['lexend', 'BM Lexend'], ['andika', 'BM Andika']]) {
    await tab(page, 'ayarlar');
    await page.locator(`.fontbtn[data-action="font"][data-v="${id}"]`).click();
    await tab(page, 'kesfet');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1').first()).toHaveCSS('font-family', new RegExp(family));
  }
  await page.reload();
  await expect(page.locator('h1').first()).toHaveCSS('font-family', /BM Andika/);
  await tab(page, 'ayarlar');
  await expect(page.locator('.fontbtn[data-v="andika"]')).toHaveClass(/on/);
});

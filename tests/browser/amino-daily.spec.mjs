import { reveal, tab } from './navigation.mjs';
import { test, expect } from '@playwright/test';
const aa = (p, key) => p.locator(`#matrix [data-sec="protein"] [data-nutrient="${key}"]`);
for (const language of ['tr', 'en']) {
  test(`B146 daily amino bars ${language}: partial, amount, saved body weight and bottom catalogue`, async ({page}) => {
    await page.addInitScript(language => localStorage.setItem('bm.settings.v2', JSON.stringify({version:2,settings:{language}})), language);
    await page.goto('/');
    await expect(page.locator('.cats [data-action="ex-cat"]').last()).toHaveAttribute('data-cat', 'ext');
    await expect(page.locator('[data-action="ex-cat"][data-cat="ext"]')).toContainText(language === 'tr' ? 'Tam Katalog' : 'Full Catalogue');
    await page.locator('#q').fill('nohut'); await page.locator('#foodlist [data-id="nohut"]').click();
    for (const key of ['his','ile','leu','lys','met','phe','thr','trp','val']) await expect(aa(page,key).locator('.bar')).toHaveCount(1);
    await expect(aa(page,'his').locator('.nrv')).toHaveAttribute('title', /70 kg/);
    const width = await aa(page,'his').locator('.bar i').getAttribute('style');
    await reveal(page, '[data-amount="ex"] .amount-options'); await page.locator('[data-amount="ex"] [data-delta="10"]').click();
    await expect(aa(page,'his').locator('.bar i')).not.toHaveAttribute('style',width);
    await page.locator('[data-action="ex-add-recipe"]').click(); await page.locator('[data-action="ex-add-day"]').click();
    if (await page.locator('[data-action="ex-back"]').isVisible()) await page.locator('[data-action="ex-back"]').click();
    await page.locator('#q').fill('ristretto');await page.locator('#foodlist [data-id="ristretto"]').click();
    await expect(aa(page,'his')).toHaveCount(0);
    await page.locator('[data-action="ex-add-recipe"]').click();await tab(page,'tarif');
    await expect(aa(page,'his').locator('.pct')).toContainText('≥');
    await expect(aa(page,'his').locator('.partial')).toContainText('1/2');
    await expect(aa(page,'met').locator('.aa-joint')).toBeVisible();
    await expect(aa(page,'protein').locator('.nrv')).not.toHaveAttribute('title',/WHO/);
    await tab(page,'gunluk');
    await reveal(page, '[data-ux-details="diary-profile"]'); await page.locator('[data-personal-field="age"]').fill('30');await reveal(page, '[data-ux-details="diary-profile"]'); await page.locator('[data-personal-field="weight"]').fill('80');
    await page.locator('[data-action="personal-save"]').click();
    await expect(page.locator('[data-daily-nutrient="his"] .nrv')).toHaveAttribute('title',/80 kg/);
    await tab(page,'tarif');await expect(aa(page,'his').locator('.nrv')).toHaveAttribute('title',/80 kg/);
    await page.reload(); await tab(page,'tarif');await expect(aa(page,'his').locator('.nrv')).toHaveAttribute('title',/80 kg/);
  });
  test(`B146 amino reflow ${language}: 320px,28px and200percent`, async ({page}) => {
    await page.setViewportSize({width:320,height:900});
    await page.addInitScript(language => localStorage.setItem('bm.settings.v2',JSON.stringify({version:2,settings:{language,fontSize:28,uiScale:200}})),language);
    await page.goto('/');await page.locator('#q').fill('nohut');await page.locator('#foodlist [data-id="nohut"]').click();
    await aa(page,'phe').scrollIntoViewIfNeeded();await expect(aa(page,'phe').locator('.bar')).toBeVisible();
    const outside=await aa(page,'phe').evaluate(row=>[...row.children].some(c=>c.getBoundingClientRect().right>innerWidth+1));
    expect(outside).toBe(false);
    await expect(page.locator('html')).toHaveAttribute('lang',language);
  });
}

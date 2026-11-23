import { category, tab } from './navigation.mjs';
import {test,expect} from '@playwright/test';
for(const language of ['tr','en']){
 test(`B155 missing dried fruit ${language}: common names,empty measurements and label entry`,async({page})=>{
  await page.addInitScript(language=>localStorage.setItem('bm.settings.v2',JSON.stringify({version:2,settings:{language}})),language);await page.goto('/');await category(page, 'meyve');
  const dry=page.locator('#foodlist [data-catalog-group="kurumeyve"]');for(const id of ['gun_kurusu_kayisi','kuru_dut','kuru_cilek','kuru_ananas','kuru_kivi'])await expect(dry.locator(`[data-id="${id}"]`)).toHaveCount(1);
  for(const query of language==='tr'?['gün kurusu','günkurusu','gunkursu']:['sun-dried apricots','unsulfured apricot']){await page.locator('#q').fill(query);await expect(page.locator('#foodlist [data-id="gun_kurusu_kayisi"]')).toBeVisible();}
  await page.locator('#foodlist [data-id="gun_kurusu_kayisi"]').click();await expect(page.locator('.detail .unavail')).toContainText(language==='tr'?'kopyalanmadı':'not copied');await expect(page.locator('#matrix [data-basic="energy"] b')).toHaveText(language==='tr'?'veri yok':'no data');await expect(page.locator('#matrix [data-basic="energy"] .gref')).toHaveCount(0);await expect(page.locator('.unavail [data-action="cu-new"]')).toBeVisible();
 });
 test(`B155 measured dried fruit ${language}: named dry sections,source values and honest mixed recipe`,async({page})=>{
  await page.addInitScript(language=>{if(!localStorage.getItem('bm.settings.v2'))localStorage.setItem('bm.settings.v2',JSON.stringify({version:2,settings:{language}}));},language);await page.goto('/');await category(page, 'meyve');
  const dry=page.locator('#foodlist [data-catalog-group="kurumeyve"]');for(const id of ['kuru_mango','kuru_armut','kuru_trabzon_hurmasi','kuru_turna_yemisi','kuru_yaban_mersini','kuru_hunnap','kuru_lici','kuru_longan','muz_cipsi'])await expect(dry.locator(`[data-id="${id}"]`)).toHaveCount(1);
  await page.locator('#q').fill(language==='tr'?'mango kurusu':'dried mango');await page.locator('#foodlist [data-id="kuru_mango"]').click();await expect(page.locator('#food-title')).toContainText(language==='tr'?'şekerli':'sweetened');await expect(page.locator('#matrix [data-basic="energy"]')).toContainText('319');await page.locator('[data-action="ex-add-recipe"]').click();await page.locator('.brand').click();await page.locator('#q').fill('gunkurusu');await page.locator('#foodlist [data-id="gun_kurusu_kayisi"]').click();await page.locator('[data-action="ex-add-recipe"]').click();await tab(page,'tarif');await expect(page.locator('.ing')).toHaveCount(2);await expect(page.locator('#recipe-summary [data-basic="energy"]')).toContainText('≥');await expect(page.locator('#recipe-summary [data-basic="energy"]')).toContainText('319');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('bm.recipes.v1')));expect(saved[0].items.map(i=>i.ref.id)).toEqual(['kuru_mango','gun_kurusu_kayisi']);await page.reload();await tab(page,'tarif');await expect(page.locator('.ing')).toHaveCount(2);await expect(page.locator('#recipe-summary [data-basic="energy"]')).toContainText('≥');
 });
}

test('B264 kuru ananas değerleri, klorür ve CoFID hesabının kaynağı görünür', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('kuru ananas');
  await expect(page.locator('#foodlist [data-id="kuru_ananas_sekerli"]')).toBeVisible();
  await page.locator('#foodlist [data-id="kuru_ananas"]').click();
  await expect(page.locator('[data-overview="energy"]')).toContainText('303');
  await expect(page.locator('[data-micro="chloride"] .micro-value')).toHaveText('127 mg');
  await expect(page.locator('[data-micro="iodine"]')).toHaveAttribute('data-micro-status', 'missing');
  await expect(page.locator('#matrix .idcard')).toContainText('CoFID 14-396');
  await expect(page.locator('#matrix .idcard')).toContainText('CoFID tarafından hesaplanan profil');
});

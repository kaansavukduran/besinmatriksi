import {test,expect} from '@playwright/test';
import { categories, category, tab } from './navigation.mjs';
const cat=(page,id)=>page.locator(`#ex-categories [data-cat="${id}"]`);
for(const language of ['tr','en']){
 test(`B153 home ${language}: logo, text, keyboard and section navigation preserve saved work`,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(language=>{if(!localStorage.getItem('bm.settings.v2'))localStorage.setItem('bm.settings.v2',JSON.stringify({version:2,settings:{language}}));},language);await page.goto('/');
  const home=page.getByRole('button',{name:language==='tr'?"Besin Matriksi: Keşfet'e dön":'Besin Matriksi: Back to Explore',exact:true});
  await category(page,'baklagil');await page.locator('#q').fill('tofu');await page.locator('#foodlist [data-id="tofu_sert"]').click();await page.locator('[data-action="ex-add-recipe"]').click();await home.locator('svg').click();await expect(page.locator('.view-kesfet')).toBeVisible();await expect(page.locator('#q')).toHaveValue('');await expect(cat(page,'')).toHaveAttribute('class',/\bon\b/);await expect(page.locator('.explore')).not.toHaveClass(/has-sel/);
  const saved=await page.evaluate(()=>[localStorage.getItem('bm.recipes.v1'),localStorage.getItem('bm.settings.v2')]);
  for(const id of ['tarif','gunluk','karsilastir','hakkinda','ayarlar']){await tab(page,id);await home.locator('b').click();await expect(page.locator('.view-kesfet')).toBeVisible();await expect(page.locator('.tabs [data-tab="kesfet"]')).toHaveAttribute('aria-current','page');expect(await page.evaluate(()=>window.scrollY)).toBe(0);}
  for(const key of ['Enter','Space']){await tab(page,'tarif');await page.keyboard.press('Tab');await home.focus();await expect(home).toBeFocused();expect(await home.evaluate(el=>getComputedStyle(el).outlineStyle)).not.toBe('none');await home.press(key);await expect(page.locator('.view-kesfet')).toBeVisible();await expect(home).toBeFocused();}
  expect(await page.evaluate(()=>[localStorage.getItem('bm.recipes.v1'),localStorage.getItem('bm.settings.v2')])).toEqual(saved);await page.reload();await tab(page,'tarif');await expect(page.locator('.ing')).toHaveCount(1);expect(errors).toEqual([]);
 });
 test(`B261 Kategoriler açılır ve yatay kaydırma gerektirmez (${language})`, async ({ page }) => {
  await page.addInitScript(language => localStorage.setItem('bm.settings.v2', JSON.stringify({ version: 2, settings: { language } })), language);
  await page.goto('/');
  await expect(page.locator('#ex-categories')).toBeHidden();
  for (const width of [1440, 1024, 768, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await categories(page);
    const nav = page.locator('#ex-categories');
    const layout = await nav.evaluate(el => ({ width: el.clientWidth, scroll: el.scrollWidth, boxes: [...el.querySelectorAll('.cat')].map(b => b.getBoundingClientRect().right) }));
    expect(layout.scroll).toBeLessThanOrEqual(layout.width + 1);
    expect(Math.max(...layout.boxes)).toBeLessThanOrEqual(width + 1);
    await category(page, 'atistirmalik');
    await expect(cat(page, 'atistirmalik')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#foodlist [data-id="patates_cipsi"]')).toHaveCount(1);
    await category(page, '');
  }
 });
 test(`B153 reflow ${language}: large text,200percent,grid preference and hidden icons`,async({page})=>{
  await page.addInitScript(language=>{if(!localStorage.getItem('bm.settings.v2'))localStorage.setItem('bm.settings.v2',JSON.stringify({version:2,settings:{language,fontSize:28,uiScale:200,emoji:false}}));},language);await page.goto('/');
  for(const catGrid of [false,true]){
   await page.evaluate(catGrid=>{const s=JSON.parse(localStorage.getItem('bm.settings.v2'));s.settings.catGrid=catGrid;localStorage.setItem('bm.settings.v2',JSON.stringify(s));},catGrid);await page.reload();
   for (const width of [960, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await categories(page);
    const nav = page.locator('#ex-categories');
    expect(await nav.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    await category(page, 'icecek');
    await expect(cat(page, 'icecek')).toHaveAttribute('aria-pressed', 'true');
    await expect(nav).toHaveClass(catGrid ? /cats-grid/ : /^cats browse-categories$/);
    await tab(page, 'tarif');
    await page.locator('.brand').click();
    await expect(cat(page, '')).toHaveAttribute('class', /\bon\b/);
    await expect(page.locator('.brand svg')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
   }
   const settings=await page.evaluate(()=>JSON.parse(localStorage.getItem('bm.settings.v2')).settings);expect(settings.catGrid).toBe(catGrid);expect(settings.uiScale).toBe(200);expect(settings.fontSize).toBe(28);
  }
 });
}

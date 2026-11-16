import {test,expect} from '@playwright/test';
const tab=(page,id)=>page.locator(`.tabs [data-tab="${id}"]`).click();
const cat=(page,id)=>page.locator(`.explore>.cats [data-cat="${id}"]`);
for(const language of ['tr','en']){
 test(`B153 home ${language}: logo, text, keyboard and section navigation preserve saved work`,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(language=>{if(!localStorage.getItem('bm.settings.v2'))localStorage.setItem('bm.settings.v2',JSON.stringify({version:2,settings:{language}}));},language);await page.goto('/');
  const home=page.getByRole('button',{name:language==='tr'?"Besin Matriksi: Keşfet'e dön":'Besin Matriksi: Back to Explore',exact:true});
  await cat(page,'baklagil').click();await page.locator('#q').fill('tofu');await page.locator('#foodlist [data-id="tofu_sert"]').click();await page.locator('[data-action="ex-add-recipe"]').click();await home.locator('svg').click();await expect(page.locator('.view-kesfet')).toBeVisible();await expect(page.locator('#q')).toHaveValue('');await expect(cat(page,'')).toHaveAttribute('class',/\bon\b/);await expect(page.locator('.explore')).not.toHaveClass(/has-sel/);
  const saved=await page.evaluate(()=>[localStorage.getItem('bm.recipes.v1'),localStorage.getItem('bm.settings.v2')]);
  for(const id of ['tarif','gunluk','karsilastir','hakkinda','ayarlar']){await tab(page,id);await home.locator('b').click();await expect(page.locator('.view-kesfet')).toBeVisible();await expect(page.locator('.tabs [data-tab="kesfet"]')).toHaveAttribute('aria-current','page');expect(await page.evaluate(()=>window.scrollY)).toBe(0);}
  for(const key of ['Enter','Space']){await tab(page,'tarif');await page.keyboard.press('Tab');await home.focus();await expect(home).toBeFocused();expect(await home.evaluate(el=>getComputedStyle(el).outlineStyle)).not.toBe('none');await home.press(key);await expect(page.locator('.view-kesfet')).toBeVisible();await expect(home).toBeFocused();}
  expect(await page.evaluate(()=>[localStorage.getItem('bm.recipes.v1'),localStorage.getItem('bm.settings.v2')])).toEqual(saved);await page.reload();await tab(page,'tarif');await expect(page.locator('.ing')).toHaveCount(1);expect(errors).toEqual([]);
 });
 test(`B153 category rows ${language}: all desktop categories fit without horizontal scrolling`,async({page})=>{
  await page.addInitScript(language=>localStorage.setItem('bm.settings.v2',JSON.stringify({version:2,settings:{language}})),language);await page.goto('/');
  for(const width of [1440,1024,768]){
   await page.setViewportSize({width,height:1000});const nav=page.locator('.explore>.cats');
   const layout=await nav.evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth,wrap:getComputedStyle(el).flexWrap,boxes:[...el.querySelectorAll('.cat')].map(b=>{const r=b.getBoundingClientRect();return {top:r.top,left:r.left,right:r.right};})}));
   expect(layout.wrap).toBe('wrap');expect(layout.scroll).toBeLessThanOrEqual(layout.width+1);expect(new Set(layout.boxes.map(b=>Math.round(b.top))).size).toBeGreaterThan(1);for(const box of layout.boxes){expect(box.left).toBeGreaterThanOrEqual(0);expect(box.right).toBeLessThanOrEqual(width+1);}
   await cat(page,'atistirmalik').click();await expect(cat(page,'atistirmalik')).toHaveAttribute('class',/\bon\b/);await expect(page.locator('#foodlist [data-id="patates_cipsi"]')).toHaveCount(1);await cat(page,'').click();
  }
 });
 test(`B153 reflow ${language}: large text,200percent,grid preference and hidden icons`,async({page})=>{
  await page.addInitScript(language=>{if(!localStorage.getItem('bm.settings.v2'))localStorage.setItem('bm.settings.v2',JSON.stringify({version:2,settings:{language,fontSize:28,uiScale:200,emoji:false}}));},language);await page.goto('/');
  for(const catGrid of [false,true]){
   await page.evaluate(catGrid=>{const s=JSON.parse(localStorage.getItem('bm.settings.v2'));s.settings.catGrid=catGrid;localStorage.setItem('bm.settings.v2',JSON.stringify(s));},catGrid);await page.reload();
   for(const width of [960,320]){await page.setViewportSize({width,height:1000});await cat(page,'icecek').click();await expect(page.locator('.explore>.cats')).toHaveClass(catGrid?/cats-grid/:/^cats\s*$/);await tab(page,'tarif');await page.locator('.brand').click();await expect(cat(page,'')).toHaveAttribute('class',/\bon\b/);await expect(page.locator('.brand svg')).toHaveCount(0);expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);}
   const settings=await page.evaluate(()=>JSON.parse(localStorage.getItem('bm.settings.v2')).settings);expect(settings.catGrid).toBe(catGrid);expect(settings.uiScale).toBe(200);expect(settings.fontSize).toBe(28);
  }
 });
}

import {test,expect} from '@playwright/test';
const tab=(p,id)=>p.locator(`.tabs [data-tab="${id}"]`).click();
async function add(p,id){await tab(p,'kesfet');if(await p.locator('[data-action="ex-back"]').isVisible())await p.locator('[data-action="ex-back"]').click();await p.locator('#q').fill(id);await p.locator(`#foodlist [data-id="${id}"]`).click();await p.locator('[data-action="ex-add-recipe"]').click();await tab(p,'tarif');}
for(const language of ['tr','en']){
 test(`B148 automatic daily recipe ${language}:meals,total,serving,source,CSV,editing and no self inclusion`,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(language=>{if(!localStorage.getItem('bm.settings.v2'))localStorage.setItem('bm.settings.v2',JSON.stringify({version:2,settings:{language}}));},language);
  await page.goto('/');await add(page,'nohut');await page.locator('#rc-name').fill('Kahvaltı');await page.locator('#rc-name').blur();
  await page.locator('[data-action="rc-new"]').click();await add(page,'muz');await page.locator('#rc-name').fill('Öğle');await page.locator('#rc-name').blur();await page.locator('[data-action="rc-serv"][data-d="1"]').click();
  await page.locator('[data-action="rc-daily-total"]').click();
  await expect(page.locator('.daily-recipe-total h1')).toHaveText(language==='tr'?'Günlük Toplam Tarif':'Daily Recipe Total');
  await expect(page.locator('.meal-table tbody tr')).toHaveCount(2);await expect(page.locator('.tabs [data-tab="tarif"] .badge')).toHaveText('2');
  await expect(page.locator('.meal-table tbody tr').first().locator('[data-meal-nutrient="energy"]')).toHaveText('378 kcal');
  await expect(page.locator('.meal-table tbody tr').last().locator('[data-meal-nutrient="energy"]')).toHaveText('89 kcal');
  await expect(page.locator('#recipe-summary [data-basic="energy"]')).toContainText('467');
  await expect(page.locator('#matrix .aas .aabar')).toHaveCount(9);await expect(page.locator('#matrix .micro-row')).toHaveCount(28);
  await page.locator('[data-action="daily-recipe-basis"][data-b="serving"]').click();
  await expect(page.locator('.meal-table tbody tr').last().locator('[data-meal-nutrient="energy"]')).toContainText(language==='tr'?'44,5':'44.5');
  await expect(page.locator('#recipe-summary [data-basic="energy"]')).toContainText(language==='tr'?'423':'423');
  await page.locator('#matrix [data-micro="vitc"] button').click();
  await expect(page.locator('#recipe-source-rows .source-ingredients > li')).toHaveCount(2);await expect(page.locator('#recipe-source-rows')).toContainText('Kahvaltı');await expect(page.locator('#recipe-source-rows')).toContainText('Öğle');
  await page.locator('#recipe-source-nutrient').selectOption('energy');await expect(page.locator('#recipe-source-rows .source-total')).toContainText('423');
  const download=page.waitForEvent('download');await page.locator('.daily-recipe-header [data-action="csv"]').click();const stream=await(await download).createReadStream();const parts=[];for await(const x of stream)parts.push(x);const csv=Buffer.concat(parts).toString();expect(csv).toContain('422,5');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('bm.recipes.v1')));expect(saved).toHaveLength(2);expect(saved.map(x=>x.name)).toEqual(['Kahvaltı','Öğle']);
  await page.reload();await tab(page,'tarif');await page.locator('[data-action="rc-daily-total"]').click();await expect(page.locator('[data-action="daily-recipe-basis"][data-b="serving"]')).toHaveAttribute('aria-pressed','true');
  await page.locator('.meal-table [data-action="rc-open"]').first().click();await page.locator('.ing [data-delta="10"]').click();await page.locator('[data-action="rc-daily-total"]').click();await expect(page.locator('.meal-table tbody tr').first().locator('[data-meal-nutrient="energy"]')).toContainText(language==='tr'?'416':'416');
  for(let i=0;i<3;i++)await page.locator('[data-action="rc-new"]').click();await page.locator('#rc-q').fill('yokboyle');await expect(page.locator('[data-action="rc-daily-total"]')).toBeVisible();await page.locator('[data-action="rc-daily-total"]').click();await expect(page.locator('.meal-table tbody tr')).toHaveCount(5);expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('bm.recipes.v1')).length)).toBe(5);expect(errors).toEqual([]);
 });
 test(`B148 daily recipe reflow ${language}:320px28px200percent and partial`,async({page})=>{
  await page.setViewportSize({width:320,height:900});await page.addInitScript(language=>{localStorage.setItem('bm.settings.v2',JSON.stringify({version:2,settings:{language,fontSize:28,uiScale:200}}));localStorage.setItem('bm.recipes.v1',JSON.stringify([{id:'a',name:'Öğün 1',servings:1,items:[{id:'aa',ref:{t:'c',id:'nohut',f:0},g:100}]},{id:'b',name:'Öğün 2',servings:1,items:[{id:'bb',ref:{t:'c',id:'ristretto',f:0},g:100}]}]));},language);
  await page.goto('/');await tab(page,'tarif');await page.locator('[data-action="rc-daily-total"]').click();await expect(page.locator('.meal-table tbody tr')).toHaveCount(2);await expect(page.locator('#recipe-summary [data-basic="energy"]')).toContainText('≥');await expect(page.locator('#matrix .aas')).toHaveAttribute('data-aa-status','unknown');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
  await page.locator('.meal-table [data-action="rc-open"]').first().click();await expect(page.locator('#rc-name')).toHaveValue('Öğün 1');
 });
}

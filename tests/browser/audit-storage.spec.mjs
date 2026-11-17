import {test,expect} from '@playwright/test';
async function setup(page,language){await page.addInitScript(language=>{
 if(!localStorage.getItem('bm.settings.v2'))localStorage.setItem('bm.settings.v2',JSON.stringify({version:2,settings:{language}}));
 const write=Storage.prototype.setItem;window.denyStorageKey='';Storage.prototype.setItem=function(k,v){if(k===window.denyStorageKey)throw new DOMException('full','QuotaExceededError');return write.call(this,k,v);};
},language);await page.goto('/');}
for(const language of ['tr','en']){
 test(`B149 bulk recipe failure ${language}: selected foods stay available for one retry`,async({page})=>{
  await setup(page,language);await page.locator('[data-action="multi-toggle"]').click();for(const id of ['muz','yulaf']){await page.locator('#q').fill(id);await page.locator(`#foodlist [data-id="${id}"]`).click();}
  await page.evaluate(()=>window.denyStorageKey='bm.recipes.v1');await page.locator('[data-action="multi-add"]').click();await expect(page.locator('.multibar')).toBeVisible();await expect(page.locator('.toast')).toContainText(language==='tr'?'Kaydedilemedi':'Could not save');await page.locator('.tabs [data-tab="tarif"]').click();await expect(page.locator('.ing')).toHaveCount(0);
  await page.evaluate(()=>window.denyStorageKey='');await page.locator('.tabs [data-tab="kesfet"]').click();await page.locator('[data-action="multi-add"]').click();await page.locator('.tabs [data-tab="tarif"]').click();await expect(page.locator('.ing')).toHaveCount(2);expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('bm.recipes.v1'))[0].items.map(x=>x.g))).toEqual([100,100]);
 });
 test(`B149 recipe write failure ${language}: failed addition is retryable without a ghost ingredient`,async({page})=>{
  await setup(page,language);await page.locator('#q').fill('nohut');await page.locator('#foodlist [data-id="nohut"]').click();await page.evaluate(()=>window.denyStorageKey='bm.recipes.v1');await page.locator('[data-action="ex-add-recipe"]').click();await expect(page.locator('.toast')).toContainText(language==='tr'?'Kaydedilemedi':'Could not save');await page.locator('.tabs [data-tab="tarif"]').click();await expect(page.locator('.ing')).toHaveCount(0);
  await page.evaluate(()=>window.denyStorageKey='');await page.locator('.tabs [data-tab="kesfet"]').click();await page.locator('[data-action="ex-add-recipe"]').click();await page.locator('.tabs [data-tab="tarif"]').click();await expect(page.locator('.ing')).toHaveCount(1);expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('bm.recipes.v1'))[0].items[0].g)).toBe(100);
 });
 test(`B149 failed recovery ${language}: corrupt personal record stays protected until successful import`,async({page})=>{
  await setup(page,language);await page.evaluate(()=>localStorage.setItem('bm.personal.v1','{broken'));await page.reload();await page.locator('.tabs [data-tab="gunluk"]').click();
  const buffer=Buffer.from(JSON.stringify({app:'besin-matriksi-personal',version:1,personal:{schema:1,profile:{},entries:[],milestones:{}},custom:[]}));
  await page.evaluate(()=>window.denyStorageKey='bm.personal.v1');await page.locator('#personal-file').setInputFiles({name:'personal.json',mimeType:'application/json',buffer});await expect(page.locator('.dlg')).toBeVisible();await page.locator('.dlg [data-r="1"]').click();
  await page.evaluate(()=>window.denyStorageKey='');await page.locator('.tabs [data-tab="kesfet"]').click();await page.locator('#q').fill('nohut');await page.locator('#foodlist [data-id="nohut"]').click();await page.locator('[data-action="ex-add-day"]').click();expect(await page.evaluate(()=>localStorage.getItem('bm.personal.v1'))).toBe('{broken');
  await page.locator('.tabs [data-tab="gunluk"]').click();await page.locator('#personal-file').setInputFiles({name:'personal-retry.json',mimeType:'application/json',buffer});await expect(page.locator('.toast')).toContainText(language==='tr'?'birleştirildi':'merged');expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('bm.personal.v1')).entries.length)).toBe(0);
 });
 test(`B149 personal failure ${language}: failed daily addition never looks saved or duplicates on retry`,async({page})=>{
  await setup(page,language);await page.locator('#q').fill('nohut');await page.locator('#foodlist [data-id="nohut"]').click();await page.evaluate(()=>window.denyStorageKey='bm.personal.v1');await page.locator('[data-action="ex-add-day"]').click();await expect(page.locator('.toast')).toContainText(language==='tr'?'Kaydedilemedi':'Could not save');
  await page.locator('.tabs [data-tab="gunluk"]').click();await expect(page.locator('[data-action="personal-remove"]')).toHaveCount(0);await expect(page.locator('.day-empty')).toBeVisible();await expect(page.locator('[data-daily-nutrient="energy"]')).toHaveCount(0);expect(await page.evaluate(()=>localStorage.getItem('bm.personal.v1'))).toBeNull();
  await page.evaluate(()=>window.denyStorageKey='');await page.locator('.tabs [data-tab="kesfet"]').click();await page.locator('[data-action="ex-add-day"]').click();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('bm.personal.v1')).entries.length)).toBe(1);
 });
 test(`B149 import failure ${language}: no half-import, then normal retry`,async({page})=>{
  await setup(page,language);await page.locator('.tabs [data-tab="ayarlar"]').click();const before=await page.evaluate(()=>localStorage.getItem('bm.recipes.v1'));
  const buffer=Buffer.from(JSON.stringify({app:'besin-matriksi',version:1,recipes:[{id:'imported',name:'İçe aktarılan tarif',servings:1,items:[{id:'item',ref:{t:'c',id:'nohut',f:0},g:100}]}],custom:[],profiles:[],collections:[]}));
  await page.evaluate(()=>window.denyStorageKey='bm.profiles.v1');await page.locator('#imp-file').setInputFiles({name:'backup.json',mimeType:'application/json',buffer});await expect(page.locator('.dlg')).toContainText(language==='tr'?'İçe aktarılamadı':'Could not import');await page.locator('.dlg [data-r="1"]').click();expect(await page.evaluate(()=>localStorage.getItem('bm.recipes.v1'))).toBe(before);
  await page.evaluate(()=>window.denyStorageKey='');await page.locator('#imp-file').setInputFiles({name:'retry.json',mimeType:'application/json',buffer});await expect(page.locator('.toast')).toContainText(language==='tr'?'içe aktarıldı':'imported');expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('bm.recipes.v1')).filter(r=>r.name==='İçe aktarılan tarif').length)).toBe(1);
 });
 test(`B149 custom storage failure ${language}: preserve draft, retry, failed edit and deletion`,async({page})=>{
  await setup(page,language);await page.locator('[data-action="ex-cat"][data-cat="custom"]').click();await page.locator('[data-action="cu-new"]').click();
  await page.locator('#cu-name').fill('Etiket örneğim');await page.locator('[data-cu="energy"]').fill('99');await page.evaluate(()=>window.denyStorageKey='bm.custom.v1');await page.locator('[data-action="cu-save"]').click();
  await expect(page.locator('#cu-name')).toHaveValue('Etiket örneğim');await expect(page.locator('.toast')).toContainText(language==='tr'?'Kaydedilemedi':'Could not save');expect(await page.evaluate(()=>localStorage.getItem('bm.custom.v1'))).toBeNull();
  await page.evaluate(()=>window.denyStorageKey='');await page.locator('[data-action="cu-save"]').click();await expect(page.locator('#matrix')).toContainText('Etiket örneğim');
  await page.locator('[data-action="cu-edit"]').click();await page.locator('#cu-name').fill('Düzenlenmiş');await page.evaluate(()=>window.denyStorageKey='bm.custom.v1');await page.locator('[data-action="cu-save"]').click();await expect(page.locator('#cu-name')).toHaveValue('Düzenlenmiş');
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('bm.custom.v1'))[0].name)).toBe('Etiket örneğim');
  await page.locator('[data-action="cu-delete"]').click();await page.locator('.dlg [data-r="1"]').click();await expect(page.locator('#cu-name')).toHaveValue('Düzenlenmiş');
  await page.evaluate(()=>window.denyStorageKey='');await page.locator('[data-action="cu-save"]').click();await page.reload();await page.locator('[data-action="ex-cat"][data-cat="custom"]').click();await expect(page.locator('#foodlist')).toContainText('Düzenlenmiş');
 });
 test(`B149 profile storage failure ${language}: preserve name and last saved appearance`,async({page})=>{
  await setup(page,language);await page.locator('.tabs [data-tab="ayarlar"]').click();await page.locator('#profile-name').fill('Görünümüm');await page.evaluate(()=>window.denyStorageKey='bm.profiles.v1');await page.locator('[data-action="profile-save"]').click();await expect(page.locator('#profile-name')).toHaveValue('Görünümüm');await expect(page.locator('.profile-bar')).toHaveCount(0);
  await page.evaluate(()=>window.denyStorageKey='');await page.locator('[data-action="profile-save"]').click();await expect(page.locator('.profile-bar')).toContainText('Görünümüm');
  const before=await page.evaluate(()=>localStorage.getItem('bm.profiles.v1'));await page.evaluate(()=>window.denyStorageKey='bm.profiles.v1');await page.locator('[data-action="profile-update"]').click();await page.locator('.dlg [data-r="1"]').click();await expect(page.locator('.toast')).toContainText(language==='tr'?'yazılamadı':'Could not');expect(await page.evaluate(()=>localStorage.getItem('bm.profiles.v1'))).toBe(before);
  await page.locator('[data-action="profile-delete"]').click();await page.locator('.dlg [data-r="1"]').click();await expect(page.locator('.profile-bar')).toContainText('Görünümüm');
 });
}

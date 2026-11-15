import {test,expect} from '@playwright/test';
const tab=(p,id)=>p.locator(`.tabs [data-tab="${id}"]`).click();
const chart=p=>p.locator('#matrix .aas');
async function pick(p,id,q=id) {
 await tab(p,'kesfet');if(await p.locator('[data-action="ex-back"]').isVisible())await p.locator('[data-action="ex-back"]').click();
 await p.locator('#q').fill(q);await p.locator(`#foodlist [data-id="${id}"]`).click();
}
for(const language of ['tr','en']) {
 test(`B147 recipe amino parity ${language}: single,total,serving,per100,partial and recovery`,async({page})=>{
  await page.addInitScript(language=>localStorage.setItem('bm.settings.v2',JSON.stringify({version:2,settings:{language}})),language);
  await page.goto('/');await pick(page,'nohut');
  const single=await chart(page).locator('.aav').allTextContents(),score=await chart(page).locator('.aas-head b').textContent();
  await page.locator('[data-action="ex-add-recipe"]').click();await tab(page,'tarif');
  await expect(chart(page)).toHaveAttribute('data-aa-status','complete');
  expect(await chart(page).locator('.aav').allTextContents()).toEqual(single);
  await expect(chart(page).locator('.aas-head b')).toHaveText(score);
  await page.locator('[data-action="rc-serv"][data-d="1"]').click();await page.locator('[data-action="rc-basis"][data-b="serving"]').click();
  expect(await chart(page).locator('.aav').allTextContents()).toEqual(single);
  await page.locator('[data-action="rc-basis"][data-b="per100"]').click();expect(await chart(page).locator('.aav').allTextContents()).toEqual(single);
  await pick(page,'elma');await page.locator('[data-action="ex-add-recipe"]').click();await tab(page,'tarif');
  await expect(chart(page)).toHaveAttribute('data-aa-status','complete');expect(await chart(page).locator('.aav').allTextContents()).not.toEqual(single);
  await page.locator('.ing').last().locator('[data-action="rc-del-item"]').click();expect(await chart(page).locator('.aav').allTextContents()).toEqual(single);
  await pick(page,'yabanmersini');await page.locator('[data-action="ex-form"][data-f="1"]').click();await page.locator('[data-action="ex-add-recipe"]').click();await tab(page,'tarif');
  await expect(chart(page)).toHaveAttribute('data-aa-status','partial');await expect(chart(page).locator('.aabar')).toHaveCount(9);
  await expect(chart(page).locator('.aas-head b')).toContainText('≥');
  await expect(chart(page).locator('[data-aa="lys"] .aav')).toContainText('≥');
  await chart(page).locator('.aa-gaps summary').click();await expect(chart(page).locator('.aa-gaps li')).toContainText(language==='tr'?'Yaban mersini':'Blueberr');
  await expect(chart(page).locator('.aa-gaps li')).toContainText(language==='tr'?'Lizin':'Lysine');
  await page.reload();await tab(page,'tarif');await expect(chart(page)).toHaveAttribute('data-aa-status','partial');
  await page.locator('.ing').last().locator('[data-action="rc-del-item"]').click();
  await expect(chart(page)).toHaveAttribute('data-aa-status','complete');expect(await chart(page).locator('.aav').allTextContents()).toEqual(single);
  await pick(page,'ristretto');await page.locator('[data-action="ex-add-recipe"]').click();await tab(page,'tarif');
  await expect(chart(page)).toHaveAttribute('data-aa-status','unknown');await expect(chart(page).locator('.aabar')).toHaveCount(9);
  await expect(chart(page).locator('.aa-reason')).toContainText(language==='tr'?'protein ölçümü eksik':'protein measurements are incomplete');
 });
 test(`B147 recipe amino layout ${language}:320px+28px/200percent`,async({page})=>{
  await page.setViewportSize({width:320,height:900});await page.addInitScript(language=>localStorage.setItem('bm.settings.v2',JSON.stringify({version:2,settings:{language,fontSize:28,uiScale:200}})),language);
  await page.goto('/');await pick(page,'nohut');await page.locator('[data-action="ex-add-recipe"]').click();await pick(page,'yabanmersini');await page.locator('[data-action="ex-form"][data-f="1"]').click();await page.locator('[data-action="ex-add-recipe"]').click();await tab(page,'tarif');
  await chart(page).scrollIntoViewIfNeeded();await expect(chart(page).locator('.aabar')).toHaveCount(9);
  await chart(page).locator('.aa-gaps summary').click();await expect(chart(page).locator('.aa-gaps li')).toBeVisible();
  const outside=await chart(page).evaluate(el=>[...el.querySelectorAll('.aabar > *, .aa-gaps')].some(x=>x.getBoundingClientRect().right>innerWidth+1));expect(outside).toBe(false);
 });
}

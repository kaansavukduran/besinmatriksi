import { test, expect } from '@playwright/test';

test('B210/B211 dünya ve Anadolu yemekleri aranır; vegan filtresi doğrulanmış bitkisel tarifleri gösterir', async ({ page }) => {
  const errors = []; page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.locator('#q').fill('sushi');
  await expect(page.locator('#foodlist [data-id="susi_somonlu"]')).toBeVisible();
  await expect(page.locator('#foodlist [data-id="susi_california"]')).toBeVisible();
  await page.locator('#q').fill('içli köfte');
  await expect(page.locator('#foodlist [data-id="icli_kofte_etsiz"]')).toBeVisible();
  await expect(page.locator('#foodlist [data-id="icli_kofte"]')).toBeVisible();
  await page.locator('#foodlist [data-id="icli_kofte_etsiz"]').click();
  await expect(page.locator('#matrix .idcard')).toContainText('Tahmin');
  if (await page.locator('[data-action="ex-back"]').isVisible()) await page.locator('[data-action="ex-back"]').click();
  await page.locator('#ex-diet-pattern').selectOption('vegan');
  await page.locator('#q').fill('köfte');
  await expect(page.locator('#foodlist [data-id="icli_kofte_etsiz"]')).toBeVisible();
  await expect(page.locator('#foodlist [data-id="icli_kofte"]')).toHaveCount(0);
  await page.locator('#q').fill('meksika fasulyesi');
  await expect(page.locator('#foodlist [data-id="kirmizi_fasulye"]')).toBeVisible();
  // B231: yabancı adla arama (vegan filtresi açıkken de görünür)
  for (const [q, id] of [['mujaddara', 'mucedra'], ['khichdi', 'kicri'], ['gallo pinto', 'gallo_pinto'], ['lobio', 'lobio'], ['acılı ezme', 'acili_ezme'], ['barbunya pilaki', 'zeytinyagli_barbunya'], ['kushari', 'koshari'], ['lahana yemeği', 'kapuska'], ['lecso', 'lecso'], ['nohut pilavı', 'nohutlu_pilav'], ['karnıbahar yemeği', 'karnabahar_yemegi'], ['bharta', 'baingan_bharta'], ['duvec', 'djuvec'], ['three sisters', 'uc_kiz_kardes'], ['wild rice', 'yaban_pirinci_pilavi'], ['pumpkin soup', 'balkabagi_corbasi'], ['zeytinyağlı bakla', 'zeytinyagli_taze_bakla'], ['achichuk', 'achichuk'], ['jollof', 'jollof_pilavi'], ['red red', 'red_red'], ['groundnut stew', 'mafe'], ['gado gado', 'gado_gado'], ['quinoa salad', 'kinoa_salatasi'], ['couscous', 'kuskus_sebzeli'], ['fried rice', 'sebzeli_kizarmis_pilav'], ['thai curry', 'tay_sebze_korisi'], ['rice and peas', 'rice_and_peas'], ['pkhali', 'pkhali'], ['ajapsandali', 'ajapsandali'], ['adas polo', 'adas_polo'], ['soba', 'zaru_soba'], ['monggo', 'ginisang_monggo'], ['mexican rice', 'arroz_rojo'], ['frijoles', 'frijoles_de_la_olla'], ['kabak tatlısı', 'kabak_tatlisi'], ['hoşaf', 'kayisi_hosafi']]) {
    await page.locator('#q').fill(q);
    await expect(page.locator(`#foodlist [data-id="${id}"]`), q).toBeVisible();
  }
  expect(errors).toEqual([]);
});

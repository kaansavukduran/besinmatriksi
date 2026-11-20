import { test, expect } from '@playwright/test';

// B233: "toggle" olayı sonradan gelir; açılıştan hemen sonra (aynı görevde) yeniden çizim olursa bölüm kapanmamalı
test('B233 EFSA tablosu açıldığı görevde yeniden çizilse de açık kalır', async ({ page }) => {
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/#/settings');
  await page.locator('[data-k="referenceMode"][data-v=\'"efsa"\']').click();
  const panel = page.locator('.efsa-settings');
  await expect(panel.locator('details.efsa-table')).not.toHaveAttribute('open', '');
  await page.evaluate(() => {
    document.querySelector('details.efsa-table').open = true;
    const age = document.querySelector('[data-efsa="efsaAge"]');
    age.value = '20';
    age.dispatchEvent(new Event('change', { bubbles: true })); // toggle olayı gelmeden render()
  });
  await expect(panel.locator('[data-efsa="efsaAge"]')).toHaveValue('20');
  await expect(panel.locator('details.efsa-table')).toHaveAttribute('open', '');
  // kapatma da aynı şekilde korunur
  await page.evaluate(() => {
    document.querySelector('details.efsa-table').open = false;
    const age = document.querySelector('[data-efsa="efsaAge"]');
    age.value = '45';
    age.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expect(panel.locator('[data-efsa="efsaAge"]')).toHaveValue('45');
  await expect(panel.locator('details.efsa-table')).not.toHaveAttribute('open', '');
  expect(errors).toEqual([]);
});

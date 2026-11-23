import { tab } from './navigation.mjs';
import { test, expect } from '@playwright/test';
async function addComparisonFood(page, query) {
  await page.locator('[data-action="cmp-add"]').click();
  await page.locator('#pq').fill(query);
  await page.locator('.pk-list [data-action="pk-pick"]').first().click();
  await page.locator('[data-action="pk-confirm"]').click();
}

test('B200 Günlük telefonda yalnız Enerji açık; açılan bölüm hatırlanır', async ({ page }, testInfo) => {
  const errors = []; page.on('pageerror', (error) => errors.push(error.message));
  const phone = page.viewportSize().width <= 700;
  await page.goto('/');
  await page.locator('#q').fill('muz'); await page.locator('#foodlist [data-id="muz"]').click();
  await page.locator('[data-action="ex-add-day"]').click(); await tab(page, 'gunluk');
  await page.locator('[data-ux-details="diary-nutrients"] > summary').click();
  await expect(page.locator('[data-daily-nutrient="energy"]')).toContainText('89');
  const sec = (id) => page.locator(`.personal-section[data-psec="${id}"]`);
  await expect(sec('enerji')).toHaveAttribute('open', '');
  if (phone) {
    await expect(sec('protein')).not.toHaveAttribute('open');
    await expect(sec('mineral')).not.toHaveAttribute('open');
    await expect(page.locator('.personal .micro-overview')).not.toHaveAttribute('open');
    await sec('protein').locator('summary').click();
    await expect(sec('protein')).toHaveAttribute('open', '');
    await tab(page, 'kesfet'); await tab(page, 'gunluk');
    await expect(sec('protein')).toHaveAttribute('open', '');
    await expect(sec('mineral')).not.toHaveAttribute('open');
  } else {
    await expect(sec('protein')).toHaveAttribute('open', '');
    await expect(sec('mineral')).toHaveAttribute('open', '');
  }
  expect(errors).toEqual([]);
});

test('B200 Kıyasla kartında biçim yerinde değişir, miktar korunur', async ({ page }) => {
  const errors = []; page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await tab(page, 'karsilastir');
  await addComparisonFood(page, 'nohut');
  const form = page.locator('.cmp-col select.cmp-form').first();
  await expect(form).toBeVisible();
  const before = await page.locator('#cmp-table').textContent();
  const options = await form.locator('option').allTextContents();
  expect(options.length).toBeGreaterThan(1);
  await form.selectOption({ index: 1 });
  await expect(form).toHaveValue('1');
  await expect(page.locator('.cmp-col')).toHaveCount(1);
  await expect(page.locator('#cmp-table')).not.toHaveText(before);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
});

test('B201 Kıyasla grafikleri ve haftalık değer seçimi', async ({ page }) => {
  const errors = []; page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await tab(page, 'karsilastir');
  for (const q of ['nohut', 'pirinç']) await addComparisonFood(page, q);
  await page.locator('#compare-charts-toggle').click();
  const chart = page.locator('.cmp-chart').first();
  await expect(chart).toBeVisible();
  await expect(chart.locator('.cc-legend li')).toHaveCount(2);
  await expect(chart.locator('[data-cc="protein"] .cc-bar')).toHaveCount(2);
  await expect(page.locator('.cmp-amino [data-cc-aa="lys"] .cc-bar')).toHaveCount(2);
  const amino = page.locator('details.cmp-amino');
  if (page.viewportSize().width <= 700) { await expect(amino).not.toHaveAttribute('open'); await amino.locator('summary').click(); }
  await expect(amino).toHaveAttribute('open', '');
  await expect(amino.locator('.cc-ref').first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.locator('#cmp-table .cmp-chart').first().screenshot({ path: 'test-results/b201-compare-chart.png' }).catch(() => {});

  await tab(page, 'kesfet');
  await page.locator('#q').fill('nohut'); await page.locator('#foodlist [data-id="nohut"]').click();
  await page.locator('[data-action="ex-add-day"]').click(); await tab(page, 'gunluk');
  await page.locator('[data-ux-details="diary-history"] > summary').click();
  const week = page.locator('.week');
  await expect(week).toHaveAttribute('data-week-key', 'energy');
  await week.locator('[data-action="week-key"][data-key="protein"]').click();
  await expect(page.locator('.week')).toHaveAttribute('data-week-key', 'protein');
  await expect(page.locator('.week [data-action="week-key"][data-key="protein"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.week-bars .wk').nth(6).locator('.wk-v')).not.toHaveText('—');
  expect(errors).toEqual([]);
});

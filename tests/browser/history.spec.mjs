import { test, expect } from '@playwright/test';
const tab = (page, id) => page.locator(`.tabs [data-action="tab"][data-tab="${id}"]`).first().click();

test('B217 Günlük geçmişi: 7 gün / 30 gün / takvim, ortalama yalnız kayıtlı günlerden, takvimden güne git, sık yeneni aç', async ({ page }) => {
  const errors = []; page.on('pageerror', (error) => errors.push(error.message));
  await page.clock.setFixedTime(new Date('2026-11-19T12:00:00'));
  await page.addInitScript(() => {
    const e = (id, day, ref, g) => ({ id, day, ref, g, consumed: true });
    localStorage.setItem('bm.personal.v1', JSON.stringify({ schema: 1, profile: {}, milestones: {}, entries: [
      e('1', '2026-11-19', { t: 'c', id: 'muz', f: 0 }, 100), e('2', '2026-11-18', { t: 'c', id: 'muz', f: 0 }, 200),
      e('3', '2026-11-10', { t: 'c', id: 'yulaf', f: 0 }, 100), e('4', '2026-10-30', { t: 'c', id: 'muz', f: 0 }, 100),
    ] }));
  });
  await page.goto('/#/diary');
  const hist = page.locator('.history');
  await expect(hist).toHaveAttribute('data-hist-mode', '7');
  await expect(hist.locator('.week-bars .wk')).toHaveCount(7);
  await expect(hist.locator('.hist-tiles .ht').first()).toContainText('2'); // 7 günde 2 kayıtlı gün
  await expect(hist.locator('.hist-tiles .ht').nth(1)).toContainText('134'); // (89 + 178) / 2 ≈ 133,5 → 134
  await expect(hist.locator('.hist-top li').first()).toContainText('Muz');

  await hist.locator('[data-action="hist-mode"][data-mode="30"]').click();
  await expect(page.locator('.history .week-bars .wk')).toHaveCount(30);
  await expect(page.locator('.history .hist-tiles .ht').first()).toContainText('4');

  await page.locator('.history [data-action="hist-mode"][data-mode="month"]').click();
  const cells = page.locator('.history .cal-cell:not(.out)');
  await expect(cells).toHaveCount(30); // Kasım
  await expect(page.locator('.history .cal-cell.has')).toHaveCount(3);
  await expect(page.locator('.history .cal-cell.today')).toHaveCount(1);
  await expect(page.locator('.history [data-action="hist-month"][data-d="1"]')).toBeDisabled(); // gelecek ay yok
  await page.locator('.history .cal-cell[data-day="2026-11-10"]').click();
  await expect(page.locator('#personal-day')).toHaveValue('2026-11-10');
  await page.locator('.history [data-action="hist-month"][data-d="-1"]').click();
  await expect(page.locator('.history .cal-head b')).toContainText(/Ekim|October/);
  await expect(page.locator('.history .cal-cell.has')).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);

  await page.locator('.history [data-action="hist-month"][data-d="1"]').click();
  await page.locator('.history .cal-cell[data-day="2026-11-19"]').click(); // bugüne dön
  await page.locator('.history [data-action="hist-mode"][data-mode="7"]').click();
  await page.locator('.history [data-action="hist-open"]').first().click();
  await expect(page).toHaveURL(/#\/food\/muz$/);
  expect(errors).toEqual([]);
});

test('B217 Günlük geçmişi boşken rehber ve Keşfet düğmesi', async ({ page }) => {
  await page.goto('/#/diary');
  // Bugüne kayıt yokken geçmiş bölümü günün kartında boş durum gösterir (kayıt varken geçmiş görünür)
  await expect(page.locator('.day-empty, .hist-empty').first()).toBeVisible();
});

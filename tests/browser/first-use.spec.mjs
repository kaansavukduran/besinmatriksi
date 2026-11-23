import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { category, filters, reveal, tab } from './navigation.mjs';

test('first use brings search, amount, basic nutrition, and diary feedback into view', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('#ex-categories')).toBeHidden();
  await expect(page.locator('#ex-filters')).toBeHidden();
  expect((await page.locator('#foodlist .food').first().boundingBox()).y).toBeLessThanOrEqual(320);
  await page.getByLabel('Besin ara', { exact: true }).fill('muz');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page.locator('#food-title')).toBeFocused();
  await expect(page.locator('[data-overview="energy"]')).toBeInViewport();
  const amount = page.locator('[data-amtinput="ex"]');
  await expect(amount).toHaveValue('100');
  await amount.fill('42,5');
  await amount.press('Enter');
  await expect(page.locator('[data-overview="energy"]')).toContainText('37,8');
  await amount.fill('0');
  await page.locator('[data-action="ex-add-day"]').click();
  await expect(amount).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('.amount-error')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('bm.personal.v1'))).toBeNull();
  await amount.fill('150');
  await page.locator('[data-action="ex-add-day"]').click();
  await expect(page.locator('#food-day-feedback')).toContainText('Muz · 150 g');
  await page.locator('[data-action="personal-show-added"]').click();
  await expect(page.locator('.diary-entries')).toContainText('Muz · 150 g');
  await expect(page.locator('#diary-title')).toBeFocused();
  await expect(page.locator('[data-ux-details="diary-profile"]')).not.toHaveAttribute('open', '');
  await page.locator('[data-action="personal-undo"]').click();
  await expect(page.locator('.diary-entries')).toHaveCount(0);
});

test('diary picker keeps the selected date and amount through storage failure, then saves once', async ({ page }) => {
  await page.addInitScript(() => {
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (window.failDiary && key === 'bm.personal.v1') throw new Error('storage full');
      return set.call(this, key, value);
    };
  });
  await page.goto('/#/diary');
  const date = page.locator('#personal-day');
  await date.fill('2026-01-10');
  const opener = page.locator('[data-action="personal-add-food"]');
  await opener.click();
  const picker = page.getByRole('dialog', { name: 'Günlüğe ekle' });
  await expect(picker.getByRole('searchbox')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(picker).toHaveCount(0);
  await expect(opener).toBeFocused();
  await opener.click();
  await expect(picker.locator('time')).toHaveAttribute('datetime', '2026-01-10');
  await picker.getByRole('searchbox').fill('nohut');
  await picker.locator('.pk-list [data-id="nohut"]').click();
  await picker.locator('[data-amtinput="pk"]').fill('137');
  await page.evaluate(() => { window.failDiary = true; });
  await picker.locator('[data-action="pk-confirm"]').click();
  await expect(picker.getByRole('alert')).toBeVisible();
  await expect(picker.locator('[data-amtinput="pk"]')).toHaveValue('137');
  await page.evaluate(() => { window.failDiary = false; });
  await picker.locator('[data-action="pk-confirm"]').click();
  await expect(picker).toHaveCount(0);
  await expect(date).toHaveValue('2026-01-10');
  await expect(page.locator('.diary-entries li')).toHaveCount(1);
  await expect(opener).toBeFocused();
  const entries = await page.evaluate(() => JSON.parse(localStorage.getItem('bm.personal.v1')).entries);
  expect(entries.map(e => [e.day, e.g, e.consumed])).toEqual([['2026-01-10', 137, false]]);
  await page.reload();
  await date.fill('2026-01-10');
  await expect(page.locator('.diary-entries')).toContainText('Nohut · 137 g');
});

test('category selection and filters stay readable across detail and back navigation', async ({ page }) => {
  await page.goto('/');
  await category(page, 'icecek');
  await filters(page);
  await page.locator('#ex-diet-pattern').selectOption('vegan');
  await filters(page);
  await expect(page.locator('[aria-controls="ex-categories"]')).toContainText('İçecekler');
  await expect(page.locator('[aria-controls="ex-filters"]')).toContainText('Vegan');
  await page.locator('#q').fill('espresso');
  const result = page.locator('#foodlist [data-id="espresso"]');
  await result.click();
  await page.locator('[data-action="ex-back"]').click();
  await expect(page.locator('#q')).toHaveValue('espresso');
  await expect(page.locator('#ex-diet-pattern')).toHaveValue('vegan');
  await expect(result).toBeFocused();
});

test('EN at 320 px, 200% and large text retains visible routes and diary controls', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.addInitScript(() => localStorage.setItem('bm.settings.v2', JSON.stringify({
    version: 2, settings: { language: 'en', theme: 'contrast', uiScale: 200, fontSize: 28 },
  })));
  await page.goto('/');
  await expect(page.locator('#nav-more-button')).toHaveText('Menu');
  await tab(page, 'gunluk');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('button', { name: 'Add food', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Add to diary' })).toBeVisible();
  await page.locator('#pq').fill('banana');
  await page.locator('.pk-list [data-id="muz"]').click();
  await page.locator('[data-action="pk-confirm"]').click();
  await expect(page.locator('.diary-entries')).toContainText('Banana');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await tab(page, 'ayarlar');
  await expect(page.locator('#settings-q')).toBeVisible();
});

test('keyboard and accessibility checks cover search, food and native picker', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/');
  const check = async () => {
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(result.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))).toEqual([]);
  };
  await check();
  await page.locator('#q').fill('nohut');
  await page.locator('#foodlist [data-id="nohut"]').click();
  await reveal(page, '.food-tools');
  await check();
  await tab(page, 'gunluk');
  await page.locator('[data-action="personal-add-food"]').click();
  await check();
});

test('older WebViews retain the keyboard-accessible food picker', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { value: undefined }); });
  await page.goto('/#/diary');
  const opener = page.locator('[data-action="personal-add-food"]');
  await opener.click();
  const picker = page.getByRole('dialog', { name: 'Günlüğe ekle' });
  await expect(picker).toHaveAttribute('aria-modal', 'true');
  await expect(picker.getByRole('searchbox')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(picker).toHaveCount(0);
  await expect(opener).toBeFocused();
});

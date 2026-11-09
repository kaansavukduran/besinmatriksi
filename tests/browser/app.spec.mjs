import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const tab = (page, id) => page.locator(`[data-action="tab"][data-tab="${id}"]`).click();
const pickBanana = async page => {
  await page.locator('#q').fill('muz');
  await page.locator('#foodlist [data-id="muz"]').click();
};
test('besin, miktar, tarif maliyeti ve karşılaştırma uçtan uca çalışır', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/'); await pickBanana(page);
  await page.locator('[data-amount="ex"] [data-val="250"]').click();
  await expect(page.locator('[data-sec="enerji"]')).toContainText('223');
  await page.locator('[data-action="ex-add-recipe"]').click();
  await page.locator('[data-action="ex-add-compare"]').click();
  await tab(page, 'tarif');
  await page.locator('[data-price]').fill('80');
  await expect(page.locator('#recipe-summary')).toContainText('20 TL toplam');
  await page.locator('[data-action="rc-serv"][data-d="1"]').click();
  await expect(page.locator('#recipe-summary')).toContainText('10 TL / porsiyon');
  await page.locator('[data-action="rc-basis"][data-b="serving"]').click();
  await expect(page.locator('#recipe-summary')).toContainText('111');
  await page.reload(); await tab(page, 'tarif');
  await expect(page.locator('[data-price]')).toHaveValue('80');
  // Karşılaştırma geçici; bu test için yeniden seç.
  await tab(page, 'kesfet'); await pickBanana(page);
  await page.locator('[data-action="ex-add-compare"]').click(); await tab(page, 'karsilastir');
  await expect(page.locator('table.cmp')).toContainText('Muz');
  expect(errors).toEqual([]);
});
test('v1 ayarları taşınır; bölümler, sabitler, profil ve ayar dosyası kalıcıdır', async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('bm.settings.v2')) localStorage.setItem('bm.settings.v1', JSON.stringify({ theme: 'dark', fontSize: 20 }));
  });
  await page.goto('/'); await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await tab(page, 'ayarlar');
  await page.locator('[data-section-visible="hesap"]').uncheck();
  await page.locator('#pin-nutrient').selectOption('fe');
  await page.locator('[data-action="section-move"][data-id="tolerans"][data-d="-1"]').click();
  await page.locator('#profile-name').fill('Gece okuma'); await page.locator('[data-action="profile-save"]').click();
  await expect(page.locator('.profile-bar')).toContainText('Gece okuma');
  const downloadPromise = page.waitForEvent('download'); await page.locator('[data-action="settings-export"]').click();
  expect((await downloadPromise).suggestedFilename()).toBe('besin-matriksi-ayarlar.json');
  await page.reload(); await pickBanana(page);
  await expect(page.locator('.pinned')).toContainText('Demir'); await expect(page.locator('[data-sec="hesap"]')).toHaveCount(0);
  await tab(page, 'ayarlar');
  await page.locator('#settings-file').setInputFiles({ name: 'ayarlar.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ app: 'besin-matriksi-ayarlar', version: 2, settings: { theme: 'forest', fontSize: 18 } })) });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'forest');
  await page.locator('.profile-bar [data-action="profile-apply"]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
test('eş anlamlı ve Türkçe arama geçmişi cihazda çalışır', async ({ page }) => {
  await page.goto('/'); await page.locator('#q').fill('HIYAR');
  await expect(page.locator('#foodlist')).toContainText('Salatalık');
  await page.locator('#foodlist [data-id="salatalik"]').click();
  await page.reload(); await expect(page.locator('.recent-searches')).toContainText('HIYAR');
  await page.locator('[data-action="search-recent"]').click(); await expect(page.locator('#q')).toHaveValue('HIYAR');
  await page.locator('[data-action="search-clear"]').click(); await expect(page.locator('.recent-searches')).toHaveCount(0);
});
test('etiket besini silindiğinde tarif eksik malzemeyi ve kapsamı gösterir', async ({ page }) => {
  await page.goto('/'); await page.locator('[data-action="ex-cat"][data-cat="custom"]').click();
  await page.locator('[data-action="cu-new"]').click(); await page.locator('#cu-name').fill('Deneme içeceği');
  await page.locator('[data-cu="energy"]').fill('40'); await page.locator('[data-action="cu-save"]').click();
  await page.locator('[data-action="ex-add-recipe"]').click();
  await page.locator('[data-action="cu-edit"]').click(); await page.locator('[data-action="cu-delete"]').click();
  await page.locator('.dlg [data-r="1"]').click(); await tab(page, 'tarif');
  await expect(page.locator('#recipe-summary')).toContainText('1 malzemenin kaydı bulunamadı');
  await expect(page.locator('#matrix .idcard')).toContainText('100 g malzeme');
  await expect(page.locator('#recipe-summary')).toContainText('veri yok');
});
test('üretim PWA çevrimdışı yeniden açılır ve geniş katalog yüklenir', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; if (!navigator.serviceWorker.controller) await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true })); });
  await context.setOffline(true); await page.reload(); await pickBanana(page);
  await expect(page.locator('#matrix')).toContainText('Muz');
  await tab(page, 'ayarlar'); await page.locator('[data-setbool="showExt"]').check();
  await tab(page, 'kesfet'); await page.locator('[data-action="ex-cat"][data-cat="ext"]').click();
  await expect(page.locator('#foodlist .food').first()).toBeVisible();
});
test('ana ekranlar WCAG 2.1 AA otomatik denetimi ve yatay taşma kontrolünden geçer', async ({ page }) => {
  await page.goto('/');
  for (const id of ['kesfet', 'ayarlar', 'tarif', 'karsilastir']) {
    await tab(page, id);
    if (id === 'kesfet') await pickBanana(page);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), id).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), id).toBe(true);
  }
});

test('malzeme penceresinde odak tutulur, Escape ile açan düğmeye döner', async ({ page }) => {
  await page.goto('/'); await tab(page, 'tarif');
  await page.locator('[data-action="rc-add"]').click();
  const modal = page.locator('.modal');
  await expect(modal).toBeVisible();
  expect(await page.evaluate(() => !!document.activeElement.closest('.modal'))).toBe(true);
  await page.keyboard.press('Shift+Tab');
  expect(await page.evaluate(() => !!document.activeElement.closest('.modal'))).toBe(true);
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => !!document.activeElement.closest('.modal'))).toBe(true);
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(result.violations.map(v => v.id)).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(modal).toHaveCount(0); await expect(page.locator('[data-action="rc-add"]')).toBeFocused();
});

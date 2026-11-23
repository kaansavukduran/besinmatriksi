import { categories, category, reveal, tab } from './navigation.mjs';
import { test, expect } from '@playwright/test';

// B252–B255: doğruluk, kullanım akışı, yeni veri ve üretilen kapak görseli gerileme testleri

test('B252 yoğunluk, kesin miktar girişi ve katlanır uç hazır miktarlar', async ({ page }) => {
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.locator('#q').fill('zeytinyağı');
  await page.locator('#foodlist [data-id="zeytinyagi"]').click();

  // Yağda 100 g ≈ mL hatası kalktı; USDA hacim ölçüsünden doğrulanan yoğunlukla ≈ 110 mL gösterilir (100 / 0,913 ≈ 109,5)
  const unit = page.locator('[data-amount="ex"] .amount-unit');
  await expect(unit).not.toContainText('g ≈ mL');
  await expect(unit).toContainText('mL');
  await expect(unit).toContainText('110');

  // Kesin miktar girişi (hem tam sayı hem Türkçe virgüllü ondalık)
  const inp = page.locator('[data-amount="ex"] .amt-input');
  await expect(inp).toBeVisible();
  await inp.fill('137');
  await inp.dispatchEvent('change');
  await expect(page.locator('[data-amount="ex"] .amt-val b')).toHaveText('137');

  await inp.fill('42,5');
  await inp.dispatchEvent('change');
  await expect(page.locator('[data-amount="ex"] .amt-val b')).toHaveText('42,5');

  // Uç hazır miktarlar (1 g, 5 kg, 10 kg) <details class="amt-more"> içinde katlı gelir
  const more = page.locator('[data-amount="ex"] details.amt-more');
  await reveal(page, '[data-amount="ex"] .amount-options');
  await expect(more).toBeVisible();
  await expect(more).not.toHaveAttribute('open', '');
  await more.locator('summary').click();
  await expect(more.locator('[data-val="5000"]')).toBeVisible();
  expect(errors).toEqual([]);
});

test('B252/B254 Foundation-only besinlerde "NDB undefined" görünmez, FDC kaydı açık yazılır', async ({ page }) => {
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  for (const [id, fdc] of [['siyah_pirinc', '2710825'], ['aslan_yelesi', 'FDC']]) {
    await page.locator('#q').fill(id === 'siyah_pirinc' ? 'siyah pirinç' : 'aslan yelesi');
    await page.locator(`#foodlist [data-id="${id}"]`).click();
    await expect(page.locator('.detail')).not.toContainText('undefined');
    await expect(page.locator('.detail .src-base')).toContainText(fdc);
    if (await page.locator('[data-action="ex-back"]').isVisible()) await page.locator('[data-action="ex-back"]').click();
  }
  expect(errors).toEqual([]);
});

test('B253 seçici modalında arama en üstte, kategoriler isteğe bağlı açılır', async ({ page }) => {
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await page.locator('[data-action="tab"][data-tab="tarif"]').first().click();
  await page.locator('[data-action="rc-add"]').click();

  const search = page.locator('.modal #pq');
  await expect(search).toBeVisible();
  const sBox = await search.boundingBox();
  const navBox = await page.locator('.modal .browse-tools').boundingBox();
  const listBox = await page.locator('.modal .pk-list').boundingBox();
  expect(sBox.y).toBeLessThan(220);
  expect(sBox.y).toBeLessThan(navBox.y);
  expect(listBox.y).toBeLessThan(380); // liste ilk ekranda görünür

  await search.fill('nohut');
  await expect(page.locator('.modal [data-action="pk-clear"]')).toBeVisible();
  await page.locator('.modal [data-action="pk-clear"]').click();
  await expect(search).toHaveValue('');

  await page.locator('.modal [data-action="pk-cats-toggle"]').click();
  await expect(page.locator('.modal .pk-cats-nav')).toBeVisible();
  expect(errors).toEqual([]);
});

test('B253 masaüstünde kaydırılmış listeden besin seçince başlık görünür kalır; geri dönünce kaydırma ve arama korunur', async ({ page }) => {
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 700));
  const beforeY = await page.evaluate(() => window.scrollY);
  expect(beforeY).toBeGreaterThanOrEqual(500);

  const foods = page.locator('#foodlist [data-action="ex-pick"]');
  const index = await foods.evaluateAll(items => items.findIndex(item => {
    const y = item.getBoundingClientRect().top;
    return y > 130 && y < 450;
  }));
  expect(index).toBeGreaterThanOrEqual(0);
  await foods.nth(index).click();
  const headBox = await page.locator('.detail .dhead').boundingBox();
  expect(headBox).not.toBeNull();
  expect(headBox.y).toBeGreaterThanOrEqual(0);
  expect(headBox.y).toBeLessThan(220);

  if (await page.locator('[data-action="ex-back"]').isVisible()) {
    await page.locator('[data-action="ex-back"]').click();
  } else {
    await page.locator('[data-action="tab"][data-tab="kesfet"]').first().click();
  }
  const restoredY = await page.evaluate(() => window.scrollY);
  expect(restoredY).toBeGreaterThanOrEqual(450);
  expect(errors).toEqual([]);
});

test('B253 karşılaştırma tablosu erişilebilir başlık/scope taşır ve taslak varken PWA güncellemesi zorla yenilemez', async ({ page }) => {
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  for (const id of ['muz', 'nohut']) {
    await page.locator('#q').fill(id);
    await page.locator(`#foodlist [data-id="${id}"]`).click();
    await reveal(page, '.food-tools'); await page.locator('[data-action="ex-add-compare"]').click();
    if (await page.locator('[data-action="ex-back"]').isVisible()) await page.locator('[data-action="ex-back"]').click();
  }
  await page.locator('[data-action="tab"][data-tab="karsilastir"]').first().click();
  await expect(page.locator('.compare-basic-wrap table.cmp caption.sr')).toHaveCount(1);
  expect(await page.locator('.compare-basic-wrap table.cmp thead th[scope="col"]').count()).toBeGreaterThanOrEqual(3);
  expect(await page.locator('.compare-basic-wrap table.cmp tbody th[scope="row"]').count()).toBeGreaterThan(5);

  // Taslak koruma: özel besin modalı açıkken hasActiveDraft true döner ve engellemesiz güncelleme şeridi görünür
  await page.locator('[data-action="tab"][data-tab="kesfet"]').first().click();
  await category(page, 'custom');
  await page.locator('[data-action="cu-new"]').click();
  await page.locator('#cu-name').fill('Taslak süt');
  expect(await page.evaluate(() => window.__bmHasActiveDraft())).toBe(true);
  await page.evaluate(() => window.__bmNotifyUpdateReady());
  await expect(page.locator('#pwa-update-bar')).toBeVisible();
  await expect(page.locator('#cu-name')).toHaveValue('Taslak süt');
  await page.locator('[data-action="pwa-dismiss"]').click();
  await expect(page.locator('#pwa-update-bar')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('B255 tabak illüstrasyonu Hakkında bölümünde yüklenir ve taşmaz', async ({ page }) => {
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await expect(page.locator('img.kitchen-plate')).toHaveCount(0);
  await tab(page, 'hakkinda');
  const img = page.locator('img.kitchen-plate');
  await expect(img).toBeVisible();
  await expect.poll(() => img.evaluate(el => el.naturalWidth)).toBeGreaterThan(0);
  const dims = await img.evaluate((el) => ({ complete: el.complete, w: el.naturalWidth, h: el.naturalHeight }));
  expect(dims.complete).toBe(true);
  expect(dims.w).toBeGreaterThanOrEqual(300);
  expect(dims.h).toBeGreaterThanOrEqual(250);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
});

test('B257 Türkçe açılışta İngilizce sözlük indirilmez; İngilizceye geçince canlı yüklenir', async ({ page }) => {
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  const reqs = []; page.on('request', (r) => reqs.push(r.url()));
  await page.addInitScript(() => {
    if (!localStorage.getItem('bm.settings.v2')) localStorage.setItem('bm.settings.v2', JSON.stringify({ version: 2, settings: { language: 'tr' } }));
  });
  await page.goto('/');
  await expect(page.locator('#foodlist [data-action="ex-pick"]').first()).toBeVisible();
  expect(reqs.some((u) => /i18n-ui/.test(u))).toBe(false);

  await tab(page, 'ayarlar');
  await page.locator('.lang-pick button[lang="en"]').first().click();
  await expect(page.locator('h2').first()).toContainText('Language');
  expect(reqs.some((u) => /i18n-ui/.test(u))).toBe(true);
  expect(errors).toEqual([]);
});

test('B261 tablet (768×1024) ana gezinme ve Ayarlar taşmadan kullanılabilir', async ({ page }) => {
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/');
  const tabs = page.locator('nav.tabs .tab:visible');
  await expect(tabs).toHaveCount(5);
  await page.locator('#nav-more-button').click();
  const settingsBox = await page.locator('nav.tabs [data-tab="ayarlar"]').boundingBox();
  expect(settingsBox).not.toBeNull();
  expect(settingsBox.x + settingsBox.width).toBeLessThanOrEqual(768);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
});

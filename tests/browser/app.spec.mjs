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
  await expect(page.locator('[data-price]')).toHaveCount(0);
  await page.locator('[data-action="ing-open"]').first().click();
  await page.locator('[data-price]').fill('80');
  await expect(page.locator('#recipe-summary')).toContainText('20 TL toplam');
  await page.locator('[data-action="rc-serv"][data-d="1"]').click();
  await expect(page.locator('#recipe-summary')).toContainText('10 TL / porsiyon');
  await page.locator('[data-action="rc-basis"][data-b="serving"]').click();
  await expect(page.locator('#recipe-summary')).toContainText('111');
  await page.reload(); await tab(page, 'tarif');
  await page.locator('[data-action="ing-open"]').first().click();
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
  await tab(page, 'ayarlar'); await page.locator('[data-setbool="showExt"]').locator('..').click();
  await expect(page.locator('[data-setbool="showExt"]')).toBeChecked();
  await tab(page, 'kesfet');
  if (await page.locator('[data-action="ex-back"]').isVisible()) await page.locator('[data-action="ex-back"]').click();
  await page.locator('[data-action="ex-cat"][data-cat="ext"]').click();
  await page.locator('#q').fill('');
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

test('özel hedef, birimler, tema dosyası ve kısayol ataması çalışır', async ({ page }) => {
  await page.goto('/'); await tab(page, 'ayarlar');
  await page.locator('[data-k="referenceMode"][data-v=\'"custom"\']').click();
  await page.locator('#target-nutrient').selectOption('protein'); await page.locator('#target-new-value').fill('80');
  await page.locator('[data-action="target-add"]').click();
  await page.locator('[data-k="energyUnit"][data-v=\'"kj"\']').click();
  await page.locator('[data-k="amountUnit"][data-v=\'"oz"\']').click();
  await page.locator('[data-k="decimalSeparator"][data-v=\'"dot"\']').click();
  await page.locator('#theme-file').setInputFiles({ name: 'tema.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ app: 'besin-matriksi-tema', version: 1, colors: { bg: '#101820', fg: '#ffffff', card: '#1d2630', accent: '#8ad1ff' } })) });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'custom');
  await page.locator('[data-shortcut="ayarlar"]').selectOption('Alt+9');
  await tab(page, 'kesfet'); await pickBanana(page);
  await expect(page.locator('[data-amount="ex"] .amt-val')).toContainText('3.53');
  await expect(page.locator('[data-sec="enerji"] .val').filter({ hasText: 'kJ' })).toBeVisible();
  await expect(page.locator('.reference-label')).toContainText('%hedef');
  await page.locator('[data-tab="kesfet"]').focus(); await page.keyboard.press('Alt+9');
  await expect(page.locator('#target-nutrient')).toBeVisible();
});

test('tek HTML dosyası internet olmadan yerelden açılır', async ({ page, context }) => {
  test.skip(process.env.PLAYWRIGHT_FILE_URL_BLOCKED === '1', 'Yönetilen sistem Chromium politikası file:// gezinmesini engelliyor; ağsız HTML testi ayrıca çalışır.');
  const { fileURLToPath } = await import('node:url');
  const html = fileURLToPath(new URL('../../dist-single/besin-matriksi.html', import.meta.url));
  await context.setOffline(true); await page.goto('file://' + html);
  await pickBanana(page); await expect(page.locator('#matrix')).toContainText('USDA');
  await page.locator('[data-amount="ex"] [data-val="1000"]').click();
  await expect(page.locator('[data-sec="enerji"]')).toContainText('890');
});


test('tek HTML içeriği harici istek olmadan çalışır', async ({ page, context }) => {
  const { readFile } = await import('node:fs/promises');
  const html = await readFile(new URL('../../dist-single/besin-matriksi.html', import.meta.url), 'utf8');
  const requests = []; page.on('request', r => requests.push(r.url()));
  await context.setOffline(true); await page.setContent(html);
  await pickBanana(page); await page.locator('[data-amount="ex"] [data-val="1000"]').click();
  await expect(page.locator('[data-sec="enerji"]')).toContainText('890');
  expect(requests.filter(url => /^https?:/.test(url))).toEqual([]);
});

test('A4 çıktısı tabloyu ve tüm değerleri korur, bölüm durumunu geri yükler', async ({ page }, testInfo) => {
  await page.goto('/'); await pickBanana(page);
  const before = await page.locator('#matrix .row').allTextContents();
  const protein = page.locator('[data-sec="protein"]');
  await protein.locator('summary').click(); await expect(protein).not.toHaveAttribute('open', '');
  const pdf = await page.pdf({ path: testInfo.outputPath('muz-a4.pdf'), preferCSSPageSize: true, printBackground: true });
  const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) || []).length;
  expect(pages).toBeGreaterThan(0); expect(pages).toBeLessThanOrEqual(10);
  await expect(protein).not.toHaveAttribute('open', '');
  expect(await page.locator('#matrix .row').allTextContents()).toEqual(before);
  await page.locator('[data-amount="ex"] [data-val="250"]').click();
  await expect(page.locator('[data-sec="protein"]')).not.toHaveAttribute('open', '');
});

test('lisanslar çevrimdışı okunur ve veri kapsamı açıkça belirtilir', async ({ page, context }) => {
  await page.goto('/'); await context.setOffline(true); await tab(page, 'hakkinda');
  await expect(page.locator('.about')).toContainText('NIN ürün kullanım izni doğrulanmadığı için');
  const font = page.locator('.notice').filter({ has: page.locator('summary', { hasText: '@fontsource/opendyslexic' }) });
  await font.locator('summary').click();
  await expect(font.locator('pre')).toContainText('Abbie Gonzalez');
  await expect(font.locator('pre')).toContainText('SIL OPEN FONT LICENSE');
});

test('tarif kaynak dökümü eksik/sıfır veriyi ve porsiyon/100 g katkılarını çevrimdışı korur', async ({ page, context }) => {
  await page.addInitScript(() => {
    localStorage.setItem('bm.custom.v1', JSON.stringify([{ id: 'label', name: 'Deneme etiketi', v: { energy: 40, protein: 0, na: 20 } }]));
    localStorage.setItem('bm.recipes.v1', JSON.stringify([{ id: 'trace', name: 'Kaynaklı tarif', servings: 2, cookedWeight: 200, items: [
      { id: 'banana', ref: { t: 'c', id: 'muz', f: 0 }, g: 250 },
      { id: 'label', ref: { t: 'u', id: 'label' }, g: 100 },
      { id: 'lost', ref: { t: 'u', id: 'deleted' }, g: 50 },
    ] }]));
  });
  await page.goto('/'); await tab(page, 'tarif'); await context.setOffline(true);
  const panel = page.locator('.recipe-sources');
  await panel.locator('summary').click();
  const firstValue = panel.locator('.source-contribution strong').first();
  await expect(firstValue).toHaveText('223 kcal');
  await expect(panel).toContainText('USDA SR28 (2015) · NDB 09040');
  await expect(panel).toContainText('Kullanıcının ürün etiketi');
  await expect(panel).toContainText('Kayıt bulunamadı; katkı bilinmiyor.');
  await expect(panel.locator('.source-total')).toContainText('2/3 malzemede veri · kısmi toplam');
  await page.locator('[data-action="rc-basis"][data-b="serving"]').click();
  await expect(panel).toHaveAttribute('open', ''); await expect(firstValue).toHaveText('111 kcal');
  await page.locator('[data-action="rc-basis"][data-b="per100"]').click();
  await expect(panel).toContainText('pişmiş ağırlık 200 g'); await expect(firstValue).toHaveText('111 kcal');
  await page.locator('[data-action="ing-open"][data-id="banana"]').click();
  await page.locator('[data-amount="rc:banana"] [data-val="500"]').click();
  await expect(firstValue).toHaveText('223 kcal');
  await panel.locator('select').selectOption('protein');
  await expect(panel.locator('.source-ingredients > li').nth(1)).toContainText('0 g');
  await panel.locator('select').selectOption('salt');
  await expect(panel).toContainText('Tuz (g) = sodyum (mg) × 2,5 / 1000');
  await panel.locator('select').selectOption('oxalate');
  await expect(panel.locator('.source-total')).toContainText('veri yok');
  await expect(panel.locator('.source-total')).toContainText('0/3');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(result.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))).toEqual([]);
});

test('ayrıntılı renk seçim penceresi önizleme, iptal, kalıcılık ve tema paylaşımını korur', async ({ page }, testInfo) => {
  await page.goto('/'); await tab(page, 'ayarlar');
  const opener = page.locator('[data-action="theme-color-open"][data-key="muted"]');
  await opener.click();
  const modal = page.getByRole('dialog', { name: 'Renk seçimi' });
  await expect(modal).toBeVisible();
  await modal.locator('[data-color="#2e8a4a"]').click();
  await expect(modal.locator('#theme-color-hex')).toHaveValue('#2e8a4a');
  await modal.locator('#theme-color-hex').fill('#12');
  await modal.locator('[data-action="theme-color-save"]').click();
  await expect(modal.locator('#theme-color-hex')).toHaveAttribute('aria-invalid', 'true');
  await modal.locator('#theme-color-hex').fill('#505050');
  await expect(modal.locator('#theme-color-picker')).toHaveValue('#505050');
  await modal.locator('[data-action="theme-color-save"]').click();
  await expect(opener).toContainText('#505050'); await expect(opener).toBeFocused();
  await page.locator('[data-action="theme-color-open"][data-key="card2"]').click();
  await modal.locator('#theme-color-picker').fill('#eeeeee');
  await expect(modal.locator('#theme-color-hex')).toHaveValue('#eeeeee');
  await modal.locator('[data-action="theme-color-save"]').click();
  await page.locator('[data-action="theme-color-open"][data-key="line"]').click();
  await modal.locator('[data-color="#c62d42"]').click(); await page.keyboard.press('Escape');
  await expect(modal).toHaveCount(0);
  await expect(page.locator('[data-action="theme-color-open"][data-key="line"]')).not.toContainText('#c62d42');
  await page.locator('[data-action="theme-apply"]').click();
  expect(await page.locator('html').evaluate(el => el.style.getPropertyValue('--muted'))).toBe('#505050');
  expect(await page.locator('html').evaluate(el => el.style.getPropertyValue('--card2'))).toBe('#eeeeee');
  await page.reload(); await tab(page, 'ayarlar'); await expect(opener).toContainText('#505050');
  const downloadPromise = page.waitForEvent('download'); await page.locator('[data-action="theme-export"]').click();
  const download = await downloadPromise; const stream = await download.createReadStream(); const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const exported = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  expect(exported.version).toBe(2); expect(exported.colors.muted).toBe('#505050'); expect(exported.colors.card2).toBe('#eeeeee');
  await opener.click();
  await page.keyboard.press('Shift+Tab'); expect(await page.evaluate(() => !!document.activeElement.closest('.modal'))).toBe(true);
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(result.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('renk-secimi.png') });
});

test('EFSA grup referansı yaş/koşul/türü korur; kişisel hedefi değiştirmez ve çevrimdışı CSV taşır', async ({ page, context }, testInfo) => {
  await page.goto('/'); await tab(page, 'ayarlar');
  await page.locator('[data-k="referenceMode"][data-v=\'"custom"\']').click();
  await page.locator('#target-nutrient').selectOption('protein'); await page.locator('#target-new-value').fill('80');
  await page.locator('[data-action="target-add"]').click();
  await page.locator('[data-k="referenceMode"][data-v=\'"efsa"\']').click();
  const panel = page.locator('.efsa-settings');
  await expect(panel.locator('[data-efsa="efsaSex"]')).toHaveValue('unspecified');
  await expect(panel.locator('summary')).toContainText('(0 bileşen)');
  await panel.locator('[data-efsa="efsaSex"]').selectOption('female');
  await panel.locator('summary').click();
  const calcium = panel.locator('li').filter({ has: page.locator('b', { hasText: 'Kalsiyum (Ca)' }) });
  await expect(calcium).toContainText('950 mg/gün · PRI');
  await panel.locator('[data-efsa="efsaAge"]').selectOption('20');
  await expect(calcium).toContainText('1.000 mg/gün · PRI');
  await expect(panel.locator('details')).toHaveAttribute('open', '');
  await panel.locator('[data-efsa="efsaAge"]').selectOption('45');
  const iron = panel.locator('li').filter({ has: page.locator('b', { hasText: 'Demir (Fe)' }) });
  const zinc = panel.locator('li').filter({ has: page.locator('b', { hasText: 'Çinko (Zn)' }) });
  await expect(iron).toHaveCount(0); await expect(zinc).toHaveCount(0);
  await panel.locator('[data-efsa="efsaPhytate"]').selectOption('600');
  await expect(zinc).toContainText('9,3 mg/gün · PRI');
  await panel.locator('[data-efsa="efsaIronGroup"]').selectOption('pre');
  await expect(iron).toContainText('16 mg/gün · PRI');
  await panel.locator('[data-efsa="efsaIronGroup"]').selectOption('post');
  await expect(iron).toContainText('11 mg/gün · PRI');
  await expect(panel).toContainText('üst sınır (UL)');
  await page.reload(); await tab(page, 'ayarlar');
  await expect(panel.locator('[data-efsa="efsaAge"]')).toHaveValue('45');
  await expect(panel.locator('[data-efsa="efsaPhytate"]')).toHaveValue('600');
  await page.locator('[data-k="referenceMode"][data-v=\'"custom"\']').click();
  await expect(page.locator('[data-target-value="protein"]')).toHaveValue('80');
  await page.locator('[data-k="referenceMode"][data-v=\'"efsa"\']').click();
  await panel.locator('summary').click();
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(result.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('efsa-grup.png') });
  await context.setOffline(true); await tab(page, 'kesfet'); await pickBanana(page);
  await expect(page.locator('.reference-label')).toContainText('%EFSA (PRI/AI)');
  await expect(page.locator('#matrix .row').filter({ has: page.locator('.lbl', { hasText: 'Kalsiyum (Ca)' }) }).locator('.ref-kind')).toHaveText('PRI');
  await expect(page.locator('#matrix .row').filter({ has: page.locator('.lbl', { hasText: 'Sodyum (Na)' }) }).locator('.nrv')).toHaveCount(0);
  const promise = page.waitForEvent('download'); await page.locator('[data-action="csv"]').click();
  const stream = await (await promise).createReadStream(), chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const csv = Buffer.concat(chunks).toString('utf8');
  expect(csv).toContain('%EFSA (PRI/AI)'); expect(csv).toContain(';PRI;950;mg/gün;2015;');
  expect(csv).toContain('45 yaş · kadın grubu');
});
test('Aion kare kare oynar, eklemede kutlar; sabit poz ve gizleme kalıcıdır', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  const sprite = page.locator('#aion .aion-sprite');
  await expect(sprite).toBeVisible();
  const first = await sprite.evaluate(el => el.style.backgroundPosition);
  await expect.poll(() => sprite.evaluate(el => el.style.backgroundPosition), { timeout: 3000 }).not.toBe(first);
  await pickBanana(page);
  await expect(page.locator('#aion')).toHaveAttribute('data-anim', 'read');
  await page.locator('[data-action="ex-add-recipe"]').click();
  await expect(page.locator('#aion')).toHaveAttribute('data-anim', 'celebrate');
  await tab(page, 'ayarlar');
  await page.locator('[data-action="set"][data-k="aionMotion"][data-v=\'"still"\']').click();
  await expect(page.locator('#aion')).toHaveAttribute('data-still', 'true');
  const still = await sprite.evaluate(el => el.style.backgroundPosition);
  await page.waitForTimeout(600);
  expect(await sprite.evaluate(el => el.style.backgroundPosition)).toBe(still);
  await page.locator('label.toggle:has(input[data-setbool="aionEnabled"])').click();
  await expect(page.locator('#aion')).toBeHidden();
  await page.reload();
  await expect(page.locator('#aion')).toBeHidden();
  expect(errors).toEqual([]);
});
test('İngilizce modda eski ekranlarda Türkçe arayüz metni kalmaz (B051)', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('bm.settings.v2', JSON.stringify({ version: 2, settings: { language: 'en', showMissing: true } })));
  await page.goto('/');
  const leftovers = () => page.evaluate(() => {
    const re = /[çğışöüÇĞİŞÖÜ]/, out = [];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) { const t = w.currentNode.textContent.trim(); if (t && re.test(t) && !w.currentNode.parentElement.closest('pre,.notice,option,.fontbtn,.theme-preview,.rname,#rc-name,.profile-bar')) out.push(t); }
    for (const el of document.querySelectorAll('[aria-label],[title],[placeholder]')) for (const a of ['aria-label', 'title', 'placeholder']) { const v = el.getAttribute(a); if (v && re.test(v) && !el.closest('.notice,.rname')) out.push(a + ': ' + v); }
    return out;
  });
  await expect(page.locator('[data-action="tab"][data-tab="kesfet"]')).toContainText('Explore');
  expect(await leftovers()).toEqual([]);
  await page.locator('#q').fill('lentil'); await page.locator('#foodlist [data-id="yesil_mercimek"]').click();
  await expect(page.locator('.dtitle h2')).toContainText('Green / brown lentils');
  expect(await leftovers()).toEqual([]);
  await page.locator('[data-action="ex-add-recipe"]').click(); await page.locator('[data-action="ex-add-compare"]').click();
  for (const id of ['tarif', 'karsilastir', 'ayarlar', 'hakkinda']) {
    await tab(page, id);
    expect(await leftovers(), id).toEqual([]);
  }
});
test('koleksiyon ve alt kategori ekleme/çıkarma; besin ekle-çıkar ve kalıcılık (B054)', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  // Yeni koleksiyon
  await page.locator('[data-action="col-new"]').click();
  await page.locator('.dlg .dlg-line').fill('Kahvaltılıklar'); await page.keyboard.press('Enter');
  await expect(page.locator('.col-head h3')).toHaveText('Kahvaltılıklar');
  await expect(page.locator('#foodlist')).toContainText('boş');
  // Alt kategori
  await page.locator('[data-action="col-sub"]').click();
  await page.locator('.dlg .dlg-line').fill('Smoothie'); await page.locator('.dlg [data-r="1"]').click();
  await expect(page.locator('.col-head h3')).toHaveText('Kahvaltılıklar › Smoothie');
  // Besin ekle: muz → Smoothie, yulaf → yeni "Lifli" koleksiyonu (önce Tümü'ne dön)
  await page.locator('.cat[data-cat=""]').click();
  await pickBanana(page);
  await page.locator('[data-action="col-pick"]').click();
  await page.locator('.col-toggle.sub').click();
  await expect(page.locator('.col-toggle.sub')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('[data-action="col-pick-close"]').last().click();
  await expect(page.locator('[data-action="col-pick"]')).toContainText('★');
  if (await page.locator('.back').isVisible()) await page.locator('.back').click();
  await page.locator('#q').fill('yulaf'); await page.locator('#foodlist [data-id="yulaf"]').click();
  await page.locator('[data-action="col-pick"]').click();
  await page.locator('#col-new-name').fill('Lifli');
  await page.locator('[data-action="col-create-add"]').click();
  await expect(page.locator('.col-toggle').filter({ hasText: 'Lifli' })).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape');
  await expect(page.locator('.modal')).toHaveCount(0);
  // Yeniden aç: üst koleksiyon alt kategorinin besinini de gösterir
  await page.reload();
  if (await page.locator('.back').isVisible()) await page.locator('.back').click();
  await page.locator('#q').fill('');
  await page.locator('.cat', { hasText: 'Kahvaltılıklar' }).click();
  await expect(page.locator('#foodlist')).toContainText('Smoothie');
  await expect(page.locator('#foodlist [data-action="ex-pick-ref"]')).toHaveCount(1);
  // Besini koleksiyondan çıkar
  await page.locator('#foodlist [data-action="col-remove-item"]').click();
  await expect(page.locator('#foodlist [data-action="ex-pick-ref"]')).toHaveCount(0);
  // Koleksiyonu sil (alt kategoriyle birlikte)
  await page.locator('[data-action="col-delete"]').click();
  await expect(page.locator('.dlg')).toContainText('1');
  await page.locator('.dlg [data-r="1"]').click();
  await expect(page.locator('.cat', { hasText: 'Kahvaltılıklar' })).toHaveCount(0);
  await expect(page.locator('.cat', { hasText: 'Lifli' })).toHaveCount(1);
  expect(errors).toEqual([]);
});
test('tarif malzemeleri ve koleksiyon besinleri ↑/↓ ile sıralanır, sıra kalıcıdır (B055)', async ({ page }) => {
  await page.goto('/');
  for (const id of ['muz', 'yulaf']) {
    if (await page.locator('.back').isVisible()) await page.locator('.back').click();
    await page.locator('#q').fill(id === 'muz' ? 'muz' : 'yulaf'); await page.locator(`#foodlist [data-id="${id}"]`).click();
    await page.locator('[data-action="ex-add-recipe"]').click();
  }
  await tab(page, 'tarif');
  const names = () => page.locator('.ing .ing-h b').allTextContents();
  expect(await names()).toEqual(['Muz', 'Yulaf ezmesi']);
  await expect(page.locator('.ing').first().locator('[data-action="rc-move"][data-d="-1"]')).toBeDisabled();
  await page.locator('.ing').nth(1).locator('[data-action="rc-move"][data-d="-1"]').click();
  expect(await names()).toEqual(['Yulaf ezmesi', 'Muz']);
  await page.reload(); await tab(page, 'tarif');
  expect(await names()).toEqual(['Yulaf ezmesi', 'Muz']);
  // Koleksiyon sırası
  await tab(page, 'kesfet');
  await page.locator('[data-action="col-new"]').click();
  await page.locator('.dlg .dlg-line').fill('Sıra'); await page.keyboard.press('Enter');
  for (const id of ['muz', 'yulaf']) {
    if (await page.locator('.back').isVisible()) await page.locator('.back').click();
    await page.locator('.cat[data-cat=""]').click();
    await page.locator('#q').fill(id); await page.locator(`#foodlist [data-id="${id}"]`).click();
    await page.locator('[data-action="col-pick"]').click(); await page.locator('.col-toggle').first().click(); await page.keyboard.press('Escape');
  }
  if (await page.locator('.back').isVisible()) await page.locator('.back').click();
  await page.locator('#q').fill('');
  await page.locator('.cat', { hasText: 'Sıra' }).click();
  const colNames = () => page.locator('#foodlist .food-wrap .fn').allTextContents();
  expect(await colNames()).toEqual(['Muz', 'Yulaf ezmesi']);
  await page.locator('#foodlist [data-action="col-move"][data-i="0"][data-d="1"]').click();
  expect(await colNames()).toEqual(['Yulaf ezmesi', 'Muz']);
});
test('Ayarlar → Güncellemeler yüklü sürümü ve sürüm sayfası bağlantısını gösterir, ağa kendiliğinden çıkmaz (B052)', async ({ page }) => {
  const requests = []; page.on('request', r => requests.push(r.url()));
  await page.goto('/'); await tab(page, 'ayarlar');
  const card = page.locator('section.updates');
  await expect(card).toContainText(/\d+\.\d+\.\d+/);
  await expect(card.locator('a[href$="/releases"]')).toHaveAttribute('target', '_blank');
  expect(requests.filter(u => !u.startsWith('http://127.0.0.1') && !u.startsWith('data:'))).toEqual([]);
});

test('besin kartları kısa özet gösterir ve liste enerji/proteine göre sıralanır (B057)', async ({ page }) => {
  await page.goto('/');
  const muz = page.locator('#foodlist [data-id="muz"] .facts');
  await expect(muz).toContainText('kcal');
  await page.locator('[data-action="sort"][data-s="protein"]').click();
  await expect(page.locator('[data-action="sort"][data-s="protein"]')).toHaveAttribute('aria-pressed', 'true');
  const vals = await page.locator('#foodlist .food .facts').evaluateAll((els) => els.map((e) => {
    const m = e.textContent.match(/([\d.,]+) g prot/); return m ? Number(m[1].replace(/\./g, '').replace(',', '.')) : null;
  }));
  const known = vals.filter((v) => v != null);
  expect(known.length).toBeGreaterThan(20);
  for (let i = 1; i < known.length; i++) expect(known[i]).toBeLessThanOrEqual(known[i - 1]);
  // Veri olmayanlar sonda: ilk bilinmeyenden sonra bilinen yok
  const firstNull = vals.indexOf(null);
  if (firstNull >= 0) expect(vals.slice(firstNull).every((v) => v == null)).toBe(true);
  await page.locator('[data-action="sort"][data-s="default"]').click();
  await expect(page.locator('#foodlist h3.grp').first()).toBeVisible();
});

test('tarif en düşük kalan besinleri gösterir ve öneriden besine gider (B058)', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('muz'); await page.locator('#foodlist [data-id="muz"]').click();
  await page.locator('[data-action="ex-add-recipe"]').click();
  await tab(page, 'tarif');
  const card = page.locator('.recipe-gaps');
  await expect(card.locator('li')).toHaveCount(3);
  await expect(card).toContainText('B12');
  const chip = card.locator('[data-action="gap-open"]').first();
  const id = await chip.getAttribute('data-id');
  await chip.click();
  await expect(page.locator(`.dhead, .detail`).first()).toBeVisible();
  await expect(page.locator('[data-action="ex-add-recipe"]')).toBeVisible();
  expect(id).toBeTruthy();
});

test('çoklu seçimle birden çok besin tek dokunuşla tarife eklenir (B059)', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-action="multi-toggle"]').first().click();
  await expect(page.locator('[data-action="multi-add"]')).toBeDisabled();
  await page.locator('#q').fill('muz'); await page.locator('#foodlist [data-id="muz"]').click();
  await expect(page.locator('#foodlist [data-id="muz"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#q').fill('yulaf'); await page.locator('#foodlist [data-id="yulaf"]').click();
  await expect(page.locator('.multibar')).toContainText('2');
  await page.locator('[data-action="multi-add"]').click();
  await expect(page.locator('.multibar')).toHaveCount(0);
  await tab(page, 'tarif');
  await expect(page.locator('.ing .ing-h b')).toHaveText(['Muz', 'Yulaf ezmesi']);
});

test('tarif malzemesi tek satırda kalır; ±10, porsiyon başı gram ve Ayarla ile açılan ayrıntı (B060)', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('muz'); await page.locator('#foodlist [data-id="muz"]').click();
  await page.locator('[data-action="ex-add-recipe"]').click();
  await tab(page, 'tarif');
  const mini = page.locator('.ing .amount.mini');
  await expect(mini.locator('.amt-val b')).toHaveText('100');
  await expect(page.locator('.ing .slider')).toHaveCount(0);
  await mini.locator('[data-delta="10"]').click();
  await expect(mini.locator('.amt-val b')).toHaveText('110');
  await page.locator('[data-action="rc-serv"][data-d="1"]').click();
  await expect(page.locator('.ing .per-serv')).toHaveText('porsiyon başı 55 g');
  await page.locator('.ing [data-action="nudge"][data-delta="-10"]').click();
  await expect(page.locator('.ing .per-serv')).toHaveText('porsiyon başı 50 g');
  await page.locator('[data-action="ing-open"]').click();
  await expect(page.locator('.ing .slider')).toBeVisible();
  await expect(page.locator('[data-action="ing-open"]')).toHaveAttribute('aria-expanded', 'true');
  await page.locator('[data-action="ing-open"]').click();
  await expect(page.locator('.ing .slider')).toHaveCount(0);
});

test('Keşfet son bakılan besinleri gösterir, kalıcıdır ve temizlenir (B061)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.presets.recent')).toHaveCount(0);
  for (const id of ['muz', 'yulaf']) {
    if (await page.locator('.back').isVisible()) await page.locator('.back').click();
    await page.locator('#q').fill(id); await page.locator(`#foodlist [data-id="${id}"]`).click();
  }
  await page.reload();
  const row = page.locator('.presets.recent .pchip');
  await expect(row).toHaveCount(2);
  await expect(row.first()).toContainText('Yulaf');
  await row.nth(1).click();
  await expect(page.locator('[data-action="ex-add-recipe"]')).toBeVisible();
  if (await page.locator('.back').isVisible()) await page.locator('.back').click();
  await expect(page.locator('.presets.recent .pchip').first()).toContainText('Muz');
  await page.locator('[data-action="recent-clear"]').click();
  await expect(page.locator('.presets.recent')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('.presets.recent')).toHaveCount(0);
});

test('tarif porsiyonla bugünün günlüğüne malzeme malzeme eklenir (B062)', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('muz'); await page.locator('#foodlist [data-id="muz"]').click();
  await page.locator('[data-action="ex-add-recipe"]').click();
  await tab(page, 'tarif');
  await page.locator('[data-action="rc-serv"][data-d="1"]').click();
  await page.locator('[data-action="rc-to-day"]').click();
  await page.locator('.dlg .dlg-line').fill('abc'); await page.keyboard.press('Enter');
  await expect(page.locator('.dlg')).toHaveCount(0);
  await page.locator('[data-action="rc-to-day"]').click();
  await page.locator('.dlg .dlg-line').fill('1,5'); await page.keyboard.press('Enter');
  const entries = await page.evaluate(() => JSON.parse(localStorage.getItem('bm.personal.v1')).entries);
  expect(entries.map((e) => [e.ref.id, e.g])).toEqual([['muz', 75]]);
  await tab(page, 'gunluk');
  await expect(page.locator('main')).toContainText('Muz');
});

test('günlükteki gün tek dokunuşla tarife dönüşür (B063)', async ({ page }) => {
  await page.goto('/');
  for (const id of ['muz', 'yulaf', 'muz']) {
    if (await page.locator('.back').isVisible()) await page.locator('.back').click();
    await page.locator('#q').fill(id); await page.locator(`#foodlist [data-id="${id}"]`).click();
    await page.locator('[data-action="ex-add-day"]').click();
  }
  await tab(page, 'gunluk');
  await page.locator('[data-action="personal-to-recipe"]').click();
  await expect(page.locator('#rc-name')).toHaveValue(/^Günlük \d{4}-\d{2}-\d{2}$/);
  await expect(page.locator('.ing .ing-h b')).toHaveText(['Muz', 'Yulaf ezmesi']);
  await expect(page.locator('.ing').first().locator('.amt-val b')).toHaveText('200');
});

test('Ayarlarda arama kartları süzer, odak korunur (B064)', async ({ page }) => {
  await page.goto('/');
  await tab(page, 'ayarlar');
  const cards = page.locator('.settings > :not(.settings-search)');
  const total = await cards.count();
  expect(total).toBeGreaterThan(3);
  const q = page.locator('#settings-q');
  await q.fill('AİON');
  await expect(page.locator('.aion-settings')).toBeVisible();
  const visible = await cards.evaluateAll((els) => els.filter((e) => !e.hidden).length);
  expect(visible).toBeGreaterThan(0); expect(visible).toBeLessThan(total);
  await expect(q).toBeFocused();
  await q.fill('zzqqxx');
  await expect(page.locator('#settings-none')).toBeVisible();
  await q.fill('');
  expect(await cards.evaluateAll((els) => els.filter((e) => !e.hidden).length)).toBe(total);
  await expect(page.locator('#settings-none')).toBeHidden();
});

test('tarif listesi: arama, sıralama ve porsiyon başı kcal (B065)', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('muz'); await page.locator('#foodlist [data-id="muz"]').click();
  await page.locator('[data-action="ex-add-recipe"]').click();
  await tab(page, 'tarif');
  await expect(page.locator('#rc-q')).toHaveCount(0);
  for (let i = 0; i < 3; i++) await page.locator('[data-action="rc-new"]').click();
  const items = page.locator('.rlist-item');
  await expect(items).toHaveCount(4);
  await expect(items.first().locator('.rkcal')).toHaveText('89 kcal/porsiyon');
  await expect(items.nth(1).locator('.rkcal')).toHaveCount(0);
  await page.locator('#rc-q').fill('İLK');
  await expect(page.locator('.rlist-item:visible')).toHaveCount(1);
  await expect(page.locator('#rc-q')).toBeFocused();
  await page.locator('#rc-q').fill('yokboyle');
  await expect(page.locator('#rc-none')).toBeVisible();
  await page.locator('#rc-q').fill('');
  await page.locator('[data-action="rc-sort"][data-s="name"]').click();
  const names = await page.locator('.rlist-item .rname').evaluateAll((els) => els.map((e) => e.firstChild.textContent.replace('📒', '').trim()));
  expect(names[0]).toMatch(/^İlk/);
  expect(names.slice(1)).toEqual(['Tarif 2', 'Tarif 3', 'Tarif 4']);
});

test('besin ayrıntısında benzer besinler aynı kategoriden gelir ve açılır (B067)', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('mercimek'); await page.locator('#foodlist .food').first().click();
  const cat = (await page.locator('.dsub').textContent()).split('·')[0].trim();
  const chips = page.locator('.similar .pchip');
  expect(await chips.count()).toBeGreaterThan(2);
  const first = await chips.first().textContent();
  await chips.first().click();
  await expect(page.locator('.dtitle h2')).toContainText(first.trim());
  await expect(page.locator('.dsub')).toContainText(cat);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test('ilk açılışta 3 adımlı tanıtım turu; ileri/geri, atlama kalıcı, Ayarlar\'dan yeniden başlar (B070)', async ({ page }) => {
  await page.goto('/');
  const tour = page.locator('.tour');
  await expect(tour).toContainText('Adım 1/3');
  await expect(page.locator('.cats')).toHaveClass(/tour-target/);
  await expect(page.locator('[data-action="tour-prev"]')).toBeDisabled();
  await page.locator('[data-action="tour-next"]').click();
  await expect(tour).toContainText('Adım 2/3');
  await expect(page.locator('#foodlist')).toHaveClass(/tour-target/);
  await page.locator('[data-action="tour-prev"]').click();
  await expect(tour).toContainText('Adım 1/3');
  await page.locator('[data-action="tour-skip"]').click();
  await expect(tour).toHaveCount(0);
  await expect(page.locator('.tour-target')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('.tour')).toHaveCount(0);
  await tab(page, 'ayarlar');
  await page.locator('[data-action="tour-start"]').click();
  await expect(page.locator('.tour')).toContainText('Adım 1/3');
  for (let i = 0; i < 3; i++) await page.locator('[data-action="tour-next"]').click();
  await expect(page.locator('.tour')).toHaveCount(0);
});

test('Günlük son 7 gün enerji grafiği: kayıtsız gün boş, güne dokununca o gün açılır (B072)', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-06-15T12:00:00'));
  await page.goto('/');
  await page.locator('#q').fill('muz'); await page.locator('#foodlist [data-id="muz"]').click();
  await page.locator('[data-action="ex-add-day"]').click();
  await tab(page, 'gunluk');
  const bars = page.locator('.week-bars .wk');
  await expect(bars).toHaveCount(7);
  await expect(bars.nth(6)).toHaveAttribute('aria-current', 'date');
  await expect(bars.nth(6).locator('.wk-v')).toHaveText('89');
  await expect(bars.nth(5).locator('.wk-v')).toHaveText('—');
  await bars.nth(5).click();
  await expect(page.locator('#personal-day')).toHaveValue('2026-06-14');
  await expect(page.locator('.week-bars .wk').nth(5)).toHaveAttribute('aria-current', 'date');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test('Kıyasla: her besin için hazır ölçüler (USDA porsiyonu) tek dokunuşla seçilir (B074)', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('muz'); await page.locator('#foodlist [data-id="muz"]').click();
  await page.locator('[data-action="ex-add-compare"]').click();
  await tab(page, 'karsilastir');
  // B075: varsayılan tek satır; ±10 çalışır, ölçüler Ayarla'nın altında
  const mini = page.locator('.cmp-col .amount.mini');
  await expect(mini.locator('.amt-val b')).toHaveText('100');
  await mini.locator('[data-delta="10"]').click();
  await expect(page.locator('table.cmp thead')).toContainText('110 g');
  await expect(page.locator('.cmp-col .slider')).toHaveCount(0);
  await page.locator('.cmp-col [data-action="ing-open"]').click();
  const por = page.locator('.cmp-col [data-amount="cmp:0"] .pchip.por');
  expect(await por.count()).toBeGreaterThan(0);
  const g = await por.first().getAttribute('data-val');
  await por.first().click();
  await expect(page.locator('table.cmp thead')).toContainText(`${Number(g).toLocaleString('tr-TR', { maximumFractionDigits: 1 })} g`);
});

test('hayvansal besinler kendi kategorilerinde, etiketli; Ayarlar\'dan gizlenir (B077)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.cat[data-cat="balik"]')).toBeVisible();
  await page.locator('#q').fill('somon');
  const card = page.locator('#foodlist [data-id="somon"]');
  await expect(card.locator('.tag-animal')).toHaveText('Hayvansal');
  await card.click();
  await expect(page.locator('.dsub .tag-animal')).toBeVisible();
  await expect(page.locator('.matrix')).toContainText('Balık');
  await tab(page, 'ayarlar');
  await page.locator('[data-setbool="showAnimal"]').uncheck({ force: true });
  await tab(page, 'kesfet');
  if (await page.locator('.back').isVisible()) await page.locator('.back').click();
  await page.locator('#q').fill('somon');
  await expect(page.locator('#foodlist [data-id="somon"]')).toHaveCount(0);
  await expect(page.locator('.cat[data-cat="balik"]')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('.cat[data-cat="sut"]')).toHaveCount(0);
});

test('besin kartları ve ayrıntı kendi çizimini gösterir; sebzeler farklı (B076/B080)', async ({ page }) => {
  await page.goto('/');
  await page.locator('.cat[data-cat="sebze"]').click();
  const art = (id) => page.locator(`#foodlist [data-id="${id}"] .fi svg.fart`).innerHTML();
  const [d, b, p] = [await art('domates'), await art('brokoli'), await art('patlican')];
  expect(new Set([d, b, p]).size).toBe(3);
  await page.locator('#foodlist [data-id="misir"]').click();
  await expect(page.locator('.dtitle h2 svg.fart')).toBeVisible();
});

test('geniş katalogda hayvansal USDA grupları; gizlenince aramadan da çıkar (B082)', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('bm.settings.v2', JSON.stringify({ version: 2, settings: { showExt: true } })));
  await page.goto('/');
  await page.locator('.cat[data-cat="ext"]').click();
  await expect(page.locator('[data-action="ex-extgroup"][data-g="1500"]')).toContainText('Balık');
  await page.locator('#q').fill('salmon atlantic wild raw');
  await expect(page.locator('#foodlist [data-action="ex-pick-ext"]').first()).toBeVisible();
  await page.locator('#foodlist [data-action="ex-pick-ext"]').first().click();
  await expect(page.locator('.dsub .tag-animal')).toBeVisible();
  await tab(page, 'ayarlar');
  await page.locator('[data-setbool="showAnimal"]').uncheck({ force: true });
  await tab(page, 'kesfet');
  if (await page.locator('.back').isVisible()) await page.locator('.back').click();
  await page.locator('#q').fill('salmon atlantic wild raw');
  await expect(page.locator('#foodlist [data-action="ex-pick-ext"]')).toHaveCount(0);
  await expect(page.locator('[data-action="ex-extgroup"][data-g="1500"]')).toHaveCount(0);
});

test('"besin ekle" penceresinde kategori düğmeleri simetrik: eşit genişlik ve yükseklik (B083)', async ({ page }) => {
  await page.goto('/');
  await tab(page, 'karsilastir');
  await page.locator('[data-action="cmp-add"]').click();
  const sizes = await page.locator('.cats.cats-grid .cat:not(.add)').evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; }));
  expect(sizes.length).toBeGreaterThan(10);
  expect(new Set(sizes.map((s) => s[0])).size).toBe(1);
  expect(new Set(sizes.map((s) => s[1])).size).toBe(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test('Keşfet kategorileri isteğe bağlı simetrik ızgara (B085)', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('bm.settings.v2', JSON.stringify({ version: 2, settings: { catGrid: true } })));
  await page.goto('/');
  const sizes = await page.locator('.explore .cats.cats-grid .cat:not(.add)').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().width)));
  expect(sizes.length).toBeGreaterThan(10);
  expect(new Set(sizes).size).toBe(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

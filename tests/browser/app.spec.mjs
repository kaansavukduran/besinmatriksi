import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const tab = (page, id) => page.locator(`[data-action="tab"][data-tab="${id}"]`).click();
const pickBanana = async page => {
  await page.locator('#q').fill('muz');
  await page.locator('#foodlist [data-id="muz"]').click();
};
test('besin, miktar, tarif ve karşılaştırma uçtan uca çalışır', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/'); await pickBanana(page);
  await page.locator('[data-amount="ex"] [data-val="250"]').click();
  await expect(page.locator('#matrix [data-basic="energy"]')).toContainText('223');
  await page.locator('[data-action="ex-add-recipe"]').click();
  await page.locator('[data-action="ex-add-compare"]').click();
  await tab(page, 'tarif');
  // Maliyet hesabı yok (Kaan'ın 2026-11-12 kararı); özet temel değer kartıdır
  await page.locator('[data-action="ing-open"]').first().click();
  await expect(page.locator('[data-price]')).toHaveCount(0);
  await expect(page.locator('#recipe-summary')).not.toContainText('Maliyet');
  await expect(page.locator('#recipe-summary .basic-card [data-basic="energy"] [data-who="female"]')).toHaveCount(1);
  await page.locator('[data-action="rc-serv"][data-d="1"]').click();
  await page.locator('[data-action="rc-basis"][data-b="serving"]').click();
  await expect(page.locator('#recipe-summary')).toContainText('111');
  await page.reload();
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
  await expect(page.locator('#matrix [data-basic="energy"]')).toContainText('kJ');
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
  await expect(page.locator('#matrix [data-basic="energy"]')).toContainText('890');
});


test('tek HTML içeriği harici istek olmadan çalışır', async ({ page, context }) => {
  const { readFile } = await import('node:fs/promises');
  const html = await readFile(new URL('../../dist-single/besin-matriksi.html', import.meta.url), 'utf8');
  const requests = []; page.on('request', r => requests.push(r.url()));
  await context.setOffline(true); await page.setContent(html);
  await pickBanana(page); await page.locator('[data-amount="ex"] [data-val="1000"]').click();
  await expect(page.locator('#matrix [data-basic="energy"]')).toContainText('890');
  expect(requests.filter(url => /^https?:/.test(url))).toEqual([]);
});

test('A4 çıktısı tabloyu ve tüm değerleri korur, bölüm durumunu geri yükler', async ({ page, browserName }, testInfo) => {
  await page.goto('/'); await pickBanana(page);
  const before = await page.locator('#matrix .row').allTextContents();
  const protein = page.locator('[data-sec="protein"]');
  await protein.locator('summary').click(); await expect(protein).not.toHaveAttribute('open', '');
  if (browserName === 'chromium') { // page.pdf yalnız Chromium'da desteklenir; diğer tarayıcılarda baskı ortamı öykünülür
    const pdf = await page.pdf({ path: testInfo.outputPath('muz-a4.pdf'), preferCSSPageSize: true, printBackground: true });
    const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) || []).length;
    expect(pages).toBeGreaterThan(0); expect(pages).toBeLessThanOrEqual(10);
  } else {
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('#matrix .row').first()).toBeVisible();
    await page.emulateMedia({ media: 'screen' });
  }
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
  await page.addInitScript(() => { if (!localStorage.getItem('bm.aionOffV1')) { localStorage.setItem('bm.aionOffV1', '1'); localStorage.setItem('bm.settings.v1', JSON.stringify({ aionEnabled: true })); } });
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
    while (w.nextNode()) { const t = w.currentNode.textContent.trim(); if (t && re.test(t) && !w.currentNode.parentElement.closest('script,style,pre,.notice,option,.fontbtn,.theme-preview,.rname,#rc-name,.profile-bar,[lang="tr"]')) out.push(t); }
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

test('tanıtım turu kaldırıldı: ilk açılışta tur kartı ve vurgu yok; Ayarlar\'da tur düğmesi yok (B123; B070 kaldırıldı)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.tour, .tour-target, [data-action^="tour-"]')).toHaveCount(0);
  await expect(page.locator('#q')).toBeVisible();
  await tab(page, 'ayarlar');
  await expect(page.locator('[data-action="tour-start"]')).toHaveCount(0);
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
  await expect(page.locator('table.cmp thead')).toContainText(`${Math.round(Number(g))} g`);
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

test('önce temel besin değerleri: ayrıntı, Kıyasla ve Günlük en üstte basit değerleri gösterir (B086)', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('muz'); await page.locator('#foodlist [data-id="muz"]').click();
  const card = page.locator('#matrix .basic-card');
  await expect(card).toBeVisible();
  await expect(card.locator('[data-basic="energy"] b')).toContainText('89');
  for (const k of ['protein', 'carb_avail', 'sugars', 'fat', 'fiber', 'salt']) await expect(card.locator(`[data-basic="${k}"]`)).toHaveCount(1);
  // temel kart matriksteki ilk öğedir
  expect(await page.locator('#matrix > *').first().getAttribute('class')).toContain('basic-card');
  await page.locator('[data-action="ex-add-compare"]').click();
  await page.locator('[data-action="ex-add-day"]').click();
  await tab(page, 'karsilastir');
  await expect(page.locator('table.cmp tbody tr').first()).toHaveClass(/secrow basic/);
  await expect(page.locator('table.cmp tbody tr').nth(1)).toContainText('Enerji');
  await tab(page, 'gunluk');
  await expect(page.locator('.basic-card')).toContainText('89');
});

test('kategorilerde yaygın besinler önce; az bilinenler gizli ama aranabilir (B087)', async ({ page }) => {
  await page.goto('/');
  await page.locator('.cat[data-cat="meyve"]').click();
  const ids = await page.locator('#foodlist .food').evaluateAll((els) => els.map((e) => e.dataset.id));
  expect(ids.slice(0, 3)).toEqual(['elma', 'muz', 'portakal']);
  expect(ids).not.toContain('jackfruit');
  await page.locator('#q').fill('jackfruit');
  await expect(page.locator('#foodlist [data-id="jackfruit"]')).toBeVisible();
  await tab(page, 'ayarlar');
  await page.locator('[data-setbool="showNiche"]').check({ force: true });
  await tab(page, 'kesfet');
  await page.locator('#q').fill('');
  await page.locator('.cat[data-cat="meyve"]').click();
  await expect(page.locator('#foodlist [data-id="jackfruit"]')).toBeVisible();
});

test('yaygın eklenen besinler: ekmek, su, taze soğan, tavuk but listede ve çizimli (B088)', async ({ page }) => {
  await page.goto('/');
  await page.locator('.cat[data-cat="ekmek"]').click();
  const ids = await page.locator('#foodlist .food').evaluateAll((els) => els.map((e) => e.dataset.id));
  expect(ids[0]).toBe('beyaz_ekmek');
  await expect(page.locator('#foodlist [data-id="beyaz_ekmek"] svg.fart')).toBeVisible();
  await page.locator('.cat[data-cat=""]').click();
  for (const q of ['su', 'taze soğan', 'tavuk but']) {
    await page.locator('#q').fill(q);
    await expect(page.locator('#foodlist .food').first()).toBeVisible();
  }
  await page.locator('#q').fill('içme suyu'); await page.locator('#foodlist [data-id="su"]').click();
  await expect(page.locator('.basic-card [data-basic="energy"] b')).toContainText('0');
});

test('Ayarlar en üstte Dil kartı: Türkçe/English tek dokunuşla değişir ve kalıcıdır (B089)', async ({ page }) => {
  await page.goto('/');
  await tab(page, 'ayarlar');
  const first = page.locator('.settings > section').first();
  await expect(first).toHaveClass(/lang-card/);
  await first.locator('[data-v=\'"en"\']').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('[data-action="tab"][data-tab="ayarlar"]')).toContainText('Settings');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.locator('[data-action="tab"][data-tab="ayarlar"]').click();
  await page.locator('.lang-card [data-v=\'"tr"\']').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
});

test('açılış bekçisi: uygulama yüklenemezse boş ekran yerine önbellek temizleme düğmesi (B090)', async ({ page }) => {
  await page.clock.install();
  await page.route(/\/assets\/index-[^/]+\.js$/, (r) => r.abort());
  await page.goto('/');
  await page.clock.runFor(11000);
  const btn = page.locator('#bm-recover');
  await expect(btn).toBeVisible();
  await page.unroute(/\/assets\/index-[^/]+\.js$/);
  await btn.click();
  await expect(page.locator('[data-action="tab"][data-tab="kesfet"]')).toBeVisible({ timeout: 15000 });
});

test('service worker: sayfa açılışı önce ağdan, tek dosya hatası kurulumu bozmaz, güncellemede yeniler (B090)', async ({ page }) => {
  await page.goto('/');
  const sw = await page.evaluate(() => fetch('./sw.js').then((r) => r.text()));
  expect(sw).toContain("e.request.mode === 'navigate'");
  expect(sw).toContain('Promise.allSettled');
  expect(sw).toContain("cache: 'no-store'");
  // sağlıklı açılışta bekçi mesajı çıkmaz
  expect(await page.evaluate(() => window.__bmBooted)).toBe(true);
});

test('Türk ölçüleri düğmelerde ≈ ile görünür ve gramı ayarlar (B092)', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('nohut'); await page.locator('#foodlist [data-id="nohut"]').click();
  const chip = page.locator('[data-amount="ex"] .pchip.por', { hasText: '1 su bardağı (200 ml)' });
  await expect(chip).toContainText('≈');
  await chip.click();
  await expect(page.locator('[data-amount="ex"] .amt-val b')).toHaveText(/^169/);
});

test('Günlük hedef çubukları: kalori hedefe doğru, yalnız Günlük\'te (B093)', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('muz'); await page.locator('#foodlist [data-id="muz"]').click();
  await expect(page.locator('#matrix .basic-card.goals')).toHaveCount(0);
  await page.locator('[data-action="ex-add-day"]').click();
  await tab(page, 'gunluk');
  const card = page.locator('.basic-card.goals');
  await expect(card.locator('[data-basic="energy"] .gbar')).toHaveCount(2);
  // profil yok: ortalama kadın ve erkek çubukları
  await expect(card.locator('[data-basic="energy"] [data-who="female"]')).toContainText('%4');
  await expect(card.locator('[data-basic="energy"] [data-who="male"]')).toHaveCount(1);
  await expect(card.locator('[data-basic="salt"]')).toContainText('üst sınır');
  await expect(card).toContainText('tıbbi öneri değildir');
});

test('Aion Günlük hedefine ulaşınca bir kez kutlar (B094)', async ({ page }) => {
  await page.addInitScript(() => { if (!localStorage.getItem('bm.aionOffV1')) { localStorage.setItem('bm.aionOffV1', '1'); localStorage.setItem('bm.settings.v1', JSON.stringify({ aionEnabled: true })); } });
  await page.goto('/');
  await page.locator('#q').fill('soya'); await page.locator('#foodlist [data-id="soya_izolat"]').click();
  await page.locator('[data-action="ex-add-day"]').click();
  await tab(page, 'gunluk');
  await expect(page.locator('.basic-tile.goal.done[data-basic="protein"]')).toHaveCount(1);
  await expect(page.locator('#aion .aion-bubble')).toContainText('protein');
  await page.waitForTimeout(900); // gecikmeli ilk selam (600 ms) kutlamanın üzerine yazmamalı
  await expect(page.locator('#aion .aion-bubble')).toContainText('protein');
  const seen = await page.evaluate(() => JSON.parse(localStorage.getItem('bm.aion.goals')));
  expect(seen.keys).toContain('protein');
  await page.reload(); await tab(page, 'gunluk');
  await expect(page.locator('.basic-tile.goal.done[data-basic="protein"]')).toHaveCount(1);
  await expect(page.locator('#aion .aion-bubble')).not.toContainText('hedefine ulaştın');
});

test('görünüm cilası: eşit kıyas sütunları, Türkçe yüzde, tek dil seçimi, telefonda ad (B095)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.brand b')).toBeVisible();
  await page.locator('#q').fill('nohut'); await page.locator('#foodlist [data-id="nohut"]').click();
  await expect(page.locator('#matrix .basic-card [data-basic="carb_avail"] .gpct').first()).toContainText(/^%\d/);
  await page.locator('[data-action="ex-add-compare"]').click();
  if (await page.locator('[data-action="ex-back"]').isVisible()) await page.locator('[data-action="ex-back"]').click();
  await page.locator('#q').fill('muz'); await page.locator('#foodlist [data-id="muz"]').click();
  await page.locator('[data-action="ex-add-compare"]').click();
  await tab(page, 'karsilastir');
  const w = await page.locator('table.cmp thead th').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().width));
  expect(Math.abs(w[1] - w[2])).toBeLessThan(2);
  const wrap = await page.locator('.tablewrap').evaluate((e) => e.scrollWidth - e.clientWidth);
  expect(wrap).toBeLessThanOrEqual(1);
  await tab(page, 'ayarlar');
  await expect(page.locator('#app-language')).toHaveCount(0);
  await expect(page.locator('.lang-pick [data-k="language"]')).toHaveCount(3);
});

test('temel değerlerde ortalama kadın/erkek yüzdesi; Kıyasla yüzdeleri; kül ve maliyet yok; kaynak en altta (B097)', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('nohut'); await page.locator('#foodlist [data-id="nohut"]').click();
  const card = page.locator('#matrix .basic-card');
  await expect(card.locator('[data-basic="protein"] [data-who="female"] .gpct')).toHaveText('%45');
  await expect(card.locator('[data-basic="protein"] [data-who="male"] .gpct')).toHaveText('%37');
  await expect(card).toContainText('PHE');
  await expect(page.locator('[data-sec="enerji"]')).toHaveCount(0); // ayrı Kalori kutusu yok (B113)
  const order = await page.locator('#matrix > *').evaluateAll((els) => els.map((e) => e.className));
  expect(order.findIndex((c) => c.includes('reference-label'))).toBeGreaterThan(order.findIndex((c) => c.includes('sec')));
  await page.locator('[data-action="ex-add-compare"]').click();
  await tab(page, 'karsilastir');
  await expect(page.locator('table.cmp tbody tr').nth(2)).toContainText('K %45');
  await expect(page.locator('table.cmp')).not.toContainText('Kül');
});

test('makro pasta grafiği kalori kutusunun üstünde; flavonoid verisi USDA Flavonoid etiketiyle (B100)', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('soğan'); await page.locator('#foodlist [data-id="sogan"]').click();
  const pie = page.locator('#matrix .basic-card .macro-pie');
  await expect(pie.locator('svg.pie circle[data-part]')).not.toHaveCount(0);
  await expect(pie.locator('li[data-part="c"] strong')).toContainText('%');
  // pasta temel değer kartının içinde; hesaplanan göstergeler hemen altında
  const order = await page.locator('#matrix > *').evaluateAll((els) => els.map((e) => e.dataset.sec || e.className));
  expect(order[0]).toContain('basic-card');
  expect(order[1]).toBe('hesap');
  await page.locator('[data-sec="fito"] > summary').click();
  await expect(page.locator('[data-sec="fito"]')).toContainText('Kuersetin');
  await expect(page.locator('[data-sec="fito"] .src-f').first()).toContainText('USDA Flavonoid');
});

test('pasta grafiği Keşfet, Tarif ve Kıyasla sekmelerinde (B102)', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('nohut'); await page.locator('#foodlist [data-id="nohut"]').click();
  await expect(page.locator('#matrix .macro-pie svg.pie')).toHaveCount(1);
  await page.locator('[data-action="ex-add-recipe"]').click();
  await page.locator('[data-action="ex-add-compare"]').click();
  if (await page.locator('[data-action="ex-back"]').isVisible()) await page.locator('[data-action="ex-back"]').click();
  await page.locator('#q').fill('muz'); await page.locator('#foodlist [data-id="muz"]').click();
  await page.locator('[data-action="ex-add-compare"]').click();
  await tab(page, 'tarif');
  await expect(page.locator('#recipe-summary .basic-card .macro-pie svg.pie')).toHaveCount(1);
  await tab(page, 'karsilastir');
  await expect(page.locator('.cmp-pies .macro-pie.mini svg.pie')).toHaveCount(2);
  await expect(page.locator('.cmp-pies .macro-pie.mini').first()).toContainText('Nohut');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});

test('Günlük: kişisel profil en üstte, ardından gün kartı (B122; B104 tersine çevrildi)', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('muz'); await page.locator('#foodlist [data-id="muz"]').click();
  await page.locator('[data-action="ex-add-day"]').click();
  await tab(page, 'gunluk');
  const y = async (sel) => (await page.locator(sel).first().boundingBox()).y;
  expect(await y('.personal-profile')).toBeLessThan(await y('#personal-day'));
  expect(await y('#personal-day')).toBeLessThan(await y('.personal .basic-card'));
});

test('Günlük: günün kalori pasta grafiği temel değerlerin altında (B105)', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('nohut'); await page.locator('#foodlist [data-id="nohut"]').click();
  await page.locator('[data-action="ex-add-day"]').click();
  await tab(page, 'gunluk');
  await expect(page.locator('.personal .macro-pie svg.pie')).toHaveCount(1);
  await expect(page.locator('.personal .macro-pie li[data-part="p"] strong')).toContainText('%');
});

test('temel değer karoları dengeli (4+4 ya da 2×4) (B107)', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('ıspanak'); await page.locator('#foodlist [data-id="ispanak"]').click();
  const tops = await page.locator('#matrix .basic-card .basic-tile').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
  const rows = new Map(); for (const t of tops) rows.set(t, (rows.get(t) || 0) + 1);
  const counts = [...rows.values()];
  expect(tops.length).toBe(8);
  expect(new Set(counts).size).toBe(1); // her satırda eşit sayıda karo
});

test('Ayarlar kartları boşluksuz sütunlara akar; yatay taşma yok (B108)', async ({ page }) => {
  await page.goto('/'); await tab(page, 'ayarlar');
  expect(await page.locator('.settings').evaluate((e) => getComputedStyle(e).columnWidth)).not.toBe('auto');
  // aynı sütundaki ardışık kartlar arasında büyük boşluk yok
  const gaps = await page.locator('.settings > .card').evaluateAll((els) => {
    const r = els.filter((e) => e.offsetParent).map((e) => e.getBoundingClientRect());
    const out = [];
    for (const a of r) { const below = r.filter((b) => Math.abs(b.left - a.left) < 2 && b.top > a.bottom - 1).sort((x, y) => x.top - y.top)[0]; if (below) out.push(below.top - a.bottom); }
    return out;
  });
  expect(Math.max(...gaps)).toBeLessThan(40);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test('Kıyasla tablosu kendi içinde dikey kaydırmaz; sayfa boyunca açık (B109)', async ({ page }) => {
  await page.goto('/');
  for (const id of ['limon', 'ananas']) {
    await page.locator('#q').fill(id); await page.locator(`#foodlist [data-id="${id}"]`).click();
    await page.locator('[data-action="ex-add-compare"]').click();
    if (await page.locator('[data-action="ex-back"]').isVisible()) await page.locator('[data-action="ex-back"]').click();
  }
  await tab(page, 'karsilastir');
  const w = page.locator('.tablewrap');
  expect(await w.evaluate((e) => e.scrollHeight - e.clientHeight)).toBeLessThanOrEqual(1);
  expect(await w.evaluate((e) => e.clientHeight)).toBeGreaterThan(1000);
});

test('Keşfet: karşılama kartı üstte; seçili kategorinin besinleri sağda kare ızgara (B112)', async ({ page }, info) => {
  await page.goto('/');
  await expect(page.locator('.welcome')).toHaveCount(1);
  await expect(page.locator('#aion')).toBeHidden(); // Aion varsayılan kapalı (B113)
  if (page.viewportSize().width <= 700) return; // dar ekranda (telefon) orta liste kullanılır
  await expect(page.locator('.detail .periodic .pt').first()).toBeVisible();
  await page.locator('.cat[data-cat="meyve"]').click();
  const tiles = page.locator('.detail .periodic .pt');
  await expect(tiles.first()).toContainText('Elma');
  const box = await tiles.first().boundingBox();
  expect(Math.abs(box.width - box.height)).toBeLessThan(2); // kare
  await tiles.nth(1).click();
  await expect(page.locator('#matrix .basic-card')).toBeVisible();
});

test('çeşitlilik: longevity besinleri görünür; besin mayası/psyllium etiketten eklenir (B115)', async ({ page }) => {
  await page.goto('/');
  await page.locator('.cat[data-cat="kuruyemis"]').click();
  await expect(page.locator('#foodlist [data-id="brezilya_cevizi"]')).toHaveCount(1);
  await expect(page.locator('#foodlist [data-id="makadamya"]')).toHaveCount(1);
  await page.locator('.cat[data-cat=""]').click();
  for (const id of ['sirken', 'karpuz_cekirdegi', 'horoz_mantari', 'irlanda_yosunu']) {
    await page.locator('#q').fill(id === 'sirken' ? 'sirken' : id === 'karpuz_cekirdegi' ? 'karpuz çekirdeği' : id === 'horoz_mantari' ? 'chanterelle' : 'sea moss');
    await expect(page.locator(`#foodlist [data-id="${id}"]`)).toHaveCount(1);
  }
  await page.locator('#q').fill('besin mayası'); await page.locator('#foodlist [data-id="besin_mayasi_z"]').click();
  await page.locator('.unavail [data-action="cu-new"]').click();
  await expect(page.locator('.modal input').first()).toHaveValue(/Besin mayası/);
});

test('içecekler ve tahıllar: Türk kahvesi (FNDDS), hibiskus; Americano ve siyez açıklamalı (B117)', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('türk kahvesi'); await page.locator('#foodlist [data-id="turk_kahvesi"]').click();
  await expect(page.locator('#matrix [data-basic="energy"]')).toContainText('27');
  await expect(page.locator('#matrix .src-N').first()).toContainText('USDA FNDDS');
  if (await page.locator('[data-action="ex-back"]').isVisible()) await page.locator('[data-action="ex-back"]').click();
  await page.locator('#q').fill('hibiskus'); await expect(page.locator('#foodlist [data-id="hibiskus_cayi"]')).toHaveCount(1);
  await page.locator('#q').fill('americano'); await page.locator('#foodlist [data-id="americano"]').click();
  await expect(page.locator('.unavail')).toContainText('espresso');
  if (await page.locator('[data-action="ex-back"]').isVisible()) await page.locator('[data-action="ex-back"]').click();
  await page.locator('#q').fill('siyez'); await expect(page.locator('#foodlist [data-id="siyez_bulguru"]')).toHaveCount(1);
});

test('kapsam: deniz ürünleri, mantarlar, Türkiye besinleri, protein tozları ve kreatin aranabilir (B119)', async ({ page }) => {
  await page.goto('/');
  for (const [q, id] of [['lüfer', 'lufer'], ['ahtapot', 'ahtapot'], ['aslan yelesi', 'aslan_yelesi'], ['kanlıca', 'kanlica'], ['gemlik', 'gemlik_zeytini'], ['taflan', 'taflan'], ['seylan', 'seylan_tarcini'], ['whey', 'whey_izolat'], ['bezelye proteini', 'bezelye_proteini'], ['kreatin', 'kreatin'], ['kuşburnu', 'kusburnu']]) {
    await page.locator('#q').fill(q);
    await expect(page.locator(`#foodlist [data-id="${id}"]`), q).toHaveCount(1);
  }
  await page.locator('#foodlist [data-id="kusburnu"]').click();
  await expect(page.locator('#matrix [data-basic="energy"]')).not.toContainText('veri yok');
  if (await page.locator('[data-action="ex-back"]').isVisible()) await page.locator('[data-action="ex-back"]').click();
  await page.locator('#q').fill('patates kızartması'); await page.locator('#foodlist [data-id="patates_kizartmasi"]').click();
  await expect(page.locator('.fchip, [data-action="ex-form"]').filter({ hasText: 'Tavada' })).toHaveCount(1);
});

test('Lifler kutusu temel kart ve hesaplanan göstergelerin altında; malzeme ✕ düğmesi sağ üstte sabit (B120)', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('shiitake'); await page.locator('#foodlist [data-id="shiitake"]').click();
  const order = await page.locator('#matrix > *').evaluateAll((els) => els.map((e) => e.dataset.sec || e.className));
  expect(order.slice(0, 3)).toEqual([expect.stringContaining('basic-card'), 'hesap', 'protein']);
  expect(order.indexOf('lif')).toBe(order.indexOf('vitamin') + 1); // B125: Lifler, Vitaminler'in hemen altında
  await expect(page.locator('[data-sec="lif"]')).toContainText('Beta-glukan');
  await page.locator('[data-action="ex-add-recipe"]').click();
  if (await page.locator('[data-action="ex-back"]').isVisible()) await page.locator('[data-action="ex-back"]').click();
  await page.locator('#q').fill('ıspanak'); await page.locator('#foodlist [data-id="ispanak"]').click(); await page.locator('[data-action="ex-add-recipe"]').click();
  await page.locator('[data-action="tab"][data-tab="tarif"]').click();
  const pos = await page.locator('.ing').evaluateAll((els) => els.map((e) => { const c = e.getBoundingClientRect(), x = e.querySelector('[data-action="rc-del-item"]').getBoundingClientRect(); return [Math.round(c.right - x.right), Math.round(x.top - c.top)]; }));
  expect(new Set(pos.map(String)).size).toBe(1); // her kartta aynı konum
  expect(pos[0][0]).toBeLessThan(30); expect(pos[0][1]).toBeLessThan(30);
});

test('ayran tarif hesabı olarak görünür: Tahmin (tarif) etiketi ve oran; Ekmek kategorisi (B124)', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('ayran'); await page.locator('#foodlist [data-id="ayran"]').click();
  await expect(page.locator('#matrix [data-basic="protein"]')).toContainText('2,08');
  await expect(page.locator('#matrix .src-r').first()).toContainText('Tahmin (tarif)');
  await expect(page.locator('#matrix .idcard')).toContainText('%60');
  if (await page.locator('[data-action="ex-back"]').isVisible()) await page.locator('[data-action="ex-back"]').click();
  await page.locator('#q').fill('');
  await expect(page.locator('.cat[data-cat="ekmek"]')).toContainText('Ekmek');
  await expect(page.locator('.cat[data-cat="yemek"]')).toHaveCount(1);
});

test('ekmek türleri ve hazır yemekler: ekşi mayalı, naan, döner, falafel; hayvansal yemekler gizlenebilir (B126)', async ({ page }) => {
  await page.goto('/');
  await page.locator('.cat[data-cat="ekmek"]').click();
  for (const id of ['eksi_mayali_ekmek', 'cok_tahilli_ekmek', 'naan', 'bagel']) await expect(page.locator(`#foodlist [data-id="${id}"]`)).toHaveCount(1);
  await page.locator('.cat[data-cat="yemek"]').click();
  for (const id of ['et_doner', 'tavuk_doner', 'falafel', 'zeytinyagli_sarma']) await expect(page.locator(`#foodlist [data-id="${id}"]`)).toHaveCount(1);
  await page.locator('#foodlist [data-id="et_doner"]').click();
  await expect(page.locator('#matrix .src-r').first()).toContainText('Tahmin (tarif)');
  await expect(page.locator('#matrix .idcard')).toContainText('Lamb, ground');
  if (await page.locator('[data-action="ex-back"]').isVisible()) await page.locator('[data-action="ex-back"]').click();
  await tab(page, 'ayarlar');
  await page.locator('label.toggle:has(input[data-setbool="showAnimal"])').click();
  await tab(page, 'kesfet');
  await page.locator('.cat[data-cat="yemek"]').click();
  await expect(page.locator('#foodlist [data-id="et_doner"]')).toHaveCount(0);
  await expect(page.locator('#foodlist [data-id="falafel"]')).toHaveCount(1);
});

test('denetim düzeltmeleri: Kıyasla ✕ doğru besini siler (silinmiş özel besin varken); arama sağdaki tabloyu da süzer (B127)', async ({ page }, info) => {
  await page.goto('/');
  if (page.viewportSize().width > 700) {
    await page.locator('#q').fill('mercimek');
    await expect(page.locator('.detail .periodic h2')).toContainText('mercimek');
    await page.locator('#q').fill('');
  }
  // gizli (çözümlenemeyen) bir kıyas kaydı + muz
  await page.evaluate(() => localStorage.setItem('bm.compare.test', '1'));
  await page.locator('#q').fill('muz'); await page.locator('#foodlist [data-id="muz"]').click();
  await page.locator('[data-action="ex-add-compare"]').click();
  if (await page.locator('[data-action="ex-back"]').isVisible()) await page.locator('[data-action="ex-back"]').click();
  await page.locator('#q').fill('elma'); await page.locator('#foodlist [data-id="elma"]').click();
  await page.locator('[data-action="ex-add-compare"]').click();
  await tab(page, 'karsilastir');
  await page.locator('.cmp-col').filter({ hasText: 'Muz' }).locator('[data-action="cmp-del"]').click();
  await expect(page.locator('.cmp-col')).toHaveCount(1);
  await expect(page.locator('.cmp-col')).toContainText('Elma');
});

test('İngilizce modda ekranda görünen İngilizce adla arama bulur (B127)', async ({ page }) => {
  await page.goto('/'); await tab(page, 'ayarlar');
  await page.locator('.lang-pick [data-k="language"][lang="en"]').click();
  await tab(page, 'kesfet');
  for (const [q, id] of [['chickpeas', 'nohut'], ['grapes', 'uzum'], ['lentils', 'yesil_mercimek'], ['blackcurrant', 'frenk_uzumu']]) {
    await page.locator('#q').fill(q);
    await expect(page.locator(`#foodlist [data-id="${id}"]`), q).toHaveCount(1);
  }
});

test('USDA özel veri tabanları: kakaoda proantosiyanidin, yumurtada kolin türleri kaynak etiketiyle (B128)', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('kakao');
  await page.locator('#foodlist [data-id="kakao"]').click();
  await expect(page.locator('#matrix')).toContainText('Proantosiyanidin polimerleri');
  await expect(page.locator('#matrix .src-P').first()).toContainText('USDA Proantosiyanidin');
  if (await page.locator('[data-action="ex-back"]').isVisible()) await page.locator('[data-action="ex-back"]').click();
  await page.locator('#q').fill('yumurta');
  await page.locator('#foodlist [data-id="yumurta"]').first().click();
  await expect(page.locator('#matrix')).toContainText('Kolin – fosfatidilkolinden');
  await expect(page.locator('#matrix .src-C').first()).toContainText('USDA Kolin');
});

test('yeni besinler aranabilir: mercimek çorbası, yulaf sütü (B129)', async ({ page }) => {
  await page.goto('/');
  for (const [q, id] of [['mercimek çorbası', 'mercimek_corbasi'], ['yulaf sütü', 'yulaf_sutu'], ['badem ezmesi', 'badem_ezmesi']]) {
    await page.locator('#q').fill(q);
    await expect(page.locator(`#foodlist [data-id="${id}"]`), q).toHaveCount(1);
  }
  await page.locator('#foodlist [data-id="badem_ezmesi"]').click();
  await expect(page.locator('#matrix')).toContainText('Protein');
});

test('mercimek köftesi tarif hesabı etiketiyle açılır (B130)', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('mercimek köftesi');
  await page.locator('#foodlist [data-id="mercimek_koftesi"]').click();
  await expect(page.locator('#matrix .src-r').first()).toContainText('Tahmin (tarif)');
  await expect(page.locator('#matrix .idcard')).toContainText('Bulgur, cooked');
});

test('simit: pişme verimi satırı ve vitaminler veri yok (B131)', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('simit');
  await page.locator('#foodlist [data-id="simit"]').click();
  await expect(page.locator('#matrix .src-r').first()).toContainText('Tahmin (tarif)');
  await expect(page.locator('#matrix')).toContainText('Pişme verimi');
  await expect(page.locator('#matrix')).toContainText('%82');
});

test('kurutulmuş shiitakede pürinler USDA Pürin etiketiyle (B132)', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('shiitake');
  await page.locator('#foodlist [data-id="shiitake"]').click();
  const forms = page.locator('[data-action="form"]');
  if (await forms.count()) await page.locator('[data-action="form"]', { hasText: /Kurutulmuş/ }).first().click();
  await expect(page.locator('#matrix')).toContainText('Pürinler (4 bazın toplamı)');
  await expect(page.locator('#matrix .src-U').first()).toContainText('USDA Pürin');
});

import { category, reveal, tab } from './navigation.mjs';
import { test, expect } from '@playwright/test';

const micro = (page, key) => page.locator(`.micro-overview [data-micro="${key}"]`);

test('B266 Matvaretabellen profilleri ve tarif katkısı aynı kaynak kaydını gösterir', async ({ page }) => {
  await page.goto('/');
  await pick(page, 'beluga', 'siyah_mercimek');
  await expect(page.locator('[data-overview="energy"]')).toContainText('278');
  await expect(page.locator('#matrix .idcard')).toContainText('06.256');
  await page.locator('[data-action="ex-add-recipe"]').click();
  await pick(page, 'psyllium', 'psyllium');
  await expect(page.locator('[data-overview="fiber"]')).toContainText('78');
  await expect(page.locator('#matrix .idcard')).toContainText('05.465');
  await tab(page, 'tarif');
  await expect(page.locator('#recipe-summary [data-basic="energy"]')).toContainText('278');
  await expect(page.locator('#recipe-source-rows')).toContainText('Matvaretabellen · 06.256');
});

test('B267 eksik iyot kaynaklıdır ve kahve çalışması hacim notu olarak kalır', async ({ page }) => {
  await page.goto('/');
  await pick(page, 'dereotu', 'dereotu');
  await expect(micro(page, 'iodine').locator('.micro-value')).toHaveText('4 µg');
  await expect(page.locator('#matrix .idcard')).toContainText('06.120');
  await page.locator('[data-action="ex-add-recipe"]').click();
  await tab(page, 'tarif');
  await expect(micro(page, 'iodine').locator('.micro-value')).toHaveText('4 µg');
  await reveal(page, '.micro-overview');
  await micro(page, 'iodine').locator('button').click();
  await expect(page.locator('#recipe-source-nutrient')).toHaveValue('iodine');
  await expect(page.locator('#recipe-source-rows')).toContainText('Matvaretabellen · 06.120');
  await tab(page, 'kesfet');
  await pick(page, 'türk kahvesi', 'turk_kahvesi_sade');
  await expect(page.locator('.unavail')).toContainText('129,6 mg kafein / 100 mL');
  await expect(page.locator('.unavail')).toContainText('10.3389/fnut.2024.1407590');
  await page.locator('[data-action="ex-add-recipe"]').click();
  await tab(page, 'tarif');
  await expect(micro(page, 'iodine')).toHaveAttribute('data-micro-status', 'partial');
});

test('B264 küratörlü kataloğa taşınan NDB eski tarifte kaybolmaz', async ({ page }) => {
  await page.addInitScript(() => {
    if (localStorage.getItem('bm.recipes.v1')) return;
    localStorage.setItem('bm.recipes.v1', JSON.stringify([{
      id: 'old', name: 'Eski nohut tarifi', servings: 1,
      items: [{ id: 'chickpea', ref: { t: 'x', n: '16359' }, g: 100 }],
    }]));
  });
  await page.goto('/');
  await tab(page, 'tarif');
  await expect(page.locator('.ing')).toHaveCount(1);
  await expect(page.locator('.ing.missing')).toHaveCount(0);
  await expect(page.locator('.ing .ingredient-info > b')).toHaveText('Nohut (konserve, durulanmış)');
  await expect(page.locator('#recipe-summary [data-basic="energy"]')).toContainText('138');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('bm.recipes.v1'))[0].items[0].ref)).toEqual({ t: 'x', n: '16359' });
});

async function seedSettings(page, settings) {
  await page.addInitScript(settings => {
    if (!localStorage.getItem('bm.settings.v2')) {
      localStorage.setItem('bm.settings.v2', JSON.stringify({ version: 2, settings }));
    }
  }, settings);
}

async function blockExternalRequests(page) {
  await page.route('**/*', route => {
    const host = new URL(route.request().url()).hostname;
    return ['127.0.0.1', 'localhost'].includes(host) ? route.continue() : route.abort();
  });
}

async function pick(page, query, id) {
  const back = page.locator('[data-action="ex-back"]');
  if (await back.isVisible()) await back.click();
  await page.locator('#q').fill(query);
  await page.locator(`#foodlist [data-id="${id}"]`).click();
}

async function expectMicroFits(page) {
  const issues = await page.locator('.micro-overview').evaluate(box => {
    const outer = box.getBoundingClientRect(), issues = [];
    for (const row of box.querySelectorAll('.micro-row')) {
      const bounds = row.getBoundingClientRect();
      if (bounds.left < outer.left - 1 || bounds.right > outer.right + 1) issues.push(`${row.dataset.micro}: row outside overview`);
      const children = [...row.children].filter(child => child.getClientRects().length);
      for (const child of children) {
        const rect = child.getBoundingClientRect();
        if (rect.left < bounds.left - 1 || rect.right > bounds.right + 1) issues.push(`${row.dataset.micro}: ${child.className} outside row`);
      }
      for (let i = 0; i < children.length; i++) for (let j = i + 1; j < children.length; j++) {
        const a = children[i].getBoundingClientRect(), b = children[j].getBoundingClientRect();
        if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1) {
          issues.push(`${row.dataset.micro}: ${children[i].className}/${children[j].className} overlap`);
        }
      }
    }
    return issues;
  });
  expect(issues).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
}

for (const language of ['tr', 'en']) {
  test(`B142 mikro besinler ${language}: sıfır, veri boşluğu, kısmi toplam ve katkı akışları ayrılır`, async ({ page }) => {
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await seedSettings(page, { language });
    await blockExternalRequests(page);
    await page.goto('/');
    await pick(page, 'chickpea', 'nohut');
    await expect(micro(page, 'b12')).toHaveAttribute('data-micro-status', 'complete');
    await expect(micro(page, 'b12').locator('.micro-value')).toHaveText('0 µg');
    await expect(micro(page, 'b12').locator('.micro-meta')).toContainText(language === 'en' ? 'Assumed 0' : 'Varsayılan 0');
    await expect(micro(page, 'vita_rae').locator('.micro-ref')).toHaveText(language === 'en' ? 'No reference' : 'Referans yok');
    await expect(micro(page, 'vita_rae').locator('.micro-track')).toHaveCount(0); // RAE is not the EU RE unit.
    await page.locator('[data-action="ex-add-recipe"]').click();
    await page.locator('[data-action="ex-add-day"]').click();

    await pick(page, 'apple', 'elma');
    await page.locator('[data-action="ex-add-recipe"]').click();
    await page.locator('[data-action="ex-add-day"]').click();
    await pick(page, 'ristretto', 'ristretto');
    await expect(page.locator('.micro-overview [data-micro-status="missing"]')).toHaveCount(29);
    await expect(page.locator('.micro-overview .micro-track')).toHaveCount(0);
    await expect(micro(page, 'vitc').locator('.micro-value')).toHaveText(language === 'en' ? 'no data' : 'veri yok');
    await page.locator('[data-action="ex-add-recipe"]').click();
    await page.locator('[data-action="ex-add-day"]').click();

    await tab(page, 'tarif');
    await expect(micro(page, 'vitc')).toHaveAttribute('data-micro-status', 'partial');
    await expect(micro(page, 'vitc').locator('.micro-value')).toContainText('≥');
    await expect(micro(page, 'vitc').locator('.micro-meta')).toContainText('2/3');
    await reveal(page, '.micro-overview');
    await micro(page, 'vitc').locator('button').click();
    await expect(page.locator('#recipe-source-nutrient')).toHaveValue('vitc');
    await expect(page.locator('#recipe-source-rows .source-ingredients > li')).toHaveCount(3);
    await expect(page.locator('#recipe-source-rows .source-total')).toContainText('2/3');
    await page.locator('#recipe-source-nutrient').selectOption('fe');
    await expect(page.locator('#recipe-source-rows .source-total')).toContainText(language === 'en' ? 'Iron' : 'Demir');

    await tab(page, 'gunluk');
    await reveal(page, '[data-ux-details="diary-nutrients"]');
    await reveal(page, '.personal .micro-overview');
    await expect(micro(page, 'vitc')).toHaveAttribute('data-micro-status', 'partial');
    await reveal(page, '.micro-overview');
    await micro(page, 'vitc').locator('button').click();
    await expect(page.locator('#personal-source-key')).toHaveValue('vitc');
    await expect(page.locator('#personal-sources-content .source-ingredients > li')).toHaveCount(3);
    await page.locator('#personal-source-key').selectOption('fe');
    await expect(page.locator('#personal-sources-content')).toContainText(language === 'en' ? 'Chickpea' : 'Nohut');
    await page.locator('.micro-overview > summary').click();
    await expect(page.locator('.micro-overview')).not.toHaveAttribute('open');
    await tab(page, 'tarif');
    await expect(page.locator('.micro-overview')).not.toHaveAttribute('open');
    await reveal(page, '.micro-overview');
    await expectMicroFits(page);
    expect(errors).toEqual([]);
  });
}

test('B142 mikro satırları 320 px ve 28 px yazı/%200 ölçekte sığar; miktar gerçek değeri günceller', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await seedSettings(page, { language: 'en', fontSize: 28, uiScale: 200 });
  await blockExternalRequests(page);
  await page.goto('/');
  await pick(page, 'chickpea', 'nohut');
  await reveal(page, '.micro-overview');
  await expectMicroFits(page);
  await expect(micro(page, 'vitc').locator('.micro-value')).toHaveText('4 mg');
  await reveal(page, '[data-amount="ex"] .amount-options'); await page.locator('[data-amount="ex"] [data-delta="10"]').click();
  await expect(page.locator('[data-amount="ex"] .amt-val')).toContainText('110');
  await expect(micro(page, 'vitc').locator('.micro-value')).toHaveText('4.4 mg');
  await reveal(page, '.micro-overview');
  await expectMicroFits(page);
  await page.locator('[data-action="ex-add-recipe"]').click();
  await tab(page, 'tarif');
  await reveal(page, '.micro-overview');
  await expectMicroFits(page);
  await micro(page, 'vitc').locator('button').click();
  await expect(page.locator('#recipe-source-nutrient')).toHaveValue('vitc');
  await expect(page.locator('#recipe-source-rows .source-total')).toContainText('4.4 mg');
});

test('B142 tam katalog ayar kapalıyken erişilir; sayfa, grup, NDB arama ve kayıt yeniden açılır', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await seedSettings(page, { language: 'tr', showExt: false });
  await blockExternalRequests(page);
  await page.goto('/');
  await category(page, 'ext');
  await expect(page.locator('#foodlist .food.ext')).toHaveCount(80);
  const first = await page.locator('#foodlist .food.ext').first().getAttribute('data-ndb');
  await page.locator('[data-action="ex-extpage"][data-page="1"]').click();
  await expect(page.locator('#foodlist .food.ext').first()).not.toHaveAttribute('data-ndb', first);
  await expect(page.locator('.catalog-pages [role="status"]')).toContainText('Sayfa 2');
  await page.locator('#ex-extgroup').selectOption('0600');
  await expect(page.locator('.catalog-pages [role="status"]')).toContainText('Sayfa 1');
  await page.locator('#q').fill('06190');
  await expect(page.locator('#foodlist .food.ext')).toHaveCount(1);
  const name = await page.locator('#foodlist .food.ext .fn').innerText();
  await page.locator('#foodlist .food.ext').click();
  await expect(page.locator('#matrix .idcard')).toContainText('NDB 06190');
  await page.locator('[data-action="ex-add-recipe"]').click();
  await page.reload();
  await tab(page, 'tarif');
  await expect(page.locator('.ing .ingredient-info > b')).toHaveText(name);
  await expect(page.locator('.ing.missing')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('B142 yalnız koleksiyonda saklanan USDA kaydı katalog ayarı kapalıyken normal yoldan açılır', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await seedSettings(page, { language: 'tr', showExt: false });
  await page.addInitScript(() => {
    localStorage.setItem('bm.collections.v1', JSON.stringify([
      { id: 'saved-soup', name: 'Kaydedilen çorba', items: [{ t: 'x', n: '06190' }] },
    ]));
  });
  await blockExternalRequests(page);
  await page.goto('/');
  // There is no extended-catalog recipe/day entry to trigger eager loading.
  await category(page, 'col:saved-soup');
  const saved = page.locator('#foodlist [data-action="ex-pick-ref"]');
  await expect(saved).toBeVisible();
  await expect(page.locator('#foodlist .missing-ref')).toHaveCount(0);
  await saved.click();
  await expect(page.locator('#matrix .idcard')).toContainText('NDB 06190');
  expect(errors).toEqual([]);
});

test.describe('B142 katalog yükleme hatası', () => {
  test.use({ serviceWorkers: 'block' });
  test('yükleme reddedildiğinde hata ve yeniden yükleme görünür; önceki tarif korunur', async ({ page }) => {
    await seedSettings(page, { language: 'tr', showExt: false });
    await blockExternalRequests(page);
    let rejectCatalog = true, blocked = 0;
    // Both the production chunk and Vite's development JSON module use this name.
    await page.route(/\/foods-ext(?:-[^/?]+\.js|\.json)(?:\?.*)?$/, route => {
      if (rejectCatalog) { blocked++; return route.abort('failed'); }
      return route.continue();
    });
    await page.goto('/');
    await pick(page, 'nohut', 'nohut');
    await page.locator('[data-action="ex-add-recipe"]').click();
    const back = page.locator('[data-action="ex-back"]');
    if (await back.isVisible()) await back.click();
    await category(page, 'ext');
    await expect(page.locator('#foodlist [role="alert"]')).toContainText('USDA kataloğu yüklenemedi');
    expect(blocked).toBeGreaterThan(0);
    rejectCatalog = false;
    await page.locator('[data-action="ext-reload"]').click();
    await category(page, 'ext');
    await expect(page.locator('#foodlist .food.ext')).toHaveCount(80);
    await expect(page.locator('#foodlist [role="alert"]')).toHaveCount(0);
    await tab(page, 'tarif');
    await expect(page.locator('.ing .ingredient-info > b')).toHaveText('Nohut');
    await expect(page.locator('.ing .ingredient-amount')).toContainText('100 g');
  });
});

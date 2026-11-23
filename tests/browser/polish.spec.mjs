import { category, reveal, tab } from './navigation.mjs';
import { test, expect } from '@playwright/test';

const widths = [320, 390, 768, 1440];
const backToList = async page => {
  const back = page.locator('[data-action="ex-back"]');
  if (await back.isVisible()) await back.click();
};

async function blockExternalRequests(page) {
  await page.route('**/*', route => {
    const { hostname } = new URL(route.request().url());
    return ['127.0.0.1', 'localhost'].includes(hostname) ? route.continue() : route.abort();
  });
}

async function expectCardFits(card) {
  const issues = await card.evaluate(box => {
    const rect = el => el.getBoundingClientRect();
    const shown = el => el.getClientRects().length && rect(el).width > 0 && rect(el).height > 0;
    const parent = rect(box), owner = rect(box.parentElement), problems = [];
    if (parent.left < owner.left - 1 || parent.right > owner.right + 1) problems.push('card outside layout');
    for (const el of box.querySelectorAll('button, input, output, .ingredient-info > b, .ingredient-info > .muted, .cmp-h > b, .cmp-h > .muted')) {
      if (!shown(el)) continue;
      const r = rect(el);
      if (r.left < parent.left - 1 || r.right > parent.right + 1 || r.top < parent.top - 1 || r.bottom > parent.bottom + 1) problems.push(`outside: ${el.outerHTML.slice(0, 100)}`);
    }
    for (const selector of ['.ingredient-line', '.cmp-h', '.amount.mini', '.amt-main']) {
      const group = box.querySelector(selector);
      if (!group) continue;
      const children = [...group.children].filter(shown);
      for (let i = 0; i < children.length; i++) for (let j = i + 1; j < children.length; j++) {
        const a = rect(children[i]), b = rect(children[j]);
        if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1) problems.push(`overlap: ${selector} ${children[i].tagName}/${children[j].tagName}`);
      }
    }
    return problems;
  });
  expect(issues).toEqual([]);
}

test('eski favori ve son bakılan kayıtları açılır, kaydedilir ve yeniden açıldığında korunur', async ({ page }) => {
  await blockExternalRequests(page);
  await page.addInitScript(() => {
    if (localStorage.getItem('audit.seeded')) return;
    localStorage.setItem('audit.seeded', 'true');
    localStorage.setItem('bm.settings.v2', JSON.stringify({ version: 2, settings: { language: 'tr', showRecent: true } }));
    localStorage.setItem('bm.recent.v1', JSON.stringify([{ t: 'c', id: 'kudret_narı', f: 0 }]));
    localStorage.setItem('bm.collections.v1', JSON.stringify([{ id: 'saved', name: 'Favorilerim', items: [{ t: 'c', id: 'kudret_narı', f: 0 }] }]));
  });
  await page.goto('/');
  const recent = page.locator('.recent [data-action="ex-pick-ref"]');
  await expect(recent).toContainText('Kudret narı');
  await recent.click();
  await expect(page.locator('#matrix .idcard')).toContainText('Kudret narı');
  await backToList(page);
  await category(page, 'col:saved');
  await expect(page.locator('#foodlist .missing-ref')).toHaveCount(0);
  await page.locator('#foodlist [data-action="ex-pick-ref"]').click();
  await expect(page.locator('#matrix .idcard')).toContainText('Kudret narı');
  await backToList(page);
  await category(page, 'col:saved');
  await page.locator('[data-action="col-rename"][data-id="saved"]').click();
  await page.locator('.dlg input').fill('Kaydedilen favoriler');
  await page.locator('.dlg [data-r="1"]').click();
  await page.reload();
  await category(page, 'col:saved');
  await expect(page.locator('#foodlist')).toContainText('Kaydedilen favoriler');
  await expect(page.locator('#foodlist [data-action="ex-pick-ref"]')).toContainText('Kudret narı');
  expect(await page.evaluate(() => ({
    collection: JSON.parse(localStorage.getItem('bm.collections.v1'))[0].items[0].id,
    recent: JSON.parse(localStorage.getItem('bm.recent.v1'))[0].id,
  }))).toEqual({ collection: 'kudret_nari', recent: 'kudret_nari' });
});

for (const large of [false, true]) {
  test(`tarif kontrolleri ${large ? '28 px yazı ve %200 ölçekte' : 'normal ölçekte'} sığar ve gerçek miktarı değiştirir`, async ({ page }) => {
    await blockExternalRequests(page);
    await page.addInitScript(({ large }) => {
      if (localStorage.getItem('audit.seeded')) return;
      localStorage.setItem('audit.seeded', 'true');
      localStorage.setItem('bm.settings.v2', JSON.stringify({ version: 2, settings: { language: 'tr', fontSize: large ? 28 : 17, uiScale: large ? 200 : 100 } }));
      localStorage.setItem('bm.recipes.v1', JSON.stringify([{ id: 'audit', name: 'Nohutlu öğle yemeği', servings: 3, items: [{ id: 'n', ref: { t: 'c', id: 'nohut', f: 0 }, g: 100 }, { id: 't', ref: { t: 'c', id: 'tahin', f: 0 }, g: 250 }] }]));
    }, { large });
    for (const width of widths) {
      await page.setViewportSize({ width, height: 950 });
      await page.goto('/');
      await tab(page, 'tarif');
      const card = page.locator('.ing').first();
      await card.scrollIntoViewIfNeeded();
      await expectCardFits(card);
      await card.locator('[data-action="ing-open"]').click();
      const before = Number((await card.locator('.amt-val b').textContent()).replace(',', '.'));
      await card.locator('[data-delta="-10"]').click();
      await expect(card.locator('.amt-val b')).toHaveText(String(before - 10));
      await expectCardFits(card);
      await card.locator('.presets > [data-action="amt"][data-val="500"]').click();
      await expect(card.locator('.amt-val b')).toHaveText('500');
      await card.locator('[data-action="ing-open"]').click();
      await expectCardFits(card);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `recipe ${width}px`).toBe(true);
      await page.waitForTimeout(350); // miktar kaydının mevcut 300 ms gecikmesini tamamla
      await page.reload();
      await tab(page, 'tarif');
      await expect(page.locator('.ing').first().locator('.ingredient-amount')).toHaveText('500 g');
    }
  });

  test(`karşılaştırma kontrolleri ${large ? '28 px yazı ve %200 ölçekte' : 'normal ölçekte'} sığar ve tabloyu günceller`, async ({ page }) => {
    await blockExternalRequests(page);
    await page.addInitScript(({ large }) => {
      localStorage.setItem('bm.settings.v2', JSON.stringify({ version: 2, settings: { language: 'tr', fontSize: large ? 28 : 17, uiScale: large ? 200 : 100 } }));
    }, { large });
    for (const width of widths) {
      await page.setViewportSize({ width, height: 950 });
      await page.goto('/');
      for (const id of ['nohut', 'tahin']) {
        await page.locator('#q').fill(id);
        await page.locator(`#foodlist [data-id="${id}"]`).click();
        await reveal(page, '.food-tools'); await page.locator('[data-action="ex-add-compare"]').click();
        await backToList(page);
      }
      await tab(page, 'karsilastir');
      const card = page.locator('.cmp-col').first();
      await card.scrollIntoViewIfNeeded();
      await expectCardFits(card);
      const before = Number((await card.locator('.amt-val b').textContent()).replace(',', '.'));
      await card.locator('[data-delta="-10"]').click();
      await expect(card.locator('.amt-val b')).toHaveText(String(before - 10));
      await card.locator('[data-action="ing-open"]').click();
      await expectCardFits(card);
      await card.locator('.presets > [data-action="amt"][data-val="200"]').click();
      await expect(card.locator('.amt-val b')).toHaveText('200');
      await expect(page.locator('.compare-basic-wrap table.cmp .cmp-food').first()).toContainText('200 g');
      await card.locator('[data-action="ing-open"]').click();
      await expectCardFits(card);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `comparison ${width}px`).toBe(true);
    }
  });
}

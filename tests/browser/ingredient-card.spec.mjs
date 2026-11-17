import { test, expect } from '@playwright/test';

// Kaan'ın ekran görüntüsü (B156): tarif malzeme kartında ↓ ve ✕ üst üste biniyor, kart altında boşluk kalıyordu.
const addFood = async (page, q, id) => {
  await page.locator('#q').fill(q);
  await page.locator(`#foodlist [data-id="${id}"]`).first().click();
  await page.locator('[data-action="ex-add-recipe"]').first().click();
  if (await page.locator('[data-action="ex-back"]').isVisible()) await page.locator('[data-action="ex-back"]').click();
};

for (const width of [1280, 1024, 820, 390, 320]) {
  test(`tarif malzeme kartı: düğmeler üst üste binmez, açılan kart komşusunu uzatmaz (${width}px, B156)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await addFood(page, 'nohut', 'nohut');
    await addFood(page, 'ıspanak', 'ispanak');
    await addFood(page, 'elma', 'elma');
    await page.locator('[data-action="tab"][data-tab="tarif"]').first().click();
    await page.locator('[data-action="ing-open"]').nth(1).click();
    const cards = await page.locator('.ing').evaluateAll((els) => els.map((ing) => {
      const r = (e) => e.getBoundingClientRect();
      const btns = [...ing.querySelectorAll('.ing-h .btn')].map(r);
      let overlap = false;
      for (let i = 0; i < btns.length; i++) for (let j = i + 1; j < btns.length; j++) {
        const a = btns[i], b = btns[j];
        if (a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1) overlap = true;
      }
      const inside = btns.every((b) => b.right <= r(ing).right + 0.5 && b.left >= r(ing).left - 0.5);
      const kids = [...ing.querySelectorAll('*')].filter((e) => r(e).height > 0);
      const emptyBelow = r(ing).bottom - Math.max(...kids.map((e) => r(e).bottom));
      return { overlap, inside, emptyBelow, h: r(ing).height };
    }));
    expect(cards).toHaveLength(3);
    for (const c of cards) { expect(c.overlap).toBe(false); expect(c.inside).toBe(true); expect(c.emptyBelow).toBeLessThan(40); }
    expect(Math.abs(cards[0].h - cards[2].h)).toBeLessThan(2); // açılan ortadaki kart diğerlerini uzatmaz
    // ✕ gerçek tıklamayla doğru malzemeyi siler
    await page.locator('.ing').first().locator('[data-action="rc-del-item"]').click();
    await expect(page.locator('.ing')).toHaveCount(2);
  });
}

test('B156 yeni besinler: sosisli, suşi, buzlu mocha aranır; hayvansallar gizlenince bitkisel olanlar kalır', async ({ page }) => {
  await page.goto('/');
  for (const [q, id] of [['sosisli', 'sosisli'], ['suşi', 'sebzeli_susi'], ['mocha', 'buzlu_mocha_bitkisel'], ['pretzel', 'pretzel'], ['burrito', 'fasulyeli_burrito']]) {
    await page.locator('#q').fill(q);
    await expect(page.locator(`#foodlist [data-id="${id}"]`), q).toHaveCount(1);
  }
});

test('seitan: ölçülmemiş B vitaminleri "Varsayılan 0" etiketiyle (B158)', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('seitan');
  await page.locator('#foodlist [data-id="seitan"]').first().click();
  await expect(page.locator('#matrix .src-z').first()).toContainText('Varsayılan 0');
});

test('B162 boş günde bileşen matrisi yerine kısa yönlendirme; besin eklenince matris gelir. Tarif kopyala/sil tarifin başlığında', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-action="tab"][data-tab="gunluk"]').first().click();
  await expect(page.locator('.day-empty')).toBeVisible();
  await expect(page.locator('.personal-section')).toHaveCount(0);
  await page.locator('[data-action="tab"][data-tab="kesfet"]').first().click();
  await page.locator('#q').fill('nohut'); await page.locator('#foodlist [data-id="nohut"]').first().click();
  await page.locator('[data-action="ex-add-day"]').first().click();
  await page.locator('[data-action="tab"][data-tab="gunluk"]').first().click();
  await expect(page.locator('.day-empty')).toHaveCount(0);
  expect(await page.locator('.personal-section').count()).toBeGreaterThan(3);
  await page.locator('[data-action="tab"][data-tab="tarif"]').first().click();
  await expect(page.locator('.rhead [data-action="rc-delete"]')).toHaveText('Tarifi sil');
  await expect(page.locator('.rlist [data-action="rc-delete"]')).toHaveCount(0);
});

test('B163 enerji "ikisi" kcal ile kJ birlikte; "Varsayılana dön" onay ister, Vazgeç ayarları korur', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('muz'); await page.locator('#foodlist [data-id="muz"]').click();
  await expect(page.locator('#matrix [data-basic="energy"]')).toContainText('kcal');
  await expect(page.locator('#matrix [data-basic="energy"]')).toContainText('kJ');
  await page.locator('[data-action="tab"][data-tab="ayarlar"]').first().click();
  await page.locator('[data-k="energyUnit"][data-v=\'"kcal"\']').click();
  await page.locator('[data-action="preset"][data-p="reset"]').click();
  await expect(page.locator('.dlg [role="alertdialog"]')).toBeVisible();
  await page.locator('.dlg [data-r="0"]').click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('bm.settings.v2') || '{}').settings?.energyUnit)).toBe('kcal');
  await page.goto('/');
  await page.locator('#q').fill('muz'); await page.locator('#foodlist [data-id="muz"]').click();
  await expect(page.locator('#matrix [data-basic="energy"]')).not.toContainText('kJ');
  await page.locator('[data-action="tab"][data-tab="ayarlar"]').first().click();
  await page.locator('[data-action="preset"][data-p="reset"]').click();
  await page.locator('.dlg [data-r="1"]').click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('bm.settings.v2') || '{}').settings?.energyUnit)).toBe('both');
});

test('B164 1000 g sınırı sessizce kırpılmaz: tarifte birikince ve +10 ile bildirim', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('muz'); await page.locator('#foodlist [data-id="muz"]').click();
  await page.locator('[data-amount="ex"] [data-action="amt"][data-val="750"]').click();
  await page.locator('[data-action="ex-add-recipe"]').click();
  await page.locator('[data-action="ex-add-recipe"]').click();
  await expect(page.locator('.toast')).toContainText('1000 g');
  const g = await page.evaluate(() => JSON.parse(localStorage.getItem('bm.recipes.v1'))[0].items[0].g);
  expect(g).toBe(1000);
  await page.locator('[data-amount="ex"] [data-action="amt"][data-val="1000"]').click();
  await page.locator('[data-amount="ex"] [data-action="nudge"][data-delta="10"]').click();
  await expect(page.locator('.toast')).toContainText('En fazla 1000 g');
  await expect(page.locator('[data-amount="ex"] .amt-val b')).toHaveText('1.000');
});

test('B165 koleksiyondaki geniş katalog kaydı vegan süzgeçte kaybolmaz, katalog yüklenince açılır; sınır mesajları nedenini söyler', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('bm.settings.v2', JSON.stringify({ version: 2, settings: { language: 'tr', dietPattern: 'vegan', showExt: false } }));
    const many = Array.from({ length: 60 }, (_, i) => ({ id: 'c' + i, name: 'K' + i, items: i === 0 ? [{ t: 'x', n: '09427' }] : [] }));
    localStorage.setItem('bm.collections.v1', JSON.stringify(many));
  });
  await page.goto('/');
  await page.locator('[data-action="ex-cat"][data-cat="col:c0"]').first().click();
  await expect(page.locator('#foodlist [data-action="ex-pick-ref"]')).toHaveCount(1, { timeout: 15000 });
  await expect(page.locator('#foodlist .pending-ref')).toHaveCount(0);
  await page.locator('[data-action="col-sub"][data-id="c0"]').click();
  await page.locator('.dlg .dlg-line').fill('Alt');
  await page.locator('.dlg [data-r="1"]').click();
  await expect(page.locator('.toast')).toContainText('En fazla 60 koleksiyon');
});

test('B166 başka sekmede değişen ayar bu sekmeye gelir; eski ayarla üzerine yazılmaz', async ({ page, context }) => {
  await page.goto('/');
  const other = await context.newPage(); await other.goto('/');
  await other.evaluate(() => { const s = JSON.parse(localStorage.getItem('bm.settings.v2')); s.settings.theme = 'dark'; localStorage.setItem('bm.settings.v2', JSON.stringify(s)); });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('[data-action="tab"][data-tab="ayarlar"]').first().click();
  await page.locator('[data-k="energyUnit"][data-v=\'"kcal"\']').click();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('bm.settings.v2')).settings);
  expect(saved.theme).toBe('dark'); expect(saved.energyUnit).toBe('kcal');
});

test('B168 gram kaydırıcısı: sol yarı 1–250 g, dokunuşla küçük miktar seçilir, hazır miktarla konum eşleşir, tarifte 44 px', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('muz'); await page.locator('#foodlist [data-id="muz"]').click();
  const sl = page.locator('[data-amount="ex"] .slider');
  await page.locator('[data-amount="ex"] [data-action="amt"][data-val="250"]').click();
  await expect(sl).toHaveValue(/^(499|500)$/); // √(249/999) = 0,499 → 250 g
  await sl.fill('100'); // %10 konum
  await expect(page.locator('[data-amount="ex"] .amt-val b')).toHaveText('11');
  await expect(sl).toHaveAttribute('aria-valuetext', '11 g');
  await sl.focus(); await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-amount="ex"] .amt-val b')).toHaveText('11');
  await sl.fill('1000');
  await expect(page.locator('[data-amount="ex"] .amt-val b')).toHaveText('1.000');
  await page.locator('[data-action="ex-add-recipe"]').click();
  await page.locator('[data-action="tab"][data-tab="tarif"]').first().click();
  await page.locator('[data-action="ing-open"]').first().click();
  const h = await page.locator('[data-amount^="rc:"] .slider').evaluate((e) => e.getBoundingClientRect().height);
  expect(h).toBeGreaterThanOrEqual(44);
});

test('B169 Aion baloncuğu kontrolleri yutmaz; telefonda kaydırınca Aion kenara çekilip dokunuşu geçirir', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.addInitScript(() => { localStorage.setItem('bm.aionOffV1', '1'); localStorage.setItem('bm.settings.v2', JSON.stringify({ version: 2, settings: { language: 'tr', aionEnabled: true, aionTips: true } })); });
  await page.goto('/');
  await page.locator('#q').fill('muz'); await page.locator('#foodlist [data-id="muz"]').click();
  const bubble = page.locator('.aion-bubble');
  await page.locator('.aion-body').click();
  await expect(bubble).toBeVisible();
  // Baloncuğun ortasındaki nokta Aion'a değil alttaki sayfaya aittir
  const hit = await bubble.evaluate((b) => { const r = b.getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !!e && !e.closest('.aion'); });
  expect(hit).toBe(true);
  await page.locator('#q').evaluate(() => document.querySelector('.slider')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
  await expect(bubble).toBeHidden();
  await page.mouse.wheel(0, 300);
  await expect(page.locator('#aion')).toHaveClass(/aion-tucked/);
  const through = await page.locator('.aion-body').evaluate((b) => { const r = b.getBoundingClientRect(); const x = Math.min(innerWidth - 2, r.left + r.width / 2); const e = document.elementFromPoint(x, r.top + r.height / 2); return !!e && !e.closest('.aion'); });
  expect(through).toBe(true);
  await expect(page.locator('#aion')).not.toHaveClass(/aion-tucked/, { timeout: 5000 });
});

test('B169 ölçek etiketleri: 320 px normal yazıda dördü çakışmadan görünür, 28 px + %200 ölçekte yalnız uçlar', async ({ page }) => {
  const check = async (fs, sc, n) => {
    await page.addInitScript(([fs, sc]) => localStorage.setItem('bm.settings.v2', JSON.stringify({ version: 2, settings: { language: 'tr', fontSize: fs, uiScale: sc } })), [fs, sc]);
    await page.goto('/'); await page.locator('#q').fill('muz'); await page.locator('#foodlist [data-id="muz"]').click();
    const r = await page.evaluate(() => { const sp = [...document.querySelectorAll('[data-amount="ex"] .slider-scale span')].map((e) => e.getBoundingClientRect()).filter((r) => r.width); return { shown: sp.length, ov: sp.some((a, i) => i && a.left < sp[i - 1].right + 2) }; });
    expect(r).toEqual({ shown: n, ov: false });
  };
  await page.setViewportSize({ width: 320, height: 800 });
  await check(18, 100, 4);
  await check(28, 200, 2);
});

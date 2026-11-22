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

test('B164 + B197 üst sınır (10 kg) sessizce kırpılmaz: tarifte birikince ve +10 ile bildirim', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('muz'); await page.locator('#foodlist [data-id="muz"]').click();
  await page.locator('[data-amount="ex"] details.amt-more > summary').click();
  await page.locator('[data-amount="ex"] [data-action="amt"][data-val="5000"]').click();
  await expect(page.locator('[data-amount="ex"] [data-action="amt"][data-val="5000"]')).toHaveText('5 kg');
  await page.locator('[data-action="ex-add-recipe"]').click();
  await page.locator('[data-action="ex-add-recipe"]').click();
  await page.locator('[data-action="ex-add-recipe"]').click();
  await expect(page.locator('.toast')).toContainText('10.000 g');
  const g = await page.evaluate(() => JSON.parse(localStorage.getItem('bm.recipes.v1'))[0].items[0].g);
  expect(g).toBe(10000);
  await page.locator('[data-amount="ex"] [data-action="amt"][data-val="10000"]').click();
  await page.locator('[data-amount="ex"] [data-action="nudge"][data-delta="10"]').click();
  await expect(page.locator('.toast')).toContainText('En fazla 10.000 g');
  await expect(page.locator('[data-amount="ex"] .amt-val b')).toHaveText('10.000');
});

test('B168 + B197 gram kaydırıcısı: küp ölçek (1 g – 10 kg), dokunuşla küçük miktar seçilir, hazır miktarla konum eşleşir, tarifte 44 px', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('muz'); await page.locator('#foodlist [data-id="muz"]').click();
  const sl = page.locator('[data-amount="ex"] .slider');
  await page.locator('[data-amount="ex"] [data-action="amt"][data-val="250"]').click();
  await expect(sl).toHaveValue('292'); // B197 küp ölçek: (249/9999)^(1/3) = 0,292 → 250 g
  await sl.fill('100'); // %10 konum
  await expect(page.locator('[data-amount="ex"] .amt-val b')).toHaveText('11');
  await expect(sl).toHaveAttribute('aria-valuetext', '11 g');
  await sl.focus(); await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-amount="ex"] .amt-val b')).toHaveText('11');
  await sl.fill('1000');
  await expect(page.locator('[data-amount="ex"] .amt-val b')).toHaveText('10.000');
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
  await page.evaluate(() => window.scrollBy(0, 300)); // mobil WebKit'te mouse.wheel yok; kaydırma olayı aynı
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

test('B170 miktar düğmeleri 320 px telefonda tek satırda (+10 alta düşmez); 1000 g taşmaz', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/'); await page.locator('#q').fill('muz'); await page.locator('#foodlist [data-id="muz"]').click();
  for (const g of ['100', '1000']) {
    await page.locator(`[data-amount="ex"] [data-action="amt"][data-val="${g}"]`).click();
    const r = await page.evaluate(() => { const n = [...document.querySelectorAll('[data-amount="ex"] .amt-main > .nudge')].map((e) => Math.round(e.getBoundingClientRect().top)); const v = document.querySelector('[data-amount="ex"] .amt-val'); return { tops: new Set(n).size, over: v.scrollWidth > v.clientWidth + 1, doc: document.documentElement.scrollWidth <= innerWidth + 1 }; });
    expect(r).toEqual({ tops: 1, over: false, doc: true });
  }
});

test('B173 koleksiyon öğesi alt kategoriye taşınır; hedefte varsa kopya oluşmaz', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('bm.collections.v1', JSON.stringify([{ id: 'a', name: 'Kahvaltı', items: [{ t: 'c', id: 'muz', f: 0 }, { t: 'c', id: 'nohut', f: 0 }] }, { id: 'b', name: 'Meyveler', parent: 'a', items: [{ t: 'c', id: 'nohut', f: 0 }] }])));
  await page.goto('/');
  await page.locator('[data-action="ex-cat"][data-cat="col:a"]').first().click();
  const store = () => page.evaluate(() => JSON.parse(localStorage.getItem('bm.collections.v1')).map((c) => [c.id, c.items.map((i) => i.id)]));
  await page.locator('[data-col-transfer="a"]').first().selectOption('b');
  await expect(page.locator('.toast')).toContainText('Meyveler');
  expect(await store()).toEqual([['a', ['nohut']], ['b', ['nohut', 'muz']]]);
  await page.locator('[data-col-transfer="a"]').first().selectOption('b');
  await expect(page.locator('.toast')).toContainText('zaten vardı');
  expect(await store()).toEqual([['a', []], ['b', ['nohut', 'muz']]]);
});

test('B174 ilk açılışta arama kutusu ilk ekranda ve diyet süzgecinden önce (iPhone SE boyu)', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  const r = await page.evaluate(() => {
    const q = document.querySelector('#q').getBoundingClientRect();
    const nav = document.querySelector('.tabs').getBoundingClientRect();
    const diet = document.querySelector('.list select, .list [class*="diet"]');
    const before = diet ? !!(document.querySelector('#q').compareDocumentPosition(diet) & Node.DOCUMENT_POSITION_FOLLOWING) : true;
    return { visible: q.bottom <= Math.min(innerHeight, nav.top > 0 ? nav.top : innerHeight), before };
  });
  expect(r).toEqual({ visible: true, before: true });
});

test('B175 telefonda Günlük Toplam başlığı tek satır, tarif kartları eşit genişlikte', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.addInitScript(() => localStorage.setItem('bm.recipes.v1', JSON.stringify([{ id: 'a', name: 'Kahvaltı', servings: 1, items: [{ id: 'i1', ref: { t: 'c', id: 'muz', f: 0 }, g: 120 }] }, { id: 'b', name: 'Öğle', servings: 1, items: [{ id: 'i3', ref: { t: 'c', id: 'nohut', f: 0 }, g: 80 }] }, { id: 'c', name: 'Akşam', servings: 1, items: [{ id: 'i4', ref: { t: 'c', id: 'elma', f: 0 }, g: 80 }] }])));
  await page.goto('/'); await page.evaluate(() => document.fonts.ready);
  await page.locator('[data-action="tab"][data-tab="tarif"]').first().click();
  await page.locator('[data-action="rc-daily-total"]').click();
  const r = await page.evaluate(() => {
    const h = document.querySelector('.daily-recipe-header h1'); const lh = parseFloat(getComputedStyle(h).lineHeight);
    const items = [...document.querySelectorAll('.rlist-item:not(.daily-total-entry)')].map((e) => e.getBoundingClientRect());
    const rows = {}; for (const b of items) (rows[Math.round(b.top)] ||= []).push(Math.round(b.width));
    const uneven = Object.values(rows).some((ws) => ws.length > 1 && Math.max(...ws) - Math.min(...ws) > 2);
    return { oneLine: h.getBoundingClientRect().height < lh * 1.5, uneven };
  });
  expect(r).toEqual({ oneLine: true, uneven: false });
});

test('B176 Aion kapalıyken işlemeyen seçenekler gösterilmez; açınca gelir', async ({ page }) => {
  await page.addInitScript(() => { localStorage.setItem('bm.aionOffV1', '1'); localStorage.setItem('bm.settings.v2', JSON.stringify({ version: 2, settings: { language: 'tr', aionEnabled: false } })); });
  await page.goto('/');
  await page.locator('[data-action="tab"][data-tab="ayarlar"]').first().click();
  const sec = page.locator('.aion-settings');
  await expect(sec.locator('[data-k="aionSize"]')).toHaveCount(0);
  await expect(sec.locator('[data-action="aion-demo"]')).toHaveCount(0);
  await sec.locator('label.toggle:has(input[data-setbool="aionEnabled"])').click();
  await expect(sec.locator('[data-k="aionSize"]')).toHaveCount(3);
  await expect(sec.locator('[data-action="aion-demo"]')).toBeVisible();
  await sec.locator('[data-action="aion-demo"]').click();
  await expect(page.locator('#aion .aion-bubble')).toBeVisible();
});

test('B177 telefonda Kıyasla kartları kısa; Keşfet sekmesine yeniden dokunmak listeye döndürür (arama korunur)', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  for (const id of ['muz', 'nohut', 'elma']) {
    if (await page.locator('[data-action="ex-back"]').isVisible()) await page.locator('[data-action="tab"][data-tab="kesfet"]').first().click();
    await page.locator('#q').fill(id); await page.locator(`#foodlist [data-id="${id}"]`).click();
    await page.locator('[data-action="ex-add-compare"]').click();
  }
  await page.locator('[data-action="tab"][data-tab="kesfet"]').first().click();
  await expect(page.locator('#q')).toBeVisible();
  await expect(page.locator('#q')).toHaveValue('elma');
  await page.locator('[data-action="tab"][data-tab="karsilastir"]').first().click();
  const r = await page.evaluate(() => ({ h: [...document.querySelectorAll('.cmp-col')].map((e) => e.getBoundingClientRect().height), row: (() => { const m = document.querySelector('.cmp-col .amount.mini'); const n = [...m.querySelectorAll('.nudge')].map((e) => Math.round(e.getBoundingClientRect().top)); const v = Math.round(m.querySelector('.amt-val').getBoundingClientRect().top); return new Set(n).size === 1 && Math.abs(n[0] - v) < 20; })() }));
  expect(r.h.length).toBe(3);
  expect(Math.max(...r.h)).toBeLessThan(220);
  expect(r.row).toBe(true);
});

test('B178 yana kayan tablolar devam gölgesi taşır; ilk sütun kayarken yerinde kalır', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  for (const id of ['muz', 'nohut']) {
    if (await page.locator('[data-action="ex-back"]').isVisible()) await page.locator('[data-action="tab"][data-tab="kesfet"]').first().click();
    await page.locator('#q').fill(id); await page.locator(`#foodlist [data-id="${id}"]`).click();
    await page.locator('[data-action="ex-add-compare"]').click();
  }
  await page.locator('[data-action="tab"][data-tab="karsilastir"]').first().click();
  const wrap = page.locator('#cmp-table .tablewrap');
  await expect(wrap).toBeVisible();
  const r = await wrap.evaluate((e) => { const cs = getComputedStyle(e); const before = e.querySelector('tbody th[scope="row"]').getBoundingClientRect().left; e.scrollLeft = 120; const after = e.querySelector('tbody th[scope="row"]').getBoundingClientRect().left; return { scrolls: e.scrollWidth > e.clientWidth, grads: (cs.backgroundImage.match(/linear-gradient/g) || []).length, local: cs.backgroundAttachment.includes('local'), sticky: Math.abs(after - before) < 2 }; });
  expect(r).toEqual({ scrolls: true, grads: 2, local: true, sticky: true });
});

test('B179 Kıyasla telefonda Temel besin değerleriyle açılır, masaüstünde Tümü', async ({ page }, info) => {
  const phone = (page.viewportSize()?.width || 1280) <= 600;
  await page.goto('/');
  for (const id of ['muz', 'nohut']) {
    if (await page.locator('[data-action="ex-back"]').isVisible()) await page.locator('[data-action="tab"][data-tab="kesfet"]').first().click();
    await page.locator('#q').fill(id); await page.locator(`#foodlist [data-id="${id}"]`).click();
    await page.locator('[data-action="ex-add-compare"]').click();
  }
  await page.locator('[data-action="tab"][data-tab="karsilastir"]').first().click();
  await expect(page.locator(`[data-action="cmp-sec"][data-s="${phone ? 'temel' : 'all'}"]`)).toHaveClass(/\bon\b/);
  const h = await page.locator('#cmp-table .tablewrap').evaluate((e) => e.getBoundingClientRect().height);
  if (phone) expect(h).toBeLessThan(1500); else expect(h).toBeGreaterThan(1500);
});

test('B180 Bilgi ekranı kısa: veri dürüstlüğü açık, kaynaklar ve lisanslar katlanır (sayılarıyla), içerik kaybolmaz', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  await page.locator('[data-action="tab"][data-tab="hakkinda"]').first().click();
  const about = page.locator('.about');
  await expect(about.getByRole('heading', { name: 'Veri dürüstlüğü' })).toBeVisible();
  const more = about.locator('details.about-more');
  await expect(more).toHaveCount(2);
  for (const d of await more.all()) expect(await d.getAttribute('open')).toBeNull();
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThan(3000);
  await expect(more.first().locator('summary .cnt')).toHaveText(/^\d+$/);
  await more.first().locator('summary').click();
  await expect(about).toContainText('FoodData Central');
  await expect(more.first().locator('li').first()).toBeVisible();
});

test('B181 Ayarlar bölüm şeridi: her karta atlar, aramada gizlenen kartın düğmesi de gizlenir', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  await page.locator('[data-action="tab"][data-tab="ayarlar"]').first().click();
  const chips = page.locator('.settings-toc [data-action="settings-jump"]');
  expect(await chips.count()).toBe(await page.locator('.settings > [id^="set-"]').count());
  await chips.filter({ hasText: 'Yedekleme' }).click();
  const top = await page.locator('.settings h2', { hasText: 'Yedekleme' }).evaluate((e) => e.getBoundingClientRect().top);
  expect(top).toBeGreaterThanOrEqual(0); expect(top).toBeLessThan(300);
  await page.locator('#settings-q').fill('aion');
  await expect(chips.filter({ hasText: 'Aion' })).toBeVisible();
  await expect(chips.filter({ hasText: 'Yedekleme' })).toBeHidden();
});

test('B182 telefonda yazı tipi kartları iki sütun, adlar sözcük ortasından bölünmez, seçili tam genişlik', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/'); await page.evaluate(() => document.fonts.ready);
  await page.locator('[data-action="tab"][data-tab="ayarlar"]').first().click();
  const r = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('.fonts .fontbtn')];
    const cols = new Set(btns.filter((b) => !b.classList.contains('on')).map((b) => Math.round(b.getBoundingClientRect().left))).size;
    const split = btns.map((b) => b.querySelector('b')).filter((b) => { const r = document.createRange(); r.selectNodeContents(b); return new Set([...r.getClientRects()].map((x) => Math.round(x.top))).size > b.textContent.trim().split(/\s+/).length; }).map((b) => b.textContent);
    const on = document.querySelector('.fonts .fontbtn.on'); const grid = document.querySelector('.fonts').getBoundingClientRect();
    return { cols, split, onFull: !on || Math.abs(on.getBoundingClientRect().width - grid.width) < 2, onDesc: !on || getComputedStyle(on.querySelector('small')).display !== 'none' };
  });
  expect(r).toEqual({ cols: 2, split: [], onFull: true, onDesc: true });
});

test('B183 matriks bölümü satırlarında sarılan ad onay kutusunun altına düşmez; oklar aynı satırda', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  await page.locator('[data-action="tab"][data-tab="ayarlar"]').first().click();
  const bad = await page.evaluate(() => [...document.querySelectorAll('.section-option')].filter((row) => {
    const box = row.querySelector('input').getBoundingClientRect();
    const label = row.querySelector('label');
    const texts = [...label.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim());
    const textRects = texts.flatMap((n) => { const r = document.createRange(); r.selectNodeContents(n); return [...r.getClientRects()].filter((x) => x.width > 2); });
    const under = textRects.some((x) => x.left < box.right);
    const arrows = [...row.querySelectorAll('[data-action="section-move"]')].map((b) => Math.round(b.getBoundingClientRect().top));
    return under || new Set(arrows).size > 1;
  }).map((row) => row.textContent.trim().slice(0, 30)));
  expect(bad).toEqual([]);
});

test('B184 telefonda Kendi temam renkleri iki sütun; adlar sözcük ortasından bölünmez; diğer formlar etkilenmez', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/'); await page.evaluate(() => document.fonts.ready);
  await page.locator('[data-action="tab"][data-tab="ayarlar"]').first().click();
  const r = await page.evaluate(() => {
    const f = [...document.querySelectorAll('.theme-colors .color-field')];
    const cols = new Set(f.map((b) => Math.round(b.getBoundingClientRect().left))).size;
    const split = f.filter((b) => [...b.querySelectorAll('span, b')].some((el) => [...el.childNodes].some((n) => { if (n.nodeType !== 3 || !n.textContent.trim()) return false; const r = document.createRange(); r.selectNodeContents(n); return new Set([...r.getClientRects()].map((x) => Math.round(x.top))).size > n.textContent.trim().split(/\s+/).length; }))).length;
    return { n: f.length, cols, split, doc: document.documentElement.scrollWidth <= innerWidth + 1 };
  });
  expect(r.n).toBeGreaterThan(4);
  expect({ cols: r.cols, split: r.split, doc: r.doc }).toEqual({ cols: 2, split: 0, doc: true });
});

test('B185 koleksiyon varsa kategori şeridinde Tümü\'nün hemen ardından gelir; yoksa sıra değişmez', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  const firstAfterAll = () => page.evaluate(() => { const kids = [...document.querySelector('.explore .cats').children]; return kids[1]?.className || ''; });
  expect(await firstAfterAll()).not.toContain('cat-group');
  await page.evaluate(() => localStorage.setItem('bm.collections.v1', JSON.stringify([{ id: 'a', name: 'Kahvaltı', items: [{ t: 'c', id: 'muz', f: 0 }] }])));
  await page.reload();
  expect(await firstAfterAll()).toContain('cat-group');
  // B207: şeridin başında "Tüm kategoriler" çipi var; koleksiyon "Tümü"ye yakın kalmalı
  const x = await page.locator('.explore .cats [data-cat="col:a"]').evaluate((e) => e.getBoundingClientRect().left - e.parentElement.querySelector('[data-cat=""]').getBoundingClientRect().left);
  expect(x).toBeLessThan(400);
});

test('B186 telefonda Aion konuşunca kenarda beklemez: "Kutlamayı dene" baloncuğu hemen görünür', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.addInitScript(() => { localStorage.setItem('bm.aionOffV1', '1'); localStorage.setItem('bm.settings.v2', JSON.stringify({ version: 2, settings: { language: 'tr', aionEnabled: true, aionTips: true } })); });
  await page.goto('/');
  await page.locator('[data-action="tab"][data-tab="ayarlar"]').first().click();
  await page.locator('.aion-settings [data-action="aion-demo"]').scrollIntoViewIfNeeded();
  await page.locator('.aion-settings [data-action="aion-demo"]').click();
  await expect(page.locator('#aion .aion-bubble')).toBeVisible({ timeout: 800 });
  await expect(page.locator('#aion')).not.toHaveClass(/aion-tucked/);
  await page.evaluate(() => window.scrollBy(0, 200)); // mobil WebKit'te mouse.wheel yok
  await expect(page.locator('#aion')).toHaveClass(/aion-tucked/);
});

test('B187 telefonda Günlük: yaş/boy/kilo tek satır, başlık en fazla iki satır, alanlar çalışır', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/'); await page.evaluate(() => document.fonts.ready);
  await page.locator('[data-action="tab"][data-tab="gunluk"]').first().click();
  const r = await page.evaluate(() => {
    const ins = ['age', 'height', 'weight'].map((k) => document.querySelector(`.profile-basic [data-personal-field="${k}"]`).getBoundingClientRect());
    const h = document.querySelector('.personal > header h1'); const lh = parseFloat(getComputedStyle(h).lineHeight);
    return { row: new Set(ins.map((b) => Math.round(b.top))).size, minW: Math.min(...ins.map((b) => b.width)), lines: Math.round(h.getBoundingClientRect().height / lh), doc: document.documentElement.scrollWidth <= innerWidth + 1 };
  });
  expect(r.row).toBe(1); expect(r.minW).toBeGreaterThan(60); expect(r.lines).toBeLessThanOrEqual(2); expect(r.doc).toBe(true);
  await page.locator('.profile-basic [data-personal-field="weight"]').fill('70');
  await expect(page.locator('.profile-basic [data-personal-field="weight"]')).toHaveValue('70');
});

test('B189 bildirim telefonda ekranın yarısına sıkışmaz: uzun mesaj geniş ve en fazla üç satır, ekrandan taşmaz', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  await page.locator('#q').fill('muz'); await page.locator('#foodlist [data-id="muz"]').click();
  await page.locator('[data-action="ex-add-day"]').click();
  const t = page.locator('.toast'); await expect(t).toBeVisible();
  const r = await t.evaluate((e) => { const b = e.getBoundingClientRect(); const lh = parseFloat(getComputedStyle(e).lineHeight); const pad = parseFloat(getComputedStyle(e).paddingTop) * 2; return { w: b.width, lines: Math.round((b.height - pad) / lh), inside: b.left >= 0 && b.right <= innerWidth }; });
  expect(r.w).toBeGreaterThan(220); expect(r.lines).toBeLessThanOrEqual(3); expect(r.inside).toBe(true);
});

test('B194 Kıyasla sekmesinde doğrudan arama: yaz, dokun, iki besin yan yana; 4 sınırında arama yerine uyarı', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-action="tab"][data-tab="karsilastir"]').first().click();
  const q = page.locator('#cmp-q');
  await expect(q).toBeVisible();
  await q.fill('nohut');
  await expect(page.locator('[data-action="cmp-pick"]').first()).toContainText('Nohut');
  await page.locator('[data-action="cmp-pick"]').first().click();
  await expect(q).toHaveValue('');
  await q.fill('yulaf'); await page.locator('[data-action="cmp-pick"]').first().click();
  await expect(page.locator('.cmp-col')).toHaveCount(2);
  await expect(page.locator('#cmp-table table')).toHaveCount(1);
  await q.fill('nohut');
  await expect(page.locator('[data-action="cmp-pick"]').first()).toBeDisabled(); // zaten eklenmiş biçim
  for (const id of ['elma', 'muz']) { await q.fill(id); await page.locator('[data-action="cmp-pick"]:not([disabled])').first().click(); }
  await expect(page.locator('.cmp-col')).toHaveCount(4);
  await expect(page.locator('#cmp-q')).toHaveCount(0);
});

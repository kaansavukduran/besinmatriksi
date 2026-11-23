import { tab as goToTab } from './navigation.mjs';
import { test, expect } from '@playwright/test';
import { UI_EN } from '../../src/i18n-ui.js';

// B171: İngilizce arayüzde görünür Türkçe kalmasın. Türkçe harf içeren ya da çeviri tablosunda Türkçe anahtar olan
// görünür metin/aria/title/placeholder aranır. Yazı tipi örnekleri (bilerek Türkçe harf gösterir) ve besin adları hariç.
const KEYS = Object.entries(UI_EN).filter(([k, v]) => k !== v && k.length > 2 && !/[{<]/.test(k)).map(([k]) => k);
const ALLOW = [/İıĞğŞş 0O 1lI/, /^İı Şş Ğğ · /];

async function scan(page) {
  await page.evaluate(() => document.querySelectorAll('details').forEach((d) => { d.open = true; }));
  await page.waitForTimeout(200);
  return page.evaluate((KEYS) => {
    const KS = new Set(KEYS), out = [], tr = /[ğşıçöüİĞŞÇÖÜ]/;
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) {
      const s = n.textContent.trim(); if (!s || !(tr.test(s) || KS.has(s))) continue;
      const el = n.parentElement; if (el.closest('script,style,.fn,.food,.fname,[lang="tr"],option')) continue;
      const st = getComputedStyle(el); if (st.display === 'none' || st.visibility === 'hidden') continue;
      out.push(s.slice(0, 120));
    }
    for (const e of document.querySelectorAll('[aria-label],[title],[placeholder]')) for (const a of ['aria-label', 'title', 'placeholder']) { const v = e.getAttribute(a); if (v && (tr.test(v) || KS.has(v))) out.push(`${a}: ${v.slice(0, 100)}`); }
    return out;
  }, KEYS);
}

test('B171 İngilizce arayüzde görünür Türkçe metin yok (tüm sekmeler, besin, tarif, günlük)', async ({ page }) => {
  await page.addInitScript(() => { localStorage.setItem('bm.aionOffV1', '1'); localStorage.setItem('bm.settings.v2', JSON.stringify({ version: 2, settings: { language: 'en', aionEnabled: true, showSource: true, showMissing: true } })); });
  const found = new Set();
  const add = (list) => list.filter((s) => !ALLOW.some((r) => r.test(s))).forEach((s) => found.add(s));
  await page.goto('/'); add(await scan(page));
  await page.locator('#q').fill('nohut'); await page.locator('#foodlist [data-id="nohut"]').click(); add(await scan(page));
  await page.locator('[data-action="ex-add-recipe"]').click(); await page.locator('[data-action="ex-add-day"]').click();
  for (const tab of ['tarif', 'gunluk', 'karsilastir', 'ayarlar', 'hakkinda']) { await goToTab(page, tab); add(await scan(page)); }
  expect([...found]).toEqual([]);
});

test('B172 alt sekme etiketleri sözcük ortasından bölünmez ve düğmesine sığar (EN/TR, 320 ve 390 px)', async ({ page }) => {
  for (const lang of ['en', 'tr']) for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 700 });
    await page.addInitScript((lang) => localStorage.setItem('bm.settings.v2', JSON.stringify({ version: 2, settings: { language: lang } })), lang);
    await page.goto('/'); await page.evaluate(() => document.fonts.ready);
    const bad = await page.evaluate(() => [...document.querySelectorAll('.tabs .tab')].flatMap((t) => {
      if (!t.getClientRects().length) return [];
      const r = document.createRange(); r.selectNodeContents(t);
      const lines = new Set([...r.getClientRects()].map((x) => Math.round(x.top))).size;
      const tb = t.getBoundingClientRect(), rb = r.getBoundingClientRect();
      return lines > t.textContent.trim().split(/\s+/).length || rb.left < tb.left - 1 || rb.right > tb.right + 1 ? [`${t.textContent} satır=${lines}`] : [];
    }));
    expect(bad, `${lang} ${width}px`).toEqual([]);
  }
});

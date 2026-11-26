import { test, expect } from '@playwright/test';

// D4: WebKit'te diyalog kapandıktan sonra odak gövdeye düşebiliyor (CI: first-use.spec 37, Safari/iPhone/iPad).
// Chromium'da aynı koşulu taklit et: dialog kapanınca odak bir görev sonra gövdeye bırakılır; uygulama açan düğmeye geri dönmeli.
test('D4 günlük seçicisi onaylanınca odak, WebKit benzeri kayıpta da "Besin ekle" düğmesine döner', async ({ page }) => {
  await page.addInitScript(() => {
    const close = HTMLDialogElement.prototype.close;
    HTMLDialogElement.prototype.close = function (...args) {
      const r = close.apply(this, args);
      queueMicrotask(() => document.activeElement?.blur()); // WebKit: odak gövdeye
      return r;
    };
  });
  await page.goto('/#/diary');
  const opener = page.locator('[data-action="personal-add-food"]');
  await opener.click();
  const picker = page.getByRole('dialog');
  await picker.getByRole('searchbox').fill('nohut');
  await picker.locator('.pk-list [data-id="nohut"]').click();
  await picker.locator('[data-action="pk-confirm"]').click();
  await expect(picker).toHaveCount(0);
  await expect(opener).toBeFocused();
});

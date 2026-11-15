import { test, expect } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Pages gibi yalnız /besinmatriksi/ altında statik dosya sun. Kök yola düşen
// varlık veya service worker isteği 404 olur; göreli yol hataları gizlenmez.
const root = path.resolve('dist');
const prefix = '/besinmatriksi/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };
let server, address;

test.beforeAll(async () => {
  server = createServer(async (req, res) => {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    const file = path.resolve(root, pathname.slice(prefix.length) || 'index.html');
    if (!pathname.startsWith(prefix) || (file !== root && !file.startsWith(root + path.sep))) {
      res.writeHead(404).end(); return;
    }
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
      res.end(body);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  address = `http://127.0.0.1:${server.address().port}${prefix}`;
});

test.afterAll(async () => { await new Promise(resolve => server.close(resolve)); });

test('Pages alt yolunda açılır, kayıtlı tarif ve çevrimdışı besin verisi korunur', async ({ page, context }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto(address);
  await page.locator('#q').fill('muz');
  await page.locator('#foodlist [data-id="muz"]').click();
  await page.locator('[data-action="ex-add-recipe"]').click();
  const scope = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
    return registration.scope;
  });
  expect(scope).toBe(address);
  const manifest = await page.locator('link[rel="manifest"]').evaluate(async link => (await fetch(link.href)).json());
  expect(new URL(manifest.start_url, address).href).toBe(address);
  expect(new URL(manifest.scope, address).href).toBe(address);
  await context.setOffline(true);
  await page.reload();
  await page.locator('[data-action="tab"][data-tab="tarif"]').click();
  await expect(page.locator('.ings')).toContainText('Muz');
  await page.locator('[data-action="tab"][data-tab="kesfet"]').click();
  await page.locator('#q').fill('nohut');
  await page.locator('#foodlist [data-id="nohut"]').click();
  await expect(page.locator('#matrix')).toContainText('Nohut');
  expect(errors).toEqual([]);
});

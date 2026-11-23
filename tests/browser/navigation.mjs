export async function reveal(page, selector) {
  const disclosure = page.locator(selector).first();
  if (!(await disclosure.evaluate(el => el.open))) await disclosure.locator(':scope > summary').click();
}

export async function tab(page, id) {
  const link = page.locator(`.tabs [data-tab="${id}"]`);
  if (!(await link.isVisible())) await page.locator('#nav-more-button').click();
  await link.click();
}

export async function categories(page, prefix = 'ex') {
  const toggle = page.locator(`[aria-controls="${prefix}-categories"]`);
  if (await toggle.getAttribute('aria-expanded') !== 'true') await toggle.click();
}

export async function category(page, id, prefix = 'ex') {
  await categories(page, prefix);
  await page.locator(`#${prefix}-categories [data-cat="${id}"]`).click();
}

export async function filters(page, prefix = 'ex') {
  const toggle = page.locator(`[aria-controls="${prefix}-filters"]`);
  if (await toggle.getAttribute('aria-expanded') !== 'true') await toggle.click();
}

export async function outputTools(page) {
  const panel = page.locator('.food-tools, .recipe-tools').first();
  if ((await panel.count()) && !(await panel.evaluate(el => el.open))) await panel.locator(':scope > summary').click();
}

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPrintController } from '../src/print.js';
function fixture() {
  const details = [{ open: false, isConnected: true }, { open: true, isConnected: true }];
  const view = new EventTarget(), media = new EventTarget();
  view.matchMedia = () => media;
  view.print = () => view.dispatchEvent(new Event('beforeprint'));
  const controller = createPrintController({ querySelectorAll: () => details }, view);
  return { details, view, media, controller };
}
test('tekrar beforeprint ilk açık/kapalı durumu ezmez; iptal sonrası geri yükler', () => {
  const { details, view, controller } = fixture();
  controller.print(); assert.deepEqual(details.map(d => d.open), [true, true]);
  view.dispatchEvent(new Event('beforeprint'));
  view.dispatchEvent(new Event('afterprint'));
  assert.deepEqual(details.map(d => d.open), [false, true]); assert.equal(controller.active, false);
  controller.print(); view.dispatchEvent(new Event('afterprint'));
  assert.deepEqual(details.map(d => d.open), [false, true]);
});
test('yazdırma hatası, yazdırma ortamından çıkış ve kaldırılmış öğeler güvenle ele alınır', () => {
  const { details, view, media, controller } = fixture();
  view.print = () => { throw Error('desteklenmiyor'); };
  assert.throws(() => controller.print()); assert.equal(details[0].open, false);
  const on = new Event('change'); on.matches = true; media.dispatchEvent(on);
  assert.equal(controller.active, true); details[1].isConnected = false;
  const off = new Event('change'); off.matches = false; media.dispatchEvent(off);
  assert.equal(details[0].open, false); controller.dispose();
  view.dispatchEvent(new Event('beforeprint')); assert.equal(controller.active, false);
});

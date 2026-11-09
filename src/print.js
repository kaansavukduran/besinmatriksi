// Yazdırma için bölümleri geçici aç; iptal ve tekrar yazdırma da aynı durumu korur.
export function createPrintController(doc, view) {
  let snapshot = null;
  const media = view.matchMedia?.('print');
  function prepare() {
    if (snapshot) return;
    snapshot = [...doc.querySelectorAll('details.sec')].map(el => ({ el, open: el.open }));
    for (const { el } of snapshot) el.open = true;
  }
  function restore() {
    if (!snapshot) return;
    const saved = snapshot;
    snapshot = null;
    for (const { el, open } of saved) if (el.isConnected) el.open = open;
  }
  const change = e => e.matches ? prepare() : restore();
  view.addEventListener('beforeprint', prepare);
  view.addEventListener('afterprint', restore);
  media?.addEventListener('change', change);
  return {
    get active() { return snapshot !== null; },
    prepare, restore,
    print() {
      prepare();
      try { view.print(); } catch (error) { restore(); throw error; }
    },
    dispose() {
      restore(); view.removeEventListener('beforeprint', prepare); view.removeEventListener('afterprint', restore);
      media?.removeEventListener('change', change);
    },
  };
}

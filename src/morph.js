// B199: Miktar değişince matrisi baştan çizmek yerine yalnız değişen metin ve öznitelikleri yamar.
// Yapı aynıysa (aynı etiketler, aynı sıra) düğümler korunur: açık bölümler, odak ve kaydırma yerinde kalır.
// Yapı farklıysa o alt ağaç yenisiyle değiştirilir.
function sameShape(a, b) {
  return a.nodeType === b.nodeType && (a.nodeType !== 1 || a.tagName === b.tagName);
}
function patchAttrs(a, b) {
  for (const { name } of [...a.attributes]) if (!b.hasAttribute(name) && name !== 'open') a.removeAttribute(name);
  for (const { name, value } of b.attributes) if (name !== 'open' && a.getAttribute(name) !== value) a.setAttribute(name, value);
}
export function morphChildren(target, source) {
  const a = [...target.childNodes], b = [...source.childNodes];
  let changed = 0;
  for (let i = 0; i < b.length; i++) {
    const x = a[i], y = b[i];
    if (!x) { target.appendChild(y); changed++; continue; }
    if (!sameShape(x, y)) { target.replaceChild(y, x); changed++; continue; }
    if (x.nodeType === 3 || x.nodeType === 8) { if (x.nodeValue !== y.nodeValue) { x.nodeValue = y.nodeValue; changed++; } continue; }
    patchAttrs(x, y);
    changed += morphChildren(x, y);
  }
  for (let i = b.length; i < a.length; i++) { a[i].remove(); changed++; }
  return changed;
}
export function morphHtml(target, html) {
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  return morphChildren(target, tpl.content);
}

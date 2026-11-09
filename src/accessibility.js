const focusable = 'button:not(:disabled), input:not(:disabled):not([type="hidden"]), textarea:not(:disabled), select:not(:disabled), a[href], [tabindex="0"], summary';
export function focusSelector(el) {
  if (!el || el === document.body) return null;
  if (el.id) return `#${CSS.escape(el.id)}`;
  const attrs = [...el.attributes].filter(a => a.name.startsWith('data-'));
  return attrs.length ? el.tagName.toLowerCase() + attrs.map(a => `[${a.name}="${CSS.escape(a.value)}"]`).join('') : null;
}
export function syncModalFocus(preferred = null) {
  const modals = [...document.querySelectorAll('.modal')], modal = modals.at(-1);
  document.querySelectorAll('.top, .profile-bar, .view').forEach(el => { el.inert = !!modal; });
  modals.forEach(el => { el.inert = el !== modal; });
  const target = preferred ? document.querySelector(preferred) : null;
  if (target && (!modal || modal.contains(target)) && !target.closest('[inert]')) target.focus({ preventScroll: true });
  else if (modal && !modal.contains(document.activeElement)) modal.querySelector(focusable)?.focus({ preventScroll: true });
}
export function trapModalTab(e) {
  if (e.key !== 'Tab') return;
  const modal = [...document.querySelectorAll('.modal')].at(-1);
  if (!modal) return;
  const list = [...modal.querySelectorAll(focusable)].filter(el => el.getClientRects().length && !el.closest('[inert]'));
  if (!list.length) { e.preventDefault(); return; }
  const first = list[0], last = list.at(-1);
  if (e.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && (document.activeElement === last || !modal.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
}

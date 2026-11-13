// Aion: Kaan'ın aksolotl maskotu. Kare kare (sprite sheet) animasyon.
// Kaynak pozlar: assets-src/aion (Drive: Aion-Trans-Akici-Dort-Hareket.png), üretim: scripts/build-aion.py
import sheetUrl from './assets/aion/aion-sprites.webp?url';
import META from './assets/aion/aion-sprites.json';
import { t } from './i18n.js';

const SIZES = { s: 64, m: 88, l: 120 };
const TIP_KEYS = ['aionTip1', 'aionTip2', 'aionTip3', 'aionTip4', 'aionTip5', 'aionTip6', 'aionTip7', 'aionTip8'];

let root = null, sprite = null, bubble = null, bubbleText = null;
let timer = null, bubbleTimer = null;
let mood = 'idle';            // sürekli döngü
let current = 'idle';         // o an oynayan
let frame = 0;
let onceThen = null;
let cfg = { enabled: true, still: false, size: 'm', side: 'right', tips: true };
let tipIndex = 0;

function reducedMotionPreferred() {
  return !!globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function draw() {
  if (!sprite) return;
  const a = META.animations[current] || META.animations.idle;
  const px = sprite.clientWidth || SIZES[cfg.size] || SIZES.m;
  sprite.style.backgroundSize = `${META.columns * px}px ${Object.keys(META.animations).length * px}px`;
  sprite.style.backgroundPosition = `${-(cfg.still ? 0 : frame) * px}px ${-a.row * px}px`;
  root.dataset.anim = current;
}

function tick() {
  timer = null;
  if (!root || cfg.still || !cfg.enabled || document.hidden) return;
  const a = META.animations[current];
  frame += 1;
  if (frame >= a.frames) {
    if (!a.loop || onceThen) {
      current = onceThen || mood; onceThen = null; frame = 0;
    } else frame = 0;
  }
  draw();
  schedule();
}

function schedule() {
  if (timer || cfg.still || !cfg.enabled || document.hidden) return;
  const a = META.animations[current] || META.animations.idle;
  timer = setTimeout(tick, a.ms);
}

function stop() { if (timer) { clearTimeout(timer); timer = null; } }

export function mountAion() {
  if (root || typeof document === 'undefined') return;
  root = document.createElement('div');
  root.id = 'aion';
  root.className = 'aion';
  root.innerHTML = `
    <div class="aion-bubble" role="status" aria-live="polite" hidden>
      <span class="aion-text"></span>
      <button class="aion-close" type="button" data-aion="close"></button>
    </div>
    <button class="aion-body" type="button" data-aion="poke"><span class="aion-sprite" aria-hidden="true"></span></button>`;
  document.body.appendChild(root);
  sprite = root.querySelector('.aion-sprite');
  sprite.style.backgroundImage = `url("${sheetUrl}")`;
  bubble = root.querySelector('.aion-bubble');
  bubbleText = root.querySelector('.aion-text');
  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-aion]');
    if (!b) return;
    if (b.dataset.aion === 'close') { hideBubble(); return; }
    // Dokununca selam verir ve sıradaki ipucunu gösterir
    aionPlay('wave', { once: true });
    if (cfg.tips) { aionSay(t(TIP_KEYS[tipIndex % TIP_KEYS.length])); tipIndex++; }
  });
  window.addEventListener('resize', draw);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else schedule(); });
  labels();
  draw();
  schedule();
}

function labels() {
  if (!root) return;
  root.querySelector('.aion-body').setAttribute('aria-label', t('aionPoke'));
  root.querySelector('.aion-body').title = t('aionPoke');
  const c = root.querySelector('.aion-close');
  c.setAttribute('aria-label', t('aionCloseTip'));
  c.textContent = '×';
}

// settings: tam ayar nesnesi
export function configureAion(settings) {
  const still = settings.aionMotion === 'still' || (settings.aionMotion === 'auto' && (settings.reduceMotion || reducedMotionPreferred()));
  cfg = { enabled: !!settings.aionEnabled, still, size: settings.aionSize, side: settings.aionSide, tips: !!settings.aionTips };
  if (!root) return;
  root.hidden = !cfg.enabled;
  root.dataset.size = cfg.size;
  root.dataset.side = cfg.side;
  root.dataset.still = String(cfg.still);
  if (!cfg.tips) hideBubble();
  labels();
  stop();
  draw();
  schedule();
}

// Sürekli ruh hali (ekrana göre). Tek seferlik hareket sürüyorsa bitince bu duruma döner.
export function aionMood(name) {
  if (!META.animations[name] || !META.animations[name].loop) return;
  if (mood === name) return;
  mood = name;
  if (!onceThen && META.animations[current]?.loop) { current = name; frame = 0; draw(); stop(); schedule(); }
}

// Tek seferlik veya geçici hareket (ör. kutlama). Bitince ruh haline döner.
export function aionPlay(name, { once = true } = {}) {
  if (!META.animations[name]) return;
  current = name; frame = 0; onceThen = once ? mood : null;
  draw(); stop();
  if (cfg.still && once) {
    // Sabit pozda kısa süre ilgili pozu göster, sonra ruh haline dön
    setTimeout(() => { if (onceThen) { current = mood; onceThen = null; draw(); } }, 1200);
    return;
  }
  schedule();
}

// ifIdle: gecikmeli selam gibi düşük öncelikli mesajlar, o an görünen daha yeni bir mesajın üzerine yazılmaz
export function aionSay(text, ms = 6000, { ifIdle = false } = {}) {
  if (!root || !cfg.enabled || !cfg.tips || !text) return;
  if (ifIdle && !bubble.hidden) return;
  bubbleText.textContent = text;
  bubble.hidden = false;
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(hideBubble, ms);
}

function hideBubble() { if (bubble) bubble.hidden = true; clearTimeout(bubbleTimer); }

export const aionAnimations = () => Object.keys(META.animations);

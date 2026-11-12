// İlk kullanım turu: 3 kısa adım, her an atlanabilir. Yalnız cihazda "görüldü" bilgisi tutar.
export const TOUR_KEY = 'bm.tour.v1';
export const TOUR_STEPS = [
  { target: '.cats', text: 'Bir kategori seç ya da üstteki kutuya besin adı yaz.' },
  { target: '#foodlist', text: 'Bir besine dokun. Büyük kaydırıcıyı sağa sola çekerek gramı ayarla; matriks hemen güncellenir.' },
  { target: '[data-tab="tarif"]', text: '“Tarife ekle” ile besinleri topla. Tarif sekmesinde tüm tarifin toplam matriksini görürsün.' },
];
export function tourSeen(storage) { try { return (storage ?? globalThis.localStorage).getItem(TOUR_KEY) === 'done'; } catch { return true; } }
export function markTourSeen(storage) { try { (storage ?? globalThis.localStorage).setItem(TOUR_KEY, 'done'); return true; } catch { return false; } }
// Adım sınırlandırma: geçersiz adım turu bitirir (null)
export const nextStep = (i, dir) => { const j = i + dir; return j < 0 ? 0 : j >= TOUR_STEPS.length ? null : j; };

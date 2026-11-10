"""Aion sprite sheet üretici (kare kare animasyon).

Kaynak: assets-src/aion/*.png. Kaan'ın Drive'ındaki "Aion-Trans-Akici-Dort-Hareket.png"
paftasından (pembe-mavi solungaçlı Aion) kesilip arka planı saydam yapılmış dört poz:
wave (el sallama), sad (üzgün tepki), work (bilgisayarda çalışma), read (kitap inceleme).
Çıktı:  src/assets/aion/aion-sprites.webp + public/aion/aion-sprites.json
Her satır bir hareket, her sütun bir kare. Ayak hizası (alt orta nokta) tüm karelerde sabittir.
Kullanım: python3 scripts/build-aion.py
"""
import json, math, os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets-src', 'aion')
OUT = os.path.join(ROOT, 'src', 'assets', 'aion')
F = 200          # kare boyu (px); ekranda en çok 100 px CSS (2x yoğunluk)
N = 8            # hareket başına kare
BASE = F - 6     # ayak çizgisi
# Dört poz aynı paftadan: ortak ölçek (en uzun poz ~387 px)
SCALE = F * 0.9 / 390

# hareket: (poz, kare süresi ms, döngü mü, kare -> (dx, dy, sx, sy, derece))
def idle(i):
    s = math.sin(i / N * 2 * math.pi)
    return 0, 0, 1 - 0.008 * s, 1 + 0.018 * s, 0
def wave(i):
    s = math.sin(i / N * 2 * math.pi)
    return 0, 0, 1, 1 + 0.01 * s, 4.5 * s
def sleep(i):
    s = math.sin(i / N * 2 * math.pi)
    return 0, 0, 1 + 0.02 * s, 1 + 0.022 * s, 0
def walk(i):
    s = math.sin(i / N * 2 * math.pi)
    return 3 * s, -7 * abs(math.sin(i / N * 2 * math.pi)), 1, 1, -3 * s
JUMP = [(0, 0, 1.0, 1.0, 0), (0, 0, 1.07, 0.9, 0), (0, -16, 0.96, 1.06, 0), (0, -30, 0.98, 1.03, -3),
        (0, -36, 1, 1, 0), (0, -26, 0.99, 1.02, 3), (0, -8, 1, 1, 0), (0, 0, 1.06, 0.93, 0)]
def celebrate(i):
    return JUMP[i]

def sad(i):
    s = math.sin(i / N * 2 * math.pi)
    return 0, 1.5 * (1 + s), 1 + 0.01 * s, 1 - 0.015 * (1 + s) / 2, 0
def work(i):
    s = math.sin(i / N * 4 * math.pi)
    return 0, -1.5 * abs(s), 1, 1 + 0.008 * s, 0

# (ad, poz, kare süresi ms, döngü, kare dönüşümü)
ANIMS = [
    ('idle', 'work', 170, True, work),       # varsayılan: bilgisayarda çalışıyor
    ('wave', 'wave', 120, True, wave),       # hoş geldin / selam
    ('read', 'read', 240, True, sleep),      # matriksi inceliyor (nefes)
    ('sad', 'sad', 200, True, sad),          # veri yok / hata
    ('celebrate', 'wave', 90, False, celebrate),  # başarı: zıplama
]

def frame(img, dx, dy, sx, sy, deg):
    w, h = img.size
    im = img.resize((max(1, round(w * sx)), max(1, round(h * sy))), Image.LANCZOS)
    if deg:
        # alt orta noktanın çevresinde döndür
        pad = Image.new('RGBA', (im.width * 2, im.height * 2), (0, 0, 0, 0))
        pad.paste(im, (im.width // 2, 0))
        pad = pad.rotate(deg, resample=Image.BICUBIC, center=(im.width, im.height))
        x = round(F / 2 - im.width + dx); y = round(BASE - im.height + dy)
        canvas = Image.new('RGBA', (F * 3, F * 3), (0, 0, 0, 0))
        canvas.alpha_composite(pad, (x + F, y + F))
        return canvas.crop((F, F, 2 * F, 2 * F))
    cell = Image.new('RGBA', (F * 3, F * 3), (0, 0, 0, 0))
    cell.alpha_composite(im, (round(F + F / 2 - im.width / 2 + dx), round(F + BASE - im.height + dy)))
    return cell.crop((F, F, 2 * F, 2 * F))

def main():
    os.makedirs(OUT, exist_ok=True)
    sheet = Image.new('RGBA', (F * N, F * len(ANIMS)), (0, 0, 0, 0))
    meta = {'frame': F, 'columns': N, 'animations': {}}
    for row, (name, pose, ms, loop, fn) in enumerate(ANIMS):
        src = Image.open(os.path.join(SRC, pose + '.png')).convert('RGBA')
        k = SCALE
        base = src.resize((round(src.width * k), round(src.height * k)), Image.LANCZOS)
        for i in range(N):
            sheet.alpha_composite(frame(base, *fn(i)), (i * F, row * F))
        meta['animations'][name] = {'row': row, 'frames': N, 'ms': ms, 'loop': loop}
    sheet.save(os.path.join(OUT, 'aion-sprites.webp'), 'WEBP', quality=82, method=6)
    preview = os.environ.get('AION_PREVIEW')
    if preview:
        sheet.save(preview)
    # Sabit poz (azaltılmış hareket) için tek kare
    sheet.crop((0, 0, F, F)).save(os.path.join(OUT, 'aion-still.webp'), 'WEBP', quality=90)
    with open(os.path.join(OUT, 'aion-sprites.json'), 'w') as fh:
        json.dump(meta, fh, indent=1)
    print('aion-sprites', sheet.size, {k: os.path.getsize(os.path.join(OUT, k)) for k in os.listdir(OUT)})

if __name__ == '__main__':
    main()

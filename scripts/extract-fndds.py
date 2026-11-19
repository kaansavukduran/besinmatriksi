#!/usr/bin/env python3
"""USDA FNDDS 2021-2023 (CC0) alt kümesine yeni yemek kodları ekler.

Kullanım: python3 -I scripts/extract-fndds.py <FoodData_Central_survey_food_json_2024-10-31.zip ya da açılmış .json> KOD [KOD ...]
Var olan kayıtlar korunur; yalnız istenen kodlar eklenir. data/raw/USDA_FNDDS_SOURCE.json'daki kod listesi güncellenir.
Zip SHA-256 kaynak dosyasındakiyle aynı olmalıdır (aynı yayın).
"""
import gzip, hashlib, json, sys, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SUBSET = ROOT / 'data/raw/USDA_FNDDS_2021-2023_SUBSET.json.gz'
SOURCE = ROOT / 'data/raw/USDA_FNDDS_SOURCE.json'

def load(path):
    p = Path(path)
    if p.suffix == '.zip':
        src = json.loads(SOURCE.read_text())
        digest = hashlib.sha256(p.read_bytes()).hexdigest()
        if digest != src['zip_sha256']:
            raise SystemExit(f'SHA-256 uyuşmuyor: {digest}')
        with zipfile.ZipFile(p) as z:
            name = next(n for n in z.namelist() if n.endswith('.json'))
            return json.loads(z.read(name))['SurveyFoods']
    return json.loads(p.read_text())['SurveyFoods']

def record(f):
    n = [[x['nutrient']['number'], x['nutrient']['name'], x['nutrient']['unitName'], x['amount']]
         for x in f['foodNutrients'] if 'amount' in x and x.get('nutrient', {}).get('number')]
    p = [[x['portionDescription'], x['gramWeight']] for x in sorted(f.get('foodPortions', []), key=lambda x: x.get('sequenceNumber', 0))]
    ing = [x['ingredientDescription'] for x in sorted(f.get('inputFoods', []), key=lambda x: x.get('sequenceNumber', 0))]
    return {'code': str(f['foodCode']), 'fdcId': f['fdcId'], 'desc': f['description'], 'n': n, 'p': p, 'in': ing}

def main():
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    foods = {str(f['foodCode']): f for f in load(sys.argv[1])}
    subset = json.loads(gzip.decompress(SUBSET.read_bytes()))
    have = {r['code'] for r in subset}
    added = []
    for code in sys.argv[2:]:
        if code in have:
            continue
        if code not in foods:
            raise SystemExit(f'FNDDS kodu bulunamadı: {code}')
        subset.append(record(foods[code])); added.append(code)
    subset.sort(key=lambda r: r['code'])
    SUBSET.write_bytes(gzip.compress(json.dumps(subset, ensure_ascii=False, separators=(',', ':')).encode(), mtime=0))
    src = json.loads(SOURCE.read_text())
    src['extracted_codes'] = sorted(set(src['extracted_codes']) | set(added))
    SOURCE.write_text(json.dumps(src, ensure_ascii=False, indent=2) + '\n')
    print(f'{len(added)} kod eklendi; alt küme {len(subset)} kayıt')

if __name__ == '__main__':
    main()

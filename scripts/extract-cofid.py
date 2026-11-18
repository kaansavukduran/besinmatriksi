# CoFID 2021 xlsx -> JSON (yalnız gerekli sütunlar; ham hücre metni korunur: sayı, "Tr", "N" ayrımı)
import sys, json, gzip, openpyxl
src, out = sys.argv[1], sys.argv[2]
wb = openpyxl.load_workbook(src, read_only=True, data_only=True)
want = {
  '1.3 Proximates': {'Water (g)': 'water', 'Protein (g)': 'protein', 'Fat (g)': 'fat', 'Total sugars (g)': 'sugars', 'Glucose (g)': 'glucose', 'Fructose (g)': 'fructose', 'Sucrose (g)': 'sucrose', 'AOAC fibre (g)': 'fiber_aoac'},
  '1.4 Inorganics': {'Sodium (mg)': 'na', 'Potassium (mg)': 'k', 'Calcium (mg)': 'ca', 'Magnesium (mg)': 'mg', 'Phosphorus (mg)': 'p', 'Iron (mg)': 'fe', 'Copper (mg)': 'cu', 'Zinc (mg)': 'zn', 'Manganese (mg)': 'mn', 'Selenium (µg)': 'se', 'Iodine (µg)': 'iodine', 'Chloride (mg)': 'chloride'},
  '1.5 Vitamins': {'Biotin (µg)': 'biotin', 'Pantothenate (mg)': 'b5', 'Vitamin K1 (µg)': 'k1', 'Folate (µg)': 'folate', 'Vitamin B6 (mg)': 'b6'},
}
foods = {}
for sheet, cols in want.items():
    ws = wb[sheet]
    rows = ws.iter_rows(values_only=True)
    head = [str(h).strip() if h is not None else '' for h in next(rows)]
    idx = {cols[h]: i for i, h in enumerate(head) if h in cols}
    for r in rows:
        if not r or not r[0] or r[0] == 'Food Code': continue
        code = str(r[0]).strip()
        if not code or code.startswith('('): continue
        f = foods.setdefault(code, {'name': str(r[1] or '').strip(), 'desc': str(r[2] or '').strip(), 'group': str(r[3] or '').strip(), 'ref': str(r[5] or '').strip(), 'v': {}})
        for k, i in idx.items():
            x = r[i]
            if x is None or x == '': continue
            f['v'][k] = x if isinstance(x, (int, float)) else str(x).strip()
with gzip.open(out, 'wt', encoding='utf-8') as fh: json.dump(foods, fh, ensure_ascii=False, separators=(',', ':'))
print(len(foods), 'besin')

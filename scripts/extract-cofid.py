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
# Tam profil kullanılan kuru ananas satırı. Diğer besinlerde dolgu için gereken sütunlar yeterli.
primary = {
  '1.3 Proximates': {'Energy (kcal) (kcal)': 'energy', 'Energy (kJ) (kJ)': 'energy_kj', 'Carbohydrate (g)': 'carb_avail', 'Starch (g)': 'starch', 'Maltose (g)': 'maltose', 'Galactose (g)': 'galactose', 'Lactose (g)': 'lactose', 'Satd FA /100g fd (g)': 'sfa', 'Mono FA /100g food (g)': 'mufa', 'Poly FA /100g food (g)': 'pufa', 'Trans FAs /100g food (g)': 'trans', 'Cholesterol (mg)': 'cholesterol'},
  '1.5 Vitamins': {'Vitamin D (µg)': 'vitd', 'Vitamin E (mg)': 'vite', 'Retinol (µg)': 'retinol', 'Thiamin (mg)': 'thiamin', 'Riboflavin (mg)': 'riboflavin', 'Niacin (mg)': 'niacin', 'Vitamin B12 (µg)': 'b12', 'Vitamin C (mg)': 'vitc'},
}
for sheet, cols in want.items():
    ws = wb[sheet]
    rows = ws.iter_rows(values_only=True)
    head = [str(h).strip() if h is not None else '' for h in next(rows)]
    idx = {cols[h]: i for i, h in enumerate(head) if h in cols}
    extra = {primary[sheet][h]: i for i, h in enumerate(head) if h in primary.get(sheet, {})}
    for r in rows:
        if not r or not r[0] or r[0] == 'Food Code': continue
        code = str(r[0]).strip()
        if not code or code.startswith('('): continue
        f = foods.setdefault(code, {'name': str(r[1] or '').strip(), 'desc': str(r[2] or '').strip(), 'group': str(r[3] or '').strip(), 'ref': str(r[5] or '').strip(), 'v': {}})
        for k, i in (idx | extra if code == '14-396' else idx).items():
            x = r[i]
            if x is None or x == '': continue
            f['v'][k] = x if isinstance(x, (int, float)) else str(x).strip()
with open(out, 'wb') as fh: fh.write(gzip.compress(json.dumps(foods, ensure_ascii=False, separators=(',', ':')).encode('utf-8'), mtime=0))
print(len(foods), 'besin')

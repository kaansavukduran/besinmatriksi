"""Extract selected Anses-Ciqual 2025 values from the pinned English workbook."""
import hashlib
import json
from pathlib import Path
import re
import sys

import openpyxl

workbook_path = Path(sys.argv[1])
digest = hashlib.md5(workbook_path.read_bytes()).hexdigest()
if digest != 'a953e8c473d8cee24a32f89a48fbd54d':
    raise SystemExit('Ciqual workbook checksum does not match the publisher record.')

# Workbook columns and definitions are fixed by the checksum. Skip values that
# are absent, below a reporting limit or reported as traces or zero.
columns = {
    9: 'energy_kj', 10: 'energy', 13: 'water', 14: 'protein', 16: 'carb_avail',
    17: 'fat', 18: 'sugars', 19: 'fructose', 21: 'glucose', 22: 'lactose',
    23: 'maltose', 24: 'sucrose', 25: 'starch', 26: 'fiber', 28: 'ash',
    29: 'alcohol', 31: 'sfa', 32: 'mufa', 33: 'pufa', 48: 'cholesterol',
    50: 'ca', 51: 'chloride', 52: 'cu', 53: 'fe', 54: 'iodine', 55: 'mg',
    56: 'mn', 57: 'p', 58: 'k', 59: 'se', 60: 'na', 61: 'zn',
    63: 'retinol', 64: 'bcarotene', 65: 'vitd', 66: 'd2', 67: 'd3',
    68: 'vite', 70: 'vitk', 71: 'k2', 72: 'vitc', 73: 'thiamin',
    74: 'riboflavin', 75: 'niacin', 76: 'panto', 77: 'b6', 78: 'folate_dfe',
    79: 'folate', 80: 'food_folate', 81: 'folic_acid', 82: 'b12',
}
profiles = {
    '9875': 'Pasta, dry, gluten-free (from rice and corn), cooked, no added salt',
    '9876': 'Pasta, dry, gluten-free (from red lentils), cooked, no added salt',
    '11069': 'Sage, fresh',
    '18316': 'Water kefir or Tibicos, prepacked',
}
chloride_matches = {
    '20057': ('brokoli/cig', 'Broccoli, raw'),
    '20059': ('ispanak/cig', 'Spinach, raw'),
}


def positive_amount(cell):
    text = str(cell).strip().replace(',', '.')
    if re.fullmatch(r'\d+(?:\.\d+)?', text) and float(text) > 0:
        return float(text)
    return None


book = openpyxl.load_workbook(workbook_path, read_only=True, data_only=True)
records = {}
for row in book['food composition'].iter_rows(values_only=True):
    code = str(row[6])
    if code not in profiles and code not in chloride_matches:
        continue
    actual_name = ' '.join(row[7].split())
    expected_name = profiles[code] if code in profiles else chloride_matches[code][1]
    if actual_name != expected_name or code in records:
        raise SystemExit(f'Unexpected Ciqual food number or name: {code} ({actual_name})')
    values = {}
    for index, key in columns.items():
        if code in chloride_matches and key not in {'water', 'protein', 'fat', 'na', 'chloride'}:
            continue
        amount = positive_amount(row[index])
        if amount is not None:
            values[key] = amount
    record = {'id': code, 'name': actual_name, 'values': values}
    if code in chloride_matches:
        record['form'] = chloride_matches[code][0]
    records[code] = record
if set(records) != set(profiles) | set(chloride_matches):
    raise SystemExit('Missing Ciqual food record.')

output = {
    'source': {
        'publisher': 'Anses', 'edition': 'Ciqual 2025',
        'url': 'https://doi.org/10.57745/RDMHWY',
        'englishWorkbook': 'https://doi.org/10.5281/zenodo.17550133',
        'licence': 'CC BY 4.0', 'workbookMd5': digest,
    },
    'records': list(records.values()),
}
(Path(__file__).resolve().parents[1] / 'data/raw/CIQUAL_2025_SUBSET.json').write_text(
    json.dumps(output, ensure_ascii=False, indent=2) + '\n', encoding='utf-8',
)

"""
    Processing the data
"""

import pandas as pd
import simplejson

acc_all_data = {}
cas_all_data = {}

def save_obj(o, f_name):
    with open(f_name, "w+") as of:
        simplejson.dump(o, of, ignore_nan=True)

# for yr in range(1975, 2015):
for yr in range(2011, 2015): # only thse years... dammit
    print yr
    acc_raw = pd.read_csv("./accidents/accidentsRaw/accidents_%s.txt" % str(yr), dtype=str) # do this only to avoid annoying warning messages
    cas_raw = pd.read_csv("./casualties/casualtiesraw/casualties_%s.txt" % str(yr), dtype=str)
    acc_raw.columns = pd.Series([str.lower(a) for a in acc_raw.columns.values])
    cas_raw.columns = pd.Series([str.lower(a) for a in cas_raw.columns.values])
    acc_all_data[str(yr)] = [{
        "lat": float(row[list(acc_raw.columns.values).index("latitude")]),
        "lon": float(row[list(acc_raw.columns.values).index("longitud")]),
        "accDmg": float(row[list(acc_raw.columns.values).index("accdmg")])
    } for row in acc_raw.values if row[list(acc_raw.columns.values).index("latitude")] != "0.00" and row[list(acc_raw.columns.values).index("longitud")] != "0.00"]
    cas_all_data[str(yr)] = [{
        "lat": float(row[list(cas_raw.columns.values).index("latitude")]),
        "lon": float(row[list(cas_raw.columns.values).index("longitud")]),
        "fatal": True if row[list(cas_raw.columns.values).index("casfatal")] == "Y" else False
    } for row in cas_raw.values if row[list(cas_raw.columns.values).index("latitude")] != "0.00" and row[list(cas_raw.columns.values).index("longitud")] != "0.00"]

save_obj(acc_all_data, "./accidents/accidents_all_latlng.json")
save_obj(cas_all_data, "./casualties/casualties_all_latlng.json")

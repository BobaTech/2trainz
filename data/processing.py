"""
    Processing the data
"""

import pandas as pd
import json

def save_obj(o, f_name):
    with open(f_name, "w+") as of:
        json.dump(o, of, allow_nan=False)

acc = pd.read_csv("./accidents_2014.txt")
cas = pd.read_csv("./casualties_2014.txt")

acc.columns = pd.Series([str.lower(a) for a in acc.columns.values])
cas.columns = pd.Series([str.lower(a) for a in cas.columns.values])

acc = acc.where((pd.notnull(acc)), None)
cas = cas.where((pd.notnull(cas)), None)

acc_json = {
    "data": []
}
acc_geojson = {
    "type": "FeatureCollection",
    "features": []
}
cas_json = {
    "data": []
}
cas_geojson = {
    "type": "FeatureCollection",
    "features": []
}

acc_col = list(acc.columns.values)
cas_col = list(cas.columns.values)

for row in acc.values:
    # 139, 138
    feature = {
        "type": "Feature",
        "geometry": { "type": "Point", "coordinates": [ row[139], row[138] ] },
        "properties": { acc_col[i]: row[i] for i in range(len(acc_col)) if i != 138 and i != 139 }
    }
    acc_json["data"].append({ acc_col[i]: row[i] for i in range(len(acc_col)) })
    acc_geojson["features"].append(feature)

for row in cas.values:
    # 49, 48
    feature = {
        "type": "Feature",
        "geometry": { "type": "Point", "coordinates": [ row[49], row[48] ] },
        "properties": { cas_col[i]: row[i] for i in range(len(cas_col)) if i != 138 and i != 139 }
    }
    cas_json["data"].append({ cas_col[i]: row[i] for i in range(len(cas_col)) })
    cas_geojson["features"].append(feature)

save_obj(acc_json, "accidents.json")
save_obj(acc_geojson, "accidents.geo.json")
save_obj(cas_json, "casualties.json")
save_obj(cas_geojson, "casualties.geo.json")

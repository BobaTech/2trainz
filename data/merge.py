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

data = {}

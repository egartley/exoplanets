import json

INDEX_DIR = "C:/Users/egart/AppData/Local/xampp/htdocs/exo/index/"
INDEX_SUBDIR = "id" # hoststar year id
VALUE_NAME = "rowid" # hostname disc_year rowid
KEY_LENGTH = 1 # host star: 1, year: 4, id: not used

def get_value(valuename, exoplanet):
    return exoplanet[values.index(valuename)]

data = dict()
values = dict()
with open("data.json", "r") as datafile:
    data = json.load(datafile)
with open("values.json", "r") as valuesfile:
    values = json.load(valuesfile)

towrite = {}
for exoplanet in data:
    if INDEX_SUBDIR != "id":
        key = get_value(VALUE_NAME, exoplanet).lower()[0:KEY_LENGTH]
        if key not in towrite:
            towrite[key] = []
        towrite[key].append(exoplanet)
    else:
        year = get_value(VALUE_NAME, exoplanet)
        key = int(year) // 1000
        key = str(key)
        if key not in towrite:
            towrite[key] = []
        towrite[key].append(exoplanet)

for key in towrite:
    key = str(key)
    with open(INDEX_DIR + INDEX_SUBDIR + "/" + key + ".json", "w") as file:
        json.dump(towrite[key], file)

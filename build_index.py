import json

INDEX_DIR = "C:/Users/egart/AppData/Local/xampp/htdocs/exo/index/"
INDEX_SUBDIR = "id" # hoststar year id
VALUE_NAME = "rowid" # pl_hostname pl_disc rowid
KEY_LENGTH = 4 # host star: 1, year: 4, id: not used

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
        towrite[get_value(VALUE_NAME, exoplanet)] = exoplanet

for key in towrite:
    with open(INDEX_DIR + INDEX_SUBDIR + "/" + key + ".json", "w") as file:
        json.dump(towrite[key], file)

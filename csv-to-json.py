import os
import csv
import json
import shutil

IN_FILE = "data.csv"
DATA_DIR = "C:/Users/egart/Desktop/Development/Exoplanet/data/"
DATA_FILE = "data.json"
VALUES_FILE = "values.json"

def read_in(filename):
    data = []
    with open(filename) as file:
        reader = csv.reader(file, delimiter=",")
        first = True
        for row in reader:
            if first:
                first = False
                continue
            data.append(row)
    return data

def get_value_names(filename):
	names = []
	with open(filename) as file:
		for row in csv.reader(file, delimiter=","):
			names = row
			break
	return names

# make sure data folder exists, make it if not
if not(os.path.exists(DATA_DIR)):
	os.mkdir(DATA_DIR)

# check if the data folder should be cleared
clear = input("Clear \"data\" folder? ") == "y"
if clear:
	print("Clearing...")
	shutil.rmtree(DATA_DIR)
	os.mkdir(DATA_DIR)
	print("Cleared!")

# gather data
names = get_value_names(IN_FILE)
csv_data = read_in(IN_FILE)

# write files
with open(os.path.join(DATA_DIR, DATA_FILE), "w") as file:
	json.dump(csv_data, file)
with open(os.path.join(DATA_DIR, VALUES_FILE), "w") as file:
	json.dump(names, file)

input("Done!")

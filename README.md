# Exoplanets
Visualizer and interface for confirmed exoplanets' data

Data is sourced from the [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=planets) (DOI 10.26133/NEA1) as a CSV file, and converted to JSON with `csv-to-json.py`

## Current Functionality
- A test list of the first 200 exoplanets, which will eventually be the search results list
- Visualization of exoplanets based on their radius and orbitial period, determining size and color respectively

## Planned Functionality
- Search by name, radius, distance, etc.
- View all of the available information about a chosen planet from the search results
- "Chunked" loading of data to ensure optimum peformance as the amount of data increases

## Tools Used
[PhpStorm](https://www.jetbrains.com/phpstorm/) for writing the JavaScript, HTML and CSS  
[XAMPP](https://www.apachefriends.org/index.html) for simple testing of changes  
[Sublime Text](https://www.sublimetext.com/) for writing the Python which converts the data from CSV to JSON

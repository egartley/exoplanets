# Exoplanets
Visualizer and interface for confirmed exoplanets' data.

Data is sourced from the [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=planets) (DOI 10.26133/NEA1) as a CSV file, and converted to JSON with `csv-to-json.py`

## Current Functionality
- Search through the data by name, host star or year discovered
- Results are displayed in a scrollable list
- Visualization of exoplanets based on their radius and orbitial period, determining size and color respectively

## Planned Functionality
- More advanced search abilities, such as ranges and additional values to search by
- Sort the result list alphabetically or ascending/descending by size, distance, etc.
- View all of the available information about a chosen planet from the search results
- Chunked loading and searching of data to ensure optimum peformance as the amount increases

## Tools Used
[PhpStorm](https://www.jetbrains.com/phpstorm/) for writing the JavaScript, HTML and CSS  
[XAMPP](https://www.apachefriends.org/index.html) for simulating a website  
[Sublime Text](https://www.sublimetext.com/) for writing the Python which converts the data from CSV to JSON

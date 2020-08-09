# Exoplanets
Visualizer and interface for confirmed exoplanets' data.

Data is sourced from the [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=planets) (DOI 10.26133/NEA1) as a CSV file and converted to JSON with `csv-to-json.py`. Two files are created, `data.json` and `values.json`, which contain all of the data and value names. Putting the value names in a seperate file dramatically decreases the size of the data file, which is already quite large. Chunked, or incremental loading will be added at a later date to better manage the data as it increases when new exoplanets are discovered and confirmed.

A working "demo" can be accessed at the [project page](https://egartley.net/projects/exoplanets/?via=ghreadmeearlyaugust). The only modifications made are the base URL in `script.js` and small corrections in `style.css` to avoid conflicts with the website's own styling.

## Current Functionality
- Search through the data by name, host star or year discovered
- Results are displayed in a scrollable list
- Visualization of exoplanets based on their radius and orbitial period, determining size and color respectively
- Detailed view of an exoplanet's data when clicking on its search result

## Planned Functionality
- More advanced search abilities, such as ranges and additional values to search by
- Sort the result list alphabetically or ascending/descending by size, distance, etc.
- Chunked loading and searching of data to ensure optimum peformance

## Tools Used
[PhpStorm](https://www.jetbrains.com/phpstorm/) for writing the JavaScript, HTML and CSS  
[XAMPP](https://www.apachefriends.org/index.html) for simulating a website  
[Sublime Text](https://www.sublimetext.com/) for writing the Python which converts the data from CSV to JSON

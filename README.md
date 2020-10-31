# Exoplanets
Visualizer and interface for confirmed exoplanets' data.

A working "demo" can be accessed [here](https://egartley.net/projects/exoplanets/). The only modifications made are the base URL in `script.js` and small corrections in `style.css` to avoid conflicts with the website's own styling.

Data is sourced from the [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=PS) (DOI 10.26133/NEA12) as a CSV file and converted to JSON with `csv-to-json.py`. Two files are created, `data.json` and `values.json`, which contain all of the data and value names.

Putting the value names in a seperate file dramatically decreases the size of the data file, which is already quite large.

Running `build_index.py` produces an index which allows for only potential matches for a query to be retrieved, rather than all of the data no matter what. This reduces download size.

## Current Functionality
- Search through the data by name, host star or year discovered
- Results are displayed in a scrollable list, with the ability to display more
- Visualization of exoplanets based on their radius and orbitial period, determining size and color respectively
- Detailed view of an exoplanet's data when clicking on its search result

## Planned Functionality
- More advanced search abilities, such as ranges and additional values to search by
- Sort the result list alphabetically or ascending/descending by size, distance, etc.

## Tools Used
[PhpStorm](https://www.jetbrains.com/phpstorm/)  
[XAMPP](https://www.apachefriends.org/index.html)  
[Sublime Text](https://www.sublimetext.com/)

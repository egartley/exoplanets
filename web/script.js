const TEST_LIMIT = 20
const MIN_RAD = 1
const MAX_RAD = 2
const MIN_VISUAL = 24
const MAX_VISUAL = 72
const MIN_ORBIT = 1
const MAX_ORBIT = 1000
// const GOLDEN = 0.618033988749895
const PC_TO_LY = 3.26156378
const EMPTY_VALUE = "EMPTY"
const SEARCH_TYPES = ["pl_name", "pl_hostname", "pl_disc"]

let VALUES = []
let DATA = []

/**
 * Returns the specified data value of an exoplanet
 *
 * @param value The name/label of the value to retrieve
 * @param exoplanet The exoplanet in which to get the value from
 * @returns {*} The specified data value, or an empty string if not found
 */
function get(value, exoplanet) {
    const i = VALUES.indexOf(value)
    return i !== -1 ? exoplanet[i] : EMPTY_VALUE
}

function getListItemDataHTML(label, value, prettyName) {
    return "<span class=\"" + prettyName + "\"><span class=\"list-value-label\">" + label + ":</span> " + String(value) + "</span>"
}

/**
 * Returns HTML for the given exoplanet's list item
 *
 * @param exoplanet The exoplanet to be represented by the list item
 * @returns {string} HTML for the exoplanet's list item
 */
function getListItemHTML(exoplanet) {
    const rowid = get("rowid", exoplanet)
    const name = get("pl_name", exoplanet)
    const year = get("pl_disc", exoplanet)
    let distance = get("st_dist", exoplanet)
    // distance is in parsecs, so convert to lightyears
    distance *= PC_TO_LY
    // truncate to two decimals
    distance = distance.toFixed(2)
    return "<div class=\"list-item\" id=\"" + rowid + "\"><div class=\"left\"><div class=\"visual\"></div></div><div class=\"right\"><span class=\"title\">" + name + "</span>" + getListItemDataHTML("Found in", year, "year") + getListItemDataHTML("Distance", distance + " ly", "distance") + "</div></div>"
}

// Credit: https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
/*function getRandomColor() {
    let h = Math.random(), s = 0.5, v = 0.95;
    h += GOLDEN
    h %= 1
    return hsvToRgb(h, s, v)
}*/

// Credit: https://stackoverflow.com/a/17243070/13954969
function hsvToRgb(h, s, v) {
    let r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0:
            r = v
            g = t
            b = p
            break
        case 1:
            r = q
            g = v
            b = p
            break
        case 2:
            r = p
            g = v
            b = t
            break
        case 3:
            r = p
            g = q
            b = v
            break
        case 4:
            r = t
            g = p
            b = v
            break
        case 5:
            r = v
            g = p
            b = q
            break
        default:
            r = 1
            g = 1
            b = 1
            break
    }
    return "rgb(" + Math.round(r * 255) + ", " + Math.round(g * 255) + ", " + Math.round(b * 255) + ")"
}

/**
 * Scales, or "converts", a number in one range into another
 *
 * Ex. 5 in 1-10 would scale to 50 in 1-100
 *
 * @param x Number to scale
 * @param r1Min Minimum of the range x is in
 * @param r1Max Maximum of the range x is in
 * @param r2Min Minimum of the range to scale to
 * @param r2Max Maximum of the range to scale to
 * @returns {number} x scaled into the other range
 */
function scaled(x, r1Min, r1Max, r2Min, r2Max) {
    if (x < r1Min) {
        x = r1Min
    } else if (x > r1Max) {
        x = r1Max
    }
    return r2Min + (r2Max - r2Min) * (x - r1Min) / (r1Max - r1Min)
}

/**
 * Sets the visual representation for the given exoplanet in its list item. Color is determined by orbitial period and size is determined by the exoplanet's radius
 *
 * @param exoplanet The exoplanet to set the visual for
 */
function setVisual(exoplanet) {
    let radius = get("pl_rade", exoplanet);
    let orbit = get("pl_orbper", exoplanet);
    const rowid = get("rowid", exoplanet);
    const visual = $("div.list-item#" + rowid + " > div.left > div.visual");

    // determine color
    if (orbit > MAX_ORBIT) {
        orbit = MAX_ORBIT
    } else if (orbit < MIN_ORBIT) {
        orbit = MIN_ORBIT
    }
    const color = hsvToRgb(scaled(orbit, MIN_ORBIT, MAX_ORBIT, 0, 360), 0.7, 0.95);

    // determine size
    if (radius > MAX_RAD) {
        radius = MAX_RAD
    } else if (radius < MIN_RAD) {
        radius = MIN_RAD
    }
    const size = Math.round(scaled(radius, MIN_RAD, MAX_RAD, MIN_VISUAL, MAX_VISUAL));

    visual.css("width", size + "px")
    visual.css("height", size + "px")
    visual.css("background-color", color)
}

/**
 * Prepare the list container for displaying results
 */
function list_readyResults() {
    $("div.list-container span.list-start").hide()
    $("div.list-container span.list-none").hide()
    $("div.list-container").removeClass("list-container-empty")
    $("div.list-container > div.list-item").remove()
}

/**
 * Sets the list to display that there weren't any results
 */
function list_noResults() {
    $("div.list-container > div.list-item").remove()
    $("div.list-container").addClass("list-container-empty")
    $("div.list-container span.list-none").show()
}

function exoKeyUp(e) {
    const key = e.keyCode || e.which;
    if (13 === key) {
        executeQuery($("input.exo-search").val())
    }
}

function executeQuery(query) {
    // get search type, make sure it's valid
    const searchType = $("select.exo-search-type").val()
    let valid = false
    $.each(SEARCH_TYPES, function (index, type) {
        if (type === searchType) {
            valid = true
        }
    })
    if (!valid) {
        alert("There was a problem with validating the search type! (\"" + searchType + "\")")
        return
    }
    // validate the query
    valid = false
    const originalQuery = query
    if (query.includes(" ")) {
        query = query.replace(/\s/g, "")
    }
    if (query.includes("-")) {
        query = query.replace(/-/g, "")
    }
    if (query.includes("+")) {
        query = query.replace(/\+/g, "")
    }
    if (/^[a-z0-9]+$/i.test(query) === false) {
        alert("Invalid query! (can only include letters, numbers, spaces or \"+\" and \"-\")")
        return
    }
    // query and type are valid, actually do the search
    exoSearch(originalQuery, searchType)
}

function exoSearch(query, type) {
    let cleared = false
    const list = $("div.list-container")
    $.each(DATA, function (index, exoplanet) {
        if (get(type, exoplanet).includes(query)) {
            if (!cleared) {
                list_readyResults()
                cleared = true
            }
            list.append(getListItemHTML(exoplanet))
            setVisual(exoplanet)
        }
    })
    if (!cleared) {
        list_noResults()
    }
}

function go_test() {
    list_readyResults()
    $.each(DATA, function (index, exoplanet) {
        if (index < TEST_LIMIT) {
            $("div.list-container").append(getListItemHTML(exoplanet))
            setVisual(exoplanet)
        }
    })
}

/*function go() {
    
}*/

$(document).ready(function () {
    $.getJSON("values.json", function (values) {
        $.getJSON("data.json", function (data) {
            VALUES = values
            DATA = data
            go_test()
        })
    })
})

const MIN_RAD = 1
const MAX_RAD = 2
const MIN_VISUAL = 24
const MAX_VISUAL = 72
const MIN_RAD2 = 0.65
const MAX_RAD2 = 3.1
const MIN_VISUAL2 = 72
const MAX_VISUAL2 = 256
const MIN_ORBIT = 1
const MAX_ORBIT = 1000

const PARSEC_LIGHTYEAR = 3.26156378
const SOL_MAG = 4.83
const POGSON = -2.5
const FLUX_INNER = 1.1
const FLUX_OUTTER = 0.53
const SPECTRAL_TYPES = ["B", "A", "F", "G", "K", "M"]
const SPECTRAL_BC = [-2.0, -0.3, -0.15, -0.4, -0.8, -2.0]

const LIMIT = 26832
const EMPTY_VALUE = "EMPTY"
const BASE_URL = "/exo/"
const SEARCH_TYPES = ["pl_name", "hostname", "disc_year"]
const DEFAULT_MAX_RESULTS = 15

let VALUES = []
let DATA = []
let LAST_DATA_KEY = ""
let LAST_QUERY = ""
let LAST_SEARCHTYPE = ""
let MORE_RESULTS = 0

/**
 * Returns the specified data value of an exoplanet
 *
 * @param value The name/label of the value to retrieve
 * @param exoplanet The exoplanet in which to get the value from
 * @returns {*} The specified data value, or an empty string if not found
 */
function get(value, exoplanet) {
    const i = VALUES.indexOf(value)
    return i !== -1 ? (exoplanet[i] !== "" ? exoplanet[i] : EMPTY_VALUE) : EMPTY_VALUE
}

function getListItemDataHTML(label, value) {
    return "<span><span class=\"list-value-label\">" + label + ":</span> " + value + "</span>"
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
    const year = get("disc_year", exoplanet)
    let distance = get("sy_dist", exoplanet)
    // distance is in parsecs, so convert to lightyears
    distance *= PARSEC_LIGHTYEAR
    // truncate to two decimals
    distance = distance.toFixed(2)
    return "<div class=\"list-item\" id=\"" + rowid + "\"><div class=\"left\"><div class=\"visual\"></div></div><div class=\"right\"><span class=\"title\">" + name + "</span>" + getListItemDataHTML("Found in", year) + getListItemDataHTML("Distance", distance + " ly") + "</div></div>"
}

function getMainDetailLabelHTML(label) {
    return "<span class=\"value-label\">" + label + ":</span>"
}

function getMainDetailValueHTML(value) {
    return "<span>" + value + "</span>"
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
            r = v, g = t, b = p;
            break;
        case 1:
            r = q, g = v, b = p;
            break;
        case 2:
            r = p, g = v, b = t;
            break;
        case 3:
            r = p, g = q, b = v;
            break;
        case 4:
            r = t, g = p, b = v;
            break;
        case 5:
            r = v, g = p, b = q;
            break;
        default:
            r = 1, g = 1, b = 1
    }
    return "rgb(" + Math.round(r * 255) + ", " + Math.round(g * 255) + ", " + Math.round(b * 255) + ")"
}

function getURLParameter(parameter) {
    const all = new URLSearchParams(window.location.search)
    return all.has(parameter) ? all.get(parameter) : ""
}

// Credit: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log
/**
 * Returns the logarithm with the given base and value
 *
 * @param base The base to use
 * @param x The number to calculate the logarithm of
 * @returns {number} log_base(x)
 */
/*function getBaseLog(base, x) {
    return Math.log(x) / Math.log(base);
}*/

// Credit: https://www.planetarybiology.com/calculating_habitable_zone.html
/**
 * Returns an array containing the inner and outer distance of the exoplanet's star's habitable zone in terms of AU
 *
 * @param exoplanet The exoplanet in which to use its star's data
 * @returns {number[]} [inner, outer]
 */
function getHabitableZone(exoplanet) {
    const gmag = get("gaia_gmag", exoplanet)
    const optmag = get("st_optmag", exoplanet)
    let apparentMag
    if (gmag === EMPTY_VALUE && optmag === EMPTY_VALUE) {
        return [0, 0]
    } else if (gmag !== EMPTY_VALUE && optmag === EMPTY_VALUE) {
        apparentMag = gmag
    } else if (gmag === EMPTY_VALUE && optmag !== EMPTY_VALUE) {
        apparentMag = optmag
    }
    let distance = get("sy_dist", exoplanet)
    const type = get("st_spstr", exoplanet).substring(0, 1)
    const index = SPECTRAL_TYPES.indexOf(type)
    let mV = apparentMag - (5 * Math.log(distance))
    let bc = index !== -1 ? SPECTRAL_BC[index] : -2.0
    let mBOL = mV + bc
    let lstar = Math.pow(10, (mBOL - SOL_MAG) / POGSON)
    return [Math.sqrt(lstar / FLUX_INNER).toFixed(2), Math.sqrt(lstar / FLUX_OUTTER).toFixed(2)]
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

function setVisual(exoplanet, visual, minRad, maxRad, minSize, maxSize) {
    let radius = get("pl_rade", exoplanet)
    let orbit = get("pl_orbper", exoplanet)

    // determine color
    if (orbit > MAX_ORBIT) {
        orbit = MAX_ORBIT
    } else if (orbit < MIN_ORBIT) {
        orbit = MIN_ORBIT
    }
    const color = hsvToRgb(scaled(orbit, MIN_ORBIT, MAX_ORBIT, 0, 360), 0.7, 0.95)

    // determine size
    if (radius === EMPTY_VALUE) {
        radius = minRad + ((maxRad - minRad) / 2)
    } else if (radius > maxRad) {
        radius = maxRad
    } else if (radius < minRad) {
        radius = minRad
    }
    const size = Math.round(scaled(radius, minRad, maxRad, minSize, maxSize))

    visual.css("width", size + "px")
    visual.css("height", size + "px")
    visual.css("background-color", color)
}

/**
 * Prepare the list container for displaying results
 */
function list_readyResults() {
    $("div.list-container > span.list-start").hide()
    $("div.list-container > span.list-none").hide()
    $("div.list-container").removeClass("list-container-empty")
    $("div.list-container > div.list-item").off()
    $("div.list-container > div.list-item").remove()
}

/**
 * Sets the list to display that there weren't any results
 */
function list_noResults() {
    $("div.list-container > div.list-item").remove()
    $("div.list-container").addClass("list-container-empty")
    $("div.list-container > span.list-none").show()
    $("div.list-container > span.list-start").hide()
}

function exoKeyUp(e) {
    const key = e.keyCode || e.which;
    if (13 === key) {
        // pressed enter
        MORE_RESULTS = 0
        exoDoQuery($("input.exo-search").val())
    }
}

function exoDoQuery(query) {
    // get search type, make sure it's valid
    const searchType = $("select.exo-search-type").val()
    let valid = SEARCH_TYPES.includes(searchType)
    if (!valid) {
        alert("There was a problem with validating the search type! (\"" + searchType + "\")")
        return
    }
    // validate the query
    valid = false
    if (query === "") {
        return
    }
    const originalQuery = query.toLowerCase()
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
    let length = 1
    let dir = "hoststar"
    if (type === SEARCH_TYPES[2]) {
        length = 4
        dir = "year"
    }
    let key = query.substring(0, length)
    if (LAST_DATA_KEY === key) {
        exoRunSearch(query, type)
    } else {
        LAST_DATA_KEY = key
        $.getJSON(BASE_URL + "index/" + dir + "/" + key + ".json", function (data) {
            DATA = data
            exoRunSearch(query, type)
        }).fail(function () {
            list_noResults()
        })
    }
}

function exoRunSearch(query, type) {
    let cleared = false
    let results = 0
    let all = true
    const list = $("div.list-container")
    $.each(DATA, function (index, exoplanet) {
        if (results === DEFAULT_MAX_RESULTS + (DEFAULT_MAX_RESULTS * MORE_RESULTS)) {
            all = false
            return
        }
        if (String(get(type, exoplanet)).toLowerCase().includes(query)) {
            if (!cleared) {
                list_readyResults()
                cleared = true
            }
            list.append(getListItemHTML(exoplanet))
            const rowid = get("rowid", exoplanet)
            setVisual(exoplanet, $("div.list-item#" + rowid + " > div.left > div.visual"), MIN_RAD, MAX_RAD, MIN_VISUAL, MAX_VISUAL)
            results++
        }
    })
    if (!cleared) {
        list_noResults()
    } else {
        exoRegisterListItemClicks()
    }
    let button = $("button#more-results")
    if (!all) {
        button.show()
    } else {
        button.hide()
    }
    LAST_QUERY = query
    LAST_SEARCHTYPE = type
}

function exoMoreResults() {
    MORE_RESULTS++
    exoRunSearch(LAST_QUERY, LAST_SEARCHTYPE)
}

function exoRegisterListItemClicks() {
    $("div.list-container > div.list-item").each(function () {
        const rowid = $(this).attr("id")
        $("div.list-container > div.list-item#" + rowid).on("click", function () {
            listItemClick(rowid)
        })
    })
}

function listItemClick(rowid) {
    window.location = BASE_URL + "?id=" + String(rowid)
}

function outputMainDetail(value, label) {
    value = value.toString()
    $("div.main-details-container div.main-details-labels").append(getMainDetailLabelHTML(label))
    $("div.main-details-container div.main-details-values").append(getMainDetailValueHTML(value.includes(EMPTY_VALUE) ? "<span style=\"color:grey\">Unknown</span>" : value))
}

function outputAllDetails(exoplanet) {
    let labels = $("div.all-data-container div.all-data-labels")
    let values = $("div.all-data-container div.all-data-values")
    for (let value of VALUES) {
        labels.append(getMainDetailLabelHTML(value))
        const v = get(value, exoplanet)
        values.append(getMainDetailValueHTML(v.includes(EMPTY_VALUE) ? "<span style=\"color:grey\">Unknown</span>" : v))
    }
}

function go_details(rowid) {
    $("div.exo-container#search").hide()
    $("div.exo-container#details").show()

    let exoplanet = []
    for (let exo of DATA) {
        if (get("rowid", exo) === rowid) {
            exoplanet = exo
            break
        }
    }

    const name = get("pl_name", exoplanet)
    $("title").html(name)
    $("div.main-card-text > h1").html(name)
    outputMainDetail((get("sy_dist", exoplanet) * PARSEC_LIGHTYEAR), "Distance (ly)")
    outputMainDetail(get("pl_orbper", exoplanet), "Orbit (days)")
    outputMainDetail(get("pl_masse", exoplanet), "Mass (Earth)")
    outputMainDetail(get("pl_rade", exoplanet), "Radius (Earth)")
    outputMainDetail(get("pl_orbeccen", exoplanet), "Eccentricity")
    outputMainDetail(get("disc_year", exoplanet) + " (" + get("discoverymethod", exoplanet) + ")", "Discovered")

    setVisual(exoplanet, $("div.main-card > div.main-card-visual"), MIN_RAD2, MAX_RAD2, MIN_VISUAL2, MAX_VISUAL2)

    outputAllDetails(exoplanet)

    $("button#all-data-toggle").on("click", function () {
        let alldata = $("div.all-data-container")
        if (alldata.is(":visible")) {
            $(this).html("Show")
            alldata.hide()
        } else {
            $(this).html("Hide")
            alldata.show()
        }
    })

    $("button#go-back").on("click", function () {
        window.location = BASE_URL
    })
}

function exoGo() {
    const id = getURLParameter("id")
    if (/[0-9]/.test(id) && parseFloat(id) <= LIMIT && parseFloat(id) >= 1) {
        $.getJSON(BASE_URL + "index/id/" + Math.floor(id / 1000) + ".json", function (data) {
            DATA = data
            go_details(id)
        })
    } else {
        if (id !== "") {
            alert("Invalid ID (must be between 1 and " + LIMIT + ")")
        }
        let button = $("button#more-results")
        button.on("click", function () {
            exoMoreResults()
        })
    }
}

$(document).ready(function () {
    $.getJSON("values.json", function (values) {
        VALUES = values
        exoGo()
    })
})

LIMIT = 200
MAX_RAD = 2
MIN_RAD = 1
MAX_VISUAL = 72
MIN_VISUAL = 24
MAX_ORBIT = 1000
MIN_ORBIT = 1
GOLDEN = 0.618033988749895
LIGHTYEAR = 3.26156378

function get(value, exoplanet, values) {
    return exoplanet[values.indexOf(value)]
}

function get_list_item_html(values, exoplanet) {
    return "<div class=\"list-item\" id=\"" + get("rowid", exoplanet, values) + "\"><div class=\"left\"><div class=\"visual\"></div></div><div class=\"right\"><span class=\"title\">" + get("pl_name", exoplanet, values) + "</span><span class=\"year\"><span class=\"list-value-label\">Found in:</span> " + get("pl_disc", exoplanet, values) + "</span><span class=\"distance\"><span class=\"list-value-label\">Distance:</span> " + (get("st_dist", exoplanet, values) * LIGHTYEAR).toFixed(2) + " ly</span></div></div>"
}

// Credit: https://stackoverflow.com/a/17243070/13954969
function hsv_to_rgb(h, s, v) {
    var r, g, b, i, f, p, q, t;
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

// Credit: https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
function get_random_color() {
    var h = Math.random(), s = 0.5, v = 0.95
    h += GOLDEN
    h %= 1
    return hsv_to_rgb(h, s, v)
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

function set_visual(values, exoplanet) {
    // color based on orbital period
    // size based on radius
    var rowid = get("rowid", exoplanet, values)
    var radius = get("pl_rade", exoplanet, values)
    var orbit = get("pl_orbper", exoplanet, values)
    var visual = $("div.list-item#" + rowid + " > div.left > div.visual")

    // determine color
    if (orbit > MAX_ORBIT) {
        orbit = MAX_ORBIT
    } else if (orbit < MIN_ORBIT) {
        orbit = MIN_ORBIT
    }
    var color = hsv_to_rgb(scaled(orbit, MIN_ORBIT, MAX_ORBIT, 0, 360), 0.7, 0.95)

    // determine size
    if (radius > MAX_RAD) {
        radius = MAX_RAD
    } else if (radius < MIN_RAD) {
        radius = MIN_RAD
    }
    var size = Math.round(scaled(radius, MIN_RAD, MAX_RAD, MIN_VISUAL, MAX_VISUAL))

    visual.css("width", size + "px")
    visual.css("height", size + "px")
    visual.css("background-color", color)
}

function exoSearch(e) {
    var key = e.keyCode || e.which
    if (13 === key) {
        // TODO: search and display results
    }
}

function go_test(values, exoplanets) {
    $("div.list-container span.list-start").hide()
    $("div.list-container").removeClass("list-container-empty")
    $.each(exoplanets, function (index, exoplanet) {
        if (index < LIMIT) {
            $("div.list-container").append(get_list_item_html(values, exoplanet))
            set_visual(values, exoplanet)
        }
    })
}

function go(values, exoplanets) {
    
}

$(document).ready(function () {
    $.getJSON("values.json", function (values) {
        $.getJSON("data.json", function (data) {
            go_test(values, data)
        })
    })
})

LIMIT = 200
MAX_RAD = 30
MIN_RAD = 3
MAX_VISUAL = 88
MIN_VISUAL = 24
MAX_ORBIT = 1000
MIN_ORBIT = 1
GOLDEN = 0.618033988749895
LIGHTYEAR = 3.26156378

function get(value, exoplanet, values) {
    return exoplanet[values.indexOf(value)]
}

function get_list_item_html(values, exoplanet) {
    return "<div class=\"list-item\" id=\"" + get("rowid", exoplanet, values) + "\"><div class=\"left\"><div class=\"visual\"></div></div><div class=\"right\"><span class=\"title\">" + get("pl_name", exoplanet, values) + "</span><span class=\"year\">Discovered in " + get("pl_disc", exoplanet, values) + "</span><span class=\"distance\">" + (get("st_dist", exoplanet, values) * LIGHTYEAR) + " light years away</span></div></div>"
}

// Credit: https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
function hsv_to_rgb(h, s, v) {
    var h_i = Math.floor(h * 6)
    var f = h * 6 - h_i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s)
    var rgb
    switch (h_i) {
        case 0:
            rgb = [v, t, p]
            break
        case 1:
            rgb = [q, v, p]
            break
        case 2:
            rgb = [p, v, t]
            break
        case 3:
            rgb = [p, q, v]
            break
        case 4:
            rgb = [t, p, v]
            break
        case 5:
            rgb = [v, p, q]
            break
        default:
            rgb = [0, 0, 0]
    }
    return "rgb(" + Math.floor(rgb[0] * 256) + ", " + Math.floor(rgb[1] * 256) + ", " + Math.floor(rgb[2] * 256) + ")"
}

// Credit: https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
function get_random_color() {
    var h = Math.random(), s = 0.5, v = 0.95
    h += GOLDEN
    h %= 1
    return hsv_to_rgb(h, s, v)
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
    var color = hsv_to_rgb(orbit / MAX_ORBIT, 0.7, 0.95)

    // determine size
    if (radius > MAX_RAD) {
        radius = MAX_RAD
    } else if (radius < MIN_RAD) {
        radius = MIN_RAD
    }
    var size = Math.round(MIN_VISUAL + (MAX_VISUAL - MIN_VISUAL) * (radius - MIN_RAD) / (MAX_RAD - MIN_RAD))
    // console.log("[" + rowid + "] " + size)

    visual.css("border", "1px solid transparent")
    visual.css("border-radius", (size / 2) + "px")
    visual.css("width", size + "px")
    visual.css("height", size + "px")
    visual.css("background-color", color)
}

function go(values, exoplanets) {
    $("div.list-container").html("")
    $.each(exoplanets, function(index, exoplanet) {
        if (index < LIMIT) {
            $("div.list-container").append(get_list_item_html(values, exoplanet))
            set_visual(values, exoplanet)
        }
    });
}

$(document).ready(function() {
    $.getJSON( "values.json", function(values) {
        $.getJSON( "data.json", function(data) {
            go(values, data)
        })
    })
})

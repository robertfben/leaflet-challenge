// coordinates for North America
var northAmericaCoordinates = [42.5260, -105.2551]
var mapZoomLevel = 3.5;

// create the createMap function
function createMap(sixthTierLayer, fifthTierLayer, fourthTierLayer, thirdTierLayer, secondTierLayer, firstTierLayer) {

    // Create the tile layer that will be the background of the map
    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create the satellite map tile layer
    var Stamen_Toner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20,
        ext: 'png'
    });

    // Create a baseMaps object to hold the streetmap layer
    var baseMaps = {
        'Street Map': streetmap,
        'Satellite Map': Stamen_Toner
    };

    // Create an overlayMaps object to hold the earthquake layer
    var overlayMaps = {
        '90+ Earthquake Depth': sixthTierLayer,
        '70-90 Earthquake Depth': fifthTierLayer,
        '50-70 Earthquake Depth': fourthTierLayer,
        '30-50 Earthquake Depth': thirdTierLayer,
        '10-30 Earthquake Depth': secondTierLayer,
        '10 and Under Earthquake Depth': firstTierLayer
    };

    // Create the map object with options
    var map = L.map('map', {
        center: northAmericaCoordinates,
        zoom: mapZoomLevel,
        layers: [streetmap, sixthTierLayer, fifthTierLayer, fourthTierLayer, thirdTierLayer, secondTierLayer, firstTierLayer]
    })

    // create a layer control, and pass it to baseMaps and overlayMaps
    // add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

    // make a variable for the legend and position it in bottomright
    var legend = L.control(
        {
            position: 'bottomright'
        }
    );

    // add the properties for the legend
    legend.onAdd = function () {
        // create a div for the legend
        var div = L.DomUtil.create('div', 'info legend');

        var intervals = [0, 10, 30, 50, 70, 90];
        // array to represent colors associated with the intervals
        var colors = [
            '#5aff00',
            '#D8ff00',
            '#Fff500',
            '#Ffcf00',
            '#Ff9000',
            '#Ff0300'
        ];

        // use loop to generate labels within the div
        // div starts empty, then is populated with the data from the arrays
        for (var i = 0; i < intervals.length; i++) {
            // display the colors and the interval values
            // use .innerHTML to set the value of the color and the text for the interval
            div.innerHTML += "<i style='background: " + colors[i] + "'></i>"
                + intervals[i]
                + (intervals[i + 1] ? " bikes &ndash; " + intervals[i + 1] + " bikes<br>" : "+");
        }

        return div;
    };

    // add legend to map
    legend.addTo(map);

};


// Creating the createMarkers function to pull earthquake data and create its markers
// for North America only (do later)
function createMarkers(data) {

    // Pull the properties needed
    // create array of features to go through
    var features = data.features

    // Initialize arrays to hold the earthquake depths markers
    var sixthTierDepth = [] // array for earthquake depth 90+
    var fifthTierDepth = [] // array for earthquake depth 70-90
    var fourthTierDepth = [] // array for earthquake depth 50-70
    var thirdTierDepth = [] // array for earthquake depth 30-50
    var secondTierDepth = [] // array for earthquake depth 10-30
    var firstTierDepth = [] // array for earthquake depth 10 and below

    // Loop through the features array
    for (var i = 0; i < features.length; i++) {

        // change the marker size based on magnitude
        var markerRadius = features[i].properties.mag * 4;
        var markerColor;

        // change marker color based on earthquake depth
        if (features[i].geometry.coordinates[2] > 90)
            markerColor = '#Ff0300'
        else if (features[i].geometry.coordinates[2] >= 70)
            markerColor = '#Ff9000'
        else if (features[i].geometry.coordinates[2] >= 50)
            markerColor = '#Ffcf00'
        else if (features[i].geometry.coordinates[2] >= 30)
            markerColor = '#Fff500'
        else if (features[i].geometry.coordinates[2] >= 10)
            markerColor = '#D8ff00'
        else
            markerColor = '#5aff00'

        // For each feature, create a marker and bind popup with the ...
        var earthquake = L.circleMarker([features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]], {
            fillOpacity: .50,
            color: markerColor,
            fillColor: markerColor,
            radius: markerRadius,
            weight: 1
        })
            .bindPopup(`<h2>Info:</h2>${features[i].properties.title}<hr><b>Depth:</b> ${features[i].geometry.coordinates[2]}`)

        // populate array based on earthquake depth level
        if (features[i].geometry.coordinates[2] > 90)
            sixthTierDepth.push(earthquake);
        else if (features[i].geometry.coordinates[2] >= 70)
            fifthTierDepth.push(earthquake);
        else if (features[i].geometry.coordinates[2] >= 50)
            fourthTierDepth.push(earthquake);
        else if (features[i].geometry.coordinates[2] >= 30)
            thirdTierDepth.push(earthquake);
        else if (features[i].geometry.coordinates[2] >= 10)
            secondTierDepth.push(earthquake);
        else
            firstTierDepth.push(earthquake);

    };

    // Create a layer group made from earthquake markers array
    // and pass it to the createMap function
    var sixthTierLayer = L.layerGroup(sixthTierDepth);
    var fifthTierLayer = L.layerGroup(fifthTierDepth);
    var fourthTierLayer = L.layerGroup(fourthTierDepth);
    var thirdTierLayer = L.layerGroup(thirdTierDepth);
    var secondTierLayer = L.layerGroup(secondTierDepth);
    var firstTierLayer = L.layerGroup(firstTierDepth);

    // createMap with all layers
    createMap(sixthTierLayer, fifthTierLayer, fourthTierLayer, thirdTierLayer, secondTierLayer, firstTierLayer);

}

// use d3 json to access queryurl data and API call to get earthquake info. call create markers function
queryURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

d3.json(queryURL).then(
    createMarkers
);

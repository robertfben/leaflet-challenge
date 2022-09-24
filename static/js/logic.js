// coordinates for North America
var northAmericaCoordinates = [54.5260, -105.2551]
var mapZoomLevel = 3;

// create the createMap function
function createMap(earthquakeLayer) {

    // Create the tile layer that will be the background of the map
    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

    // Create a baseMaps object to hold the streetmap layer
    var baseMaps = {
        'Street Map': streetmap
    };

    // Create an overlayMaps object to hold the earthquake layer
    var overlayMaps = {
        'Earthquake Locations': earthquakeLayer
    };

    // Create the map object with options
    var map = L.map('map', {
        center: northAmericaCoordinates,
        zoom: mapZoomLevel,
        layers: [streetmap, earthquakeLayer]
    })

    // create a layer control, and pass it to baseMaps and overlayMaps
    // add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

};


// Creating the createMarkers function to pull earthquake data and create its markers
// for North America only (do later)
function createMarkers(data) {
    console.log(data.features[0]);

    // Pull the properties needed
    // create array of features to go through
    //console.log(data.features[0].geometry.coordinates)
    var features = data.features

    // Initialize array to hold the earthquake markers
    var earthquakeMarkers = []

    // Loop through the features array
    for (var i = 0; i < features.length; i++) {

        // change the marker size based on magnitude
        var markerRadius = features[i].properties.mag * 10

        // For each feature, create a marker and bind popup with the ...
        var earthquake = L.circle([features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]], {
            fillOpacity: .30,
            color: 'green',
            fillColor: 'green',
            radius: markerRadius,
            weight: 1
        })
            .bindPopup(`<h2>Info:</h2>${features[i].properties.title}<hr><b>Depth:</b> ${features[i].geometry.coordinates[2]}`)

        // add the marker to earthquakeMarkers array
        earthquakeMarkers.push(earthquake)
    };

    // Create a layer group made from earthquake markers array
    // and pass it to the createMap function
    var earthquakeLayer = L.layerGroup(earthquakeMarkers);

    createMap(earthquakeLayer);

}

// use d3 json to access queryurl data and API call to get earthquake info. call create markers function
queryURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(
    createMarkers
);

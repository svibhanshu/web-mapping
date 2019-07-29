var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
console.log(data.features);
// Once we get a response, send the data.features object to the createFeatures function
createFeatures(data.features);
});


function createFeatures(earthquakeData) {
// Define a function we want to run once for each feature in the features array
// Give each feature a popup describing the place and time of the earthquake
var earthquakes = L.geoJSON(earthquakeData, {
onEachFeature: function(feature, layer) {
    layer.bindPopup("<h3>Magnitude: " + feature.properties.mag + "</h3><hr>Location: " + feature.properties.place + "</h3><hr><p>" +new Date(feature.properties.time) + "</p>");
},


pointToLayer: function (feature, latlng) {
    return new L.circle(latlng,
        {radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        fillOpacity: .6,
        color: "#000",
        stroke: true,
        weight: .8
    })
}
});

createMap(earthquakes);
}

function createMap(earthquakes) {

// Define streetmap and satellitemap layers

var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  
// Define a baseMaps object to hold our base layers
var baseMaps = {
      "Satellite Map": satellitemap,
      "Dark Map": darkmap
};

// Create an overlay object to hold our overlay layer
var overlayMaps = {
    "Earthquakes": earthquakes
};

  
// Create our map, giving it the streetmap, satellite map, darkmap and earthquakes layers to display on load
var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [satellitemap, earthquakes]
});
  
    // Create a layer control and add it to the basemaps and overlaymaps
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);
}
CreateLegend();

function CreateLegend(){
   var legend = L.control({position: "bottomright"});
   legend.onAdd = function(){
       var div = L.DomUtil.create("div","info legend");
       var labels = ["0-1","1-2","2-3","3-4","4-5","5+"];
       var legends = [];

       for(var i=0;i<labels.length;i++){
           legends.push("<li style=\"list-style-type:none;\"><div style=\"background-color: " + getColor(i) + "\">&nbsp;</div> " +
           "<div>" + labels[i] + "</div></li>");}
           div.innerHTML += "<ul class='legend'>" + legends.join("") + "</ul>";
           return div;
       };

    legend.addTo(myMap)

}

//Create color range for the circle diameter 
function getColor(mag){
    switch(parseInt(mag)){
        case 0: return '#b7f34d';
        case 1: return '#e1f34d';
        case 2: return '#f3db4d';
        case 3: return '#f3ba4d';
        case 4: return '#f0a76b';
        default: return '#f06b6b';
    }
}

//Change the maginutde of the earthquake by a factor of 25,000 for the radius of the circle. 
function getRadius(value){
  return value*25000
}

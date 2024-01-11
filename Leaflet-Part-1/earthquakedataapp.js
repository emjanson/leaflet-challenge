// Initialize Leaflet map
var map = L.map("map").setView([37.7749, -122.4194], 4);

// Add a tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Load GeoJSON data from USGS URL with D3
d3.json(
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
).then(function (data) {
  // Use D3 to add GeoJSON to the Leaflet map
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      // Customize marker based on magnitude and depth
      var radius = feature.properties.mag * 5; // Adjust this multiplier as needed
      var depth = feature.geometry.coordinates[2];
      var color = getColor(depth);

      return L.circleMarker(latlng, {
        radius: radius,
        fillColor: color,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      });
    },
    onEachFeature: function (feature, layer) {
      // Customize popups
      layer.bindPopup(
        "<b>Magnitude:</b> " +
          feature.properties.mag +
          "<br>" +
          "<b>Depth:</b> " +
          feature.geometry.coordinates[2] +
          "<br>" +
          "<b>Location:</b> " +
          feature.properties.place
      );
    },
  }).addTo(map);
});

// Function to determine color based on depth
function getColor(depth) {
  // Customize this color scale based on your preferences
  return depth > 90
    ? "#67000d"
    : depth > 70
    ? "#a50f15"
    : depth > 50
    ? "#de2d26"
    : depth > 30
    ? "#fb6a4a"
    : depth > 10
    ? "#fee08b"
    : "#d9f0a3";
}

// Create legend control
var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend"),
    depthBins = [-10, 10, 30, 50, 70, 90];

  div.innerHTML += "<strong>Earthquake Depth (km)</strong><br>";

  // Loop through depth bins and generate a label with a colored square for each bin
  for (var i = 0; i < depthBins.length; i++) {
    // Append HTML content to the 'div' element
    div.innerHTML +=
      // Create a container ('div') for styling purposes
      '<div class="legend-item">' +
      // Create an inline element ('i') with a style attribute to set its background color
      '<i style="background:' +
      getColor(depthBins[i] + 1) +
      '"></i>' +
      // Display the depth bin range
      "<span>" +
      depthBins[i] +
      (depthBins[i + 1] ? "&ndash;" + depthBins[i + 1] : "+") +
      "</span>" +
      "</div>";
  }

  return div;
};

// Add legend to map
legend.addTo(map);

$(document).ready(function(){
  var CONFIG = {
    accessToken: MAPBOX_ACCESS_TOKEN,
    attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    '<a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets',
    maxZoom: 18,
    tiles_api: 'https://api.tiles.mapbox.com/v4/' +
    '{id}/{z}/{x}/{y}@2x.png?access_token={accessToken}'
  };
  var MyMap = L.Map.extend({
    initialize: function(id) {
      L.Map.prototype.initialize.call(this, id);
    },
    configureLocation: function() {
      function onLocationFound(e) {
        var radius = {
          meters: e.accuracy / 2,
          feet: Math.round(e.accuracy / 2 * 3.28084)
        };
        L.marker(e.latlng).addTo(this)
        .bindPopup("You're within " + radius.feet + " feet of this pin").openPopup();
        L.circle(e.latlng, radius.meters).addTo(this);
      }
      function onLocationError(e) {
        alert(e.message);
      }
      this.on('locationfound', onLocationFound);
      this.on('locationerror', onLocationError);
      this.locate({setView: true, maxZoom: 16});
    },
    addToMap: function(data) {
      function getIconFromCategory(category) {
        var iconCategories = {
          'restaurants': {
            'color': '#e74c3c',
            'icon': 'restaurant'
          },
          'food': {
            'color': '#e67e22',
            'icon': 'bakery'
          },
          'shopping': {
            'color': '#2ecc71',
            'icon': 'shop'
          },
          'hotelstravel': {
            'color': '#3498db',
            'icon': 'ferry'
          },
          'arts': {
            'color': '#9b59b6',
            'icon': 'town-hall'
          },
        };
        var iconOptions = {
          color: iconCategories[category].color,
          icon: iconCategories[category].icon,
          size: 'm'
        };
        return iconOptions;
      }
      var geoJsonLayer = L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
          iconOptions = getIconFromCategory(feature.properties.parent_category);
          return L.marker(latlng, {icon: L.MakiMarkers.icon(iconOptions)});
        }
      });
      geoJsonLayer.addTo(this);
      this.fitBounds(geoJsonLayer.getBounds());
      return geoJsonLayer;
    }
  });

  var map = new MyMap('map');
  L.tileLayer(CONFIG.tiles_api, _.omit(CONFIG, 'tiles_api')).addTo(map);
  map.configureLocation();

  var geoJsonLayer;
  $.ajax({
    async: false,
    contentType: 'application/json',
    dataType: 'jsonp',
    jsonpCallback: 'callback',
    success: function(data) {
      geoJsonLayer = map.addToMap(data);
    },
    error: function(e) {
      console.log(e.message);
    },
    url: GEOJSON_LOCATION
  });
});

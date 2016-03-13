$(document).ready(function(){
  var CONFIG = {
    mapbox: {
      accessToken: MAPBOX_ACCESS_TOKEN,
      attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a> | ' +
      '<a href="http://mapbox.com">Mapbox</a>',
      id: 'mapbox.streets',
      maxZoom: 18,
      tiles_api: 'https://api.tiles.mapbox.com/v4/' +
      '{id}/{z}/{x}/{y}@2x.png?access_token={accessToken}'
    },
    locateOptions: {
      metric: false,
      showPopup: false,
      icon: 'fa fa-location-arrow',
      locateOptions: {
        maxZoom: 15
      }
    },
    categories: {
      restaurants: {
        icon: {
          color: '#e74c3c',
          glyph: 'restaurant'
        }
      },
      food: {
        icon: {
          color: '#e67e22',
          glyph: 'fast-food',
          // glyph: 'bakery',
          // glyph: 'cafe',
        }
      },
      shopping: {
        icon: {
          color: '#f1c40f',
          glyph: 'shop'
        }
      },
      thingstodo: {
        icon: {
          color: '#9b59b6',
          glyph: 'town-hall'
        }
      },
      parks: {
        icon: {
          color: '#2ecc71',
          glyph: 'park'
        }
      },
      ferries: {
        icon: {
          color: '#3498db',
          glyph: 'ferry'
        }
      },
    }
  };
  var MyMap = L.Map.extend({
    initialize: function(id, opt) {
      var options = opt || {};
      L.Map.prototype.initialize.call(this, id, options);
    },
    generateLayer: function(data) {
      var geoJsonLayer = L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
          var category = feature.properties.parent_category;
          var iconOptions = {
            color: CONFIG.categories[category].icon.color,
            icon: CONFIG.categories[category].icon.glyph,
            size: 'm'
          };
          return L.marker(latlng, {icon: L.MakiMarkers.icon(iconOptions)});
        },
        onEachFeature: function(feature, layer) {
          var f = feature.properties;
          var html = '<b>' + f.name + '</b><br>';
          html += f.address + '<br>';
          html += 'Links: <a href="' + f.url + '" target="_blank">Yelp</a>';
          layer.bindPopup(html, {closeButton: false});
        }
      });
      return geoJsonLayer;
    }
  });

  var options = {};
  if (IFRAME) {
    options = {
      'attributionControl': false,
      'zoomControl': false,
      'touchZoom': false,
      'scrollWheelZoom': false
    };
  }

  var map = new MyMap('map', options);
  L.tileLayer(CONFIG.mapbox.tiles_api, _.omit(CONFIG.mapbox, 'tiles_api')).addTo(map);
  if (!IFRAME) L.control.locate(CONFIG.locateOptions).addTo(map);
  var layerControl = L.control.layers(null, null, {position: 'topright'});

  var geoJsonLayer;
  $.ajax({
    async: false,
    contentType: 'application/json',
    dataType: 'jsonp',
    jsonpCallback: 'callback',
    success: function(data) {
      var bounds = new L.LatLngBounds();
      _.each(Object.keys(data), function(category) {
        var layer = map.generateLayer(data[category]);
        layer.addTo(map);
        bounds.extend(layer.getBounds());
        layerControl.addOverlay(layer, category);
      });
      layerControl.addTo(map);
      var container = $($(layerControl)[0]._container);
      $(container.children("a")[0]).html('<span class="fa fa-bars"></span>');
      map.fitBounds(bounds);
      if (typeof ZOOM !== 'undefined') map.setZoom(ZOOM);
    }, error: function(e) {
      console.log(e.message);
    },
    url: GEOJSON_LOCATION
  });
});

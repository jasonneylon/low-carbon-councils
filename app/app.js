'use strict';

angular.module('ordinal', []).filter('ordinal', function() {
  var ordinal = function(input) {
    // Only process numeric values.
    if (isNaN(input) || input === null) return input;

    var s=["th","st","nd","rd"],
    v=input%100;
    return input+(s[(v-20)%10]||s[v]||s[0]);
  }

  return ordinal;
});

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.uk',
  'myApp.region',
  'myApp.council',
  'regionServices',
  'councilServices',
  'countryServices',
  'ordinal'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/uk'});

  var map = L.map('map').setView([54.9, -1.5], 6);

  L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'examples.map-20v6611k'
  }).addTo(map);

  var RegionData = {}

  $.ajaxSetup({async: false});
  $.getJSON('data/uk', function(data) {
      RegionData = data;
  });
  $.ajaxSetup({async: true});
    //alert("Data var: " + RegionData);


  function getRegionById(id) {
    return _.find(RegionData, {"LA_id": id});
  }
    
  // control that shows state info on hover
  var info = L.control();

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };

  info.update = function (feature) {
    if (!_.isObject(feature)) {
      return;
    }
    var region = getRegionById(feature.id);
    this._div.innerHTML = '<h4>Renewables Data</h4>' +  (feature ?
      '<b>' + feature.properties.name + '</b><br />' + getValue(region) + ' kW per household</sup>'
      : 'Hover over a county');
  };

  info.addTo(map);

  // Calculate the value to be displayed - taken from the feature data
  function getValue(f) {
    if (!_.has(f, "kw_per_household"))
    {
      console.warn("Map is missing kw_per_household data");
      return 0;
    }
    //var calc = (f.pv.total+f.wind.total+f.chp.total)/f.households*10000;
    var calc = (f.kw_per_household).toFixed(2);
    return eval(calc);
  }

  var range = 1;
  var grades = [0, 1, 2, 5, 10, 20, 50, 100];

  // get color depending on population density value
  function getColor(v) {
    var d = v * 100 / range;
    return d > grades[7]  ? '#8c2d04' :
           d > grades[6]  ? '#d94801' :
           d > grades[5]  ? '#f16913' :
           d > grades[4]  ? '#fd8d3c' :
           d > grades[3]  ? '#fdae6b' :
           d > grades[2]  ? '#fdd0a2' :
           d > grades[1]  ? '#fee6ce' :
                      '#fff5eb';
  }

  function style(feature) {
    if (feature === null) {
      return; 
    }
    var kw_per_household = getValue(getRegionById(feature.id));
    return {
      weight: 0.5,
      opacity: 1,
      color: 'grey',
      //dashArray: '3',
      fillOpacity: 0.5,
      fillColor: getColor(kw_per_household)
    };
  }

  function highlightFeature(e) {

    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
    }

    info.update(layer.feature);
  }

  var geojson;

  function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
  }

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
    window.location.href= '#/council/' + e.target.feature.id;
    // console.log("moved?", $location)
  }

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    });
  }

  geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
      labels = [],
      from, to;

    for (var i = 0; i < grades.length; i++) {
      from = grades[i]/100*range;
      to = grades[i + 1]/100*range;

      labels.push(
        '<i style="background:' + getColor(from + 0.001) + '"></i> ' +
        from + (to ? '&ndash;' + to : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
  };

  legend.addTo(map);

}]);
'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.uk',
  'myApp.region',
  'myApp.council',
  'myApp.version',
  'regionServices',
  'leaflet-directive',
  'ordinal'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/uk'});

  var RegionData = {}

    $.ajaxSetup({async: false});
    $.getJSON('data/UK.json', function(data) {
        //alert("Data Loaded: " + data);
        RegionData = data;
    });
    $.ajaxSetup({async: true});
    //alert("Data var: " + RegionData);
    //alert("Data Extract: " + RegionData["23UB"].pv.total);
    
    var map = L.map('map').setView([53.0, -1.5], 6);

  L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'examples.map-20v6611k'
  }).addTo(map);


  // control that shows state info on hover
  var info = L.control();

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };

  info.update = function (feature) {
    this._div.innerHTML = '<h4>UK Renewables Data</h4>' +  (feature ?
      '<b>' + feature.properties.name + '</b><br />' + (RegionData[feature.id].pv.total) + ' kWh<sup>2</sup>'
      : 'Hover over a county');
  };

  info.addTo(map);

  // get color depending on population density value
  function getColor(d) {
                      var range = 10000/1000;
    return d > 1000*range ? '#800026' :
           d > 500*range  ? '#BD0026' :
           d > 200*range  ? '#E31A1C' :
           d > 100*range  ? '#FC4E2A' :
           d > 50*range   ? '#FD8D3C' :
           d > 20*range   ? '#FEB24C' :
           d > 10*range   ? '#FED976' :
                      '#FFEDA0';
  }

  function style(feature) {
    return {
      weight: 0.5,
      opacity: 1,
      color: 'grey',
      //dashArray: '3',
      fillOpacity: 0.5,
      fillColor: getColor(RegionData[feature.id].pv.total)
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
    console.log(e.target.feature);
    window.location.href= '#/council/London/' + e.target.feature.id;
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
    var range = 10000/1000;
    var div = L.DomUtil.create('div', 'info legend'),
      grades = [0*range, 10*range, 20*range, 50*range, 100*range, 200*range, 500*range, 1000*range],
      labels = [],
      from, to;

    for (var i = 0; i < grades.length; i++) {
      from = grades[i];
      to = grades[i + 1];

      labels.push(
        '<i style="background:' + getColor(from + 1) + '"></i> ' +
        from + (to ? '&ndash;' + to : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
  };

  legend.addTo(map);



}]);



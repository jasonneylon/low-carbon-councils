'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.uk',
  'myApp.region',
  'myApp.council',
  'myApp.version',
  'regionServices',
  'leaflet-directive'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/uk'});
}]);

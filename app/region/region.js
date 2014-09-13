'use strict';

angular.module('myApp.region', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/region/:regionName', {
    templateUrl: 'region/region.html',
    controller: 'RegionCtrl'
  });
}])

.controller('RegionCtrl', ['$scope', '$routeParams', '$http', 'Region',
  function($scope, $routeParams, $http, Region) {
    $scope.region = Region.query({name: $routeParams.regionName});
    $scope.regionName = $routeParams.regionName;

   $http.get("data/maps/2490.geojson").success(function(data, status) {
      angular.extend($scope, {
          geojson: {
              data: data,
              resetStyleOnMouseout: true
          }
      });
    });

   angular.extend($scope, {
      center: {
        lat: 51,
        lng: 0,
        zoom: 9
      },
      defaults: {
          scrollWheelZoom: false
      }
    });
  }]);

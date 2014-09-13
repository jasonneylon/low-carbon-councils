'use strict';

angular.module('myApp.region', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/region/:regionName', {
    templateUrl: 'region/region.html',
    controller: 'RegionCtrl'
  });
}])

.controller('RegionCtrl', ['$scope', '$routeParams', 'Region',
  function($scope, $routeParams, Region) {
    $scope.region = Region.query({name: $routeParams.regionName});

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

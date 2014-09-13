'use strict';

angular.module('myApp.region', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/region', {
    templateUrl: 'region/region.html',
    controller: 'RegionCtrl'
  });
}])

.controller('RegionCtrl', ['$scope', 'Region',
  function($scope, Region) {
    $scope.region = Region.query();

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

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
  }]);
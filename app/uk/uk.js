'use strict';

angular.module('myApp.uk', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/uk', {
    templateUrl: 'uk/uk.html',
    controller: 'UkCtrl'
  });
}])

.controller('UkCtrl', ['$scope', '$routeParams', 'Region',
  function($scope, $routeParams, Region) {
    $scope.regions =  [
      { name: "London", id: "London"},
      { name: "North West", id: "North_West"},
      { name: "North East", id: "North_East"},
      { name: "Scotland", id: "Scotland"},
      ];


     angular.extend($scope, {
        center: {
          lat: 51,
          lng: 0,
          zoom: 4
        },
        defaults: {
            scrollWheelZoom: false
        }
    });
  }]);

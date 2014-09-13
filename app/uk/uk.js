'use strict';

angular.module('myApp.uk', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/uk', {
    templateUrl: 'uk/uk.html',
    controller: 'UkCtrl'
  });
}])

.controller('UkCtrl', ['$scope', '$routeParams', '$http', 'Region',
  function($scope, $routeParams, $http, Region) {
    $scope.regions =  [
      { name: "London", id: "London"},
      { name: "North West", id: "North_West"},
      { name: "North East", id: "North_East"},
      { name: "Scotland", id: "Scotland"},
      ];

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
          lat: 55,
          lng: -2,
          zoom: 5
        },
        defaults: {
            scrollWheelZoom: false
        }
    });
  }]);

'use strict';

angular.module('myApp.council', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/council/:region/:laId', {
    templateUrl: 'council/council.html',
    controller: 'CouncilCtrl'
  });
}])

.controller('CouncilCtrl', ['$scope', '$routeParams', '$http','Region',
  function($scope, $routeParams, $http, Region) {
    Region.query({name: $routeParams.region}, function(region) {
      $scope.council = _(region).find({ LA_id: $routeParams.laId });
    });


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
          lat: 51.45,
          lng: -0.12,
          zoom: 10
        },
        defaults: {
            scrollWheelZoom: false
        }
    });
  }]);

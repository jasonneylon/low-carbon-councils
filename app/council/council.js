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
      $scope.council_count = region.length;
      $scope.best_council = _(region).min("rank").value();
      console.log($scope.best_council);
    });

    $scope.regionName = $scope.region = $routeParams.region

   // $http.get("data/maps/2490.geojson").success(function(data, status) {
   //    var point = data.coordinates[0][0];
   //    // a bit of centering map 
   //    angular.extend($scope, {
   //        center: {
   //          lat: point[1] + 0.04,
   //          lng: point[0] - 0.04,
   //          zoom: 10
   //        },
   //        geojson: {
   //            data: data,
   //            resetStyleOnMouseout: true
   //        }
   //    });
   //  });

   //   angular.extend($scope, {
   //      center: {
   //        lat: 51.45,
   //        lng: -0.12,
   //        zoom: 10
   //      },
   //      defaults: {
   //          scrollWheelZoom: false
   //      }
   //  });
  }]);

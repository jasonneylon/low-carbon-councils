'use strict';

angular.module('myApp.council', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/council/:laId', {
    templateUrl: 'council/council.html',
    controller: 'CouncilCtrl'
  });
}])

.controller('CouncilCtrl', ['$scope', '$routeParams', '$http','Council', 'Region',
  function($scope, $routeParams, $http, Council, Region) {

    Council.get({id: $routeParams.laId}, function(council) {
      $scope.council = council;
      $scope.regionName = $scope.region = council.region;
  
      Region.query({name: council.region}, function(region) {
        $scope.council_count = region.length;
        $scope.best_council = _(region).min("regional_rank").value();
      });
    });


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

'use strict';

angular.module('myApp.council', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/council/:region/:laId', {
    templateUrl: 'council/council.html',
    controller: 'CouncilCtrl'
  });
}])

.controller('CouncilCtrl', ['$scope', '$routeParams', 'Region',
  function($scope, $routeParams, Region) {
    Region.query({name: $routeParams.region}, function(region) {
      $scope.council = _(region).find({ LA_id: $routeParams.laId });
    });

     angular.extend($scope, {
        center: {
          lat: 51,
          lng: 0,
          zoom: 11
        },
        defaults: {
            scrollWheelZoom: false
        }
    });
  }]);

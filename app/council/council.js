'use strict';

angular.module('myApp.council', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/council/:laId', {
    templateUrl: 'council/council.html',
    controller: 'CouncilCtrl'
  });
}])

.controller('CouncilCtrl', ['$scope', 'Region',
  function($scope, Region) {
    var region = Region.query();
    $scope.council = region[0];

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

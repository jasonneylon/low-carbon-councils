'use strict';

angular.module('myApp.uk', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/uk', {
    templateUrl: 'uk/uk.html',
    controller: 'UkCtrl'
  });
}])

.controller('UkCtrl', ['$scope', '$routeParams', '$http', '$location', 'Region',
  function($scope, $routeParams, $http, $location, Region) {
    $scope.regions =  [
      { name: "London", id: "London"},
      { name: "North West", id: "North_West"},
      { name: "North East", id: "North_East"},
      { name: "Scotland", id: "Scotland"},
      ];
  }]);

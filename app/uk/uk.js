'use strict';

angular.module('myApp.uk', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/uk', {
    templateUrl: 'uk/uk.html',
    controller: 'UkCtrl'
  });
}])

.controller('UkCtrl', ['$scope', '$routeParams', '$http', '$location', 'Country',
  function($scope, $routeParams, $http, $location, Country) {
    $scope.regions =  [
      { name: "London", id: "London"},
      { name: "North West", id: "North_West"},
      { name: "North East", id: "North_East"},
      { name: "Scotland", id: "Scotland"},
      ];

    Country.query({}, function(councils) {
      console.log(councils);
      $scope.top_councils = _(councils).sortBy("national_rank").take(5).value();
      $scope.bottom_councils = _(councils).sortBy("national_rank").reverse().take(5).value();
      console.log($scope.top_councils);
    });

  }]);

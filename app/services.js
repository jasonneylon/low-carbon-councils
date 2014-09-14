'use strict';

/* Services */
var regionServices = angular.module('regionServices', ['ngResource']);

regionServices.factory('Region', ['$resource',
  function($resource) {
    return $resource('data/region/:name', {}, {
      query: {method: 'GET', params: {name: 'London'}, isArray: true}
    })
  }])


var councilServices = angular.module('councilServices', ['ngResource']);

councilServices.factory('Council', ['$resource',
  function($resource) {
    return $resource('data/council/:id', {}, {
      query: {method: 'GET', isArray: false}
    })
  }])

var countryServices = angular.module('countryServices', ['ngResource']);

countryServices.factory('Country', ['$resource',
  function($resource) {
    return $resource('/data/uk', {}, {
      query: {method: 'GET', isArray: true}
    })
  }])

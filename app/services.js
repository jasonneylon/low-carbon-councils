'use strict';

/* Services */
var regionServices = angular.module('regionServices', ['ngResource']);

regionServices.factory('Region', ['$resource',
  function($resource) {
    return $resource('data/regions/:name.json', {}, {
      query: {method: 'GET', params: {name: 'London'}, isArray: true}
    })
  }])

'use strict';

/* Services */
var regionServices = angular.module('regionServices', ['ngResource']);

regionServices.factory('Region', ['$resource',
  function($resource) {
    return $resource('data/regions/london.json', {}, {
      query: {method: 'GET', params: {phoneId: 'phones'},
      isArray: true}
    })
  }])

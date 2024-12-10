/* Copyright start
  Copyright (C) 2008 - 2024 Fortinet Inc.
  All rights reserved.
  FORTINET CONFIDENTIAL & FORTINET PROPRIETARY SOURCE CODE
  Copyright end */
  'use strict';

  (function () {
    angular
      .module('cybersponse')
      .factory('heatmapService', heatmapService);
  
    heatmapService.$inject = ['$q', '$http', 'Query', 'API', 'Entity', 'ALL_RECORDS_SIZE'];
  
    function heatmapService($q, $http, Query, API, Entity, ALL_RECORDS_SIZE) {
      var service;
      service = {
        getResourceAggregate: getResourceAggregate
      };
  
      //to fetch modules data through API query
      function getResourceAggregate(_config) {
        var defer = $q.defer();
        var queryObject = {
          aggregates: [
            {
              'operator': 'count',
              'field': '*',
              'alias': 'total'
            },
            {
              "operator": "groupby",
              "alias": _config.picklistField,
              "field": _config.picklistField + '.itemValue'
            },
            {
              "operator": "groupby",
              "alias": "color",
              "field": _config.picklistField +  ".color"
            }
          ],
          relationship: true
        };
        var _queryObj = new Query(queryObject);
        $http.post(API.QUERY + _config.resource + '?$limit=' + ALL_RECORDS_SIZE , _queryObj.getQuery(true)).then(function (response) {
            defer.resolve(response);
        }, function (error) {
            defer.reject(error);
        });
        return defer.promise;
      }

      return service;
    }
  })();
  
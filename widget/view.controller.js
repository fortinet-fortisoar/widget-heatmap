/* Copyright start
  Copyright (C) 2008 - 2024 Fortinet Inc.
  All rights reserved.
  FORTINET CONFIDENTIAL & FORTINET PROPRIETARY SOURCE CODE
  Copyright end */
'use strict';
(function () {
    angular
      .module('cybersponse')
      .controller('heatmap100Ctrl', heatmap100Ctrl);

    heatmap100Ctrl.$inject = ['$scope', 'widgetUtilityService', 'heatmapService', 'config', 'modelMetadatasService'];

    function heatmap100Ctrl($scope, widgetUtilityService, heatmapService, config, modelMetadatasService) {
      $scope.config = config;

      function _handleTranslations() {
        widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
          $scope.viewWidgetVars = {
            // Create your translating static string variables here
          };
        });
      }

      function init() {
        // To handle backward compatibility for widget
        _handleTranslations();
        var moduleMetaData = modelMetadatasService.getMetadataByModuleType($scope.config.resource);
        if(moduleMetaData.dataSource){
          //connector action
        }
        else{
          $scope.picklistField =  $scope.config.picklistField;
          heatmapService.getResourceAggregate($scope.config).then(function (response) {
            if (response && response.data['hydra:member'] && response.data['hydra:member'].length > 0) {
              $scope.distribution = response.data['hydra:member'];
              $scope.distributionSegment = 100 / response.data['hydra:member'].length; //width of each section
            }
          }, function (error) {
            console.log(error);
          });
        }
        
      }

      init();
    }
})();

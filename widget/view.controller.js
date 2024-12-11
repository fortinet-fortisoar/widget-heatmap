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

    heatmap100Ctrl.$inject = ['$scope', 'widgetUtilityService', 'heatmapService', 'config', 'modelMetadatasService', '$state'];

    function heatmap100Ctrl($scope, widgetUtilityService, heatmapService, config, modelMetadatasService, $state) {
      $scope.config = config;
      $scope.processing = true;
      $scope.pageState = $state;

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
        checkCurrentPage($scope.pageState);
        $scope.picklistField =  $scope.config.picklistField;
        $scope.multipleFieldsItems= $scope.config.multipleFieldsItems || [];
        var moduleMetaData = modelMetadatasService.getMetadataByModuleType($scope.config.resource);
        //to check if dataSource is present and fetch data from connector action or else from API query
        if(moduleMetaData.dataSource){ 
          executeConnectorAction(moduleMetaData.dataSource);
        }
        else{
          executeAPIQuery();
        }  
      }

      function checkCurrentPage(state){
        if (state.current.name.includes('viewPanel.modulesDetail')) {
          let params = $scope.pageState.current.params;
          $scope.indicator = params.id;
        }
      }

      function executeConnectorAction(_moduleMetaData){ 
        let _connectorName = _moduleMetaData.connector;
        let _connectorAction = _moduleMetaData.actions.risk_distribution;
        let payload = { 'indicator': $scope.indicator || '8.8.8.8' };
        heatmapService.executeAction(_connectorName, _connectorAction, payload).then(function (response) {
          if(response && response.data && response.data.length > 0)
          {
            setDistributionData(response.data);
          }
        });
      }

      function executeAPIQuery(){
        heatmapService.getResourceAggregate($scope.config).then(function (response) {
          if (response && response.data['hydra:member'] && response.data['hydra:member'].length > 0) {
            setDistributionData(response.data['hydra:member']);
          }
        }, function (error) {
          console.log(error);
        });
      }

      function setDistributionData(_responseData){
        $scope.distribution = angular.copy(_responseData);
        $scope.distributionSegment = 100 / _responseData.length; //width of each section
        $scope.processing = false;
      }

      init();
    }
})();

/* Copyright start
    MIT License
    Copyright (c) 2025 Fortinet Inc
Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('heatmap100Ctrl', heatmap100Ctrl);

  heatmap100Ctrl.$inject = ['$scope', 'widgetUtilityService', 'heatmapService', 'config', 'modelMetadatasService', '$state' , '$q', '$rootScope'];

  function heatmap100Ctrl($scope, widgetUtilityService, heatmapService, config, modelMetadatasService, $state, $q, $rootScope) {
    $scope.config = config;
    $scope.processing = true;
    $scope.pageState = $state;
    $scope.multipleFieldsItemsData = [];
    $scope.connectorOperationResponse = {};
    $scope.noData = false;
    $scope.currentTheme = $rootScope.theme.id;


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
        var _promises = [getRiskDistributionDetails(moduleMetaData.dataSource)];
        if($scope.multipleFieldsItems && $scope.multipleFieldsItems.length > 0){
          _promises.push(getRecordDetails(moduleMetaData.dataSource));
        }
        $q.all(_promises).then(function(response){
          $scope.processing = false;
          $scope.noData = true;
          if(response[0] && response[0].data && response[0].data.length > 0)
          {
            setRiskDistributionData(response[0].data);
            if(response[1] && response[1].data)
              {
                $scope.connectorOperationResponse = response[1].data;
                setMultipleFieldsData($scope.connectorOperationResponse);
                $scope.noData = false;
              }
          }
        })
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

    function getRiskDistributionDetails(_moduleMetaData){ 
      let _connectorName = _moduleMetaData.connector;
      let _connectorAction = _moduleMetaData.actions.risk_distribution;
      let payload = { 'indicator': $scope.indicator };
      return heatmapService.executeAction(_connectorName, _connectorAction, payload)
    }

    function getRecordDetails(_moduleMetaData){
      let _connectorName = _moduleMetaData.connector;
      let _connectorAction = _moduleMetaData.operation;
      let payload = { 'indicator': $scope.indicator };
      return heatmapService.executeAction(_connectorName, _connectorAction, payload);
    }

    function executeAPIQuery(){
      heatmapService.getResourceAggregate($scope.config).then(function (response) {
        if (response && response.data['hydra:member'] && response.data['hydra:member'].length > 0) {
          setRiskDistributionData(response.data['hydra:member']);
        }
      }, function (error) {
        console.log(error);
      });
    }

    function setRiskDistributionData(_responseData){
      $scope.distribution = angular.copy(_responseData);
      $scope.distributionSegment = 100 / _responseData.length; //width of each section
      $scope.processing = false;
    }

    function setMultipleFieldsData(titleFieldsData){
      $scope.multipleFieldsItems.forEach(element => {
        $scope.multipleFieldsItemsData.push({
          'field': element.title,
          'value' : titleFieldsData[element.name]
        });
      });
    }

    init();
  }
})();

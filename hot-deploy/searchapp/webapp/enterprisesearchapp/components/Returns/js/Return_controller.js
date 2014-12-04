var returnOrder = angular.module('ReturnApp.controllers', []);

  returnOrder.controller('ReturnOrderController', function($scope, $http, ReturnOrderService) {
    init();
    $scope.keyword={search:''};    
    
    $scope.keywordSearch = function() {
          parameters = { keyword: $scope.keyword.search };
          returnsPromise = ReturnOrderService.getReturnResultsByKeyword(parameters);
          returnsPromise.then (
            function(response) {
              $scope.returnsResult = response.data.result;
              console.log(response.data.result);
            },
            function(response) {
                console.log('something went wrong... please look into details.');
            }
        );
      };  
      
      $scope.filterByParameter = function(urlParam) {
        searchFacet = ReturnOrderService.getReturnFacetsByParameter(urlParam);
        searchResult = ReturnOrderService.getReturnResultsByParameter(urlParam);
        searchFacet.then(
            function(response) {
                console.log(response.data.result);
                $scope.facetsResult = response.data.result;
                
            },
            function(response) {
                console.log("In error function;;;; :(");
            }
        );
        searchResult.then (
            function(response) {
              console.log(response.data.result);
              $scope.returnsResult = response.data.result;    
            },
            function(response) {
                console.log('something went wrong... please look into details.');
                console.log(response);
            }
        );
    };
    
    $scope.minDate={date:''};
      $scope.maxDate={date:''};    
      $scope.dateSearch = function() {
          parameters = { minDate: $scope.minDate.date, maxDate: $scope.maxDate.date };
          ordersPromise = ReturnOrderService.getReturnResultsByKeyword(parameters);
          ordersPromise.then (
            function(response) {
              $scope.returnsResult = response.data.result;
                console.log(response.data.result);
            },
            function(response) {
                console.log('something went wrong... please look into details.');
            }
        );
      };  
      
    function init() {
              
        facetsPromise = ReturnOrderService.getReturnFacets(); 
        facetsPromise.then(
            function(response) {
                $scope.facetsResult = response.data.result;
                
            },
            function(response) {
                console.log("In error function;;;; :(");
            }
        );
        
        returnsPromise = ReturnOrderService.getReturnResults();
        returnsPromise.then (
            function(response) {
                $scope.returnsResult = response.data.result;    
            },
            function(response) {
                console.log('something went wrong... please look into details.');
                console.log(response);
            }
        );
    }
  
  });
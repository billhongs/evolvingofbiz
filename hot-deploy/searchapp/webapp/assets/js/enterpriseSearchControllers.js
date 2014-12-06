var controllerModule = angular.module('enterpriseSearch.controllers', ['enterpriseSearch.services']);

controllerModule.controller('enterpriseSearchController', ['$scope', '$http', '$timeout', 'getEnterpriseSearchResults', function($scope, $http, $timeout, getEnterpriseSearchResults) {
    $scope.result_list = [];
    $scope.$watch('keyword', function(new_keyword) {
         if (new_keyword) {
             $timeout(function() {
                 $scope.current_item = -1;
                 $scope.loading = 'ui-autocomplete-loading';
                 var options = {keyword: new_keyword, req_url: "http://localhost:8080/enterprisesearch/control/enterpriseSearch"},
                     item_number = 0,
                     promise = getEnterpriseSearchResults.getResults(options);
                 promise.then(
                     function(response) {
                         $scope.loading = '';
                         $scope.result_list = [];
                         data = response.data.result.allDocs;
                         angular.forEach(data, function(value, key){
                             angular.forEach(value.docInfoList, function(val, key){
                                 if(item_number == 0) {
                                     val.addFocus = 'doFocus';
                                     $scope.current_item = item_number;
                                 }
                                 $scope.item_number = item_number;
                                 val.item_number = item_number;
                                 item_number = item_number + 1;
                             });
                             $scope.result_list.push({title: value.appDescription, app: value.app, items: value.docInfoList});
                             console.log($scope.result_list);
                         });
                         if(!$scope.autoStatus) {
                             $scope.autoStatus = 'open';
                         }
                     },
                     function(data) {}
                 );
          }, 600);
      }
  });

  $scope.hideAutoComplete = function() {
      $scope.result_list = [];
      $scope.current_item = -1;
  };

  $scope.current_item = -1;
  // Support for keyboard navigation.
  $scope.startMove = function (e) {
      if(e.keyCode == '13' && $scope.current_item >= 0) {
    	  console.log("==========e.keyCode == '13' && $scope.current_item >= 0===on click of enter go to the href===");
          window.location = jQuery(angular.element('#autocomplete-result-'+$scope.current_item)).attr('href');
      }
      if($scope.keyword == '') {
    	  console.log("=======as keyword====cleaning result list and setting current item to -1");
          $scope.result_list = [];
          $scope.current_item = -1;
      }
      if(e.keyCode == '40') {
    	  console.log("=========================keycode 40============");
          if($scope.current_item == $scope.item_number) {
              $scope.current_item = 0;
              console.log("=========current_item="+$scope.current_item);
          } else {
              $scope.current_item = $scope.current_item + 1;
              console.log("=====else====current_item="+$scope.current_item);
          }
      } else if(e.keyCode == '38') {
    	  console.log("=========================keycode 38============");
          if($scope.current_item <= 0) {
              $scope.current_item = $scope.item_number;
              console.log("=============38==if===="+$scope.current_item);
          } else {
              $scope.current_item = $scope.current_item - 1;
              console.log("=========else==="+$scope.current_item);
          }
      }
      if(e.keyCode == '40' || e.keyCode == '38') {
    	  console.log("=========================keycode 40 or 38============");
          angular.forEach($scope.result_list, function(value, key){
              angular.forEach(value.items, function(value, key){
                  value.addFocus = '';
                  if($scope.current_item == value.item_number) {
                	  console.log("=====going to add focus====current_item="+$scope.current_item);
                      value.addFocus = 'doFocus';
                  }
              });
          });
      }
  };


  // Support for mouse navigation.
  $scope.startOver = function (index) {
      angular.forEach($scope.result_list, function(value, key){
          angular.forEach(value.items, function(value, key){
              value.addFocus = '';
              if(index == value.item_number) {
                  value.addFocus = 'doFocus';
                  $scope.current_item = index;
              }
          });
      });
  }
}]);
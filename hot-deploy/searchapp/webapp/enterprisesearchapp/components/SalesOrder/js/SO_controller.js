var orderSearch = angular.module('orderSearch.controllers', []);

orderSearch.controller('OrderSearchController', function($scope, orderSearchService) {
    init() ;
    $scope.keyword = {search: ''};
    $scope.keywordSearch = function() {
          parameters = { keyword: $scope.keyword.search };
          orderSearchPromise = orderSearchService.getOrderResultsByKeyword(parameters);
          orderSearchPromise.then (
            function(response) {
              $scope.searchResult = response.data.result;
                console.log(response.data.result);
            },
            function(response) {
                console.log('something went wrong... please look into details.');
            }
        );
      };
    
    $scope.minDate={date:''};
    $scope.maxDate={date:''}; 
    $scope.dateSearch = function() {
          parameters = { minDate: $scope.minDate.date, maxDate: $scope.maxDate.date };
          ordersPromise = orderSearchService.getOrderResultsByKeyword(parameters);
          ordersPromise.then (
            function(response) {
              $scope.searchResult = response.data.result;
                console.log(response.data.result);
            },
            function(response) {
                console.log('something went wrong... please look into details.');
            }
        );
      }; 
    
    
    $scope.filterByStatus = function(urlParam) {
        searchFacet = orderSearchService.getOrderFacetsByParameter(urlParam);
        searchResult = orderSearchService.getOrderResultsByParameter(urlParam);
        
        searchFacet.then(
            function(response) {
                console.log(response.data.result);
                $scope.orderFacets = response.data.result;
                
            },
            function(response) {
                console.log("In error function");
            }
        );
        searchResult.then (
            function(response) {
              console.log(response.data.result);
              $scope.searchResult = response.data.result;    
            },
            function(response) {
                console.log('something went wrong... please look into details.');
                console.log(response);
            }
        );
    };
    
    $scope.filterByChannel = function(urlParam) {
        searchFacet = orderSearchService.getOrderFacetsByParameter(urlParam);
        searchResult = orderSearchService.getOrderResultsByParameter(urlParam);
        
        searchFacet.then(
            function(response) {
                console.log(response.data.result);
                $scope.orderFacets = response.data.result;
                
            },
            function(response) {
                console.log("In error function;;;; :(");
            }
        );
        searchResult.then (
            function(response) {
              console.log(response.data.result);
              $scope.searchResult = response.data.result;    
            },
            function(response) {
                console.log('something went wrong... please look into details.');
                console.log(response);
            }
        );
    };
    
    $scope.filterByDays = function(urlParam) {
        searchFacet = orderSearchService.getOrderFacetsByParameter(urlParam);
        searchResult = orderSearchService.getOrderResultsByParameter(urlParam);
        searchFacet.then(
            function(response) {
                console.log(response.data.result);
                $scope.orderFacets = response.data.result;
                
            },
            function(response) {
                console.log("In error function;;;; :(");
            }
        );
        searchResult.then (
            function(response) {
              console.log(response.data.result);
              $scope.searchResult = response.data.result;    
            },
            function(response) {
                console.log('something went wrong... please look into details.');
                console.log(response);
            }
        );
    }; 
    
    function init() {
       orderSearchPromise = orderSearchService.getAllOrders();
        orderSearchPromise.then(
        function(response){
            $scope.searchResult = response.data.result;
        },
        function(response){
            console.log("Something went wrong please correct that.");
        }
        );

        filtersPromise = orderSearchService.getOrderFilters();

        filtersPromise.then(
        function(response){
            $scope.orderFacets = response.data.result;
            console.log(response.data.result);
        },
        function(response){
            console.log("Something went wrong please correct that.");
        }
        );
      $scope.orders = orderSearchService.getorders();
      $scope.status = orderSearchService.getstatus();
      $scope.channels = orderSearchService.getchannels();
    }
});


orderSearch.controller('OrderDetailController', function($scope, orderDetailService) {
    init();
    function init() {
    
    
       $scope.order_details = orderDetailService.getorder_details();  
       $scope.billing_details = orderDetailService.getbilling_details();
       $scope.customer_address = orderDetailService.getcustomer_address() ;
       $scope.shipment_details = orderDetailService.getshipment_details() ;
       $scope.product_detail = orderDetailService.getproduct_detail() ;
       $scope.product_gross = orderDetailService.getproduct_gross() ;
       $scope.order_history = orderDetailService.getorder_history() ;

    } 

    $(document).on("click", "#change_icon", function() {
      $("#content").hide();
      $("#frm_content").show();    
    }); 

    $(document).on("click", "#remove_edit", function() {
      $("#content").show();
      $("#frm_content").hide();    
    });

    $(document).on("mousemove", "[data-toggle='popover']", function () {
      $("[data-toggle='popover']").popover();
    });

    $(this).popover({
      html:true
    });

    $('.popper').popover({
      placement: 'left',
      container: 'body',
      html: true,
      content: function () {
         return $(this).next('.popper-content').html();
      }
    });


}) ;

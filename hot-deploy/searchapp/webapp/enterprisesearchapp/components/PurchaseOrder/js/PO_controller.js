var purchaseOrder = angular.module('purchaseOrder.controllers', []);

  purchaseOrder.controller('PurchaseOrderController', function($scope, $http, PurchaseOrderService) {
    init();
    $scope.filterByStatus = function(urlParam) {
        searchFacet = PurchaseOrderService.getPurchaseOrderFacetsByStatus(urlParam);
        searchResult = PurchaseOrderService.getPurchaseOrderResultsByStatus(urlParam);
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
              $scope.ordersResult = response.data.result;    
            },
            function(response) {
                console.log('something went wrong... please look into details.');
                console.log(response);
            }
        );
    };
    
    $scope.filterByDays = function(urlParam) {
        searchFacet = PurchaseOrderService.getPurchaseOrderFacetsByStatus(urlParam);
        searchResult = PurchaseOrderService.getPurchaseOrderResultsByStatus(urlParam);
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
              $scope.ordersResult = response.data.result;    
            },
            function(response) {
                console.log('something went wrong... please look into details.');
                console.log(response);
            }
        );
    };  
    function init() {
      
      $scope.keyword={search:''};
        
        $scope.keywordSearch = function() {
          parameters = { keyword: $scope.keyword.search };
          ordersPromise = PurchaseOrderService.getPurchaseOrderResultsByKeyword(parameters);
          ordersPromise.then (
            function(response) {
              $scope.ordersResult = response.data.result;
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
          ordersPromise = PurchaseOrderService.getPurchaseOrderResultsByKeyword(parameters);
          ordersPromise.then (
            function(response) {
              $scope.ordersResult = response.data.result;
                console.log(response.data.result);
            },
            function(response) {
                console.log('something went wrong... please look into details.');
            }
        );
      };    
        facetsPromise = PurchaseOrderService.getPurchaseOrderFacets(); 
        facetsPromise.then(
            function(response) {
                console.log(response.data.result);
                $scope.facetsResult = response.data.result;
                
            },
            function(response) {
                console.log("In error function;;;; :(");
            }
        );
        
        ordersPromise = PurchaseOrderService.getPurchaseOrderResults();
        ordersPromise.then (
            function(response) {
              console.log(response.data.result);
              $scope.ordersResult = response.data.result;    
            },
            function(response) {
                console.log('something went wrong... please look into details.');
                console.log(response);
            }
        );
    }
  
  });

  purchaseOrder.controller('OrderDetailController', function($scope, OrderDetailService) {
    init();
    function init() {
      $scope.orderDetail = OrderDetailService.getOrderDetail();
      $scope.orderStatusHistory = OrderDetailService.getStatusHistory();
      $scope.shipmentDetail = OrderDetailService.getShipmentDetail();
      $scope.productDetail = OrderDetailService.getProductDetail();
      $scope.productGross = OrderDetailService.getProductGross();
    } 
    
    $(document).on("mousemove", "[data-toggle='popover']", function () {
      $("[data-toggle='popover']").popover();
    });

    $(this).popover ({
      html: true,
      content: function() {
        return $($(this).attr('data-content')).html();
      }
    });
    $('.popper').popover({
      placement: 'left',
      container: 'body',
      html: true,
      content: function () {
        return $(this).next('.popper-content').html();
      }
    });
  });


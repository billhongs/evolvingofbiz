var orderSearch = angular.module('orderSearch.controllers', []);

orderSearch.controller('orderSearchController', function($scope, orderSearchService) {
    init() ;
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


orderSearch.controller('orderDetailController', function($scope, orderDetailService) {
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

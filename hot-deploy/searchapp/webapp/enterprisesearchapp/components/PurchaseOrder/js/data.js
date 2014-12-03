var routeParameter = '';
var purchaseOrder=angular.module('purchaseOrder',['ngRoute']);
purchaseOrder.config(function($routeProvider) {
  $routeProvider
  // route for the home page
 
  .when ('/PurchaseOrder', {
        templateUrl: 'pages/PO_Home.html',
        controller: 'purchaseOrderController'
       
  })
  .when ('/table/:param', {
        templateUrl: 'pages/PO_Home.html',
        controller: 'purchaseOrderController'
  })
  .when ('/orderDetail', {
        templateUrl: 'pages/PO_Detail.html',
        controller: 'orderDetailController'
  })
  .otherwise({
    redirectTo: '/PurchaseOrder'
  });
});

// create the controller and inject Angular's $scope
purchaseOrder.controller('purchaseOrderController', function($scope, $routeParams) {

  $scope.orders = [
    {id: 'PO20671', label: 'label-success', status: 'Completed', date: 'Sept, 29 2014', name: 'TROPICAL SUN INC.', item: '1', price: '15.44'},
    {id: 'PO20672', label: 'label-info', status: 'Approved', date: 'Sept, 27 2014', name: 'FORUM NOVELTIES CO.', item: '9', price: '115.82'}, 
    {id: 'PO20673', label: 'label-danger', status: 'Cancelled', date: 'Aug, 24 2014', name: 'FORUM NOVELTIES CO.', item: '5', price: '38'}, 
    {id: 'PO20674', label: 'label-info', status: 'Approved', date: 'July, 02 2014', name: 'TROPICAL SUN INC.', item: '4', price: '25'} 
  ];	

  $scope.status = ['Approved', 'Completed', 'Cancelled'];

  $scope.channels = ['Web Channel' , 'Phone Channel', 'Email Channel'];
  routeParameter = $routeParams.param;           //assign value of route parameter to routeParameter variable
});

purchaseOrder.filter('filterByStatus', function() {
  return function(items) {
    var filtered = []; 
    for(var i=0 ; i<items.length ; i++) {
      var item = items[i];
      if(items[i].status === routeParameter) {
        filtered.push(item);
      }
      if(routeParameter==null | routeParameter=='') {
        filtered.push(items[i]);
      }
    }
    return filtered;
  }; 
});

//Controller for order details
purchaseOrder.controller('orderDetailController', function ($scope) {

  $scope.order_details = [ 
    { id: 'PO20728', status: 'Completed', name: 'TROPICAL SUN INC.', street: '11 Exchange Place Suite', city: 'SLC UT 84111', country: 'USA', placedBy: 'Admin User', date: '09-29-2014 08:28 AM', subTotal: '$10.50', grandTotal: '$15.44', invoice: '20277', amount: '$48.75' }
  ]; 

  $scope.order_status_history = [
    { status: 'Created', date: 'July, 11 2014 03:07 AM', user: 'Admin User'},
    { status: 'Approved', date: 'Sept, 16 2014 05.04 AM', user: 'Admin User'},
    { status: 'Completed', date: 'Sept, 16 2014 04.04 AM', user: 'System Account'}    
  ];

  $scope.shipment_details = [ 
    { name: 'Hotwax Media, INC', street: '307 West 200 South', city: 'Salt Lake City UT 84101', country: 'USA', id: '20915'}
  ];

  $scope.product_detail = [ 
    { scheme:'bg-success', sNo: '1', id: 'STRAW-HAT', name: 'Straw Hat', label: 'label-success', status: 'Completed', minQty: '0', orderedQty: '5', receivedQty: '5', price: '$09.75', total: '$48.75' },
    { scheme:'bg-danger', sNo: '2', id: 'BASIC-T-PURPLE-L', name: 'Basic T-Purple-large', label: 'label-danger', status: 'Cancelled', minQty: '0', orderedQty: '10', receivedQty: '0', price: '$07.50', total: '$0.00'}
  ];
 
  $scope.product_Gross = [{tax: '$0.00', subtotal: '$48.75'}];

$(document).on("mousemove", "[data-toggle='popover']", function () {
 $("[data-toggle='popover']").popover();
});

$(this).popover({
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

}) ;





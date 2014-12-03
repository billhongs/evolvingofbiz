
var purchaseOrder = angular.module('purchaseOrder', ['ngRoute','purchaseOrder.controllers', 'purchaseOrder.services'])

.config(function($routeProvider) {
  $routeProvider
  // route for the home page
  .when ('/PurchaseOrder', {
        templateUrl: 'pages/PO_Home.html',
        controller: 'PurchaseOrderController'
  })
  .when ('/orderDetail', {
        templateUrl: 'pages/PO_Detail.html',
        controller: 'OrderDetailController'
  })
  .otherwise({
    redirectTo: '/PurchaseOrder'
  });
});


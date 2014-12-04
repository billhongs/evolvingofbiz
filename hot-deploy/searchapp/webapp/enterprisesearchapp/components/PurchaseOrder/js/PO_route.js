
var purchaseOrder = angular.module('purchaseOrder', ['ngRoute','purchaseOrder.controllers', 'purchaseOrder.services'])

.config(function($routeProvider) {
  $routeProvider
  // route for the home page
  .when ('/PurchaseOrder', {
        templateUrl: 'templates/PO_Home.html',
        controller: 'PurchaseOrderController'
  })
  .when ('/orderDetail', {
        templateUrl: 'templates/PO_Detail.html',
        controller: 'OrderDetailController'
  })
  .otherwise({
    redirectTo: '/PurchaseOrder'
  });
});


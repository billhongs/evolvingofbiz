var orderSearch = angular.module('orderSearch', ['ngRoute' , 'orderSearch.controllers', 'orderSearch.services']) 

.config(function($routeProvider) {
  $routeProvider
  // route for the home page
  .when ('/orderSearch', {
        templateUrl: 'pages/OS_Home.html',
        controller: 'orderSearchController'
  })
  .when ('/orderDetail', {
        templateUrl: 'pages/OS_Detail.html',
        controller: 'orderDetailController'
  })
  .otherwise({
    redirectTo: '/orderSearch'
  });
});
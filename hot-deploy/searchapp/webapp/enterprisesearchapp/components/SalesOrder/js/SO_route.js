var orderSearch = angular.module('orderSearch', ['ngRoute' , 'orderSearch.controllers', 'orderSearch.services']) 

.config(function($routeProvider) {
  $routeProvider
  // route for the home page
  .when ('/orderSearch', {
        templateUrl: 'templates/SO_Home.html',
        controller: 'OrderSearchController'
  })
  .when ('/orderDetail', {
        templateUrl: 'templates/SO_Detail.html',
        controller: 'OrderDetailController'
  })
  .otherwise({
    redirectTo: '/orderSearch'
  });
});

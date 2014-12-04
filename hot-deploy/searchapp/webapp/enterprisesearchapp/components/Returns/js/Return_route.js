var ReturnApp = angular.module('ReturnApp', ['ngRoute', 'ReturnApp.controllers', 'ReturnApp.services'])

.config(function($routeProvider) {

  $routeProvider.when('/index', {
    controller: 'ReturnOrderController',
    templateUrl: 'templates/Return_Home.html'
  }).when('/ViewReturn', {
    controller: 'ReturnDetailController',
    templateUrl: 'templates/Return_Detail.html'
  }).otherwise({
    redirectTo: '/index'
  });
});

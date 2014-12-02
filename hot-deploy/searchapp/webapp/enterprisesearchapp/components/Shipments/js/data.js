     $(document).on("click", "#change_icon", function () {
         $("#content").hide();
         $("#frm_content").show();

     });
     $(document).on("click", "#remove_edit", function () {
         $("#content").show();
         $("#frm_content").hide();

     });
     $(document).on("mousemove", "[data-toggle='popover']", function () {
         $("[data-toggle='popover']").popover();
     });

     $(this).popover({
         html: true,
         content: function() {
             return $($(this).attr('data-content')).html();
         }
     });
     var CustomerApp = angular.module('CustomerApp', ['ngRoute']);

     CustomerApp.controller('CustomerDetailController', function ($scope) {
         $scope.customer_profile = [{
             name: 'Aashish Vijaywargiyaa',
             phone: '1-123-4567890',
             email: 'ashish.vijay@yahoo.com',
             totalOrders: '26',
             profit: '1700.17',
             serviceLevel: '100.00%',
             otherPhones: '1-123-4567890 '
         }];

         $scope.orders = [{
             orderId: 'NNAO20655',
             date: '09-08-2014 04:26 AM',
             amount: '$109.73',
             returned: '$0.00',
             orderStatus: 'completed',
             labelClass: 'label-success'
         }, {
             orderId: 'Ao20683',
             date: '09-08-2014 04:26 AM',
             amount: '$24.74',
             returned: '$0.00',
             orderStatus: 'Approved',
             labelClass: 'label-primary'
         }, {
             orderId: 'NNAO20653',
             date: '10-02-2014 05:26 AM',
             amount: '$124.60',
             returned: '$0.00',
             orderStatus: 'Approved',
             labelClass: 'label-primary'
         }, {
             orderId: 'NNAO20785',
             date: '22-08-2014 02:10 AM',
             amount: '$200.00',
             returned: '$0.00',
             orderStatus: 'Approved',
             labelClass: 'label-primary'
         }, {
             orderId: 'NNAO20653',
             date: '10-02-2014 05:26 AM',
             amount: '$124.60',
             returned: ' $0.00',
             orderStatus: 'Approved',
             labelClass: 'label-primary'
         }];

         $scope.returns = [{
             returnId: '20272',
             date: '07-26-2014 08:06 AM',
             amount: '$20.94',
             returnStatus: 'Completed'
         }];

         $scope.address = [{
             name: 'Aashish Vijaywargiyaa',
             street: '307 W 200 S STE 4003',
             city: 'Salt Lake City UT 84101',
             country: 'USA'
         }];
         $scope.visaCode = {
             code: '*1111 6/2017'
         };
     });


     CustomerApp.controller('CustomerBasicInfoController', function ($scope) {
         $scope.customer_details = [{
             name: 'Aashish  Vijaywargiyaa',
             phone: '1-123-4567890',
             email: 'ashish.vijay@yahoo.com'
         }, {
             name: 'Aditya Barve',
             phone: '1-123-1231234',
             email: 'adityabarve48@gmail.com'
         }, {
             name: 'Anil Patel',
             phone: '1-413-2303505',
             email: 'anilpatel@yahoo.com'
         }];
     });

     CustomerApp.config(function ($routeProvider) {
         $routeProvider.when('/index', {
             controller: 'CustomerBasicInfoController',
             templateUrl: 'Customer_Search.html'
         }).when('/FindCustomerDetail', {
             controller: 'CustomerDetailController',
             templateUrl: 'Customer_Detail.html'
         }).otherwise({
             redirectTo: '/index'
         });

     });

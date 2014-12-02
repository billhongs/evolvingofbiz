var orderSearch = angular.module('orderSearch', ['ngRoute']);

orderSearch.factory('postService', function($http) {
    return {
        getResults : function(options) {
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            return $http.post(options.url, $.param(options.params));
        }
    };
});

// Controllers.
orderSearch.controller('orderSearchController', ['$scope', '$http', 'postService', function($scope, $http, postService) {
    var promise = $http.post("https://localhost:8443/enterprisesearch/control/enterpriseSearch", $.param({keyword: 'uth'}));
        promise.then(function(resp) {
            console.log("I have got success response from server. yippy");
            console.log(resp);}, function(resp) {
                console.log("I have got error response from server. uff");
                console.log(resp)});
    var options = {
        // Hard coded facility value, it can be picked from parameters.
        params: {customer: "", keyword: ""},
        url: "https://localhost:8443/enterprisesearch/control/FindOrders"
    },
    promise = postService.getResults(options);
    promise.then(
        function(response) {
            $scope.result = response.data.result;
        },
        function(response) {
            console.log(response);
        }
    );
    }]);

orderSearch.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {          // route for the home page
      templateUrl : 'pages/table.html'
    })
    .when('/table/:param', {
      templateUrl : 'pages/table.html'
    });
});

orderSearch.controller('orderFacetController', ['$scope', '$http', 'postService', function($scope, $http, postService) {
    var options = {
        // Hard coded facility value, it can be picked from parameters.
        params: {customer: "", keyword: ""},
        url: "https://localhost:8443/enterprisesearch/control/FindOrderFacets"
    },
    promise = postService.getResults(options);
    promise.then(
        function(response) {
            $scope.result = response.data.result;
            console.log(response.data.results);
        },
        function(response) {
            console.log(response);
        }
    );
}]);

orderSearch.controller('orderChannelController', function($scope) {
  $scope.channels = ['Web Channel' , 'Phone Channel', 'Email Channel'];
});


//Controller for customer details
orderSearch.controller('CustomerDetailController', function ($scope) {
  
  $scope.customer_profile = [ { name: 'Aashish Vijaywargiyaa', phone: '1-123-4567890', email: 'ashish.vijay@yahoo.com',totalOrders: '26', profit: '1700.17', serviceLevel: '100.00%', otherPhones: '1-123-4567890 ' } ];

  $scope.orders = [ 
    { orderId: 'NNAO20655', date: '09-08-2014 04:26 AM', amount: '$109.73', returned: '$0.00', orderStatus: 'completed', labelClass: 'label-success'},
    { orderId: 'NNAO20515', date: '09-08-2014 04:26 AM', amount: '$24.74', returned: '$0.00', orderStatus: 'Approved', labelClass: 'label-primary'},
    { orderId: 'NNAO20653', date: '10-02-2014 05:26 AM', amount: '$124.60', returned: '$0.00',orderStatus: 'Approved', labelClass: 'label-primary'},
    { orderId: 'NNAO20785', date: '22-08-2014 02:10 AM', amount: '$200.00', returned: '$0.00', orderStatus: 'Approved', labelClass: 'label-primary'},
    { orderId: 'NNAO20653', date: '10-02-2014 05:26 AM', amount: '$124.60', returned: ' $0.00',orderStatus: 'Approved', labelClass:'label-primary'} 
  ]; 

  $scope.returns = [ {returnId: '20272', date: '07-26-2014 08:06 AM', amount: '$20.94', returnStatus: 'Completed'} ];   
          
  $scope.address = [ {name: 'Aashish Vijaywargiyaa', street: '307 W 200 S STE 4003', city: 'Salt Lake City UT 84101' ,country: 'USA'}  ];    
}); 


//Controller for order details
orderSearch.controller('orderDetailController', function ($scope) {

  $scope.order_details = [ 
    { id : 'NA2011205' , status : 'Completed' , name: 'Nameet Jain' , channel : 'phone' , email: 'jnameet@gmail.com' , phone :'123-123-1234123' , date : '09-29-2014 08:28 AM' , priority : 'Normal' , PO : 'N/A' , subTotal : '$10.50' , adjustments : '$4.94' , grandTotal : '$15.44' , salesTax : '$0.48' , shipping : '$4.99' , discount : '-$0.53' }
  ]; 

  $scope.billing_details = [ 
    { paymentTerm : 'Pre-Authorized' , invoice : 'NN227' , paymentMethodHistory : 'Settled' , paymentMethod :'*1111 01/2016' , amount :'$5,004.99' , agent : '-' , commission : '-' , invoiced : '$5,004.99' , remaining : '$0.00' }
  ];

  $scope.customer_address = [ 
    { name : 'Nameet Jain' , street : '11 Exchange Place Suite 610' , city: 'SLC UT 84111' , country : 'USA' }
  ]; 

  $scope.shipment_details = [ 
    { packageInfo : '121-Pacakge' , trackingCode : '65465761643419861632' , packagingSlip : ' ' , label : ' '} ,
    { packageInfo : '2091-Package1' , trackingCode : '94999071246123456781' , packagingSlip : ' ' , label : ' '} 
  ];

  $scope.product_detail = [ 
    { colorScheme:'success' , sNo : '1' , id : '20080' , name : 'Basic Tee-Small-Black' , label: 'label-success' , status : 'Completed' , quantity : '1' , price : '$10.50' , total : '$10.50' , info : 'Returned:1' } ,
    { colorScheme:'info' , sNo : '2' , id : '25582' , name : 'Samsum Galaxy Tab-2 ' , label: 'label-info' , status : 'Approved' , quantity : '2' , price : '$10.10' , total : '$20.20' , tax : '$0.48' , subtotal: '$40.98' , info : 'Returned:2' } 
  ];

  $scope.product_gross = [ 
     { tax : '$0.48' , subtotal: '$10.98' }
  ];

  $scope.order_history = [ 
     {status:'Created' , date:'03-04-2014 04:29 AM' , user:'Admin User'} ,
     {status:'Approved' , date:'03-04-2014 04:29 AM' , user:'Admin User'} ,
     {status:'Completed' , date:'03-04-2014 04:29 AM' , user:'Admin User'}
  ];

}) ;

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










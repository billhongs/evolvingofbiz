var routeParameter = '';

var orderSearch=angular.module('orderSearch',['ngRoute']);

orderSearch.config(function($routeProvider) {
  $routeProvider
    .when('/', {              // route for the home page
      templateUrl : 'pages/table.html'
    })
    .when('/table/:param', {
      templateUrl : 'pages/table.html'
    });
});

// created controller and injected Angular's $scope
orderSearch.controller('orderSearchController', function($scope, $routeParams) {
  $scope.orders = [
    {id: 'NNAO21105', label: 'label-success', status: 'Completed', date: 'Sept, 29 2014', name: 'Nameet Jain', email: 'jnameet@hotwaxmedia.com', phone: '+919865432517', item: '1', price: '15.44' , channel: 'Phone Channel'},
    {id: 'NNAO21104', label: 'label-primary', status: 'Approved', date: 'Sept, 27 2014', name: 'Amit Kumar', email: 'amit12@gmail.com', phone: '+919754692517', item: '9', price: '115.82' , channel: 'Web Channel'}, 
    {id: 'NNAO21103', label: 'label-danger', status: 'Rejected', date: 'Aug, 24 2014', name: 'Rakesh Sharma', email: 'rsh123@gmail.com', phone: '+918812345967', item: '5', price: '38' , channel: 'Email Channel'}, 
    {id: 'NNAO21102', label: 'label-default', status: 'Cancelled', date: 'Jul, 2 2014', name: 'James Bond', email: 'bond1@yahoo.com', phone: '+919876543210', item: '4', price: '25' , channel: 'Phone Channel'}, 
    {id: 'NNAO21101', label: 'label-warning', status: 'Held', date: 'June, 6 2014', name: 'Jimmy Hopkins', email: 'jimmy@yahoo.com', phone: '+919776543210', item: '6', price: '75' , channel: 'Web Channel'}, 
    {id: 'NNAO21100', label: 'label-info', status: 'Created', date: 'May, 12 2014', name: 'Dan Code', email: 'dcode@live.com', phone: '+919576543210', item: '4', price: '25' , channel: 'Phone Channel'},
    {id: 'NNAO21999', label: 'label-success', status: 'Completed', date: 'May, 9 2014', name: 'Chinmay Patidar', email: 'chinmay@gmail.com', phone: '+919865720000', item: '1', price: '100' , channel: 'Email Channel'}  
  ];	
  routeParameter = $routeParams.param;
});

//Custom filter 
orderSearch.filter('filterByStatus', function() {  
  return function(items) {
    var filtered = []; 
    for(var i=0 ; i<items.length ; i++) {
      var item = items[i];
      if(items[i].status === routeParameter | items[i].channel === routeParameter) {
        filtered.push(item);
      }
      if(routeParameter==null | routeParameter=='') {
        filtered.push(items[i]);
      }
    }
    return filtered;
  }; 
});

orderSearch.controller('orderStatusController', function($scope) {
  $scope.status = ['Created' , 'Approved', 'Held', 'Completed', 'Cancelled', 'Rejected'];
});

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










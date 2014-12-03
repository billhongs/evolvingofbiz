angular.module('SearchAppShared.services', [])
    .factory('getPostRequestPromise', function($cacheFactory, $http) {

        var cache = $cacheFactory('dataCache'),
            getPromise = function(url, parameters) {
                if (parameters.keyword) {
                    var cache_id = url + '*' + parameters.keyword,
                        cached_data = cache.get(cache_id);
                    if (cached_data) {
                        return cached_data;
                    }
                }
                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                var promise = $http.post(url, $.param(parameters));
                console.log(promise);
                
                if (parameters.keyword) {
                   cache.put(cache_id, promise);
                }
                return promise;
            }
        return {
            getPromise: function(url, parameters) {
                return getPromise(url, parameters); 
            }
        };
    }
);
var orderSearchServices = angular.module("orderSearch.services", ['SearchAppShared.services']);

orderSearchServices.service("orderSearchService" ,['getPostRequestPromise', function(getPostRequestPromise) {

  this.getAllOrders = function() {
        var url = "http://localhost:8080/enterprisesearch/control/FindOrders",
            parameters = {};
        return getPostRequestPromise.getPromise(url, parameters);
    };
    
  this.getOrderFilters = function() {
      var url = "http://localhost:8080/enterprisesearch/control/FindOrderFacets",
            parameters = {};
      return getPostRequestPromise.getPromise(url, parameters);
  }
    
  this.getorders = function () {
    return orders ;
  }
  
  this.getstatus = function() {
    return status ;
  }
  
  this.getchannels = function() {
    return channels ;
  }
  
  var orders = [
    {id: 'NNAO21105', label: 'label-success', status: 'Completed', date: 'Sept, 29 2014', name: 'Nameet Jain', email: 'jnameet@hotwaxmedia.com', phone: '+919865432517', item: '1', price: '15.44' , channel: 'Phone Channel'},
    {id: 'NNAO21104', label: 'label-primary', status: 'Approved', date: 'Sept, 27 2014', name: 'Amit Kumar', email: 'amit12@gmail.com', phone: '+919754692517', item: '9', price: '115.82' , channel: 'Web Channel'}, 
    {id: 'NNAO21103', label: 'label-danger', status: 'Rejected', date: 'Aug, 24 2014', name: 'Rakesh Sharma', email: 'rsh123@gmail.com', phone: '+918812345967', item: '5', price: '38' , channel: 'Email Channel'}, 
    {id: 'NNAO21102', label: 'label-default', status: 'Cancelled', date: 'Jul, 2 2014', name: 'James Bond', email: 'bond1@yahoo.com', phone: '+919876543210', item: '4', price: '25' , channel: 'Phone Channel'}, 
    {id: 'NNAO21101', label: 'label-warning', status: 'Held', date: 'June, 6 2014', name: 'Jimmy Hopkins', email: 'jimmy@yahoo.com', phone: '+919776543210', item: '6', price: '75' , channel: 'Web Channel'}, 
    {id: 'NNAO21100', label: 'label-info', status: 'Created', date: 'May, 12 2014', name: 'Dan Code', email: 'dcode@live.com', phone: '+919576543210', item: '4', price: '25' , channel: 'Phone Channel'},
    {id: 'NNAO21999', label: 'label-success', status: 'Completed', date: 'May, 9 2014', name: 'Chinmay Patidar', email: 'chinmay@gmail.com', phone: '+919865720000', item: '1', price: '100' , channel: 'Email Channel'}  
  ];
  
  var status = ['Created' , 'Approved', 'Held', 'Completed', 'Cancelled', 'Rejected'];
  
  var channels = ['Web Channel' , 'Phone Channel', 'Email Channel'];

}]);



orderSearchServices.service("orderDetailService", function(){

    this.getorder_details = function () {
        return order_details ;
    }

    this.getbilling_details = function () {
        return billing_details ;
    }

    this.getcustomer_address = function () {
        return customer_address ;
    }

    this.getshipment_details = function () {
        return shipment_details ;
    }

    this.getproduct_detail = function () {
        return product_detail ;
    }

    this.getproduct_gross = function () {
        return product_gross ;
    }

    this.getorder_history = function () {
        return order_history ;
    }

    var order_details = [ 
    { id : 'NA2011205' , status : 'Completed' , name: 'Nameet Jain' , channel : 'phone' , email: 'jnameet@gmail.com' , phone :'123-123-1234123' , date : '09-29-2014 08:28 AM' , priority : 'Normal' , PO : 'N/A' , subTotal : '$10.50' , adjustments : '$4.94' , grandTotal : '$15.44' , salesTax : '$0.48' , shipping : '$4.99' , discount : '-$0.53' }
  ]; 

    var billing_details = [ 
    { paymentTerm : 'Pre-Authorized' , invoice : 'NN227' , paymentMethodHistory : 'Settled' , paymentMethod :'*1111 01/2016' , amount :'$5,004.99' , agent : '-' , commission : '-' , invoiced : '$5,004.99' , remaining : '$0.00' }
  ];

    var customer_address = [ 
    { name : 'Nameet Jain' , street : '11 Exchange Place Suite 610' , city: 'SLC UT 84111' , country : 'USA' }
  ]; 

    var shipment_details = [ 
    { packageInfo : '121-Pacakge' , trackingCode : '65465761643419861632' , packagingSlip : ' ' , label : ' '} ,
    { packageInfo : '2091-Package1' , trackingCode : '94999071246123456781' , packagingSlip : ' ' , label : ' '} 
  ];

    var product_detail = [ 
    { colorScheme:'success' , sNo : '1' , id : '20080' , name : 'Basic Tee-Small-Black' , label: 'label-success' , status : 'Completed' , quantity : '1' , price : '$10.50' , total : '$10.50' , info : 'Returned:1' } ,
    { colorScheme:'info' , sNo : '2' , id : '25582' , name : 'Samsum Galaxy Tab-2 ' , label: 'label-info' , status : 'Approved' , quantity : '2' , price : '$10.10' , total : '$20.20' , tax : '$0.48' , subtotal: '$40.98' , info : 'Returned:2' } 
  ];

    var product_gross = [ 
     { tax : '$0.48' , subtotal: '$10.98' }
  ];

   var order_history = [ 
     {status:'Created' , date:'03-04-2014 04:29 AM' , user:'Admin User'} ,
     {status:'Approved' , date:'03-04-2014 04:29 AM' , user:'Admin User'} ,
     {status:'Completed' , date:'03-04-2014 04:29 AM' , user:'Admin User'}
  ];

    

}) ;



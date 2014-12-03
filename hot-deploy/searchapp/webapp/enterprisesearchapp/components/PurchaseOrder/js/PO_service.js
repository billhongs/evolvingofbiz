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

var purchaseOrderServices = angular.module("purchaseOrder.services", ['SearchAppShared.services']);


purchaseOrderServices.service("PurchaseOrderService", ['$http', 'getPostRequestPromise', function($http, getPostRequestPromise){
        
        
    this.getPurchaseOrderFacets = function() {
        var url= "http://localhost:8080/enterprisesearch/control/purchaseOrderFacets",
        parameters = {};
        return getPostRequestPromise.getPromise(url, parameters);
    };
    
    this.getPurchaseOrderResults = function() {
        var url= "http://localhost:8080/enterprisesearch/control/purchaseOrderSearchResults",
        parameters = {};
        return getPostRequestPromise.getPromise(url, parameters);
    };
    
    this.getPurchaseOrderResultsByKeyword = function(parameters) {
        var url= "http://localhost:8080/enterprisesearch/control/purchaseOrderSearchResults";
        return getPostRequestPromise.getPromise(url, parameters);
    };
    this.getPurchaseOrderFacetsByStatus = function(urlParam) {
    
        var facetsUrl= "http://localhost:8080/enterprisesearch/control/purchaseOrderFacets?"+urlParam;
            facetPromise = $http.post(facetsUrl);
      return facetPromise;        
    };
    this.getPurchaseOrderResultsByStatus = function(urlParam) {
    
        var resultUrl = "http://localhost:8080/enterprisesearch/control/purchaseOrderSearchResults?"+urlParam;
            resultPromise = $http.post(resultUrl);
      return resultPromise;        
    };
    
}]);

purchaseOrderServices.service("OrderDetailService", function($http){
    this.getOrderDetail = function() {
      return orderDetail;        
    };

    this.getStatusHistory = function() {
      return orderStatusHistory;        
    };

    this.getShipmentDetail = function() {
      return shipmentDetail;        
    };
  
    this.getProductDetail = function() {
      return productDetail;        
    };

    this.getProductGross = function() {
      return productGross;        
    };

    var orderDetail = [ 
    { id: 'PO20728', status: 'Completed', name: 'TROPICAL SUN INC.', street: '11 Exchange Place Suite', city: 'SLC UT 84111', country: 'USA', placedBy: 'Admin User', date: '09-29-2014 08:28 AM', subTotal: '$10.50', grandTotal: '$15.44', invoice: '20277', amount: '$48.75' }
  ]; 

    var orderStatusHistory = [
    { status: 'Created', date: 'July, 11 2014 03:07 AM', user: 'Admin User'},
    { status: 'Approved', date: 'Sept, 16 2014 05.04 AM', user: 'Admin User'},
    { status: 'Completed', date: 'Sept, 16 2014 04.04 AM', user: 'System Account'}    
  ];

    var shipmentDetail = [ 
    { name: 'Hotwax Media, INC', street: '307 West 200 South', city: 'Salt Lake City UT 84101', country: 'USA', id: '20915'}
  ];

    var productDetail = [ 
    { scheme:'bg-success', sNo: '1', id: 'STRAW-HAT', name: 'Straw Hat', label: 'label-success', status: 'Completed', minQty: '0', orderedQty: '5', receivedQty: '5', price: '$09.75', total: '$48.75' },
    { scheme:'bg-danger', sNo: '2', id: 'BASIC-T-PURPLE-L', name: 'Basic T-Purple-large', label: 'label-danger', status: 'Cancelled', minQty: '0', orderedQty: '10', receivedQty: '0', price: '$07.50', total: '$0.00'}
  ];
 
    var productGross = [{tax: '$0.00', subtotal: '$48.75'}];
    
});

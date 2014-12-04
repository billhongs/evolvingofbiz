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

var returnOrderServices = angular.module("ReturnApp.services", ['SearchAppShared.services']);


returnOrderServices.service("ReturnOrderService", ['$http', 'getPostRequestPromise', function($http, getPostRequestPromise){
        
        
    this.getReturnFacets = function() {
        var url= "http://localhost:8080/enterprisesearch/control/getReturnFacets",
        parameters = {};
        return getPostRequestPromise.getPromise(url, parameters);
    };
    
    this.getReturnResults = function() {
        var url= "http://localhost:8080/enterprisesearch/control/findReturns",
        parameters = {};
        return getPostRequestPromise.getPromise(url, parameters);
    };
    
    this.getReturnResultsByKeyword = function(parameters) {
        var url= "http://localhost:8080/enterprisesearch/control/findReturns";
        return getPostRequestPromise.getPromise(url, parameters);
    };
    
    this.getReturnFacetsByParameter = function(urlParam) {
    
        var facetsUrl= "http://localhost:8080/enterprisesearch/control/getReturnFacets?"+urlParam;
            facetPromise = $http.post(facetsUrl);
      return facetPromise;        
    };
    this.getReturnResultsByParameter = function(urlParam) {
    
        var resultUrl = "http://localhost:8080/enterprisesearch/control/findReturns?"+urlParam;
            returnPromise = $http.post(resultUrl);
      return returnPromise;        
    };
    
}]);
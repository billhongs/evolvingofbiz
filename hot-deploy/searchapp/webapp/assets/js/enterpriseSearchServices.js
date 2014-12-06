angular.module('enterpriseSearch.services', [])
.factory('getEnterpriseSearchResults', function($cacheFactory, $http) {

    var cache = $cacheFactory('dataCache'),
        getResults = function(options) {
            var cache_id = options.req_url + '*' + options.keyword,
                cached_data = cache.get(cache_id);
            if (cached_data) {
                return cached_data;
            }
            var promise = $http.post(options.req_url, {keyword: options.keyword});
            cache.put(cache_id, promise);
            return promise;
        }
    return {
        getResults: function(options) {
            return getResults(options); 
        }
    };
}
);
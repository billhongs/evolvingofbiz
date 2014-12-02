angular.module('EnterpriseSearchMod.services', [])
    .factory('getEnterpriseSearchResults', function($cacheFactory, $http) {

        var cache = $cacheFactory('dataCache'),
            getResults = function(options) {
                var cache_id = options.req_url + '*' + options.keyword,
                    cached_data = cache.get(cache_id);
                if (cached_data) {
                    return cached_data;
                }
                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                var promise = $http.post(options.req_url, $.param(options.param));
                console.log(promise);
                
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

angular.module('EnterpriseSearchMod', ['EnterpriseSearchMod.services'])
    .controller('ViewEnterpriseSearchCtrl', ['$scope', '$http', '$timeout', 'getEnterpriseSearchResults', function($scope, $http, $timeout, getEnterpriseSearchResults) {
         $scope.result_list = [];
         $scope.$watch('keyword', function(new_keyword) {
             if (new_keyword) {
                 $timeout(function() {
                     $scope.current_item = -1;
                     $scope.loading = 'ui-autocomplete-loading';
                     var options = {param: {keyword: new_keyword}, req_url: "https://localhost:8443/enterprisesearch/control/enterpriseSearch"},
                         promise = getEnterpriseSearchResults.getResults(options);

                     promise.then(
                         function(data) {
                             console.log(data.data);
                             
                         },
                         function(data) {}
                     );
              }, 600);
          }
      });
    }]);
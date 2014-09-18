/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

angular.module('EnterpriseSearchMod.services', [])
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

angular.module('EnterpriseSearchMod', ['EnterpriseSearchMod.services'])
    .controller('ViewEnterpriseSearchCtrl', ['$scope', '$http', '$timeout', 'getEnterpriseSearchResults', function($scope, $http, $timeout, getEnterpriseSearchResults) {
         $scope.result_list = [];

         $scope.$watch('keyword', function(new_keyword) {
             if (new_keyword) {
                 $timeout(function() {
                     $scope.loading = 'ui-autocomplete-loading';
                     var options = {keyword: new_keyword, req_url: $scope.req_url},
                         item_number = 0,
                         promise = getEnterpriseSearchResults.getResults(options);
                     promise.then(
                         function(data) {
                             $scope.loading = '';
                             $scope.result_list = [];
                             data = data.data.result.allDocs;
                             angular.forEach(data, function(value, key){
                                 angular.forEach(value.docInfoList, function(val, key){
                                     if(item_number == 0) {
                                         val.addFocus = 'doFocus';
                                         $scope.current_item = item_number;
                                     }
                                     $scope.item_number = item_number;
                                     val.item_number = item_number;
                                     item_number = item_number + 1;
                                 });
                                 $scope.result_list.push({title: value.appDescription, app: value.app, items: value.docInfoList});
                             });
                             if(!$scope.autoStatus) {
                                 $scope.autoStatus = 'open';
                             }
                         },
                         function(data) {}
                     );
              }, 600);
          }
      });

      $scope.hideAutoComplete = function() {
          $scope.result_list = [];
          $scope.current_item = -1;
      };

      $scope.current_item = -1;
      // Support for keyboard navigation.
      $scope.startMove = function (e) {
          if(e.keyCode == '13' && $scope.current_item >= 0) {
              window.location = jQuery(angular.element('#autocomplete-result-'+$scope.current_item)).attr('href');
          }
          if($scope.keyword == '') {
              $scope.result_list = [];
              $scope.current_item = -1;
          }
          if(e.keyCode == '40') {
              if($scope.current_item == $scope.item_number) {
                  $scope.current_item = 0;
              } else {
                  $scope.current_item = $scope.current_item + 1;
              }
          } else if(e.keyCode == '38') {
              if($scope.current_item <= 0) {
                  $scope.current_item = $scope.item_number;
              } else {
                  $scope.current_item = $scope.current_item - 1;
              }
          }

          if(e.keyCode == '40' || e.keyCode == '38') {
              angular.forEach($scope.result_list, function(value, key){
                  angular.forEach(value.items, function(value, key){
                      value.addFocus = '';
                      if($scope.current_item == value.item_number) {
                          value.addFocus = 'doFocus';
                      }
                  });
              });
          }
      };
      // Support for mouse navigation.
      $scope.startOver = function (index) {
          angular.forEach($scope.result_list, function(value, key){
              angular.forEach(value.items, function(value, key){
                  value.addFocus = '';
                  if(index == value.item_number) {
                      value.addFocus = 'doFocus';
                      $scope.current_item = index;
                  }
              });
          });
      }
    }]).directive("bnMousedownOutside",
        function($document) {

            // I bind JavaScript events to the directive scope.
            function link($scope, element, attributes) {
                $scope.$watch("true",
                    function(new_value, old_value) {
                        // If enabled, listen for mouse events.
                        if (new_value) {
                            $document.on("mousedown", handleMouseDown);
                            // If disabled, but previously enabled, remove mouse events.
                        } else if (old_value) {
                            $document.off( "mousedown", handleMouseDown );
                        }
                    }
                );
 
                $scope.$on("$destroy",
                    function() {
                        $document.off("mousedown", handleMouseDown);
                    }
                );

            // I handle the mouse-down events on the document.
            function handleMouseDown(event) {

                // Check to see if this event target provides a click context
                // that should be ignored.
                if (shouldIgnoreEventTarget($(event.target))) {
                    return(console.warn("Ignoring mouse-down event.", (new Date()).getTime()));
                }

                $scope.$apply(
                    function() {
                        $scope.callback();
                    }
                );
            }

            // I detemine if the given mousedown context should be ignored.
            function shouldIgnoreEventTarget(target) {
                // If the click is inside the parent, ignore.
                if (target.closest(element).length) {
                    return(true);
                }
                if ($scope.exceptionSelectors && target.closest($scope.exceptionSelectors).length) {
                    return(true);
                }
                return(false);
            }
        }

        return({
            link: link,
            scope: {
                callback: "&bnMousedownOutside",
                exceptionSelectors: "@ignoreMousedownInside",
            }
        });
    }
);
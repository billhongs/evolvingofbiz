var directiveModule = angular.module('enterpriseSearch.directives', []);

directiveModule.directive("bnMousedownOutside",
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

        // I determined if the given mousedown context should be ignored.
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
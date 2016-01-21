angular.module('ngCheckbox')
    .directive('ngCheckbox2', function (ngCheckboxControllersCache) {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                head:'=',
                ngModel:'=?ngModel',
                sum:'=',
                id: '@',
                unit:'@',
                groups: '='
            },
            templateUrl: 'legacy/ngCheckbox/ngCheckbox.tpl.html',
            controllerAs:'checkBoxCtrl',
            controller: 'NgCheckboxController2',
            link: function (scope, element, attrs, checkBoxCtrl) {
                // Only register checkbox if it has groupId, selectAll, selectByGroup or collectionName attribute(s)
                if(checkBoxCtrl.groups){
                    ngCheckboxControllersCache.register(checkBoxCtrl);
                }

                scope.$watch('ngModel', function (value) {
                    checkBoxCtrl.setValue(value);
                });

                scope.$on('$destroy', function () {
                    if(checkBoxCtrl.groups){
                        ngCheckboxControllersCache.unregister(checkBoxCtrl);
                    }
                });
            }
        };
    });
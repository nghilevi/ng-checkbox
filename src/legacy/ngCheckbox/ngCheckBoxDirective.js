angular.module('ngCheckbox')
    .directive('ngCheckbox', function (ngCheckboxService) {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                selectAll:'=',
                selectByGroup:'=',
                ngModel:'=?ngModel',
                sum:'=',
                id: '@',
                unit:'@',
                groupId: '@',
                collectionName: '@'
            },
            templateUrl: 'legacy/ngCheckbox/ngCheckbox.tpl.html',
            controllerAs:'checkBoxCtrl',
            controller: 'NgCheckboxController',
            link: function (scope, element, attrs, checkBoxCtrl) {
                // Only register checkbox if it has groupId, selectAll, selectByGroup or collectionName attribute(s)
                if(checkBoxCtrl.groupId || checkBoxCtrl.selectAll || checkBoxCtrl.selectByGroup || checkBoxCtrl.collectionName){
                    ngCheckboxService.registerCheckBoxCtrl(checkBoxCtrl);
                }

                scope.$watch('ngModel', function (value) {
                    checkBoxCtrl.setValue(value);
                });

                scope.$on('$destroy', function () {
                    if(checkBoxCtrl.groupId || checkBoxCtrl.selectAll || checkBoxCtrl.selectByGroup || checkBoxCtrl.collectionName){
                        ngCheckboxService.unregisterCheckBoxCtrl(checkBoxCtrl);
                    }
                });
            }
        };
    });
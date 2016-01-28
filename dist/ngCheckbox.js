angular.module('ngCheckbox',['templates.ngCheckbox']);
(function(module) {
try {
  module = angular.module('templates.ngCheckbox');
} catch (e) {
  module = angular.module('templates.ngCheckbox', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('ngCheckbox.tpl.html',
    '<label for="{{checkboxCtrl.id}}">\n' +
    '    <input type="checkbox" class="ngCheckbox" id="{{checkboxCtrl.id}}" ng-model="checkboxCtrl.ngModel" ng-change="checkboxCtrl.onValueChange(checkboxCtrl.ngModel)" />\n' +
    '    <span ng-transclude></span>\n' +
    '</label>\n' +
    '');
}]);
})();

function NgCheckboxController($scope,ngCheckboxStatistics) {
    var separator = '_';
    this.ngCheckboxStatistics = ngCheckboxStatistics;
    this.$scope = $scope;
    this.superGroup=$scope.superGroup || 'default';
    this.groups=$scope.groups ? (angular.isArray($scope.groups) ? $scope.groups : [$scope.groups]) : [];
    this.head = ($scope.head===true || $scope.head===false)? $scope.head : false;
    this.id= $scope.id ? $scope.id : 'ngCb'+separator+_.uniqueId(this.groups ? this.groups.join(separator)+separator : '');
    this.sum = angular.isArray($scope.sum) ? _.sum($scope.sum) : isNaN($scope.sum) ? 0 : $scope.sum; //if $scope.sum is an array then sum it
    this.count = parseFloat($scope.count) || 1;
    this.unit=$scope.unit || '';

    this.setValue($scope.ngModel);
}

//Change the empty box icon to be checked and vice versa
NgCheckboxController.prototype.setValue= function (value) {
    this.ngModel = this.$scope.ngModel = (value===true || value===false)? value : true;
};

NgCheckboxController.prototype.onValueChange= function (value) {
    this.setValue(value);
    var selectedId = this.ngModel ? this.id : null;
    var unselectedId = this.ngModel ? null : this.id;
    if(this.head){
        this.ngCheckboxStatistics.updateAndbroadcast(this.superGroup,this.groups,this.ngModel,selectedId,unselectedId);
    }else{
        this.ngCheckboxStatistics.updateAndbroadcast(this.superGroup,null,null,selectedId,unselectedId);
    }

};

angular.module('ngCheckbox')
    .controller('NgCheckboxController', NgCheckboxController);
angular.module('ngCheckbox')
    .directive('ngCheckbox', function (ngCheckboxStatistics) {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                head:'=',
                id: '@',
                superGroup: '@',
                groups: '=',
                ngModel:'=?ngModel',
                sum:'=',
                count:'@',
                unit:'@'
            },
            templateUrl: 'ngCheckbox.tpl.html',
            controllerAs:'checkboxCtrl',
            controller: 'NgCheckboxController',
            link: function (scope, element, attrs, checkboxCtrl) {
                // Only register checkbox if it belongs to a group
                if(checkboxCtrl.groups){
                    ngCheckboxStatistics.registerCheckboxCtrl(checkboxCtrl);
                }

                scope.$watch('ngModel', function (value) {
                    checkboxCtrl.setValue(value);
                });

                scope.$on('$destroy', function () {
                    if(checkboxCtrl.groups){
                        ngCheckboxStatistics.unregisterCheckboxCtrl(checkboxCtrl);
                    }
                });
            }
        };
    });
/**
 * Created by Le on 1/21/2016.
 */
angular.module('ngCheckbox')
    .factory('ngCheckboxStatistics', function ($timeout) {
        var checkboxCtrlsCache =[],
            ngCheckboxStatisticsListeners={},
            updatePromise;

        // REGISTER/UNREGISTER
        var registerCheckboxCtrl = function (checkboxCtrl) {
            checkboxCtrlsCache.push(checkboxCtrl);
            debounceUpdateAndBroadcastAll();
        };
        
        var unregisterCheckboxCtrl = function (checkboxCtrl) {
            if(checkboxCtrlsCache.length > 0){
                _.remove(checkboxCtrlsCache,{id:checkboxCtrl.id});
                checkboxCtrl.ngModel && debounceUpdateAndBroadcastAll();
            }
        };

        var addListener = function (callBack,thisArg,superGroup) {
            var superGroup = superGroup || 'default';
            if(typeof callBack === 'function'){
                ngCheckboxStatisticsListeners[superGroup] = ngCheckboxStatisticsListeners[superGroup] || [];
                ngCheckboxStatisticsListeners[superGroup].push({
                    callBack: callBack,
                    thisArg:thisArg || null
                });
            }
        };

        // BUSINESS LOGIC
        // UPDATE
        var convertSumByUnitsToArray = function (sumByUnits) {
            // convert sumByUnits from {"unit1":60,"unit2":10} -> [ {sum: 60,unit:'unit1'}, {sum: 10,unit:'unit2'} ]
            var processedSumByUnits=[];
            for(var unit in sumByUnits){
                if(sumByUnits.hasOwnProperty(unit)){
                    processedSumByUnits.push({
                        unit:unit,
                        sum:sumByUnits[unit]
                    })
                }

            }
            return processedSumByUnits;
        };

        var update = function (superGroup,groups,updatedValue,selectedId,unselectedId) {
            var groupsStats={},sumByUnits={},selectedIds=[];
            var statistics={selectedId:selectedId,unselectedId:unselectedId,selectedIds:selectedIds,
                superGroup:superGroup,groups:groupsStats,count:0,sumByUnits:sumByUnits};

            angular.forEach(checkboxCtrlsCache, function (cachedCheckboxCtrl) {
                if(cachedCheckboxCtrl.superGroup === superGroup){
                    angular.forEach(cachedCheckboxCtrl.groups, function (group) {

                        // Update values to checkboxes under the same group
                        if(groups && (groups.length ===0 || groups.indexOf(group)> -1 )){
                            cachedCheckboxCtrl.setValue(updatedValue);
                        }

                        // Make statistics NOT include head checkbox
                        if(!cachedCheckboxCtrl.head){
                            groupsStats[group] = groupsStats[group] || {};
                            groupsStats[group].count = groupsStats[group].count || 0;
                            groupsStats[group].sumByUnits = groupsStats[group].sumByUnits || {};
                            groupsStats[group].sumByUnits[cachedCheckboxCtrl.unit] = groupsStats[group].sumByUnits[cachedCheckboxCtrl.unit] || 0;
                            sumByUnits[cachedCheckboxCtrl.unit] = sumByUnits[cachedCheckboxCtrl.unit] || 0;

                            if(cachedCheckboxCtrl.ngModel){
                                selectedIds.push(cachedCheckboxCtrl.id);
                                groupsStats[group].count += cachedCheckboxCtrl.count;
                                statistics.count+= cachedCheckboxCtrl.count;

                                groupsStats[group].sumByUnits[cachedCheckboxCtrl.unit] += cachedCheckboxCtrl.count * cachedCheckboxCtrl.sum;
                                sumByUnits[cachedCheckboxCtrl.unit] += cachedCheckboxCtrl.count * cachedCheckboxCtrl.sum;
                            }

                        }

                    });
                }
            });

            statistics.sumByUnits = convertSumByUnitsToArray(statistics.sumByUnits);
            for(var groupName in statistics.groups){
                if(statistics.groups.hasOwnProperty(groupName)){
                    statistics.groups[groupName].sumByUnits = convertSumByUnitsToArray(statistics.groups[groupName].sumByUnits);
                }
            }
            return statistics;
        };

        // BROADCAST
        var broadcast = function (listener,whatToListen) {
            (listener.callBack || angular.noop).apply(listener.thisArg ? listener.thisArg : null,[whatToListen]);
        };

        var updateAndbroadcast = function (superGroup,groups,updatedValue,selectedId,unselectedId) {
            var listeners = ngCheckboxStatisticsListeners[superGroup];
            angular.forEach(listeners, function (listener) {
                var statistics = update(superGroup,groups,updatedValue,selectedId,unselectedId);
                broadcast(listener,statistics);
            });
        };

        var updateAndBroadcastAll = function () {
            // invoke listeners
            for(var superGroup in ngCheckboxStatisticsListeners){
                if(ngCheckboxStatisticsListeners.hasOwnProperty(superGroup)){
                    updateAndbroadcast(superGroup);
                }
            }
        };

        var debounceUpdateAndBroadcastAll = function (delayedTime) {
            $timeout.cancel(updatePromise);
            updatePromise=$timeout(function () {
                updateAndBroadcastAll();
            },delayedTime || 20);
        };

        var reset = function () {
            checkboxCtrlsCache =[];
        };

        var resetHard = function () {
            reset();
            ngCheckboxStatisticsListeners={};
            updatePromise = undefined;
        };
        
        return{
            // REGISTER/UNREGISTER
            addListener:addListener,
            registerCheckboxCtrl:registerCheckboxCtrl,
            unregisterCheckboxCtrl:unregisterCheckboxCtrl,

            // UPDATE AND BROADCAST
            update:update,
            broadcast:broadcast,
            updateAndbroadcast:updateAndbroadcast,
            updateAndBroadcastAll:updateAndBroadcastAll,
            debounceUpdateAndBroadcastAll:debounceUpdateAndBroadcastAll,

            //  RESET
            reset:reset,
            resetHard:resetHard
        }
    });
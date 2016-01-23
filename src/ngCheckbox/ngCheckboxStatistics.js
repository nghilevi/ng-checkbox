/**
 * Created by Le on 1/21/2016.
 */
angular.module('ngCheckbox')
    .factory('ngCheckboxStatistics', function ($timeout) {
        var checkboxCtrlsCache =[],
            ngCheckboxStatisticsListeners=[],
            updatePromise;

        var registerCheckboxCtrl = function (checkboxCtrl) {
            checkboxCtrlsCache.push(checkboxCtrl);
        };
        
        var unregisterCheckboxCtrl = function (checkboxCtrl) {
            if(checkboxCtrlsCache.length > 0){
                _.remove(checkboxCtrlsCache,{id:checkboxCtrl.id});
                checkboxCtrl.ngModel && _debounceUpdate();
            }
        };

        // TODO add debounce in unregister atleast
        var addListener = function (callBack,thisArg,superGroup) {
            if(typeof callBack === 'function'){
                ngCheckboxStatisticsListeners.push({
                    callBack: callBack,
                    thisArg:thisArg || null,
                    superGroup: superGroup || 'default'
                });
            }
        };

        var _debounceUpdate = function () {
            $timeout.cancel(updatePromise);
            updatePromise=$timeout(function () {
                invokeNotifyResult();
            },20);
        };

        var update = function (checkboxCtrl) {
            var statistics={};
            angular.forEach(checkboxCtrlsCache, function (cachedCheckboxCtrl) {
                if(cachedCheckboxCtrl.superGroup === checkboxCtrl.superGroup){
                    angular.forEach(cachedCheckboxCtrl.groups, function (group) {
                        console.log('checkboxCtrl.groups.length ===0: ',checkboxCtrl.groups.length ===0);
                        if(checkboxCtrl.head && (checkboxCtrl.groups.length ===0 || checkboxCtrl.groups.indexOf(group)> -1 )){
                            cachedCheckboxCtrl.setValue(checkboxCtrl.ngModel); //Update values to checkboxes under the same group
                        }

                        if(!cachedCheckboxCtrl.head){
                            statistics[group] = statistics[group] || {};
                            statistics[group].count = statistics[group].count || 0;
                            statistics[group].sumByUnits = statistics[group].sumByUnits || {};
                            statistics[group].sumByUnits[cachedCheckboxCtrl.unit] = statistics[group].sumByUnits[cachedCheckboxCtrl.unit] || 0;

                            if(cachedCheckboxCtrl.ngModel){
                                statistics[group].count += cachedCheckboxCtrl.count;
                                statistics[group].sumByUnits[cachedCheckboxCtrl.unit] += cachedCheckboxCtrl.count * cachedCheckboxCtrl.sum;
                            }

                        }

                    });
                }
            });

            // invoke listeners
            angular.forEach(ngCheckboxStatisticsListeners, function (listener) {
                if(listener.superGroup === checkboxCtrl.superGroup){
                    (listener.callBack || angular.noop).apply(listener.thisArg ? listener.thisArg : null,[statistics]);
                }
            });

            console.log('statistics: ',statistics);
        };

        
        return{
            registerCheckboxCtrl:registerCheckboxCtrl,
            unregisterCheckboxCtrl:unregisterCheckboxCtrl,
            update:update,
            addListener:addListener
        }
    });
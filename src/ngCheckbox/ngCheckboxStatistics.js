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
            console.log('addListener');
            if(typeof callBack === 'function'){
                ngCheckboxStatisticsListeners.push({
                    callBack: callBack,
                    thisArg:thisArg || null,
                    superGroup: superGroup || 'default'
                });
            }
        };

        var debounceUpdate = function () {
            $timeout.cancel(updatePromise);
            updatePromise=$timeout(function () {
                update();
            },20);
        };

        var update = function (checkboxCtrl) {
            var statistics={};
            if(checkboxCtrl){
                angular.forEach(checkboxCtrlsCache, function (cachedCheckboxCtrl) {
                    if(cachedCheckboxCtrl.superGroup === checkboxCtrl.superGroup){
                        angular.forEach(cachedCheckboxCtrl.groups, function (group) {

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
                console.log('this sould not be logged');
                angular.forEach(ngCheckboxStatisticsListeners, function (listener) {
                    if(listener.superGroup === checkboxCtrl.superGroup){
                        (listener.callBack || angular.noop).apply(listener.thisArg ? listener.thisArg : null,[statistics]);
                    }
                });


            }else{
                angular.forEach(checkboxCtrlsCache, function (cachedCheckboxCtrl) {
                    angular.forEach(cachedCheckboxCtrl.groups, function (group) {

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

                });

                // invoke listeners
                console.log('gonna invoke all listeners:',ngCheckboxStatisticsListeners);
                angular.forEach(ngCheckboxStatisticsListeners, function (listener) {
                    (listener.callBack || angular.noop).apply(listener.thisArg ? listener.thisArg : null,[statistics]);
                });
            }

            console.log('statistics: ',statistics);
        };

        var reset = function () {

        };

        var resetHard = function () {
            reset();
        };
        
        return{
            registerCheckboxCtrl:registerCheckboxCtrl,
            unregisterCheckboxCtrl:unregisterCheckboxCtrl,
            update:update,
            debounceUpdate:debounceUpdate,
            addListener:addListener,
            resetHard:resetHard,
            reset:reset
        }
    });
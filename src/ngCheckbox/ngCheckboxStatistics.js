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

        // UPDATE
        var update = function (superGroup,groups,updatedValue) {
            var statistics={};
            angular.forEach(checkboxCtrlsCache, function (cachedCheckboxCtrl) {
                if(cachedCheckboxCtrl.superGroup === superGroup){
                    angular.forEach(cachedCheckboxCtrl.groups, function (group) {

                        if(groups && (groups.length ===0 || groups.indexOf(group)> -1 )){
                            cachedCheckboxCtrl.setValue(updatedValue); //Update values to checkboxes under the same group
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
            return statistics;
        };

        // BROADCAST
        var broadcast = function (listener,whatToListen) {
            (listener.callBack || angular.noop).apply(listener.thisArg ? listener.thisArg : null,[whatToListen]);
        };

        var updateAndbroadcast = function (superGroup,groups,updatedValue) {
            var listeners = ngCheckboxStatisticsListeners[superGroup];
            angular.forEach(listeners, function (listener) {
                var statistics = update(superGroup,groups,updatedValue);
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

        //  TODO RESET
        var reset = function () {

        };

        var resetHard = function () {
            reset();
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
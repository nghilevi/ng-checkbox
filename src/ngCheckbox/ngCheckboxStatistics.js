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
        var processData = function (data) {
            var sumByUnits = data.sumByUnits;
            // convert sumByUnits from {"unit1":60,"unit2":10} -> [ {sum: 60,unit:'unit1'}, {sum: 10,unit:'unit2'} ]
            var tempSumByUnits=[];
            for(var unit in sumByUnits){
                if(sumByUnits.hasOwnProperty(unit)){
                    tempSumByUnits.push({
                        unit:unit,
                        sum:sumByUnits[unit]
                    })
                }

            }
            data.sumByUnits=tempSumByUnits;
            return data;
        };

        var update = function (superGroup,groups,updatedValue) {
            var groupsStats={},sumByUnits={};
            var statistics={superGroup:superGroup,groups:groupsStats,count:0,sumByUnits:sumByUnits};

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
                                groupsStats[group].count += cachedCheckboxCtrl.count;
                                statistics.count+= cachedCheckboxCtrl.count;

                                groupsStats[group].sumByUnits[cachedCheckboxCtrl.unit] += cachedCheckboxCtrl.count * cachedCheckboxCtrl.sum;
                                sumByUnits[cachedCheckboxCtrl.unit] += cachedCheckboxCtrl.count * cachedCheckboxCtrl.sum;
                            }

                        }

                    });
                }
            });

            return processData(statistics);
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
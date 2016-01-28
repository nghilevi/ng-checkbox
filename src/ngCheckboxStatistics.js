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
                                groupsStats[group].count += cachedCheckboxCtrl.count;
                                groupsStats[group].sumByUnits[cachedCheckboxCtrl.unit] += cachedCheckboxCtrl.count * cachedCheckboxCtrl.sum;
                            }
                        }

                    });

                    if(!cachedCheckboxCtrl.head && cachedCheckboxCtrl.ngModel){
                        selectedIds.push(cachedCheckboxCtrl.id);
                        statistics.count += cachedCheckboxCtrl.count;
                        sumByUnits[cachedCheckboxCtrl.unit] += cachedCheckboxCtrl.count * cachedCheckboxCtrl.sum;
                    }
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
            var listeners = ngCheckboxStatisticsListeners[superGroup || 'default'];
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
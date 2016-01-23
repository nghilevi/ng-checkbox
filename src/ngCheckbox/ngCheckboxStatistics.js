/**
 * Created by Le on 1/21/2016.
 */
angular.module('ngCheckbox')
    .factory('ngCheckboxStatistics', function () {
        var checkboxCtrlsCache =[],ngCheckboxStatisticsListeners=[];
        var registerCheckboxCtrl = function (checkboxCtrl) {
            checkboxCtrlsCache.push(checkboxCtrl);
        };
        
        var unregisterCheckboxCtrl = function (checkboxCtrl) {
            if(checkboxCtrlsCache.length > 0){
                _.remove(checkboxCtrlsCache,{id:checkboxCtrl.id});
                //checkboxCtrl.ngModel && _debounceUpdate();
            }
        };

        // TODO add debounce in unregister atleast
        var addListener = function (callBack,thisArg) {
            if(typeof callBack === 'function'){
                ngCheckboxStatisticsListeners.push({
                    callBack: callBack,
                    thisArg:thisArg || null
                });
            }
        };

        var update = function (checkboxCtrl) {
            console.log('update: ',checkboxCtrlsCache);
            var statistics={};
            angular.forEach(checkboxCtrlsCache, function (cachedCheckboxCtrl) {

                angular.forEach(cachedCheckboxCtrl.groups, function (group) {
                    console.log('checkboxCtrl.groups.length ===0: ',checkboxCtrl.groups.length ===0);
                    if(checkboxCtrl.head && (checkboxCtrl.groups.length ===0 || checkboxCtrl.groups.indexOf(group)> -1 )){
                        cachedCheckboxCtrl.setValue(checkboxCtrl.ngModel); //Update values to checkboxes under the same group
                    }

                    if(!cachedCheckboxCtrl.head){
                        statistics[group] = statistics[group] || {};
                        statistics[group].count = statistics[group].count || 0; //TODO minus value false
                        statistics[group].sumByUnits = statistics[group].sumByUnits || {};
                        statistics[group].sumByUnits[cachedCheckboxCtrl.unit] = statistics[group].sumByUnits[cachedCheckboxCtrl.unit] || 0;

                        if(cachedCheckboxCtrl.ngModel){
                            statistics[group].count += cachedCheckboxCtrl.count;
                            statistics[group].sumByUnits[cachedCheckboxCtrl.unit] += cachedCheckboxCtrl.count * cachedCheckboxCtrl.sum;
                        }

                    }

                });


            });

            angular.forEach(ngCheckboxStatisticsListeners, function (listener) {
                (listener.callBack || angular.noop).apply(listener.thisArg ? listener.thisArg : null,[statistics]);
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
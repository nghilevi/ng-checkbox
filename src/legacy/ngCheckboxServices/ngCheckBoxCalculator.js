angular.module('ngCheckbox')
    .factory('ngCheckboxCalculator', function () {
        var selectedId, unSelectedId, count, selectedIds, sumByUnits, sumByGroups, selectedUnits;

        var _updateSelectedId = function (id,value) {
            selectedId = value ? id : null;
            unSelectedId = value ? null : id;
        };

        var _calculateAndReturnResult = function (checkBoxCtrls,selectType,isSelected,id) {

            var _calculateSumByUnits = function (sumByUnitsStats,selectedUnits,checkBoxCtrl) {
                var indexOfSelectedUnit = selectedUnits.indexOf(checkBoxCtrl.unit);
                if(indexOfSelectedUnit === -1){
                    selectedUnits.push(checkBoxCtrl.unit);
                    sumByUnitsStats.push({
                        unit:checkBoxCtrl.unit,
                        sum:checkBoxCtrl.sum
                    });
                }else{
                    sumByUnitsStats[indexOfSelectedUnit].sum +=checkBoxCtrl.sum;
                }
            };
            
            // Reduce process
            sumByUnits= _.reduce(checkBoxCtrls,function (sumByUnits,checkBoxCtrl) {

                // Update checkboxes value
                if( checkBoxCtrl.ngModel !== isSelected && (selectType==='all' || (selectType==='group' && checkBoxCtrl.groupId === id)) ){
                    checkBoxCtrl.setValue(isSelected);
                }

                // Only do the calculation on normal checkboxes with ngModel = true
                if(checkBoxCtrl.ngModel && !checkBoxCtrl.selectByGroup && !checkBoxCtrl.selectAll){
                    // Calculate sumByGroups
                    if(!sumByGroups[checkBoxCtrl.groupId]){
                        sumByGroups[checkBoxCtrl.groupId] = {sumByUnits:[],selectedUnits:[]};
                    }

                    _calculateSumByUnits(sumByGroups[checkBoxCtrl.groupId].sumByUnits,sumByGroups[checkBoxCtrl.groupId].selectedUnits,checkBoxCtrl);
                    _calculateSumByUnits(sumByUnits,selectedUnits,checkBoxCtrl); // Calculate sumByUnits

                    selectedIds.push(checkBoxCtrl.id);
                }

                return sumByUnits;
            },[]);

            // Count the selected checkboxes Id
            count = selectedIds.length;

            return {
                selectedId:selectedId,
                unSelectedId: unSelectedId,
                selectedIds:selectedIds,
                sumByUnits:sumByUnits,
                sumByGroups:sumByGroups,
                count:count
            };
        };

        var calculateResult = function (checkBoxCtrls) {
            reset();
            return _calculateAndReturnResult(checkBoxCtrls);
        };

        var calculateResultOnSelectAll = function (checkBoxCtrls,value) { //calculateResult
            reset();
            _updateSelectedId('all',value);
            return _calculateAndReturnResult(checkBoxCtrls,'all',value);
        };

        var calculateResultOnSelectByGroup = function (checkBoxCtrls,groupId,value) {
            reset();
            _updateSelectedId(groupId,value);
            return _calculateAndReturnResult(checkBoxCtrls,'group',value,groupId);
        };

        var calculateResultOnSingleSelect = function (checkBoxCtrls,id,value) {
            reset();
            _updateSelectedId(id,value);
            return _calculateAndReturnResult(checkBoxCtrls,'single',value,id);
        };

        var reset = function () {
            selectedId = undefined;
            unSelectedId = undefined;
            count = 0;
            selectedIds=[];
            selectedUnits=[];
            sumByGroups={};
        };

        return {
            reset:reset,
            calculateResult:calculateResult,
            calculateResultOnSelectAll:calculateResultOnSelectAll,
            calculateResultOnSelectByGroup:calculateResultOnSelectByGroup,
            calculateResultOnSingleSelect:calculateResultOnSingleSelect
        };
    });
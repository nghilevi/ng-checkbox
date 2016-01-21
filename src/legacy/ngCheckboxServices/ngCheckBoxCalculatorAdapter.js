angular.module('ngCheckbox')
    .factory('ngCheckboxCalculatorAdapter', function (ngCheckboxCalculator) {

        var calculateResult = function (checkBoxCtrls) {
            return ngCheckboxCalculator.calculateResult(checkBoxCtrls);
        };

        var calculateResultOnValueChange = function (checkBoxCollectionModel,checkBoxCtrl) {
            var result,
                checkBoxValue = checkBoxCtrl.ngModel,
                checkBoxCtrls = checkBoxCollectionModel.getCheckBoxCtrls();
            if(checkBoxCtrl.selectAll){
                checkBoxCollectionModel.setStatesOnSelectAll(checkBoxValue);
                result = ngCheckboxCalculator.calculateResultOnSelectAll(checkBoxCtrls,checkBoxValue);
            }else if(checkBoxCtrl.selectByGroup){
                checkBoxCollectionModel.setStatesOnSelectByGroup(checkBoxCtrl.groupId,checkBoxValue);
                result = ngCheckboxCalculator.calculateResultOnSelectByGroup(checkBoxCtrls,checkBoxCtrl.groupId,checkBoxValue);
            }else{ //Single Select
                checkBoxCollectionModel.setStatestOnSingleSelect(checkBoxValue);
                result = ngCheckboxCalculator.calculateResultOnSingleSelect(checkBoxCtrls,checkBoxCtrl.id,checkBoxValue);
            }

            return result;
        };

        var reset = function () {
            ngCheckboxCalculator.reset();
        };

        return {
            reset:reset,
            calculateResult:calculateResult,
            calculateResultOnValueChange:calculateResultOnValueChange
        };
    });
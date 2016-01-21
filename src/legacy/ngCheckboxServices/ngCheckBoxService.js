angular.module('ngCheckbox')
    .factory('ngCheckboxService', function (ngCheckboxCalculatorAdapter,ngCheckboxCollectionDictionary,$timeout) {

        var _shouldNotifyResultOnRegistration=true, notifyPromise;

        // REGISTER/UNREGISTER
        var registerCheckBoxCtrl = function (checkBoxCtrl) {
            ngCheckboxCollectionDictionary.register(checkBoxCtrl);
            _shouldNotifyResultOnRegistration && _debounceCalculateAndNotifyResult();
        };

        var unregisterCheckBoxCtrl = function (checkBoxCtrl) {
            var _checkBoxCtrls = ngCheckboxCollectionDictionary.getCollection(checkBoxCtrl.collectionName).getCheckBoxCtrls();
            if(_checkBoxCtrls.length > 0){
                _.remove(_checkBoxCtrls,{groupId:checkBoxCtrl.groupId,id:checkBoxCtrl.id});
                checkBoxCtrl.ngModel && _debounceCalculateAndNotifyResult(); //if checkBox ngModel is false (unchecked) then no need to _debounceCalculateAndNotifyResult
            }
        };

        var addCheckBoxesSelectionCallback = function (callBack,thisArg,collectionName) {
            ngCheckboxCollectionDictionary.addCheckBoxesSelectionCallback(callBack,thisArg,collectionName);
        };

        // NOTIFICATION
        var setNotifyResultOnRegistration = function (shouldNotifyResultOnRegistration) {
            _shouldNotifyResultOnRegistration = shouldNotifyResultOnRegistration;
        };

        var notifyResult = function (result,callBacksArray) {
            if(callBacksArray && callBacksArray.length > 0) {
                _.forEach(callBacksArray, function (callBackObj) {
                    (callBackObj.callBack || angular.noop).apply(callBackObj.thisArg ? callBackObj.thisArg : null,[result]); //TODO tide this callBack to checkBoxesModel
                });
            }
        };

        var _debounceCalculateAndNotifyResult = function () {
            $timeout.cancel(notifyPromise);
            notifyPromise=$timeout(function () {
                invokeNotifyResult();
            },20);
        };

        // Manually invokeNotifyResult for all array
        var invokeNotifyResult = function () {
            var checkBoxCollectionsDict = ngCheckboxCollectionDictionary.getDictionary(),result;
            for (var collectionName in checkBoxCollectionsDict) {
                if (checkBoxCollectionsDict.hasOwnProperty(collectionName)) {
                    result = ngCheckboxCalculatorAdapter.calculateResult(checkBoxCollectionsDict[collectionName].getCheckBoxCtrls());
                    notifyResult(result,checkBoxCollectionsDict[collectionName].getCallBacks());
                }
            }
        };

        // This function is used in register and unregister checkbox
        var onValueChange = function (checkBoxCtrl) {
            var result,callBacksArray;
            var checkBoxCollectionModel = ngCheckboxCollectionDictionary.getCollection(checkBoxCtrl.collectionName);
            result = ngCheckboxCalculatorAdapter.calculateResultOnValueChange(checkBoxCollectionModel,checkBoxCtrl);
            callBacksArray=checkBoxCollectionModel.getCallBacks();
            notifyResult(result,callBacksArray);
        };

        // RESET
        var reset = function (collectionName) {
            ngCheckboxCollectionDictionary.reset(collectionName); //TODO remove not reset in this case
        };

        var resetHard = function () {
            ngCheckboxCalculatorAdapter.reset();
            reset();
        };

        return {
            // REGISTER/UNREGISTER
            registerCheckBoxCtrl:registerCheckBoxCtrl,
            unregisterCheckBoxCtrl:unregisterCheckBoxCtrl,
            addCheckBoxesSelectionCallback:addCheckBoxesSelectionCallback,

            // NOTIFY
            invokeNotifyResult:invokeNotifyResult,
            setNotifyResultOnRegistration:setNotifyResultOnRegistration,
            onValueChange:onValueChange,

            // RESET
            resetHard:resetHard,
            reset:reset
        };
    });

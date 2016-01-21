angular.module('ngCheckbox')
    .factory('ngCheckboxCollectionDictionary', function (ngCheckboxCollectionModel) {
        var checkBoxCollectionDictionary = {};

        var register = function (checkBoxCtrl) {
            var collectionName = checkBoxCtrl.collectionName || 'default';
            if(!checkBoxCollectionDictionary[collectionName]){
                checkBoxCollectionDictionary[collectionName]=ngCheckboxCollectionModel.getInstance(collectionName);
            }else{
                checkBoxCollectionDictionary[collectionName].addCheckBoxCtrl(checkBoxCtrl);
            }
        };

        var getDictionary = function () {
            return checkBoxCollectionDictionary;
        };

        var getCollection = function (collectionName) {
            return checkBoxCollectionDictionary[collectionName || 'default'];
        };

        var addCheckBoxesSelectionCallback = function (callBack,thisArg,collectionName) {
            collectionName = collectionName || 'default';
            if(!checkBoxCollectionDictionary[collectionName]){
                checkBoxCollectionDictionary[collectionName]=ngCheckboxCollectionModel.getInstance(collectionName);
            }
            checkBoxCollectionDictionary[collectionName].addCheckBoxesSelectionCallback(callBack,thisArg);
        };

        var reset = function (collectionName) {
            if(collectionName){
                checkBoxCollectionDictionary[collectionName] && checkBoxCollectionDictionary[collectionName].reset();
            }else{
                for (var cbType in checkBoxCollectionDictionary) { // include 'default'
                    if (checkBoxCollectionDictionary.hasOwnProperty(cbType)) {
                        checkBoxCollectionDictionary[cbType] && checkBoxCollectionDictionary[cbType].reset();
                    }
                }
            }
        };

        return {
            register:register,
            getCollection:getCollection,
            getDictionary:getDictionary,
            addCheckBoxesSelectionCallback:addCheckBoxesSelectionCallback,
            reset:reset
        };

    });
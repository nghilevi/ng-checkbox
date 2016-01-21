angular.module('ngCheckbox')
    .factory('ngCheckboxCollectionModel', function (NgCheckboxCollectionState) {

        var NgCheckboxCollectionModel=function(collectionName) {
            this.collectionName = collectionName || 'default';
            this.checkBoxCtrls = [];
            this.checkBoxesSelectionCallbacks=[];
            this.collectionState = new NgCheckboxCollectionState();
        };

        NgCheckboxCollectionModel.prototype.addCheckBoxCtrl = function (checkBoxCtrl) {
            checkBoxCtrl.setValue(this.collectionState.getStateForCheckBox(checkBoxCtrl));
            this.checkBoxCtrls.push(checkBoxCtrl);
        };

        NgCheckboxCollectionModel.prototype.getCheckBoxCtrls = function () {
            return this.checkBoxCtrls;
        };

        NgCheckboxCollectionModel.prototype.getCallBacks = function () {
            return this.checkBoxesSelectionCallbacks;
        };

        NgCheckboxCollectionModel.prototype.addCheckBoxesSelectionCallback = function (callBack,thisArg) {
            if(typeof callBack === 'function'){
                this.checkBoxesSelectionCallbacks.push({
                    callBack: callBack,
                    thisArg:thisArg || null
                });
            }
        };

        NgCheckboxCollectionModel.prototype.reset = function () {
            this.checkBoxCtrls = [];
        };

        NgCheckboxCollectionModel.prototype.resetHard = function () {
            this.reset();
            this.checkBoxesSelectionCallbacks=[];
            this.collectionName = {};
        };

        // on value change
        NgCheckboxCollectionModel.prototype.setStatesOnSelectAll = function (checkBoxValue) {
            this.collectionState.setStatesOnSelectAll(checkBoxValue);
        };
        NgCheckboxCollectionModel.prototype.setStatesOnSelectByGroup = function (groupId,checkBoxValue) {
            this.collectionState.setStatesOnSelectByGroup(groupId,checkBoxValue);
        };
        NgCheckboxCollectionModel.prototype.setStatestOnSingleSelect = function () {
            this.collectionState.setStatestOnSingleSelect();
        };

        return {
            getInstance: function (collectionName) {
                return new NgCheckboxCollectionModel(collectionName);
            }
        };

    });
angular.module('ngCheckbox')
    .factory('NgCheckboxCollectionState', function () {

        var NgCheckboxCollectionState = function () {
           this.groupStates = {};
           this.allCheckBoxesStates;
        };

        NgCheckboxCollectionState.prototype.setStatestOnSingleSelect = function () {
            this.groupStates = {};
            this.allCheckBoxesStates=undefined;
        };

        NgCheckboxCollectionState.prototype.setStatesOnSelectAll = function (value) {
            this.groupStates = {};
            this.allCheckBoxesStates=value;
        };

        NgCheckboxCollectionState.prototype.setStatesOnSelectByGroup = function (groupId,value) {
            this.groupStates[groupId] = value;
            this.allCheckBoxesStates=undefined;
        };

        NgCheckboxCollectionState.prototype.getStateForCheckBox = function (checkBoxCtrl) {
            var state = checkBoxCtrl.ngModel;
            if(this.allCheckBoxesStates){ // if allCheckBoxesStates = true then all checkboxes should be setValue true
                state = true;
            } else if( (this.allCheckBoxesStates === false) || (!_.isEmpty(this.groupStates) && (this.groupStates[checkBoxCtrl.groupId] === false) )){ //Explicitly check if it equals false
                state = false;
            }
            return state;
        };

        NgCheckboxCollectionState.prototype.reset = function () {
           this.groupStates = {};
           this.allCheckBoxesStates=undefined;
        };

        return NgCheckboxCollectionState;
    });
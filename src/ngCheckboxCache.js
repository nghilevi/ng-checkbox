/**
 * Created by Le on 1/21/2016.
 */
angular.module('ngCheckbox')
    .factory('ngCheckboxControllersCache', function () {
        var cached =[];
        var register = function (checkboxCtrl) {
            cached.push(checkboxCtrl);
        };

        //TODO optimize this
        var _isBelongToGroup = function (checkboxCtrl,groups) {
            return _.intersection(checkboxCtrl.groups,groups).length > 0;
        };

        //TODO turn on /off other team member
        var get = function (groups, updatedValue) {
          var checkboxArr = [];
          angular.forEach(cached, function (checkboxCtrl) {
              if(_isBelongToGroup(checkboxCtrl,groups)){
                 checkboxArr.push(checkboxCtrl);
                 if(updatedValue!==undefined){
                     checkboxCtrl.setValue(updatedValue);
                 }
              }
          });
          return checkboxArr;
        };

        return{
            register:register,
            get:get
        }
    });
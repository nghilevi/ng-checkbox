/**
 * Created by Le on 1/21/2016.
 */
angular.module('ngCheckbox')
    .factory('ngCheckboxRequestHandler', function (ngCheckboxControllersCache) {
        var respond;

        var handle = function (checkboxCtrl) {
            if(checkboxCtrl.head){
                respond = ngCheckboxControllersCache.get(checkboxCtrl.groups,checkboxCtrl.ngModel);
            }else{
                respond = ngCheckboxControllersCache.get(checkboxCtrl.groups);
            }
            console.log('handle:',checkboxCtrl,'--------------');
            console.log('respond: ',respond);

            //TODO calculate from here
        };

        return{
            handle:handle
        }
    });
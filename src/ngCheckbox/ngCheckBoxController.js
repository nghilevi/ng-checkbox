function NgCheckboxController2($scope,ngCheckboxRequestHandler) {
    this.ngCheckboxRequestHandler = ngCheckboxRequestHandler;
    this.$scope = $scope;
    this.head = ($scope.selectAll===true || $scope.selectAll===false)? $scope.selectAll : false;
    this.sum = angular.isArray($scope.sum) ? _.sum($scope.sum) : isNaN($scope.sum) ? 0 : $scope.sum; //if $scope.sum is an array then sum it
    this.groups=$scope.groups || '';
    this.id= $scope.id ? $scope.id : 'ndCB_'+_.uniqueId(this.groupId ? this.groupId+'_' : '');
    this.unit=$scope.unit || '';
    this.setValue($scope.ngModel);
}

//Change the empty box icon to be checked and vice versa
NgCheckboxController2.prototype.setValue= function (value) {
    this.ngModel = this.$scope.ngModel = (value===true || value===false)? value : true;
};

NgCheckboxController2.prototype.onValueChange= function (value) {
    this.setValue(value);
    if(this.groups){
        this.ngCheckboxRequestHandler.handle(this);
    }

};

angular.module('ngCheckbox')
    .controller('NgCheckboxController2', NgCheckboxController2);
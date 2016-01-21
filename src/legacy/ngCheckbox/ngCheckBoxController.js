function NgCheckboxController($scope,ngCheckboxService) {
    this.ngCheckboxService = ngCheckboxService;
    this.$scope = $scope;
    this.selectAll = ($scope.selectAll===true || $scope.selectAll===false)? $scope.selectAll : false;
    this.selectByGroup=($scope.selectByGroup===true || $scope.selectByGroup===false)? $scope.selectByGroup : false;
    this.sum = angular.isArray($scope.sum) ? _.sum($scope.sum) : isNaN($scope.sum) ? 0 : $scope.sum; //if $scope.sum is an array then sum it
    this.groupId=$scope.groupId || '';
    this.id= $scope.id ? $scope.id : 'ndCB_'+_.uniqueId(this.groupId ? this.groupId+'_' : '');
    this.unit=$scope.unit || '';
    this.setValue($scope.ngModel);
    this.collectionName = $scope.collectionName;
}

//Change the empty box icon to be checked and vice versa
NgCheckboxController.prototype.setValue= function (value) {
    this.ngModel = this.$scope.ngModel = (value===true || value===false)? value : true;
};

NgCheckboxController.prototype.onValueChange= function (value) {
    this.setValue(value);
    // TODO prevent this if it is not registered
    this.ngCheckboxService.onValueChange(this);
};

angular.module('ngCheckbox')
    .controller('NgCheckboxController', NgCheckboxController);
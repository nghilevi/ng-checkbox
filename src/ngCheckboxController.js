function NgCheckboxController($scope,ngCheckboxStatistics) {
    this.ngCheckboxStatistics = ngCheckboxStatistics;
    this.$scope = $scope;
    this.head = ($scope.head===true || $scope.head===false)? $scope.head : false;
    this.id= $scope.id ? $scope.id : 'ndCB_'+_.uniqueId(this.groups ? this.groups.join()+'_' : '');
    this.superGroup=$scope.superGroup || 'default';
    this.groups=$scope.groups ? (angular.isArray($scope.groups) ? $scope.groups : [$scope.groups]) : [];
    this.sum = angular.isArray($scope.sum) ? _.sum($scope.sum) : isNaN($scope.sum) ? 0 : $scope.sum; //if $scope.sum is an array then sum it
    this.count = parseFloat($scope.count) || 1;
    this.unit=$scope.unit || '';

    this.setValue($scope.ngModel);
}

//Change the empty box icon to be checked and vice versa
NgCheckboxController.prototype.setValue= function (value) {
    this.ngModel = this.$scope.ngModel = (value===true || value===false)? value : true;
};

NgCheckboxController.prototype.onValueChange= function (value) {
    this.setValue(value);
    if(this.head){
        this.ngCheckboxStatistics.updateAndbroadcast(this.superGroup,this.groups,this.ngModel);
    }else{
        this.ngCheckboxStatistics.updateAndbroadcast(this.superGroup);
    }

};

angular.module('ngCheckbox')
    .controller('NgCheckboxController', NgCheckboxController);
function NgCheckboxController($scope,ngCheckboxStatistics) {
    var separator = '_';
    this.ngCheckboxStatistics = ngCheckboxStatistics;
    this.$scope = $scope;
    this.superGroup=$scope.superGroup || 'default';
    this.groups=$scope.groups ? (angular.isArray($scope.groups) ? $scope.groups : [$scope.groups]) : [];
    this.head = ($scope.head===true || $scope.head===false)? $scope.head : false;
    this.id= $scope.id ? $scope.id : 'ngCb'+separator+_.uniqueId(this.groups ? this.groups.join(separator)+separator : '');
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
    var selectedId = this.ngModel ? this.id : null;
    var unselectedId = this.ngModel ? null : this.id;
    if(this.head){
        this.ngCheckboxStatistics.updateAndbroadcast(this.superGroup,this.groups,this.ngModel,selectedId,unselectedId);
    }else{
        this.ngCheckboxStatistics.updateAndbroadcast(this.superGroup,null,null,selectedId,unselectedId);
    }

};

angular.module('ngCheckbox')
    .controller('NgCheckboxController', NgCheckboxController);
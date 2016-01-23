/**
 * Created by Le on 1/23/2016.
 */
var onCheckboxClick = function (stats) {
    console.log('onCheckboxClick');
    var _this = this;
    this.count = 0;
    this.sumByUnits = 0;
    angular.forEach(stats, function (group) {
        _this.count += group.count;
        _this.sumByUnits += group.sumByUnits;
    });
};

var ExampleControllerBasic = function (exampleTypeBasic,exampleProductsBasic,$scope,ngCheckboxStatistics,$document) {
    var _this = this;
    this.type = exampleTypeBasic;
    this.products = exampleProductsBasic;
    this.totalDisplayed = 3;
    this.ngCheckboxStatistics = ngCheckboxStatistics;
    ngCheckboxStatistics.addListener(this.onCheckboxClick,this,this.type);

    $scope.$on('$destroy', function () {
        _this.ngCheckboxStatistics.reset();
    });
};

ExampleControllerBasic.prototype.onCheckboxClick = onCheckboxClick;

demoApp.controller('ExampleControllerBasic', ExampleControllerBasic);



var ExampleControllerAdvance = function (exampleTypeAdvance,exampleProductsAdvance,$scope,ngCheckboxStatistics,$document) {
    var _this = this;
    this.type = exampleTypeAdvance;
    this.products = exampleProductsAdvance;
    this.totalDisplayed = 3;
    this.ngCheckboxStatistics = ngCheckboxStatistics;
    ngCheckboxStatistics.addListener(this.onCheckboxClick,this,this.type);

    $scope.$on('$destroy', function () {
        _this.ngCheckboxStatistics.reset();
    });
};

ExampleControllerAdvance.prototype.onCheckboxClick = onCheckboxClick;

demoApp.controller('ExampleControllerAdvance', ExampleControllerAdvance);
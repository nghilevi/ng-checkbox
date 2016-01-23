'use strict';

var MultiCheckBoxesController = function MultiCheckBoxesController(ngCheckboxStatistics,productsData,$scope,$timeout,$document) {
    var _this=this;
    var noOfProducts=0;

    console.log('exampleType');

    this.ngCheckboxStatistics=ngCheckboxStatistics;
    this.isMultiTableMode = false;
    ngCheckboxStatistics.addListener(this.onCheckboxClick,this,'basic');

    //this.products = productsData.createSampleProducts();
    noOfProducts = this.products.length;

    $scope.totalDisplayed = 3;
    $scope.loadMore = function () {
        if($scope.totalDisplayed < noOfProducts){
            $scope.totalDisplayed += 3;
        }
    };

    // DELETING LOGIC
    this.deleteProduct = function (productId) {
        if(_.isArray(_this.products[0])){
            _.some(_this.products,function (cachedProduct) { //this way it transforms the cachedProducts array without reassigning it like the way above.
                return _.remove(cachedProduct,{id:productId}).length > 0;
            });
        }else{
            _.remove(_this.products,{id:productId});
        }
    };

    // TODO defined what dataset to delete
    this.delete= function (item) {
         _this.deleteProduct(item.id);
        $scope.totalDisplayed--;
    };

    // SORT
    this.options = [
        {
            key:'category',
            isMultiTableMode:true,
            sortBy: 'productDate'
        },
        {
            key:'productDate',
            isMultiTableMode:false,
            sortBy: 'productDate'
        },
        {
            key:'recentAdded',
            isMultiTableMode:false,
            sortBy: 'name'
        }
    ];

    this.sort = function (option) {

        _this.selectedOption = option;
        _this.isMultiTableMode = option.isMultiTableMode;
        _this._ngCheckboxService.reset(); //enhance performance

        if(option.key === 'category'){
            _this.products = _(_this.products).sortBy(option.sortBy).groupBy('category').values().value();
        }else if(_this.previousSort === 'category'){
            _this.products = _(_this.products).flatten().sortBy(option.sortBy).value();
        }else{
            _this.products = _.sortBy(_this.products,option.sortBy);
        }

        _this.previousSort =option.key;
    };





};

MultiCheckBoxesController.prototype.onCheckboxClick = function (stats) {
    console.log('stats',stats);
};


demoApp.controller('MultiCheckBoxesController', MultiCheckBoxesController);

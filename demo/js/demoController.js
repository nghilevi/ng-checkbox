'use strict';

var MultiCheckBoxesController = function MultiCheckBoxesController(ngCheckboxService,productsData,$scope,$timeout) {
    var _this=this;
    var noOfProducts=0;
    this.isMultiTableMode = false;
    this._ngCheckboxService = ngCheckboxService;
    $scope.totalDisplayed = 3;

    $scope.loadMore = function () {
        if($scope.totalDisplayed < noOfProducts){
            $scope.totalDisplayed += 3;
        }
    };

    ngCheckboxService.addCheckBoxesSelectionCallback(this.onSelectionChange,this);
    ngCheckboxService.addCheckBoxesSelectionCallback(this.onSelectionChange2,this,'upcoming');

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

    // SAMPLE DATA LOADING LOGIC
    _this.products = productsData.createSampleProducts();
    _this.products2 = productsData.createSampleProducts(5);

    noOfProducts = _this.products.length;

    $scope.$on('$destroy', function () {
        _this._ngCheckboxService.resetHard();
    });

    $timeout(function () {
        _this._ngCheckboxService.invokeNotifyResult(); // Test invokeNotifyResult
    },3000);

}

MultiCheckBoxesController.prototype.onSelectionChange = function (args) {
    this.sumByGroups = args.sumByGroups;
    this.sumByUnits = args.sumByUnits.length === 1 ? args.sumByUnits[0].sum + ' ' + args.sumByUnits[0].unit : '';
    this.count=args.count;
    this.sum=args.sum;
};

MultiCheckBoxesController.prototype.onSelectionChange2 = function (args) {
    this.sumByUnits2 = args.sumByUnits.length === 1 ? args.sumByUnits[0].sum + ' ' + args.sumByUnits[0].unit : '';
    this.count2=args.count;
};



demoApp.controller('MultiCheckBoxesController', MultiCheckBoxesController);

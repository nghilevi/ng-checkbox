/**
 * Created by Le on 1/23/2016.
 */
var onCheckboxClick = function (stats) {
    console.log('stats: ',stats);
    this.count = stats.count;
    this.sumByUnits = stats.sumByUnits;
    this.groups =  stats.groups;
};

var deleteProductById = function (productId) {
    if(_.isArray(this.products[0])){
        _.some(this.products,function (cachedProduct) { //this way it transforms the cachedProducts array without reassigning it like the way above.
            return _.remove(cachedProduct,{id:productId}).length > 0;
        });
    }else{
        _.remove(this.products,{id:productId});
    }

    this.totalDisplayed--;
};

var ExampleControllerBasic = function (exampleTypeBasic,exampleProductsBasic,$scope,ngCheckboxStatistics) {
    var _this = this;
    this.type = exampleTypeBasic;
    this.products = exampleProductsBasic;
    this.totalDisplayed = 3;
    this.ngCheckboxStatistics = ngCheckboxStatistics;
    //ngCheckboxStatistics.addListener(this.onCheckboxClick,this);
    ngCheckboxStatistics.addListener(this.onCheckboxClick,this,this.type);

    var noOfProducts = exampleProductsBasic.length;
    this.loadMore = function () {
        if(_this.totalDisplayed < noOfProducts){
            _this.totalDisplayed += 3;
        }
    };

    $scope.$on('$destroy', function () {
        _this.ngCheckboxStatistics.reset();
    });
};

ExampleControllerBasic.prototype.onCheckboxClick = onCheckboxClick;
ExampleControllerBasic.prototype.delete = deleteProductById;

demoApp.controller('ExampleControllerBasic', ExampleControllerBasic);


var ExampleControllerAdvance = function (exampleTypeAdvance,exampleProductsAdvance,$scope,ngCheckboxStatistics,$document) {
    var _this = this;
    this.type = exampleTypeAdvance;
    this.products = exampleProductsAdvance;
    this.totalDisplayed = 30;
    this.ngCheckboxStatistics = ngCheckboxStatistics;
    //ngCheckboxStatistics.addListener(this.onCheckboxClick,this);
    ngCheckboxStatistics.addListener(this.onCheckboxClick,this,this.type);

    //SORTING
    this.sortOrder = true;
    var sortOption = {
        category:{
            isMultiTableMode:true,
            sortBy: 'category'
        },
        quantity:{
            isMultiTableMode:false,
            sortBy: 'quantity'
        }
    };

    // TODO use state instead of isMultiTableMode
    this.sort = function (option) {
        if(option === 'category' && _this.previousSortOption === 'category'){
           return;
        }

        _this.selectedOption = option;
        _this.isMultiTableMode = sortOption[option].isMultiTableMode;

        if(option === 'category'){
            _this.products = _(_this.products).sortBy(sortOption[option].sortBy).groupBy('category').values().value();
        }else if(_this.previousSortOption === 'category'){
            _this.products = _(_this.products).flatten().sortBy(sortOption[option].sortBy).value();
        }else{
            _this.products = _.sortByOrder(_this.products,sortOption[option].sortBy,_this.sortOrder);
            _this.sortOrder = !_this.sortOrder;
        }

        _this.previousSortOption =option;
    };

    $scope.$on('$destroy', function () {
        _this.ngCheckboxStatistics.reset();
    });
};

ExampleControllerAdvance.prototype.onCheckboxClick = onCheckboxClick;
ExampleControllerAdvance.prototype.delete = deleteProductById;

demoApp.controller('ExampleControllerAdvance', ExampleControllerAdvance);
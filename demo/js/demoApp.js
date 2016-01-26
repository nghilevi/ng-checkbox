$(document).ready(function(){
	$(document).foundation();
});

demoApp.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/demo");

  $stateProvider
    .state('demo', {
      url: "/demo",
      controllerAs:"exampleCtrl",
      resolve:{
        exampleTypeBasic: function () {
          return 'basic';
        },
        exampleTypeAdvance: function () {
          return 'advance';
        },
        exampleProductsBasic: function (productsData) {
          return productsData.createSampleProducts();
        },
        exampleProductsAdvance: function (productsData) {
          return productsData.createSampleProducts();
        }
      },

      views: {
        "exampleBasic": {
            controller: "ExampleControllerBasic",
            templateUrl: "partials/example.html"
        },
        "exampleAdvance": {
            controller: "ExampleControllerAdvance",
            templateUrl: "partials/example.html"
        }
      }
    });
});
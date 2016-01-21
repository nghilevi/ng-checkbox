$(document).ready(function(){
	$(document).foundation();
});

demoApp.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/demo");

  $stateProvider
    .state('demo', {
      url: "/demo",
      controller:"MultiCheckBoxesController",
      controllerAs:"multiCBCTrl",
      views: {
        "exampleBasic": {
			templateUrl: "partials/example-basic.html"
        },
        "exampleAdvance": {
			templateUrl: "partials/example-advance.html"
        }
      }
    });
});
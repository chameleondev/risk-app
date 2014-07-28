var app = angular.module('risk-tool',['ngAnimate','ngRoute']);

app.config(function($routeProvider){
	$routeProvider
	.when('/population',{
		templateUrl : 'partials/population.html'
	})
	.when('/bars',{
		templateUrl : 'partials/bars.html'
	})
	.when('/relative',{
		templateUrl : 'partials/relative.html'
	})
})

app.directive( 'goClick', function ( $location ) {
  return function ( scope, element, attrs ) {
    var path;

    attrs.$observe( 'goClick', function (val) {
      path = val;
    });

    element.bind( 'click', function () {
      scope.$apply( function () {
        $location.path( path );
      });
    });
  };
});

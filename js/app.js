var app = angular.module('risk-tool',['ngAnimate','ui.router']);

// app.config(function($routeProvider){
// 	$routeProvider
// 	.when('/population',{
// 		templateUrl : 'partials/population.html'
// 	})
// 	.when('/bars',{
// 		templateUrl : 'partials/bars.html'
// 	})
// 	.when('/relative',{
// 		templateUrl : 'partials/relative.html'
// 	});
// });


app.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/intro');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================

        .state('intro', {
            url: '/intro',
            templateUrl: 'partials/intro.html'
        })

        .state('graphs', {
            url: '/graphs',
            templateUrl: 'partials/graphs.html',
            controller: 'graphsCtrl'
        })

        .state('graphs.population', {
            url: '/population',
            templateUrl: 'partials/graphs/population.html'
        })

        .state('graphs.bars', {
            url: '/bars',
            templateUrl: 'partials/graphs/bars.html'
        })

        .state('graphs.relative', {
            url: '/relative',
            templateUrl: 'partials/graphs/relative.html'
        });
        
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        // .state('about', {
        //     url: '/about',
        //     views: {

        //         // the main template will be placed here (relatively named)
        //         '': { templateUrl: 'partial-about.html' },

        //         // the child views will be defined here (absolutely named)
        //         'columnOne@about': { template: 'Look I am a column!' },

        //         // for column two, we'll define a separate controller 
        //         'columnTwo@about': {
        //             templateUrl: 'table-data.html',
        //             controller: 'scotchController'
        //         }
        //     }
            
        // });
        
});


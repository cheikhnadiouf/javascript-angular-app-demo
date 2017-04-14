(function () {
    'use strict';

    angular.module('angular1appdemo.routes',[]);	

    angular.module('angular1appdemo.routes')
    /**
     * Routes patterns
     */
    .config(['$httpProvider','$urlRouterProvider','$stateProvider','$locationProvider', 
    
    function($httpProvider, $urlRouterProvider, $stateProvider,  $locationProvider){



	/**
     * Config navigation
     */
		
		$locationProvider.html5Mode(true);
		
		// Default 
		$urlRouterProvider.when('', '/').otherwise('/404'); 

        // add interceptors
        $httpProvider.interceptors.push('httpInterceptor');


		$stateProvider		
			// ROOT PAGES
			.state('app', { 
				abstract: true, 
				template: '<ui-view ></ui-view>',
                controller: 'appCtrl as app'			
			})
            // HOME PAGE
			.state('app.home',{			
				url: '/',
				templateUrl: 'modules/home/templates/home.html',
				controller: 'homeCtrl as home',
				parent: 'app'
			})
            // ERROR PAGE 403 : Forbidden
			.state('app.403',{			
				url: '/403',
				templateUrl: 'templates/403.html',
				parent: 'app'
			})
            // ERROR PAGE 404 : Not found
			.state('app.404',{			
				url: '/404',
				templateUrl: 'templates/404.html',
				parent: 'app'
			})
            // ERROR PAGE 500 : error server
			.state('app.500',{			
				url: '/500',
				templateUrl: 'templates/500.html',
				parent: 'app'
			});	

	}])

    /**
     * Global interceptors
     */

    .factory('httpInterceptor',['$q', '$log', '$rootScope', '$location', '$injector', '$window', 
		function($q,$log, $rootScope, $location, $injector, $window ) {
			/*
                The HTTP interceptor can decorate the promise rejection 
                with a property rejection.handled to indicate whether it's handled the error.
                So in controller you can use : 
                    .catch(function activateError(error) {
                        if (!error.handled) {
                            alert('An error happened');
                        }
                    });
            */

            var service = {
                responseError: responseError
            };
            return service;

            // Handle error responses
            function responseError(rejection) {
                $log.debug("REJECTION ERROR : " + angular.toJson(rejection));
                /*
                if(rejection.status === -1) {
                    $window.location.href = '/500.html';
                    // $location.path('/404');
                    rejection.handled = true;
                }
                if (rejection.status === 404) {
                    $window.location.href = '/404.html';
                    //$location.path('/500');
                    rejection.handled = true;
                }
                */
                return $q.reject(rejection);
            }
		}
	]);

})();
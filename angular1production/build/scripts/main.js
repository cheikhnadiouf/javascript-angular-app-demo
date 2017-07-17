(function () {
    'use strict';

	angular.module('angular1appdemo')


    /**
     * Run live process 
     */
    .run(['$state', '$stateParams', '$rootScope', function($state, $stateParams, $rootScope) {
        // This solves page refresh and getting back to state

        /**
         * Session management
         */
            // To handle keeping state across controllers, including when the user leaves and returns to the page.
            // so it can be converted back and forth from JSON to persist it. 
            // the html5 localstorage is used for persistence.
            // Usage :

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            if (sessionService.restorestate == "true") {
                $rootScope.$broadcast('restorestate'); //let everything know we need to restore state
                sessionService.restorestate = false;
            }
        });

        //let everthing know that we need to save state before unload.
        window.onbeforeunload = function (event) {
            $rootScope.$broadcast('savestate.onbeforeunload');
        };

        
    }])

    /**
    * Main app controller
    */
    .controller('appCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'configConstant', '$q', '$filter', '$log', '$http', '$translate', 'tmhDynamicLocale', 
        

	function ($scope, $rootScope, $state, $stateParams, configConstant, $q, $filter, $log, $http, $translate, tmhDynamicLocale) {
		/* jshint validthis: true */
		var vm = this;	
		$scope.vm = vm;
		
		// INIT
		$scope.language = $translate.preferredLanguage();

		// MAIN TRANSLATION
		$scope.changeLanguage = function (key) {
			$translate.use(key);
			$scope.language = key;
			tmhDynamicLocale.set(key);
		}; 
	
	}
    ]);


	

})();
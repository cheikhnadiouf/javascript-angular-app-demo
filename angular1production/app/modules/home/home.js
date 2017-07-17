(function () {
    'use strict';
	
angular.module('angular1appdemo.home', []);
angular.module('angular1appdemo.home')

.config(['$stateProvider', function($stateProvider){
	$stateProvider
		.state('home',{
			url: '/',
			templateUrl: 'modules/home/templates/home.html',
			controller: 'homeCtrl as home'	
		});
}])	


// UI SELECT WITH BOOTSTRAP THEME
.config(['uiSelectConfig', function(uiSelectConfig) {
	uiSelectConfig.theme = 'bootstrap';
}])



/**
* Controller
*/
.controller('homeCtrl', ['$scope', 'homeModel', 'HomeManager', '$q', '$filter', '$log',  '$http',
	
		function ($scope, homeModel, HomeManager, $q, $filter, $log, $http) {
			/* jshint validthis: true */
			var vm = this;	
			
			
			// INIT
			vm.homeModel = homeModel;
			vm.homeManager = HomeManager;
			vm.title = "home"; 
			

			vm.homeManager.listItems().$promise.then(
                  function (response) {
                  $log.info("*********************** MOCK ************* : " + angular.toJson(response));
                  }, 
                  function (error) {
                  // error.message
                  $log.info("*********************** MOCK ERROR ************* : " + error.message);
                  }
              );


		}
	]);	

	

})();
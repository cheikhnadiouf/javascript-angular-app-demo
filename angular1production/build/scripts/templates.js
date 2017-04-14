(function () {
    'use strict';
	
	angular.module('angular1appdemo')

	/**
	* Directive template Header and Footer
	*/	
	.directive('appHeader', ['$log', '$window', function ($log, $window) {
		return {
			restrict: 'E',
			templateUrl: 'templates/includes/header.html',
			scope: {},
			link: function(scope, element, attrs) {
				var windowElement = angular.element($window);
				var body = document.body;
				var docElem = document.documentElement;
				
			}
		};
	}])
	.directive('appFooter', function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/includes/footer.html',
			scope: {}
		};
	})
	;
	
})();

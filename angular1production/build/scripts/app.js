(function () {
    'use strict';

	angular.module('angular1appdemo', [	
		/* Shared modules */
		'ui.router',
		'ui.bootstrap',		
		'ngSanitize',		
		'ngStorage',
		'ui.select',
		'pascalprecht.translate',		
		'tmh.dynamicLocale',
		'angular1appdemo.routes',
		'angular1appdemo.utils',
		'angular1appdemo.translations',
		'angular1appdemo.home'		
    ]);

})();	

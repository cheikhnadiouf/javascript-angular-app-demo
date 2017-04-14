(function () {
    'use strict';
	
	angular.module('angular1appdemo')

	/**
	 * Configuration
	 */
	.constant('configConstant', {
        default: 'dev',         
		prod: {
				url_app: 'http://localhost:3000',
				url_api: 'http://localhost:5000',
				mock: false,
				debug: false
		},
		dev: {
				url_app: 'http://localhost:3000',
				url_api: 'http://localhost:5000',
				mock: true,
				debug: true
		},
		test: {
				url_app: 'http://localhost:3000',
				url_api: 'http://localhost:5000',
				mock:true,
				debug: true
		}
	});
	

})();
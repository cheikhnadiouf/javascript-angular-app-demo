(function () {
    'use strict';

    angular.module('angular1appdemo.translations',[]);	
    angular.module('angular1appdemo.translations')
    /**
     * TRANSLATION DYNAMIC LOCALE LOAD I18N ANGULAR FILES WITH tmhDynamicLocale
     */
    .config(['tmhDynamicLocaleProvider', '$translateProvider', function(tmhDynamicLocaleProvider, $translateProvider) {

        // dynamic partial translations
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '/localization/{lang}/{part}.json'
        });

        // Global translation
        $translateProvider.useStaticFilesLoader({
                    prefix: 'localization/base/global-',
                    suffix: '.json'
                }) ;               
                


        // TRANSLATION DYNAMIC LOCALE LOAD I18N ANGULAR FILES WITH tmhDynamicLocale
        tmhDynamicLocaleProvider.localeLocationPattern('localization/angular-locale_{{locale}}.js');


        // preferred language
        $translateProvider.preferredLanguage('en-US');
                        // .useSanitizeValueStrategy('escaped') // Security for escaping variables
                        // .usePostCompiling(true); // Post compiling angular filters

        // Usage in controller :
        /*
        $translate.use('en-US'); // translations-en-US.json
        tmhDynamicLocale.set('en-US'); // angular-locale_en-US.js

        // with  partial add
            $translatePartialLoader.addPart('part_name');
            $translate.refresh();

        // And dynamic change
        $scope.changeLanguage = function (key) {
            $translate.use(key);
            $scope.language = key;
            tmhDynamicLocale.set(key);
        };

        */

    }]);

})();

// CONFIG ROUTES
//-------------------------------------------------------------------------------------
app.config(function($locationProvider) {
    // use the HTML5 History API
        $locationProvider.html5Mode(false);

});

// TRANSLATION DYNAMIC I18N ANGULAR FILES WITH tmhDynamicLocale
//-------------------------------------------------------------------------------------
app.config(function(tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.localeLocationPattern('i18n/angular-locale_{{locale}}.js');
  });

  
// TRANSLATION I18N LOCALES 
//-------------------------------------------------------------------------------------
app.config(function ($translateProvider) {
  $translateProvider.translations('en', {
    LANGUAGE : 'en-us',
    HOME: 'Home',
    CONTACT: 'Contact',
    HELP: 'Help',
    TITLE: 'Single-page Application',
    DESCRIPTION: '<b>Features:</b> internationalization, pagination, filters, bootstrap ui and partial templates, flash message notifications, Authentication, Authorization, CRUD features and RestFull API services',
    BUTTON_LANG_EN: 'english',
    BUTTON_LANG_FR: 'french'
  });
  $translateProvider.translations('fr', {
    LANGUAGE : 'fr-fr',
    HOME: 'Accueil',
    CONTACT: 'Contact',
    HELP: 'Aide',
    TITLE: 'Application single-page Angular',
    DESCRIPTION: '<b>Fonctionnalités :</b> internationalization, pagination, filtres, bootstrap ui et templates, flash message notifications, Authentification, Autorisation, operations CRUD et services RestFull API ',
    BUTTON_LANG_EN: 'anglais',
    BUTTON_LANG_FR: 'français'
  });
  $translateProvider.preferredLanguage('en');

});


// FACTORY FLASH MESSAGES
//-------------------------------------------------------------------------------------
app.factory("flash", function($rootScope) {
  var notified = 0;
  var alerts = [
    //{ type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
    //{ type: 'success', msg: 'Well done! You successfully read this important alert message.' }
  ];
  
  var currentMessage = "";

  $rootScope.$on("$routeChangeSuccess", function() {
    if (notified > 1) {
      alerts.shift();
      notified -= 1;
    }  
    currentMessage = alerts[alerts.length - 1] || "";
    //currentMessage = alerts.shift() || "";
  });

  return {
    setMessage: function(message, type) {
      alerts.push({type: type, msg : message});
      notified += 1;
    },
    getCurrentMessage: function() {
      return currentMessage;
    },
    getAlerts: function() {
      return alerts;
    },
    closeAlert: function(index) {
      alerts.splice(index, 1);
      notified -= 1;
    }

  };
}); 

// EVENT ROUTE PAGE CHANGEMENT 
//-------------------------------------------------------------------------------------
app.run(function($rootScope, $location, flash) {
  $rootScope.$on( "$routeChangeStart", function(event, next, current) {
      if ($rootScope.loggedInUser == null) {
        if ( next.controller === "EditCtrl" || next.controller === "NewCtrl" || next.controller === "DeleteCtrl" ) {
          // no logged user, redirect to /login
          flash.setMessage("You must login first; You can enter any email for demonstration", "danger");
          
          if ( next.templateUrl === "partials/login.html") {
            
          } else {
            $location.path("/login");
          }
        }
      } else {  
        
      }      
  });
});

// DIRECTIVE CONFIRM-CLICK DIALOG
//-------------------------------------------------------------------------------------
app.directive('ngReallyClick', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var message = attrs.ngReallyMessage;
                if (message && confirm(message)) {
                    scope.$apply(attrs.ngReallyClick);
                }
            });
        }
    }
}]);


  
// MAIN CONTROLLER
//-------------------------------------------------------------------------------------
app.controller("MainCtrl", function($scope, $location, tmhDynamicLocale, $translate, flash, $rootScope){

  // MAIN DATA BINDING
  $scope.navbarCollapsed = true;
  $scope.title = 'AngularJS One Page';  
  $scope.language = $translate.preferredLanguage(); 
  $scope.user = {}; 
  $scope.user.email = $rootScope.loggedInUser;
  
  // MAIN TRANSLATION
  $scope.changeLanguage = function (key) {
    $translate.use(key);
    $scope.language = key;
    tmhDynamicLocale.set(key);
  };
  
  // MAIN FLASH MESSAGES
  $scope.alerts = flash.getAlerts();
  $scope.closeAlert = function(index){
    flash.closeAlert(index);    
  };

  // MAIN MENU HIGHLIGHT active current page
  $scope.menuClass = function(page) {
    var current = $location.path().substring(1);
    return page === current ? "active" : "";
  };

});

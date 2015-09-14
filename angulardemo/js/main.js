
// CONFIG ROUTES
//-------------------------------------------------------------------------------------
app.config(function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider
      .when("/items", { templateUrl: "partials/index.html" })
      .when("/items/:id", { templateUrl: "partials/show.html", controller: "ShowCtrl" })
      .when("/new", { templateUrl: "partials/new.html", controller: "NewCtrl" })
      .when("/items/:id/edit", { templateUrl: "partials/edit.html", controller: "EditCtrl" })
      .when("/items/:id/delete", { templateUrl: "partials/index.html", controller: "DeleteCtrl" })
      
      .when("/login", { templateUrl: "partials/login.html", controller: "LoginCtrl" })
      .when("/logout", { templateUrl: "partials/login.html", controller: "LogoutCtrl" })
      .when("/help", { templateUrl: "partials/help.html" })
      .otherwise( { redirectTo: "/items" });
});



// USER TOKEN HANDLER
//-------------------------------------------------------------------------------------
/*
app.factory('tokenHandler', function($rootScope, $http, $q) {
  var token = null,
      currentUser;
 
  var tokenHandler = {
    // store our token for later retrieval
    set: function(v) { token = v; },
    get: function() {
      if (!token) {
        $rootScope.$broadcast('event:unauthorized');
      }
      else {
        return token;
      }
    },
    getCurrentUser: function() {
      var d = $q.defer();

      if (currentUser) {
        d.resolve(currentUser);
      } else {
        $http({
          url: '/api/current_user',
          method: 'POST'
        }).then(function(data) {
          d.resolve(data.data);
        });
      }
      return d.promise;
    },
    wrapActions: function(r, actions) {
      // copy original resource
      var wrappedResource = r;
      for (var i=0; i < actions.length; i++) {
        tokenWrapper( wrappedResource, actions[i] );
      }
      // return modified copy of resource
      return wrappedResource;
    }
  };
  
  // https://gist.github.com/nblumoe/3052052
  var tokenWrapper = function(resource, action) {
    // copy original action
    resource['_' + action]  = resource[action];
    // create new action wrapping the original and sending token
    resource[action] = function( data, success, error){
      return resource['_' + action](
        angular.extend({}, data || {}, {access_token: tokenHandler.get()}),
        success,
        error
      );
    };
  };
 
  return tokenHandler;
}); */



// TRANSLATION DYNAMIC I18N ANGULAR FILES WITH tmhDynamicLocale
//-------------------------------------------------------------------------------------
app.config(function(tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.localeLocationPattern('i18n/angular-locale_{{locale}}.js');
  });
  
// PAGINATION TEMPLATE PATH
//-------------------------------------------------------------------------------------
app.config(function(paginationTemplateProvider) {
    paginationTemplateProvider.setPath('partials/dirPagination.tpl.html');
});  

  
// TRANSLATION I18N LOCALES 
//-------------------------------------------------------------------------------------
app.config(function ($translateProvider) {
  $translateProvider.translations('en', {
    LANGUAGE : 'en-us',
    HOME: 'Home',
    HELP: 'Help',
    TITLE: 'Single-page Application',
    DESCRIPTION: '<b>Features:</b> internationalization, pagination, filters, bootstrap ui and partial templates, flash message notifications, Authentication, Authorization, CRUD features and RestFull API services',
    BUTTON_LANG_EN: 'english',
    BUTTON_LANG_FR: 'french'
  });
  $translateProvider.translations('fr', {
    LANGUAGE : 'fr-fr',
    HOME: 'Accueil',
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


  
  
// FACTORY CRUD ITEM
//-------------------------------------------------------------------------------------
app.factory("Item", function($http) {

  // URL VARIABLES
  //-------------------------------------------------------------------------------------
  // var url = "http://systemaker.com/angulardemo/data/items.json?alt=json-in-script&callback=JSON_CALLBACK";

  // var url = "http://quickandclean.org/items.json?alt=json-in-script&callback=JSON_CALLBACK";

  // localhost
  // var url = "http://localhost:8000/items.json?alt=json-in-script&callback=JSON_CALLBACK";
  
  // local
  var url = "data/items.json";
  var items = [];
  
  $http.get(url).success(function(response){
    items = response;  //ajax request to fetch data into items
  }).error(function (data) {
		console.log("Error", data);
	});
  
  /*
  var items = [
    { title_en: "Item", active: true, id: 1, parent_id: 3 },
    { title_en: "Unit", active: true, id: 2, parent_id: 2 },
    { title_en: "Product", active: true, id: 3, parent_id: 2 },
    { title_en: "Object", active: true, id: 4, parent_id: 3 },
    { title_en: "Service", active: true, id: 5, parent_id: 2 }
  ];
  */

  return {
    index: function() {
      return items;
    },
    show: function(id) {
      var result = null;
      angular.forEach(items, function(u) {
        if (u.id == id) result = u;
      });
      return result;
    },
    create: function(item) {
      items.push(item);
    },
    update: function(item) {
      angular.forEach(items, function(u, index) {
        if (u.id == item.id) {
          //u = item; 
          items[index] = item;
        }
      });
    },
    destroy: function(id) {
      angular.forEach(items, function(u, index) {
        if (u.id == id) {
         //console.log(index);
         items.splice(index, 1); 
        }
      });
    }
  };
});

// MAIN CONTROLLER
//-------------------------------------------------------------------------------------
app.controller("MainCtrl", function($scope, $location, tmhDynamicLocale, $translate, Item, flash, $rootScope){

  // MAIN DATA BINDING
  $scope.navbarCollapsed = true;
  $scope.title = 'AngularJS Starterkit';  
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

//-------------------------------------------------------------------------------------
// INDEX ITEM CONTROLLER with crud tools, Search Filter, Sort and Paginate features
//-------------------------------------------------------------------------------------
app.controller("IndexCtrl", function($scope, $location, Item) {
  
  // ITEMS
  $scope.items = Item.index();
  
  // KEYWORD FILTER
  //-------------------------------------------------------------------------------------
  $scope.searchInput = '';
    
  // NESTED FILTER
  //-------------------------------------------------------------------------------------
  // Initialize the default option "All" to empty string
  $scope.nestedGroup = {"id":''};
  $scope.nestedGroups = [{"id":1,"title":"group1"},{"id":2,"title":"group2"},{"id":3,"title":"group3"},{"id":4,"title":"group4"},{"id":5,"title":"group5"}];
  
  // TROUBLESHOOT : Use onchange event NG-CHANGE to restore the default option "All" as initialized in empty string and not a null value
  $scope.resetNestedGroup=function(val){
    if($scope.nestedGroup.id==null) {
      $scope.nestedGroup ={"id":''};
    }     
  }
  // Debug option value on console
  /*
  $scope.$watch('nestedGroup.id', function(newVal){
      console.log(newVal);
  })
  */
  
  
  // SORT KEY
  $scope.sort = function(keyname){
    $scope.sortKey = keyname;   //set the sortKey to the param passed
    $scope.reverse = !$scope.reverse; //if true make it false and vice versa
  }
  

  
  
  // CRUD LINK PATHS
  //-------------------------------------------------------------------------------------
    // SHOW ITEM LOCATION
    $scope.showItem = function(item) {
        $location.path("/items/" + item);
    };
    
    // NEW ITEM LOCATION
    $scope.newItem = function() {
        $location.path("/new");
    };
    
    // EDIT ITEM LOCATION
    $scope.editItem = function(item) {
        $location.path("/items/" + item + "/edit");
    };
      
    // DELETE ITEM LOCATION
    $scope.deleteItem = function(item) {
        $location.path("/items/" + item + "/delete");
    };
  //-------------------------------------------------------------------------------------
  
});

//-------------------------------------------------------------------------------------
// CRUD CONTROLLERS
//-------------------------------------------------------------------------------------

  // SHOW ITEM CTRL
  //-------------------------------------------------------------------------------------
  app.controller("ShowCtrl", function($scope, $routeParams, Item, $location) {
    $scope.item = Item.show($routeParams.id);
    
    // New Item location
    $scope.newItem = function() {
        $location.path("/new");
    };
    
    // Delete Item location
    $scope.deleteItem = function(item) {
        $location.path("/items/" + item + "/delete");
    };
    
  });

  // NEW ITEM CTRL
  //-------------------------------------------------------------------------------------
  app.controller("NewCtrl", function($scope, $routeParams, Item, $location) {
    //$scope.item = Item.show($routeParams.id);
    $scope.new = {id: Item.index().length + 1};
    $scope.submitItem = function() {
        Item.create($scope.new);
        $scope.new = {};
        $location.path("/items");
    };
  });

  // EDIT ITEM CTRL
  //-------------------------------------------------------------------------------------
  app.controller("EditCtrl", function($scope, $routeParams, Item, $location) {
    //$scope.item = Item.show($routeParams.id);
    $scope.new = Item.show($routeParams.id);
    $scope.submitItem = function() {
        Item.update($scope.new);
        $scope.new = {};
        $location.path("/items/" + $routeParams.id);
    };
  });

  // DELETE ITEM CTRL
  //-------------------------------------------------------------------------------------
  app.controller("DeleteCtrl", function($scope, $routeParams, Item, $location) {
    //$scope.item = Item.show($routeParams.id);
        Item.destroy($routeParams.id);
        $location.path("/items");
  });

//-------------------------------------------------------------------------------------  
//   AUTHENTICATION - AUTHORIZATION CONTROLLERS
//-------------------------------------------------------------------------------------

  // LOGIN CTRL
  //-------------------------------------------------------------------------------------
  
  // Our login controller that will handle 
  app.controller('LoginCtrl', function ($location, $scope, $rootScope, flash, $http /*, tokenHandler */) {
    // login action
    $scope.login = function() {
      if ($scope.user.email != " ") {
        $rootScope.loggedInUser = $scope.user.email;
        $location.path("/items");
        flash.setMessage("successively logged in", "success");
      } else {
        $location.path("/login");
        flash.setMessage("wrong email", "danger");  
        $scope.user.errors = "error login";
      }
      
    };
    // Signup action
    $scope.signup = function() {
      
      if ($scope.user.email != " ") {
        $rootScope.loggedInUser = $scope.user.email;
        $location.path("/items");
        flash.setMessage("successively logged in", "success");
      } else {
        $location.path("/login");
        flash.setMessage("wrong email", "danger");  
        $scope.user.errors = "error login";
      }
        
      
      /*
      $http({
        url: '/api/users',
        method: 'POST',
        data: { user: $scope.user }
      }).success(function(data) {
        // If the request is successful, and the user
        // has been created: store the auth_token,
        // broadcast the 'authenticated' event across
        // our app, and redirect to '/'
        tokenHandler.set( data.auth_token );
        $scope.$broadcast('event:authenticated');
        $location.path('/');
        flash.setMessage("successively signed in", "success");
      }).error(function(reason) {
        // Store the errors to format on screen
        $scope.user.errors = reason;
      });*/
    };
  });
  
  

  // LOGOUT CTRL
  //-------------------------------------------------------------------------------------
  app.controller("LogoutCtrl", function($scope, $location, $rootScope, flash) {
      delete $rootScope.loggedInUser;
      $location.path("/items");
      flash.setMessage("successively logged out", "success");
  });
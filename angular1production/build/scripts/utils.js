(function () {
    'use strict';

    angular.module('angular1appdemo.utils',[]);	
    angular.module('angular1appdemo.utils')
    /**
    * Helper Service
    */	
    .service('helperService', ['$rootScope', '$log', 
        function helperService($rootScope, $log) {

            var that = this;		

            // IS-EMPTY FUNCTION
            that.isEmpty = function(variable) {
                // CHECK IF EMPTY
                if ((Array.isArray(variable) === true) && (variable.length > 0)) { 
                // if array value is not empty != []  // angular.toJson(variable) != "[]"
                    return false;
                } else if ((angular.toJson(variable) != "{}") && (typeof variable === 'object')) { 
                    // if object value is not empty != {}  // angular.toJson(variable) != "{}"
                    return false;
                } else if (typeof variable === 'undefined')	{
                    return true;
                } else {
                    return false;
                }
            };
            
            // GET-INDEX-OF FUNCTION
            that.getIndexOf = function(arr, val, prop) {
                prop = prop || '';
                
                var l = arr.length,
                i = 0;
                for (i = 0; i < l; i = i + 1) {		
                
                // if prop key exist
                if (prop && prop !== '') {
                    if (angular.toJson(arr[i][prop]) === angular.toJson(val)) {
                        return i;
                    } 			
                            
                // if arr[i] is an object then iterate on all keys 
                } else if (typeof arr[i] === 'object') {
                    var keys = Object.keys(arr[i]);
                    var flg = false;
                    for (var j = 0; j < keys.length; j++) {
                        var values = arr[i][keys[j]];
                        if (angular.toJson(values) === angular.toJson(val)) {
                            return i;
                        }
                    }
                    
                // if arr[i] is not an object
                } else {
                    if (angular.toJson(arr[i]) === angular.toJson(val)) {
                        return i;
                    }
                }
                
                }
                return -1;
            };	
            
            // IS-IN FUNCTION : Check if element is in object or in array
            that.isInclude = function(list, item, value) {
                value = value || '';
                if (Array.isArray(list) === true) { 
                    // if is an array		
                    
                    var index = that.getIndexOf(list, value, item);			
                    
                    // if (list[index] !== null) { 
                        
                    // if ($filter('filter')(list, item)[0]) {	
                    if (index > -1) {	
                        // if array contains this index
                        return true;
                    } else {
                        return false;
                    }
                    
                } else if ((angular.toJson(list) != "{}") && (typeof list === 'object')) { 
                // if is object and check if is not null (warning :  array is an object !)	
                    if (("item" in list) && (list.hasOwnProperty(item))) {
                        // if object contains this property
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
                
            };			
            
            
            // read data in list
            that.readData = function(list, ref, value){
                value = value || '';
                
                list = angular.fromJson( angular.toJson(list));
                
                if (Array.isArray(list) === true) { 
                    // if list is an array		
                    var index =  that.getIndexOf(list, value, ref);
                    
                    // if (list[index] !== null) { 
                        
                    // if ($filter('filter')(list, ref)[0]) {	
                    if (index > -1) {	
                        // if array contains this index
                        return list[index];
                    } 
                } else if ((angular.toJson(list) != "{}") && (typeof list === 'object')) { 
                // if list is object and check if is not null (warning :  array is an object !)	
                    if (("ref" in list) && (list.hasOwnProperty(ref))) {
                        // if object contains this property
                        return list[ref];
                    } 
                } 		
            };
            
        }
    ])
	
    
    /**
     * Session management
     */
    .service('sessionService', ['$rootScope', '$log', '$sessionStorage',  
        
        function($rootScope, $log, $sessionStorage) {
            
            // To handle keeping state across controllers, including when the user leaves and returns to the page.
            // so it can be converted back and forth from JSON to persist it. 
            // the html5 localstorage is used for persistence.
            // Usage :
            /*
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
            */

            var that = this;		

            that.restorestate = false;

            that.saveSession = function (nameModel) {
                $sessionStorage[nameModel] = angular.toJson(nameModel);
            };
            that.restoreSession = function(nameModel) {
                nameModel = angular.fromJson($sessionStorage[nameModel]);
            };
            that.resetSession = function(nameModel) {
                delete $sessionStorage[nameModel];
            };
            that.resetAllSessions = function() {
                $sessionStorage.$reset();
            };
        }
    ])


    /**
     * List pages history
     */
    .service('pagesHistoryService', ['$rootScope', '$log', 
        
        function($rootScope, $log) {
            
            var that = this;		
            
            // TRACK ROUTE HISTORY
            that.pages = [];			
            that.savePreviousPage = function() {				
                $rootScope.$on('$stateChangeSuccess', function (ev, toState, toParams, fromState, fromParams) {
                    that.pages.push({from: fromState, fromParams: fromParams, toState: toState, toParams : toParams  });
                    // $log.debug("Pages history : " + angular.toJson(that.pages, 4));
                });
                
            };
        }
    ])

    /**
     * Notify services
     */
    .service('notifyService', [ '$log', 
        
        function($log) {
            
            var that = this;		
            
            // Message notification
            that.messages = [];
            
            that.addMessage = function(statusVar, textVar, keysVar) {				
                statusVar = statusVar || "success";
                textVar  = textVar || "";
                keysVar = keysVar || {};
                
                that.messages.push({status : statusVar,  text : textVar, keys : keysVar});
            };
            
            that.resetMessage = function() {				
                that.messages = [];
            };
        }
    ]);

})();
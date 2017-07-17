	
angular.module('angular1appdemo.home')
/**
* Resource
*/
// DATA MANAGER
	.factory("HomeManager", ["$resource", function ($resource) {
		var userManager = {};
			
		// Data list
		userManager.items = [];

		// Will return array of data : $scope.users = UserRepository.query()
		userManager.listItems =  function(queryParam) { 
			queryParam = queryParam ||  { callback: 'JSON_CALLBACK' }; 
			var Resource = $resource('http://quickandclean.org/events');
			return Resource.query(queryParam, 
									{method: "JSONP", 
									isArray: true,
									// GET request not have body so use Accept param instead of Content-Type param
									headers : {
										'Accept' : 'application/json'
									}

									});
		};

		// Add new data : UserRepository.save($scope.user) 
			userManager.addItem = function(item) {
		var Resource = $resource('/api/users'); 
		return Resource.save(item, {method: "POST"} );
		};

		// Return data with target id  : UserRepository.get({id: $routeParams.id})
			userManager.getItem = function(index) { 
		var Resource = $resource('/api/users/' + index); 
		return Resource.get({}, {method: "GET"} );
		};

		// Update data with target id  : UserRepository.update({id: $routeParams.id}, $scope.user);
			userManager.updateItem = function(index, item) { 
		//var Resource = $resource('/api/users/' + index); 
		// return Resource.update(index, item, {method: "PUT"} );
		var Resource = $resource('/api/users/' + index, null,
												{
													'update': { method:'PUT' }
												});
		return Resource.update({ numUser:index }, item);

		};

		// Remove data with target id :  UserRepository.delete({ id: $routeParams.id })
			userManager.deleteItem = function(index) { 
		var Resource = $resource('/api/users/' + index); 
		return Resource.delete({}, {method: "DELETE"} );
		};

		// Find by property :  UserRepository.findByProperty('id', $routeParams.id)
		userManager.findByProperty = function (property, value) {
									// filter
									var matches = this.items.filter(function (property, value) {
										return user[property] === value;
										// or Convert first numUser property to a number.
										// return user[property] === Number(value); 
									});
									// take the first element in this result array
									var user = matches.shift();
									return user;
								};

			return userManager;
		}
	]);
	

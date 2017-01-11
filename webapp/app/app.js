'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'myApp.file',
  'myApp.FileBrowser',
  'ngRoute'
]).
config(['$locationProvider', '$routeProvider', 'RestangularProvider', 
	function($locationProvider, $routeProvider, RestangularProvider) {
	  $locationProvider.hashPrefix('!');
	  $routeProvider.otherwise({redirectTo: '/'});
	  RestangularProvider.setBaseUrl('http://localhost:8080');
	}]);

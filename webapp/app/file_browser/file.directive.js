'use strict';

angular.module('myApp.file', [])
.controller('FileCtrl', ['$scope', 
  function($scope) {
    $scope.onFClick = function() {
      $scope.onClick($scope.fId);
    }
  }])
  .directive('file', function() {
    return {
    	controller: 'FileCtrl',
    	transclude: true,
    	scope: {
    		'fId': '=',	
    		'fName': '=',
    		'lastModified': '=',
        'isDocumentFile': '=',
        'onClick': '='
    	},
      templateUrl: './file_browser/file.html'
    };
});

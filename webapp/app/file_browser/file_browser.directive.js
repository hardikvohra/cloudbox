'use strict';

angular.module('myApp.FileBrowser', ['myApp.Constants', 'myApp.FilesService', 'restangular', 'myApp.file'])
.controller(
	'FileBrowserController', ['$scope', 'FilesService', 'Constants',
	function($scope, FilesService, Constants) {
		$scope.currentFolder = {};
		$scope.currentDoc = {};
		$scope.showingDoc = false;
		$scope.back = back;
		$scope.showBack = false;
		showFolder(Constants.PARENT_ID);

		function back() {
			var newFolderId;
			if ($scope.showingDoc) {
				newFolderId = $scope.currentDoc.parentId;
			} else {
				newFolderId = $scope.currentFolder.parentId;
			}
			if (!_.isEmpty(newFolderId)) {
				showFolder(newFolderId);
			}
		}

		function showDoc(docId) {
			FilesService.getDoc(docId).then(function(response) {
				$scope.currentDoc = response;
				$scope.currentFolder = {};
				$scope.showingDoc = true;
				$scope.showBack = true;
			})
		}

		function showFolder(folderId) {
			FilesService.getFolder(folderId).then(function(response) {
				$scope.currentFolder = response;
				$scope.currentDoc = {};
				$scope.showingDoc = false;

				_.forEach($scope.currentFolder.children, function(fl) {
					var isDoc = (fl["kind"].toUpperCase() === Constants.DOC);
					fl["isDoc"] = isDoc;
					if (isDoc) {
						fl["onClick"] = showDoc;
					} else {
						fl["onClick"] = showFolder;
					}
				})
				$scope.showBack = !_.isEmpty($scope.currentFolder.parentId);
			});
		}
}])
.directive('fileBrowser', function() {
	return {
		controller: 'FileBrowserController',
    transclude: true,
    scope: {},
    templateUrl: './file_browser/file_browser.html'
	}
});
'use strict';

angular.module('myApp.FilesService', ['restangular'])
.service('FilesService', ['Restangular', function(Restangular){
  var Folder = 'folder';
  var Doc = 'doc';

  function getFolder(folderId) {
    return Restangular
      .one('users', 'anyuser')
      .one(Folder, folderId)
      .get();
  }

  function getDoc(docId) {
    return Restangular
      .one('users', 'anyuser')
      .one(Doc, docId)
      .get();
  }
  
  this.getDoc = getDoc;
  this.getFolder = getFolder;
}]);
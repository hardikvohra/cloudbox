var restify = require('restify');
var _ = require('lodash');
// Create the server
var server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

// Listen requests on port 8080
server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

// server.use
server.use(restify.throttle({
  burst: 5,
  rate: 5,
  ip: true,
}));

// Need to check the requirement of these
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.CORS({
  origins: ['*'],
  credentials: false, // defaults to false
  headers: ['']  // sets expose-headers
}));

server.get('/users/:user_name/folder/:folder_id', function create(req, res, next) {
  var userName = req.params.user_name;
  var folderId = req.params.folder_id;
  var folder = FilesNFolderDB[folderId];
  if (_.isEmpty(folder)) {
    res.send(400, new Error("File Not Found"));
  } else {
    var children = folder.children;
    var childrenSummary = [];
    if (!_.isEmpty(children)) {
      var children = _.forEach(children, function(childId) {
        childrenSummary.push(FilesNFolderDB[childId]);
      })
    } 
    var response = {
      id: folder.id,
      parentId: folder.parentId,
      name: folder.name,
      children: childrenSummary,
      lastModified: folder.lastModified,
      kind: folder.kind
    }
    res.send(response);  
  }
  next();
});

server.get('/users/:user_name/doc/:file_id', function create(req, res, next) {
  var userName = req.params.user_name;
  var fileId = req.params.file_id;
  var file = FilesNFolderDB[fileId];
  if (file != null && file.kind == File) {
    res.send({
      id: file.id,
      name: file.name,
      parentId: file.parentId,
      lastModified: file.lastModified,
      kind: File,
      txt: fileText[file.id.length % 2]
    });
  } else {
    res.send(400, new Error("File Not Found"));
  }
  next();
});

const Folder = 'FOLDER';
const File = 'DOC';
var parent_folder = {
  kind: Folder, 
  id: 'parent_id',
  name: '',
  children: [],
  lastModified: generateRandomDate()
};

var FilesNFolderDB = {};
FilesNFolderDB[parent_folder.id] = parent_folder;
generateFilesFolders();
generateFilesFolders();
generateFilesFolders();
generateFilesFolders();
generateFilesFolders();

function generateFilesFolders() {
  var keys = Object.keys(FilesNFolderDB);
  var i = 0;
  for (i = 0; i < keys.length; i++) {
    if (FilesNFolderDB[keys[i]].kind === Folder) {
      generateFF(FilesNFolderDB[keys[i]], 4);
    }
  }
}

function generateFF(parent, numOfFoldersNFiles) {
  var i = 0;
  var children = parent.children;
  for (i = 0 ; i < numOfFoldersNFiles; i++) {
    var _kind = [File, Folder][i % 2];
    var _name = generateRandomName();
    var _id = parent.id + "_" + _kind + "_"+ _name;
    FilesNFolderDB[_id] = {
      children: [],
      parentId: parent.id, 
      kind: _kind,
      id: _id,
      name: _name,
      lastModified: generateRandomDate()
    }
    children.push(_id);
  }
}

function generateRandomName() {
  var charCount = Math.floor((Math.random() * 12));
  charCount = Math.max(4, charCount);
  return Math.random().toString(16).substring(charCount);
}

function generateRandomDate(start, end) {
  var start = new Date(2012, 0, 1);
  var end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const fileText = ["Babumoshai, Zindagi ek rang manch hai aur " + 
  "hum sab is rang manch par kathputliyan hain, " + 
  "hum sabki dorr upar wale ke hath mien hai, " + 
  "kab kiski dor khich jaye koi nahi janta. ", 
  "Kabhi kabhi kuch jeetne ke liye kuch harna bhi padta hai, " + 
  "aur haar kar jeetnay wale ko baazigar kehte hain"];









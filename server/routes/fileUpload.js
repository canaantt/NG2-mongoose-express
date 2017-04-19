const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose'); 
const _ = require("underscore");
const validFileTypes = ['txt', 'csv', 'tsv', 'json'];
var router = express.Router();
var bodyParser = require('body-parser'); //parses information from POST
router.use(bodyParser.urlencoded({ extended: true }));
router.use(fileUpload());

router.post('/', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  var file= req.files.sampleFile;
  if (validFileTypes.indexOf(_.last(file.name.split("."), 1)[0]) == -1){
    return res.status(400).send('File type is not valid.');
  } else{
    var fileUploadingDir = '/Users/jennyzhang/Desktop/canaantt/NG2-mongoose-express/tmp/';
    var filePath = fileUploadingDir.concat(file.name);
    
    file.mv(filePath, function(err) {
      if (err)
        return res.status(500).send(err);
      res.send('File uploaded!');
    });
  }
});

router.post('/', function(res, res){
	res.send('POST handler for /files route.');
});

module.exports = router;

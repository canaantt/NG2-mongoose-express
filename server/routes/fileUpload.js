const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose'); 
const _ = require("underscore");
const validFileTypes = ['txt', 'csv', 'tsv', 'json'];
var router = express.Router();
var bodyParser = require('body-parser'); //parses information from POST
var multer = require('multer');


router.use(bodyParser.urlencoded({ extended: true }));
router.use(fileUpload());

// router.post('/', function(req, res) {
//   if (!req.files)
//     return res.status(400).send('No files were uploaded.');

//   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//   var file= req.files.sampleFile;
//   if (validFileTypes.indexOf(_.last(file.name.split("."), 1)[0]) == -1){
//     return res.status(400).send('File type is not valid.');
//   } else{
//     var fileUploadingDir = '/Users/jennyzhang/Desktop/canaantt/NG2-mongoose-express/tmp/';
//     var filePath = fileUploadingDir.concat(file.name);
    
//     file.mv(filePath, function(err) {
//       if (err)
//         return res.status(500).send(err);
//       res.send('File uploaded!');
//     });
//   }
// });

router.post('/', function(res, res){
	res.send('POST handler for /files route.');
});
var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        }
    });

    var upload = multer({ //multer settings
                    storage: storage
                }).single('file');

    /** API path that will upload the files */
    router.post('/upload', function(req, res) {
        upload(req,res,function(err){
			console.log(req.file);
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});
        });
    });

module.exports = router;

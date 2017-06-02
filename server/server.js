const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const tsv = require("node-tsv-json");
const csv=require('csvtojson');
var convertExcel = require('excel-as-json').processFile
const fs = require("fs");
var path = require('path');
// var GridFsStorage = require('multer-gridfs-storage');
// var Grid = require('gridfs-stream');
var multer = require('multer');
var bodyParser = require('body-parser'); //parses information from POST
var filebrowser = require('file-browser');
var User = require("./models/user");
var Project = require("./models/project");
var File = require("./models/file");
var IRB = require("./models/irb");
var Permission = require("./models/permission");

const corsOptions = {
	origin: 'http://localhost:4200'
}
mongoose.connect("mongodb://localhost:27017/mydb");
var db = mongoose.connection;
// Grid.mongo = mongoose.mongo;
// var gfs = Grid(db.db);

function processResult(req, res, next , query){
    return function(err, data){
        if (err) {
            console.log(err);
            res.status(404).send("Not Found").end();
        }else{
            res.json(data).end();
        }
    };
};

function routerFactory(Model)
{
    var router = express.Router();
    router.use(bodyParser.json()); 
    router.use(bodyParser.urlencoded({ extended: true }));

    router.get('/', function(req, res){	
        Model.find({}, processResult(req,res) );
    });
    router.post('/', function(req, res) {
        Model.create(req.body, processResult(req,res));
    });
    router.route('/:id')
    .get(function(req, res){
        Model.findById(req.params.id, processResult(req,res) );
    })
    .put(function(req, res){
        Model.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: false}, processResult(req,res) );
    })
    .delete(function(req, res){
        Model.remove({_id: req.params.id}, processResult(req,res) );
    });
    return router;
}

function fileRouterFactory(){
    var router = express.Router();
    router.use(bodyParser.json()); 
    router.use(bodyParser.urlencoded({ extended: true }));
    router.get('/', function(req, res){	
        // File.find({}, processResult(req,res) );
        console.log("in Files");
        res.status(200).end();
    });
    router.post('/', function(req, res) {
        console.log("in post");
    });
    return router;
}

var app = express();
app.use(function (req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
app.use(bodyParser.urlencoded({limit: '400mb'}));
app.use(bodyParser.json({limit: '400mb'}));
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function (callback) {
	console.log("Connection succeeded.");
	app.use(cors(corsOptions));
	app.use('/users', routerFactory(User));
	app.use('/projects', routerFactory(Project));
	app.use('/files', fileRouterFactory());
	app.use('/irbs', routerFactory(IRB));
	app.use('/permissions', routerFactory(Permission));
	app.post('/upload/:id', function (req, res) {
        console.log(req.params.id);
        var projectID = req.params.id;
        var molecularColleciton = mongoose.model(projectID + "_data_molecular", File.schema);
        var sampleMapCollection = mongoose.model(projectID + "_data_samples", File.schema);
        var clinicalColleciton = mongoose.model(projectID + "_data_clinical", File.schema);
		upload(req, res, function (err) {
			if (err) {
				res.json({ error_code: 1, err_desc: err });
				return;
			} else {
                // console.dir(res.req);
                // res.setHeader("Content-Type", "application/json");
                options = { "sheet": '1',
                            "isColOriented": true,
                            "omitEmtpyFields": true };
                convertExcel(res.req.file.path, undefined, options, function(err, data){
                    if (err) console.log(err);
                    console.log("Within convert Excel function");
                    console.log(data);
                    db.collection(projectID+"_data_samples").insert(data[0], function(err, result){
                                if (err) console.log(err);
                                res.send("WORKED");
                            });
                    // res.json(data).end();
                });
            }
		});
	});
    app.use('/upload/', express.static('./uploads'));
	app.listen(3000, function () {
		console.log('listening on 3000...');
	});
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
     cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    var newFileName = file.fieldname + '-' + Date.now();
    cb(null, newFileName);
  }
})
var upload = multer({
	storage: storage, 
    preservePath: true
}).single('file');





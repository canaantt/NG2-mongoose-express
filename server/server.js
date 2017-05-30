const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const tsv = require("node-tsv-json");
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
    // router.route('/:query')
    // .get(function(req, res){
    //     console.log("************");
    //     console.log(req.query.q);
    //     var query = (req.query) ? JSON.parse(req.params.query) : {};
    //     Model.find(query, processResult(req, res));
    // })
    return router;
}

function fileRouterFactory(){
    var router = express.Router();
    router.use(bodyParser.json()); 
    router.use(bodyParser.urlencoded({ extended: true }));
    router.get('/', function(req, res){	
        // File.find({}, processResult(req,res) );
    });
    router.post('/', function(req, res, next) {
        // Model.create(req.body, processResult(req,res));
        // Category, DataType, Data, Name, Size, Project
        // req.body.Project = "guid";
        var molecularColleciton = mongoose.model(req.body.Project+"_data_molecular", File.schema);
        var sampleMapCollection = mongoose.model(req.body.Project+"_data_samples", File.schema);
        var clinicalColleciton = mongoose.model(req.body.Project+"_data_clinical", File.schema);
        // mongoose.listCollections({name: req.body.Project+"_data_molecular"})
        //         .next(function(err, collinfo) {
        //             if (collinfo) {
        //                 console.log(req.body.Project+"_data_molecular exists.");
        //             } else {
        //                 var molecularColleciton = mongoose.model(req.body.Project+"_data_molecular", File.schema);
        //             }
        //         });
        
        if('SampleMap_Clinical' in req.body){
             db.collection(req.body.Project+"_data_samples").insert(req.body.SampleMap_Clinical, function(err, result){
                if (err) console.log(err);
                res.send("WORKED");
            });  
            db.collection(req.body.Project+"_data_clinical").insertMany(req.body.Clinical, function(err, result){
                if (err) console.log(err);
        
            });
        }

         if('SampleMap_Molecular' in req.body){
             db.collection(req.body.Project+"_data_samples").insert(req.body.SampleMap_Molecular, function(err, result){
                if (err) console.log(err);
                res.send("WORKED");
            });  
            db.collection(req.body.Project+"_data_molecular").insertMany(req.body.Molecular, function(err, result){
                if (err) console.log(err);
        
            });
        }
       
        
         


    });
    router.route('/:projectID-:dataType')
    .get(function(req, res){
        console.log(req.params);
        var CollectionName = req.params.projectID + "_data_" + req.params.dataType;
        console.log(CollectionName);
        // db.collection("5928a5e99bd43c24c145a548_data_clinical").find().toArray().then(function(result, err){
        //     if(err) console.log(err);
        //     console.log(result);
        // })
        db.collection(CollectionName).find().toArray().then(function(res, err){
            if(err) console.log(err);
            processResult(req, res);
        })
    })
    // .put(function(req, res){
    //     Model.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: false}, processResult(req,res) );
    // })
    // .delete(function(req, res){
    //     Model.remove({_id: req.params.id}, processResult(req,res) );
    // });
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
	app.post('/upload', function (req, res) {
		upload(req, res, function (err) {
			if (err) {
				res.json({ error_code: 1, err_desc: err });
				return;
			} else {
                console.dir(res.req);
                res.setHeader("Content-Type", "application/json");
                tsv({
                        input: res.req.file.path,
                        output: res.req.file.path + '.json',
                        parseRows: true
                    }, function(err, result) {
                        if(err) {
                        console.error(err);
                        }else {
                        console.log(res.req.file.path);
                        console.log(result);
                        res.json({data: result, filename: res.req.file.path+'.json'}).end();
                    }
                });
            }
			// res.json({ error_code: 0, err_desc: null });
		});
	});
    app.use('/upload/', express.static('./uploads'));
	app.listen(3000, function () {
		console.log('listening on 3000...');
	});
});

// var storage = GridFsStorage({
//         gfs : gfs,
//         filename: function (req, file, cb) {
//             var datetimestamp = Date.now();
//             cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
//         },
//         /** With gridfs we can store aditional meta-data along with the file */
//         metadata: function(req, file, cb) {
//             cb(null, { originalname: file.originalname});
//         },
//         root: 'uploadedFiles' //root name for collection to store files into
//     });

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
     cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    //cb(null, file.fieldname + '-' + Date.now())
    var newFileName = file.fieldname + '-' + Date.now();
    cb(null, newFileName);
    // cb(tsvParser('./uploads/' + newFileName), newFileName);
  }
})
var upload = multer({
	storage: storage, 
    preservePath: true
}).single('file');




const express = require('express');
const _ = require("underscore");
const cors = require('cors');
const mongoose = require('mongoose');
const asyncLoop = require('node-async-loop');
const tsv = require("node-tsv-json");
const csv=require('csvtojson');
var convertExcel = require('excel-as-json').processFile;
var XLSX =require("xlsx");
var excelParser = require('excel-parser');
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
    router.get('/:id', function(req, res){
        console.log("Getting Project-Related Collections...");
        console.log(req.params.id);
        var projectID = req.params.id;


        db.db.listCollections().toArray(function(err, collectionMeta) {
            if (err) {
                console.log(err);
            }
            else {
                var projectCollections = collectionMeta.map(function(m){
                    return m.name;
                }).filter(function(m){
                    return m.indexOf(projectID) > -1;
                });
                
                if(projectCollections.length === 0){
                    res.status(404).send("Not Found").end();
                } else {
                    var arr = [];

                    asyncLoop(projectCollections, function(m, next){ 
                        db.collection(m).find().toArray(function(err, data){
                            var obj = {};
                            obj.collection = m;
                            if(m.indexOf("clinical") > -1){
                                obj.category = "clinical";
                                obj.patients = data.map(function(m){return m.id});
                                obj.metatdata = data[0].metadata;
                                obj.enums_fields = data.map(function(m){return Object.keys(m.enums);})
                                                       .reduce(function(a, b){return a = _.uniq(a.concat(b));});
                                obj.nums_fields = data.map(function(m){return Object.keys(m.nums);})
                                                       .reduce(function(a, b){return a = _.uniq(a.concat(b));});               
                                obj.time_fields = data.map(function(m){return Object.keys(m.time);})
                                                       .reduce(function(a, b){return a = _.uniq(a.concat(b));});   
                                obj.boolean_fields = data.map(function(m){return Object.keys(m.boolean);})
                                                       .reduce(function(a, b){return a = _.uniq(a.concat(b));});                                                                     
                                arr.push(obj);
                            } else {
                                obj.category = "molecular";
                                var types = _.uniq(data.map(function(m){return m.type}));
                                types.forEach(function(n){
                                    obj[n] = {};
                                    typeObjs = data.filter(function(v){return v.type === n});
                                    obj[n].markers = typeObjs.map(function(v){return v.marker});
                                    obj[n].patients = _.uniq(typeObjs.map(function(v){return Object.keys(v.data);})
                                                                     .reduce(function(a, b){return a = _.uniq(a.concat(b));}));
                                });
                                arr.push(obj);
                            }
                            next();
                        });
                        
                    }, function(err){
                        if(err){
                            console.log(err);
                            res.status(404).send(err).end();
                        } else {
                            res.json(arr).end();
                        }    
                        
                    });
                    
                }
               
                
            }
        });
    });
    return router;
}
function camelToDash(str) {
      return str.replace(/\W+/g, '-')
                .replace(/([a-z\d])([A-Z])/g, '$1-$2')
                .replace("-", "_")
                .toLowerCase();
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
				res.json({ error_code: 1, err_desc: err }).end();
				return;
			} else {
                var workbook = XLSX.readFile(res.req.file.path);
                var allSheetNames =  Object.keys(workbook.Sheets);
                if (allSheetNames.indexOf("PATIENT") === -1) {
                   err = "PATIENT Sheet is missing!";
                   res.json({ error_code: 1, err_desc: err }).end(); 
                   return;
                }
                var PatientIDs;
                allSheetNames.forEach(function(sheet){
                    console.log(sheet);
                    var sheetObj = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {header:1});
                    var arr = [];
                    var header = sheetObj[0];
                    sheetObjData = sheetObj.splice(1, sheetObj.length);
                    if(sheet.split("-")[0] === "MOLECULAR"){
                        console.log("It's a molecular sheet.")
                        var dataType = sheet.split("-")[1];
                        
                        header.forEach(function(m){
                            var obj = {};
                            obj.type = dataType;
                            obj.marker = m;
                            obj.data = sheetObjData.map(function(n){
                                return n[header.indexOf(m)];
                            })
                            arr.push(obj);
                        })
                        db.collection(projectID+"_data_molecular").insertMany(arr, function(err, result){
                                                if (err) console.log(err);
                                            });
                    } else {
                        var PatientArr = [];
                        if(sheet === "PATIENT") {
                            console.log("PATIENT sheet");
                            PatientIDs = _.uniq(sheetObjData.map(function(m){
                                return m[0];
                            }));

                            var enum_fields = [];
                            var num_fields = [];
                            var date_fields = [];
                            var boolean_fields = [];
                            var remaining_fields = [];
                            header.forEach(function(h){
                                if(h.indexOf("-Date") > -1) {
                                    date_fields.push(h.split("-")[0]);
                                } else if (h.indexOf("-String") > -1) {
                                    enum_fields.push(h.split("-")[0]);
                                } else if (h.indexOf("-Number") > -1) {
                                    num_fields.push(h.split("-")[0]);
                                } else if (h.indexOf("-Boolean") > -1) {
                                    boolean_fields.push(h.split("-")[0]);
                                } else {
                                    remaining_fields.push(h.split("-")[0]);
                                }
                            });
                            // Collect unique values of enums from the entire sheetObjData
                            var metaObj = {};
                            enum_fields.forEach(function(field){
                                metaObj[camelToDash(field)] = _.uniq(sheetObjData.map(function(record){
                                                                        return record[header.indexOf(field +"-String")];}));                                        
                                                                    });



                            PatientArr = PatientIDs.reduce(function(arr_clinical, p){
                                var samples = [];
                                var enumObj = {};
                                var numObj = {};
                                var booleanObj = {};
                                var timeObj = {};
                                var Other = {};
                                sheetObjData.filter(function(record){
                                    return record[0] === p;
                                }).forEach(function(m){
                                   samples.push({id: m[1]});
                                   enum_fields.forEach(function(field){
                                    enumObj[camelToDash(field)] = m[header.indexOf(field+"-String")]; 
                                   }); 
                                   num_fields.forEach(function(field){
                                    numObj[camelToDash(field)] = m[header.indexOf(field+"-Number")];
                                   });
                                   boolean_fields.forEach(function(field){
                                    booleanObj[camelToDash(field)] = m[header.indexOf(field+"-Boolean")];
                                   });
                                   date_fields.forEach(function(field){
                                    timeObj[camelToDash(field)] = m[header.indexOf(field+"-Date")];
                                   });
                                   remaining_fields.forEach(function(field){
                                    Other[camelToDash(field)] = m[header.indexOf(field)];
                                   });
                                });
                                
                                arr_clinical.push({"id" : p,
                                          "samples" : samples,
                                          "enums" : enumObj,
                                          "time": timeObj,
                                          "nums": numObj,
                                          "boolean": booleanObj,
                                          "metadata": metaObj,
                                          "events": []
                                        });
                                return arr_clinical;
                                }, []);
                            
                        } else if (sheet.split("-")[0] === "PATIENTEVENT"){
                            console.log(sheet);
                            var sheetObj = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {header:1});
                            var header = sheetObj[0];
                            sheetObjData = sheetObj.splice(1, sheetObj.length);
                            console.log(header);
                            var id = sheet.split("-")[1];
                            sheetObjData.forEach(function(record){
                                var pos = _.findIndex(PatientArr, function(a){
                                    return a.id === record[0];
                                })
                                var o = {};
                                o.id = id;
                                o.start = record[1];
                                o.end = record[2];
                                header.splice(0, 3).forEach(function(h){
                                    o[h] = record[header.indexOf(h)];
                                });
                                if( pos > -1){
                                    PatientArr[pos].events.push(o);
                                } else{
                                    PatientArr.push({
                                        "id": record[0],
                                        "events":[o]
                                    });
                                }
                            });
                        }
                        db.collection(projectID+"_data_clinical").insertMany(PatientArr, function(err, result){
                                                if (err) console.log(err);
                                            });
                    }
                });
                res.status(200).end();
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
    var newFileName = file.fieldname + '-' + Date.now() + '.xlsx';
    cb(null, newFileName);
  }
})
var upload = multer({
	storage: storage, 
    preservePath: true
}).single('file');





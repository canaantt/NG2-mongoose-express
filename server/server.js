const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');

var User = require("./models/user");
var Project = require("./models/project");
var File = require("./models/file");
var IRB = require("./models/irb");
var Permission = require("./models/permission");

var routerFactory = require("./routes/routerFactory");
var multer = require('multer');
const corsOptions = {
	origin: 'http://localhost:4200'
}
mongoose.connect("mongodb://localhost:27017/mydb");
var db = mongoose.connection;
Grid.mongo = mongoose.mongo;
var gfs = Grid(db.db);

db.on("error", console.error.bind(console, "connection error"));
db.once("open", function (callback) {
	console.log("Connection succeeded.");
	var app = express();
	app.use(function (req, res, next) { //allow cross origin requests
		res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Credentials", true);
        next();
	});
	app.use(cors(corsOptions));
	app.use('/users', routerFactory(User));
	app.use('/projects', routerFactory(Project));
	app.use('/files', routerFactory(File));
	app.use('/irbs', routerFactory(IRB));
	app.use('/permissions', routerFactory(Permission));
	app.post('/upload', function (req, res) {
		upload(req, res, function (err) {
			if (err) {
				res.json({ error_code: 1, err_desc: err });
				return;
			}
			res.json({ error_code: 0, err_desc: null });
		});
	});
	app.listen(3000, function () {
		console.log('listening on 3000...');
	});
});

var storage = GridFsStorage({
        gfs : gfs,
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        },
        /** With gridfs we can store aditional meta-data along with the file */
        metadata: function(req, file, cb) {
            console.log("what is the req");
            console.dir(req);
            cb(null, { originalname: file.originalname});
        },
        root: 'uploadedFiles' //root name for collection to store files into
    });

var upload = multer({
	storage: storage
}).single('file');





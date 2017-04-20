const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
var User = require("./models/user");
var Project = require("./models/project");
var File = require("./models/file");
var IRB = require("./models/irb");
var Permission = require("./models/permission");

var routerFactory = require("./routes/routerFactory");
var fileupload = require('./routes/fileUpload');
const corsOptions = {
	origin: 'http://localhost:4200'
}
mongoose.connect("mongodb://localhost:27017/mydb");
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback){
    console.log("Connection succeeded.");
	var app = express();
	app.use(cors(corsOptions));
	app.use('/users', routerFactory(User));
	app.use('/projects', routerFactory(Project));
	app.use('/files', routerFactory(File));
	app.use('/irbs', routerFactory(IRB));
	app.use('/permissions', routerFactory(Permission));
    app.use('/upload', fileupload);
	
	// app.use(express.static(path.join(__dirname, 'dist')));
	// app.get('*', (req, res) => {
	// 	res.sendFile(path.join(__dirname, 'dist/index.html'));
	// });


	app.listen(3000, function(){
		console.log('listening on 3000...');
	});
});






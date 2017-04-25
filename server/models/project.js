var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var File = require("../models/file");
var IRB = require("../models/irb");
var Permission = require("../model/permission");
var status = ["uploaded", "upload started", "failed"];
var projectSchema = new Schema({
    Name: String,
    Description: String,
    Annotations: [{key: String, value: String}], 
    Files: [{type: Schema.ObjectId, ref:File}],
    Permissions: [{type: Schema.ObjectId, ref: Permission}],
    Date: {type: Date, default: Date.now}
});
module.exports = mongoose.model("Project", projectSchema);


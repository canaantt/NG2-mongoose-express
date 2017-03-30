var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var roles = ['full-permission', 'readOnly'];

var permissionSchema = new Schema({
    User: {type: Schema.ObjectId, ref: 'User', required: true},
    Project: {type: Schema.ObjectId, ref: 'Project', required: true},
    Role: {type: String, enum:roles , required: true}
});

module.exports= mongoose.model("Permission", permissionSchema);


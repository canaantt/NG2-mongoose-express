var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var roles = ['owner', 'full-access', 'read-only'];

var permissionSchema = new Schema({
    User: {type: Schema.ObjectId, ref: 'User', required: true},
    Project: {type: Schema.ObjectId, ref: 'Project', required: true},
    Role: {type: String, enum:roles , required: true},
    Date: {type: Date, default: Date.now}
}, {collection:'permissions'});

module.exports= mongoose.model("Permission", permissionSchema);


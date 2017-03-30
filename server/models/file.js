var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var categories = ['clinical', 'molecular', 'metadata'];
var datatypes = ['diagnosis', 'drug', 'treatment', 'mut', 'RNASeq', 'cnv'];

var fileSchema = new Schema({
    Category: { type: String, enum: categories }, 
    DataType: { type: String, enum: datatypes },
    Path: String, 
    Status: Boolean
});
module.exports = mongoose.model("File", fileSchema);

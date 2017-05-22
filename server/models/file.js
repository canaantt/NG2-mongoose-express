var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var categories = ['clinical', 'molecular', 'metadata'];
var datatypes = ['diagnosis', 'drug', 'treatment', 'mut', 'RNASeq', 'cnv', 'protein'];

var fileSchema = new Schema({
    Name: String,
    Category: { type: String, enum: categories }, 
    DataType: { type: String, enum: datatypes },
    Status: String,
    Date: {type: Date, default: Date.now}
});
module.exports = mongoose.model("File", fileSchema);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DimensionSchema = new Schema({
    Length: Number,
    Height: Number,
    Width: Number
})


const Dimension = mongoose.model('Dimension', DimensionSchema);
module.exports = { DimensionSchema , Dimension }
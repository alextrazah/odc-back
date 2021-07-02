var mongoose = require('mongoose');
var DimensionSchema = require('./Dimension').DimensionSchema
var Schema = mongoose.Schema;

var Package = new Schema({
  note: String,
  dimension: DimensionSchema,
  type: String,
  weight: Number
});

module.exports = mongoose.model('Package', Package);

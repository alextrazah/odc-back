var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var LocationSchema = require('./Location').LocationSchema

var AddressSchema = new Schema({
    Street: String,
    City: String,
    State: String,
    ZipCode: Number,
    Location: LocationSchema
});

const Address = mongoose.model('Address', AddressSchema);
module.exports = {Address, AddressSchema}
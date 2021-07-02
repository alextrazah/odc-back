var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var LocationSchema = new Schema({
    Longitude: Number,
    Latitude: Number
});

const Location = mongoose.model('Location', LocationSchema);
module.exports = {LocationSchema, Location }
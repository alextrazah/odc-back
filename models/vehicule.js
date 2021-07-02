var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Vehicule = new Schema({
  registrationNumber: String,
  model: String,
  weightCapacity: Number,
  trunkVolume: Number,
  weightLeft: Number,
  volumeLeft: Number,
  driver: {
    type: Schema.Types.ObjectId,
    ref: "delivery_man",
  },
});

module.exports = mongoose.model("vehicule", Vehicule);

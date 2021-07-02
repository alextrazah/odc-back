var mongoose = require("mongoose");
var AddressSchema = require("../models/Address").AddressSchema;
var LocationSchema = require("../models/Location").LocationSchema;
var Schema = mongoose.Schema;

var delivery = new Schema({
  customer: {
      type: Schema.Types.ObjectId,
      refPath: 'CustomerModel'
  },
  driver: {
      type: Schema.Types.ObjectId,
      ref: 'delivery_man'
  },
  package: [{
      type: Schema.Types.ObjectId,
      ref: 'Package'
  }],
  vehicle: {
      type: Schema.Types.ObjectId,
      ref: 'vehicule'
  },
  date_Launch: Date,
  distance: Number,
  duration: Number,
  state: Number,
  sourceAddress: AddressSchema,
  destinationAddress: [AddressSchema],
  location: LocationSchema,
  CustomerModel: {
    type: String,
    required: true,
    enum: ['customer', 'entreprise']
  },
  Paid:Boolean
});

module.exports = mongoose.model("delivery", delivery);

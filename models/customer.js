var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var AdressSchema = require('./Address').AddressSchema;

var Customer = new Schema({
  Cin: Number,
  FirstName: String,
  LastName: String,
  UserName: String,
  Password: String,
  Email: String,
  PhoneNumber: Number,
  Adress: AdressSchema,
  img: String,
  payments: [
    {
      type: Schema.Types.ObjectId,
      ref: "payment"
    }
  ],
  deliveries: [
    {
      type: Schema.Types.ObjectId,
      ref: "delivery"
    }
  ],
  reduction:Boolean

});


module.exports = mongoose.model("customer", Customer);

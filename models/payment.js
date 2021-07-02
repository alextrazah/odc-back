var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var AddressSchema = require("./Address").AddressSchema;


var Payment = new Schema({
  PaymentMethod: String,
  NameOnCard: String,
  Email:String,
  Address: AddressSchema,
  creditCard: Number,
  CardType: String,
  SecurityCode: Number,
  ExpirationDate: Date,
  Country: String,
  Amount:Number,
  CreationDate: Date
});

module.exports = mongoose.model("payment", Payment);

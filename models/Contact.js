var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Contact = new Schema(
  {
    Id: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    company: String,
    adress: String,
    type: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("contact", Contact);

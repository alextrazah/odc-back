var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Company = new Schema(
  {
    Id: String,
    appTitle: String,
    name: String,
    email: String,
    MF: String,
    phone: String,
    adress: String,
    logo: String,
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("company", Company);

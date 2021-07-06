var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Odc = new Schema(
  {
    Id: String,
    Firstname: String,
    Lastname: String,
    Sex: String,
    Email: String,
    Color: String,
    Employ: Boolean,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("odc", Odc);

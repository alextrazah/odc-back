var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var signature = new Schema(
  {
    img: String,
    client: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("signature", signature);

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Category = new Schema(
  {
    Id: String,
    categoryName: String,
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("category", Category);

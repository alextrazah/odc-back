var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Product = new Schema(
  {
    Id: String,
    productName: String,
    buyingPrice: String,
    sellingPrice: String,
    stockQuantity: String,
    image: String,
    exitTicket: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", Product);

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Expense = new Schema(
  {
    Id: String,
    name: String,
    description: String,
    paymentType: String,
    date: String,
    deadline: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("expense", Expense);

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var delivery_man = new Schema(
  {
    Username: String,
    Email: String,
    Password: String,
    FullName: String,
    Phone: Number,
    Status: Number,
    address: String,
    cin: String,
    Region: [
      {
        value: String,
        label: String,
        rating: String,
      },
    ],
    Type: String,
    Licence: String,
    Gender: String,
    Date_birth: Date,
    img: String,
    pdp: String,
    deliveries: [
      {
        type: Schema.Types.ObjectId,
        ref: "delivery",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("delivery_man", delivery_man);

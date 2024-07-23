const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const amenitiesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter The Type"],
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Amenity", amenitiesSchema);

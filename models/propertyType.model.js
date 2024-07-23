const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const propertyTypeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Please Enter The Type"],
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PropertyType", propertyTypeSchema);

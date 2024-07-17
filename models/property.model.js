const mongoose = require("mongoose");
const validator = require("validator");
require("dotenv").config({ path: "../.env" });

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please Enter The Title"],
    },
    buildingName: {
      type: String,
    },
    street: {
      type: String,
    },
    addressline2: {
      type: String,
    },
    town: {
      type: String,
    },
    country: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    location: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);

const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const propertyTypeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["commercial", "residential"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    amenities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Amenity",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("PropertyType", propertyTypeSchema);

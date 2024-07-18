const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please Enter The Title"],
    },
    propertyImage: {
      type: String,
    },
    totalRooms: {
      type: Number,
    },
    rooms: [
      {
        transaction: {
          type: String,
          enum: ["buy", "rent", "sell"],
          default: "buy",
        },
        status: {
          type: String,
          enum: ["coming soon", "available", "let agreed"],
          default: "available",
        },
        roomImages: [
          {
            type: String,
          },
        ],
        bedroom: {
          type: Number,
        },
        squareft: {
          type: Number,
        },
        price: {
          type: Number,
        },
      },
    ],
    propertyType: {
      type: String,
      enum: ["commercial", "residential"],
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

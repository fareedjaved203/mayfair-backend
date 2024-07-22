const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please Enter The Title"],
    },
    propertyType: {
      type: String,
      enum: ["commercial", "residential"],
    },
    propertyImages: [
      {
        type: String,
      },
    ],
    propertySubtype: {
      type: String,
    },
    propertyOption: {
      type: String,
      enum: ["buy", "rent"],
      default: "rent",
    },
    residentialPropertyDetails: {
      status: {
        type: String,
      },
      bedrooms: {
        type: Number,
      },
      bathrooms: {
        type: Number,
      },
      description: {
        type: String,
      },
      size: {
        type: Number,
      },
      price: {
        type: Number,
      },
    },
    propertyAddress: {
      buildingNumber: String,
      street: String,
      city: String,
      state: String,
      zip: String,
      location: String,
    },
    propertyDetails: {
      squareft: Number,
      startSize: Number,
      endSize: Number,
      propertyLocation: String,
    },
    amenities: [
      {
        type: String,
      },
    ],
    propertyDescription: String,
    facts: {
      title: String,
      description: String,
    },
    location: {
      latitude: String,
      longitude: String,
      transportOption: [
        {
          name: String,
          distance: String,
          type: String,
        },
      ],
    },
    specialOffers: {
      title: String,
      description: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);

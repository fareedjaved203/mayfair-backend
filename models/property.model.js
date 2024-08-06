const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please Enter The Title"],
      unique: true,
    },
    propertyType: {
      type: String,
      enum: ["commercial", "residential"],
    },
    propertyPrice: Number,
    propertyRent: Number,
    propertyStatus: {
      type: String,
    },
    propertySubType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PropertyType",
    },

    propertyImages: [
      {
        type: String,
      },
    ],
    propertyOption: {
      type: String,
      enum: ["buy", "rent"],
      default: "rent",
    },
    residentialPropertyDetails: {
      bedrooms: {
        type: Number,
      },
      bathrooms: {
        type: Number,
      },
      floorArea: [
        {
          description: {
            type: String,
          },
          size: {
            type: Number,
          },
          status: String,
        },
      ],
    },
    propertyAddress: {
      buildingNumber: String,
      street: String,
      city: String,
      state: String,
      zip: Number,
      location: String,
    },
    propertyDetails: {
      squareft: Number,
      startSize: Number,
      endSize: Number,
    },
    propertyDescription: String,
    facts: {
      title: String,
      description: String,
    },
    location: {
      latitude: String,
      longitude: String,
      transportOptions: [
        {
          name: {
            type: String,
          },
          distance: {
            type: String,
          },
          type: {
            type: String,
          },
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

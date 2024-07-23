const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please Enter The Title"],
      unique: true,
    },
    propertyPrice: Number,
    propertyRent: Number,
    propertyStatus: {
      type: String,
    },
    propertyType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PropertyType",
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
    amenities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Amenity",
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

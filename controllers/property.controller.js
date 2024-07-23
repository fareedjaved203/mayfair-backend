const Property = require("../models/property.model");
const Amenity = require("../models/amenities.model");
const PropertyType = require("../models/propertyType.model");

const addProperty = async (req, res, next) => {
  try {
    const property = await Property.create(req.body);
    if (property) {
      return res.status(200).json({
        success: true,
        message: "Property Added Successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

const getAllProperties = async (req, res, next) => {
  try {
    const {
      title,
      city,
      zip,
      state,
      location,
      street,
      propertyOption,
      propertyStatus,
      propertyType,
      amenities,
      squareft,
      bedrooms,
      bathrooms,
      minRent,
      maxRent,
      minPrice,
      maxPrice,
    } = req.query;

    // Build the search query
    const query = {};

    if (propertyType) {
      const propertyTypeDoc = await PropertyType.findOne({
        type: new RegExp(propertyType, "i"),
      });
      if (propertyTypeDoc) {
        query.propertyType = propertyTypeDoc._id;
      }
    }

    // Handle amenities
    if (amenities) {
      const amenityNames = amenities.split(",").map((a) => new RegExp(a, "i"));
      const amenityDocs = await Amenity.find({ name: { $in: amenityNames } });
      console.log("Amenity Docs:", amenityDocs); // Debugging log
      if (amenityDocs.length) {
        query.amenities = { $in: amenityDocs.map((amenity) => amenity._id) };
      } else {
        // If no amenities match, ensure the query will return no results
        query.amenities = { $in: [] };
      }
    }

    if (title) query.title = new RegExp(title, "i");
    if (propertyOption) query.propertyOption = new RegExp(propertyOption, "i");
    if (propertyStatus) query.propertyStatus = new RegExp(propertyStatus, "i");
    if (city) query["propertyAddress.city"] = new RegExp(city, "i");
    if (zip) query["propertyAddress.zip"] = zip;
    if (state) query["propertyAddress.state"] = state;
    if (location) query["propertyAddress.location"] = location;
    if (street) query["propertyAddress.street"] = street;

    if (squareft) query["propertyDetails.squareft"] = { $gte: squareft };
    if (bedrooms)
      query["residentialPropertyDetails.bedrooms"] = { $gte: bedrooms };
    if (bathrooms)
      query["residentialPropertyDetails.bathrooms"] = { $gte: bathrooms };

    if (minRent || maxRent) {
      query.propertyRent = {};
      if (minRent) query.propertyRent.$gte = minRent;
      if (maxRent) query.propertyRent.$lte = maxRent;
    }

    if (minPrice || maxPrice) {
      query.propertyPrice = {};
      if (minPrice) query.propertyPrice.$gte = minPrice;
      if (maxPrice) query.propertyPrice.$lte = maxPrice;
    }

    const properties = await Property.find(query)
      .populate("amenities")
      .populate("propertyType");
    if (properties) {
      return res.status(200).json({
        success: true,
        properties,
      });
    }
    return res.status(400).json({
      success: false,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

const getProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id)
      .populate("amenities")
      .populate("propertyType");
    console.log(property);
    if (property) {
      return res.status(200).json({
        success: true,
        property,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Property Not Found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await Property.findByIdAndDelete(id);

    if (!property) {
      return res.status(404).send("Property not found");
    }
    return res.status(200).json({
      success: true,
      message: "Property Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await Property.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!property) {
      return res.status(404).send("Property not found");
    }
    return res.status(200).json({
      success: true,
      message: "Property Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addProperty,
  getAllProperties,
  getProperty,
  deleteProperty,
  updateProperty,
};

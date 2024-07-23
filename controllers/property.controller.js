const Property = require("../models/property.model");
const User = require("../models/user.model");

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
    const properties = await Property.find({});
    return res.status(200).json({
      success: true,
      properties,
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
    const property = await Property.findById(id);
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
    const { id } = req.params.id;
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

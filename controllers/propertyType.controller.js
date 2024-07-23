const PropertyType = require("../models/propertyType.model");

const addPropertyType = async (req, res, next) => {
  try {
    const property = await PropertyType.create(req.body);
    if (property) {
      return res.status(200).json({
        success: true,
        message: "Property Type Added Successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

const getAllPropertyTypes = async (req, res, next) => {
  try {
    const properties = await PropertyType.find({});
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

const deletePropertyType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await PropertyType.findByIdAndDelete(id);

    if (!property) {
      return res.status(404).send("Property Type not found");
    }
    return res.status(200).json({
      success: true,
      message: "Property Type Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePropertyType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await PropertyType.findByIdAndUpdate(id, req.body, {
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
  addPropertyType,
  getAllPropertyTypes,
  deletePropertyType,
  updatePropertyType,
};

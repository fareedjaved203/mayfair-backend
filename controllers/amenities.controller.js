const Amenity = require("../models/amenities.model");

const addAmenity = async (req, res, next) => {
  try {
    const property = await Amenity.create(req.body);
    if (property) {
      return res.status(200).json({
        success: true,
        message: "Amenity Added Successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

const getAllAmenities = async (req, res, next) => {
  try {
    const properties = await Amenity.find({});
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

const deleteAmenity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await Amenity.findByIdAndDelete(id);

    if (!property) {
      return res.status(404).send("Amenity not found");
    }
    return res.status(200).json({
      success: true,
      message: "Amenity Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAmenity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await Amenity.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!property) {
      return res.status(404).send("Amenity not found");
    }
    return res.status(200).json({
      success: true,
      message: "Amenity Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addAmenity,
  getAllAmenities,
  deleteAmenity,
  updateAmenity,
};

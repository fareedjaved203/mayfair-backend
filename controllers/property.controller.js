const Property = require("../models/property.model");
const Amenity = require("../models/amenities.model");
const multer = require("multer");

const PropertyType = require("../models/propertyType.model");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const s3Client = new S3Client({
  region: "ams3",
  endpoint: "https://ams3.digitaloceanspaces.com",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const addProperty = async (req, res, next) => {
  try {
    existingTitle = await Property.findOne({ title: req.body.title });
    if (existingTitle) {
      return res.status(409).json({
        success: false,
        message: "Property with same title already added",
      });
    }

    console.log(req.body);

    let images = [];

    const imageFiles = req.files;

    if (imageFiles || imageFiles?.length >= 1) {
      await Promise.all(
        imageFiles.map(async (file) => {
          const putObjectCommand = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME_GENERATED_IMAGES,
            Key: `${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "public-read",
          });

          await s3Client.send(putObjectCommand);
          const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME_GENERATED_IMAGES}.ams3.digitaloceanspaces.com/${file.originalname}`;
          images.push(imageUrl);
        })
      );

      req.body.propertyImages = images;
    }

    const property = await Property.create(req.body);

    if (property) {
      return res.status(200).json({
        success: true,
        message: "Property Added Successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
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
      propertySubType,
      amenities,
      squareft,
      bedrooms,
      bathrooms,
      minRent,
      maxRent,
      minPrice,
      maxPrice,
    } = req.query;

    const query = {};

    if (propertySubType) {
      const propertyTypeDoc = await PropertyType.findOne({
        name: new RegExp(propertySubType, "i"),
      }).populate("amenities");
      if (propertyTypeDoc) {
        query.propertySubType = propertyTypeDoc._id;
      }
    }

    if (amenities) {
      const amenityNames = amenities.split(",").map((a) => new RegExp(a, "i"));

      const amenityDocs = await Amenity.find({ name: { $in: amenityNames } });

      if (amenityDocs.length) {
        const propertyTypeIds = await PropertyType.find({
          amenities: { $in: amenityDocs.map((amenity) => amenity._id) },
        }).distinct("_id");

        query["propertySubType"] = { $in: propertyTypeIds };
      } else {
        query["propertySubType"] = { $in: [] };
      }
    }

    if (title) query.title = new RegExp(title, "i");
    if (propertyType) query.propertyType = new RegExp(propertyType, "i");
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
      .populate({
        path: "propertySubType",
        populate: {
          path: "amenities",
        },
      })
      .exec();

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
    const property = await Property.findById(id).populate("propertySubType");
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
    const propertyId = req.params.propertyId;
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    let updatedImages = [];
    let existingUrls = [];

    if (req.body.propertyImages) {
      existingUrls = req.body.propertyImages.filter(
        (item) => typeof item === "string"
      );
    }

    const imageFiles = req.files;
    let newImages = [];

    if (imageFiles || imageFiles?.length >= 1) {
      await Promise.all(
        imageFiles.map(async (file) => {
          const putObjectCommand = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME_GENERATED_IMAGES,
            Key: `${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "public-read",
          });

          await s3Client.send(putObjectCommand);
          const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME_GENERATED_IMAGES}.ams3.digitaloceanspaces.com/${file.originalname}`;
          newImages.push(imageUrl);
        })
      );
    }
    updatedImages = [...existingUrls, ...newImages];
    property.propertyImages = updatedImages;

    const propertySaved = await property.save();

    if (propertySaved) {
      return res.status(200).json({
        success: true,
        message: "Property updated successfully",
      });
    }
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

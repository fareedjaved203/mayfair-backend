const Blog = require("../models/blog.model");
const Amenity = require("../models/amenities.model");
const PropertyType = require("../models/propertyType.model");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: "ams3",
  endpoint: "https://ams3.digitaloceanspaces.com",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const addBlog = async (req, res, next) => {
  try {
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

      req.body.blogImages = images;
    }

    const blog = await Blog.create(req.body);

    if (blog) {
      return res.status(200).json({
        success: true,
        message: "Blog Added Successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllBlogs = async (req, res, next) => {
  try {
    const { title, description } = req.query;

    const query = {};

    if (title) query.title = new RegExp(title, "i");
    if (description) query.description = new RegExp(description, "i");

    const blogs = await Blogs.find(query);

    if (blogs) {
      return res.status(200).json({
        success: true,
        blogs,
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

const getBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (blog) {
      return res.status(200).json({
        success: true,
        blog,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Blog Not Found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    return res.status(200).json({
      success: true,
      message: "Blog Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

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

      req.body.blogImages = images;
    }

    const blog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return res.status(404).send("blog not found");
    }
    return res.status(200).json({
      success: true,
      message: "blog Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addBlog,
  getAllBlogs,
  getBlog,
  deleteBlog,
  updateBlog,
};

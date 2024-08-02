const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please Enter The Title"],
    },
    description: {
      type: String,
      required: [true, "Please Enter The Description"],
    },
    featureImage: {
      type: String,
    },
    blogImages: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);

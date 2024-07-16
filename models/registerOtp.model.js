const mongoose = require("mongoose");
const validator = require("validator");
require("dotenv").config({ path: "../.env" });

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
      validate: [validator.isEmail, "Please Enter A Valid Email"],
    },
    otp: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OTP", otpSchema);

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config({ path: "../.env" });

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please Enter Your First Name"],
    },
    lastName: {
      type: String,
      required: [true, "Please Enter Your Last Name"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
      validate: [validator.isEmail, "Please Enter A Valid Email"],
    },
    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
      minLength: [5, "Passwword must be atleast 5 characters"],
      select: false,
    },
    image: {
      type: String,
      default:
        "https://png.pngtree.com/png-clipart/20210129/ourmid/pngtree-default-male-avatar-png-image_2811083.jpg",
    },
    phone: {
      type: Number,
      required: [true, "Please Enter Phone Number"],
    },
    role: {
      type: String,
      enum: ["admin", "landlord", "tenant"],
      default: "tenant",
    },
    shortlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
    otp: String,
    companyName: {
      type: String,
    },
    companyWebsite: {
      type: String,
    },
    jobTitle: {
      type: String,
    },
    address1: String,
    address2: String,
    town: String,
    country: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//jwt
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "86400s",
  });
};

//compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//password reset token
userSchema.methods.getResetPasswordToken = async function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = resetToken;
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);

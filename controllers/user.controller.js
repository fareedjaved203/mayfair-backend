const fs = require("fs");

const path = require("path");

const ErrorHandler = require("../utils/errorHandler");

const User = require("../models/user.model");

const Otp = require("../models/registerOtp.model");

const sendToken = require("../utils/jwtToken");

const sendEmail = require("../utils/sendEmail");

const renderEmailTemplate = require("../utils/emailTemplate");

const { generateOTP } = require("../utils/otpGenerator");

//register

const registerUser = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = {
      ...req.body,
    };

    const emailAlreadyPresent = await User.findOne({ email });

    if (emailAlreadyPresent) {
      return res
        .status(409)
        .json({ success: false, message: "Email already present" });
    }

    const otp = generateOTP();

    const otpData = {
      otp: otp,
    };

    const templatePath = path.join(
      __dirname,
      "..",
      "public",
      "views",
      "templates",
      "otpTemplate.html"
    );

    const emailContent = renderEmailTemplate(templatePath, otpData);

    try {
      await sendEmail({
        email: email,
        subject: "Mayfair OTP",
        html: emailContent,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }

    const presentOTPEmail = await Otp.findOne({ email });

    if (presentOTPEmail) {
      presentOTPEmail.otp = otp;
      await presentOTPEmail.save();
    } else {
      await Otp.create({ email, otp });
    }

    res
      .status(200)
      .cookie("user", JSON.stringify(user), {
        maxAge: 86400000,
      })
      .json({ message: "OTP sent to your email, please verify", otp });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { otp } = req.body;
    if (otp) {
      const { user } = req.cookies;
      const userObj = JSON.parse(user);
      const userVerification = await Otp.findOne({ email: userObj?.email });
      if (userVerification.otp == otp) {
        const newUser = await User.create(userObj);
        await Otp.findOneAndDelete({ email: userObj?.email });
        sendToken(newUser, 201, res);
      } else {
        res.status(400).json({
          success: false,
          message: "Invalid OTP",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

//login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(404).json({
        success: false,
        message: "Please Enter Email and Password",
      });
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid Email/Password",
      });
    } else {
      const isPasswordMatched = await user.comparePassword(password);

      if (!isPasswordMatched) {
        return res.status(401).json({
          success: false,
          message: "Invalid Email/Password",
        });
      }

      sendToken(user, 200, res);
    }
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
};

//logout
const logout = async (req, res, next) => {
  try {
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 404));
  }
};

//for oneself
const getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 404));
  }
};

//get all users (for admin)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

//get a single user (for admin)
const getSingleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(
        new ErrorHandler(`User Doesn't Exist with Id: ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error.message);
    return next(new ErrorHandler(error.message, 400));
  }
};

//update user role (for admin)
const updateUserRole = async (req, res, next) => {
  try {
    const newUserData = {
      role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(new ErrorHandler("User Does not Exist with this id ", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err.message);
    return next(new ErrorHandler(err.message, 500));
  }
};

//delete user (for admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(new ErrorHandler("User Does not Exist with this id ", 404));
    }

    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    console.log(req.body.email);
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new ErrorHandler("User Not Found", 404));
    }
    const resetToken = await user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.RESET_TOKEN_URL}/${resetToken}`;

    const emailData = {
      resetPasswordUrl: resetPasswordUrl,
    };

    const templatePath = path.join(
      __dirname,
      "..",
      "public",
      "views",
      "templates",
      "resetPasswordTemplate.html"
    );
    const emailContent = renderEmailTemplate(templatePath, emailData);

    try {
      await sendEmail({
        email: req.body.email,
        subject: "Mayfair Password Recovery",
        html: emailContent,
      });

      res.status(200).json({
        success: true,
        message: `Email Sent to ${req.body.email}`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    console.log(error.message);
    return next(new ErrorHandler(error.message, 404));
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = req.params.resetId;

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorHandler("Token expired or invalid", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res);
  } catch (error) {
    console.log(error.message);
    return next(new ErrorHandler(error.message, 500));
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const newUserData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      address1: req.body.address1,
      address2: req.body.address2,
      town: req.body.town,
      country: req.body.country,
    };

    await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyOTP,
  getUserDetails,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
  forgotPassword,
  resetPassword,
  updateProfile,
  logout,
};

const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { ApiError } = require("../utils/ApiError");

const isAuthenticatedUser = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken?.id).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid Token" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (user) {
      if (!roles.includes(user.role)) {
        return res
          .status(403)
          .json({ success: false, message: "Not Allowed to Access this Page" });
      }
    }
    next();
  };
};

module.exports = {
  isAuthenticatedUser,
  authorizeRoles,
};

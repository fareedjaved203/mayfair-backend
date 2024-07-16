const express = require("express");
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyOTP,
  logout,
  getUserDetails,
} = require("../controllers/user.controller.js");
const { isAuthenticatedUser } = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.get("/logout", isAuthenticatedUser, logout);
router.get("/my-profile", isAuthenticatedUser, getUserDetails);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

module.exports = router;

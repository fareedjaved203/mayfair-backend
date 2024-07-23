const express = require("express");
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyOTP,
  logout,
  getUserDetails,
  shortlistProperties,
  addPropertyToShortlist,
  removePropertyFromShortlist,
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

router.get("/shortlist-properties", isAuthenticatedUser, shortlistProperties);
router.post("/shortlist/add", isAuthenticatedUser, addPropertyToShortlist);
router.delete(
  "/shortlist/remove/:id",
  isAuthenticatedUser,
  removePropertyFromShortlist
);

module.exports = router;

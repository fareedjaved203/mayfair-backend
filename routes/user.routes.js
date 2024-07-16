import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  userDetails,
  verifyOTP,
  logout,
} from "../controllers/user.controllers.js";
import { isAuthenticatedUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.post("/logout", isAuthenticatedUser, logout);
router.get("/my-profile", isAuthenticatedUser, userDetails);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

export default router;

const express = require("express");
const {
  addProperty,
  getAllProperties,
  getProperty,
  deleteProperty,
  updateProperty,
} = require("../controllers/property.controller.js");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/auth.middleware.js");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post(
  "/",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  upload.array("propertyImages"),
  addProperty
);
router.get("/", getAllProperties);
router.get("/:id", getProperty);
router.delete("/:id", isAuthenticatedUser, deleteProperty);
router.put("/:id", isAuthenticatedUser, updateProperty);

module.exports = router;

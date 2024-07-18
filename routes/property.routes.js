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

const router = express.Router();

router.post(
  "/property",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  addProperty
);
router.get("/properties", getAllProperties);
router.get("/property/:id", getProperty);
router.delete("/property/:id", isAuthenticatedUser, deleteProperty);
router.put("/property/:id", isAuthenticatedUser, updateProperty);

module.exports = router;

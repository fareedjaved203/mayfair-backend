const express = require("express");
const {
  addProperty,
  getAllProperties,
  getProperty,
  deleteProperty,
  updateProperty,
  searchProperty,
} = require("../controllers/property.controller.js");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.post("/", isAuthenticatedUser, authorizeRoles("admin"), addProperty);
router.get("/", getAllProperties);
router.get("/:id", getProperty);
router.delete("/:id", isAuthenticatedUser, deleteProperty);
router.put("/:id", isAuthenticatedUser, updateProperty);

router.get("/search", searchProperty);

module.exports = router;

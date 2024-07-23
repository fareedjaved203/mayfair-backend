const express = require("express");
const {
  addPropertyType,
  getAllPropertyTypes,
  deletePropertyType,
  updatePropertyType,
} = require("../controllers/propertyType.controller.js");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.post("/", isAuthenticatedUser, authorizeRoles("admin"), addPropertyType);
router.get("/", getAllPropertyTypes);
router.delete(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deletePropertyType
);
router.put(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  updatePropertyType
);

module.exports = router;

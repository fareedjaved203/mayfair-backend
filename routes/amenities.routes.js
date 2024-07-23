const express = require("express");
const {
  addAmenity,
  getAllAmenities,
  deleteAmenity,
  updateAmenity,
} = require("../controllers/amenities.controller.js");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.post("/", isAuthenticatedUser, authorizeRoles("admin"), addAmenity);
router.get("/", getAllAmenities);
router.delete(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteAmenity
);
router.put("/:id", isAuthenticatedUser, authorizeRoles("admin"), updateAmenity);

module.exports = router;

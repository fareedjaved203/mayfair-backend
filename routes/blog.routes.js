const express = require("express");
const {
  addBlog,
  getAllBlogs,
  getBlog,
  deleteBlog,
  updateBlog,
} = require("../controllers/blog.controller.js");
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
  upload.array("blogImages"),
  addBlog
);

router.get("/", getAllBlogs);

router.get("/:id", getBlog);

router.delete("/:id", isAuthenticatedUser, deleteBlog);

router.put(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  upload.array("blogImages"),
  updateBlog
);

module.exports = router;

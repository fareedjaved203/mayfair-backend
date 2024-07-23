const mongoose = require("mongoose");
const User = require("../models/user.model");

mongoose
  .connect(process.env.DB_URL)
  .then(async () => {
    console.log("Database Connection Successful");
    const user = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!user) {
      await User.create({
        firstName: "Admin",
        lastName: "User",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        phone: 1234567890,
        role: "admin",
      });
    }
  })
  .catch((err) => {
    console.log(err);
  });

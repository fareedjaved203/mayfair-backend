require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const port = process.env.PORT || 5000;

require("./database/connection");

app.use(cors());

app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const user = require("./routes/user.routes");
const property = require("./routes/property.routes");
const amenities = require("./routes/amenities.routes");
const propertyType = require("./routes/propertyType.routes");

app.use("/api/v1/user", user);
app.use("/api/v1/property", property);
app.use("/api/v1/amenities", amenities);
app.use("/api/v1/propertyType", propertyType);

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});

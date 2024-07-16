require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const compression = require("compression");

const port = process.env.PORT || 5000;

require("./database/connection");

app.use(cors());

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const user = require("./routes/user.routes");

app.use("/api/v1/user", user);

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});

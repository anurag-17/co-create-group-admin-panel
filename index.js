const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");
const session = require("express-session");

app.use(cors({ origin: "*" }));
app.use(cookieParser("secret"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

dotenv.config({ path: "./.env" });
const PORT = process.env.PORT;

//Admin
app.use("/api/auth", require("./routes/auth"));

if (process.env.NODE_ENV === "dev") {
  //replaced "production" with "dev"
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
connectDB();
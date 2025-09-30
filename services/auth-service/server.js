const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mysql = require("mysql2");
const { createSchema } = require("./models/User");
// const authRoutes = require("./routes/auth");
dotenv.config();

// Import the MySQL connection pool
const promisePool = require("./Database/db");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
// app.use("/", (req, res) => {
//   console.log("Auth Service is running!!!!!!!!!");
//   res.status(200).send("Auth Service is running!!");
// });
app.use("/auth", require("./routes/auth"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
createSchema();
  console.log(`Auth Service running on port ${PORT}`);
});
// Database/db.js
const mysql = require("mysql2/promise");
require("dotenv").config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "healthcare_auth",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,    // maximum concurrent connections
  queueLimit: 0,          // unlimited queued requests
});

// Test connection immediately when app starts
(async () => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS now");
    console.log("✅ MySQL connected successfully at:", rows[0].now);
  } catch (err) {
    console.error("❌ MySQL connection error:", err.message);
  }
})();

module.exports = pool;

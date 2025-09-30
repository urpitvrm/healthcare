const mysql = require("mysql2");
require("dotenv").config(); // Ensure dotenv is loaded

// Create a connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Error connecting to the database:", err);
  } else {
    console.log("✅ Database connected successfully");
    connection.release();
  }
});
const promisePool = db.promise(); // Use promise-based pool for async/await

module.exports = promisePool;
const mysql = require("mysql2/promise");
require("dotenv").config();

async function initDB() {
  try {
    if (!process.env.DB_NAME) {
      throw new Error("Environment variable DB_NAME is required.");
    }

    // Connect without DB first
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      port: process.env.DB_PORT || 3306,
    });

    // Escape DB name to prevent syntax issues
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${mysql.escapeId(process.env.DB_NAME)}`);
    console.log("✅ Database ensured");

    await connection.end();

    // Create pool connected to the DB
    const pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Optional: test connection
    await pool.query("SELECT 1");
    console.log("✅ Database connected successfully");

    return pool;
  } catch (err) {
    console.error("❌ Error initializing DB:", err.message);
    throw err;
  }
}

module.exports = initDB;


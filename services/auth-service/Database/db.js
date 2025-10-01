const mysql = require("mysql2/promise");
require("dotenv").config();

async function initDB() {
  try {
    // Connect without specifying a database first
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      port: process.env.DB_PORT || 3306,
    });

    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log("✅ Database ensured");

    await connection.end();

    // Now create a pool connected to the database
    const pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "healthcare_auth",
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log("✅ Database connected successfully");

    return pool;
  } catch (err) {
    console.error("❌ Error initializing DB:", err);
    throw err;
  }
}

module.exports = initDB;

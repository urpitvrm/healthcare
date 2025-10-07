// // const mysql = require("mysql2/promise");
// // require("dotenv").config();

// // async function initDB() {
// //   try {
// //     // Connect without specifying a database first
// //     const connection = await mysql.createConnection({
// //       host: process.env.DB_HOST || "localhost",
// //       user: process.env.DB_USER || "root",
// //       password: process.env.DB_PASSWORD || "",
// //       port: process.env.DB_PORT || 3306,
// //     });

// //     // Create database if not exists
// //     await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
// //     console.log("✅ Database ensured");

// //     await connection.end();

// //     // Now create a pool connected to the database
// //     const pool = mysql.createPool({
// //       host: process.env.DB_HOST || "localhost",
// //       user: process.env.DB_USER || "root",
// //       password: process.env.DB_PASSWORD || "",
// //       database: process.env.DB_NAME || "healthcare_auth",
// //       port: process.env.DB_PORT || 3306,
// //       waitForConnections: true,
// //       connectionLimit: 10,
// //       queueLimit: 0,
// //     });

// //     console.log("✅ Database connected successfully");

// //     return pool;
// //   } catch (err) {
// //     console.error("❌ Error initializing DB:", err);
// //     throw err;
// //   }
// // }

// // module.exports = initDB;


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

// const { Client } = require("pg");
// require("dotenv").config();

// async function initDB() {
//   try {
//     if (!process.env.DB_NAME) {
//       throw new Error("Environment variable DB_NAME is required.");
//     }

//     // Connect to PostgreSQL (Supabase)
//     const client = new Client({
//       host: process.env.DB_HOST || "localhost",  // Use the Supabase URL if you're connecting to a live project
//       user: process.env.DB_USER || "postgres",
//       password: process.env.DB_PASSWORD || "",
//       port: process.env.DB_PORT || 5432,  // Default PostgreSQL port
//     });

//     await client.connect();
//     console.log("✅ Connected to PostgreSQL");

//     // Check if the database exists before attempting to create it
//     const dbName = process.env.DB_NAME;
//     const checkDbExistsQuery = `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`;
//     const res = await client.query(checkDbExistsQuery);

//     if (res.rowCount === 0) {
//       // If database doesn't exist, create it
//       await client.query(`CREATE DATABASE ${dbName}`);
//       console.log("✅ Database created");
//     } else {
//       console.log("✅ Database already exists");
//     }

//     // Close connection to the initial DB
//     await client.end();

//     // Set up connection to the newly created or existing DB
//     const pool = new Client({
//       host: process.env.DB_HOST || "localhost",
//       user: process.env.DB_USER || "postgres",
//       password: process.env.DB_PASSWORD || "",
//       database: process.env.DB_NAME,
//       port: process.env.DB_PORT || 5432,
//     });

//     // Test connection
//     await pool.connect();
//     console.log("✅ Database connected successfully");

//     return pool;
//   } catch (err) {
//     console.error("❌ Error initializing DB:", err.message);
//     throw err;
//   }
// }

// module.exports = initDB;

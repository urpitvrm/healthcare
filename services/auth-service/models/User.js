const pool = require("../Database/db");

async function createSchema() {
  try {
    // Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('patient', 'doctor', 'admin') DEFAULT 'patient',
        is_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Licenses Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS licenses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        license_number VARCHAR(100) UNIQUE NOT NULL,
        issued_by VARCHAR(255),
        issue_date DATE,
        expiry_date DATE,
        is_valid BOOLEAN DEFAULT true,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log("✅ Database schema created successfully");
  } catch (err) {
    console.error("❌ Error creating schema:", err);
  }
}

module.exports = { createSchema };


// async function createSchema(db) {
//   try {
//     // Check if the ENUM type "user_role" exists
//     const typeCheckResult = await db.query(`
//       SELECT 1 FROM pg_type WHERE typname = 'user_role'
//     `);

//     // Only create the ENUM type if it doesn't exist
//     if (typeCheckResult.rows.length === 0) {
//       await db.query(`
//         CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');
//       `);
//       console.log("✅ ENUM type 'user_role' created successfully.");
//     } else {
//       console.log("✅ ENUM type 'user_role' already exists.");
//     }

//     // Users Table
//     await db.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,  -- Use SERIAL for auto-increment
//         name VARCHAR(255) NOT NULL,
//         email VARCHAR(255) UNIQUE NOT NULL,
//         password_hash VARCHAR(255) NOT NULL,
//         role user_role DEFAULT 'patient',  -- Use the ENUM type for role
//         is_verified BOOLEAN DEFAULT false,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     // Licenses Table
//     await db.query(`
//       CREATE TABLE IF NOT EXISTS licenses (
//         id SERIAL PRIMARY KEY,  -- Use SERIAL for auto-increment
//         user_id INT NOT NULL,
//         license_number VARCHAR(100) UNIQUE NOT NULL,
//         issued_by VARCHAR(255),
//         issue_date DATE,
//         expiry_date DATE,
//         is_valid BOOLEAN DEFAULT true,
//         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
//       )
//     `);

//     console.log("✅ Database schema created successfully");
//   } catch (err) {
//     console.error("❌ Error creating schema:", err);
//   }
// }

// module.exports = { createSchema };

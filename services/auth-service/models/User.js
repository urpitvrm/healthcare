const promisePool = require("../Database/db");
const db = promisePool;

async function createSchema() {
  try {
    // Create database if not exists
    await db.query(`CREATE DATABASE IF NOT EXISTS healthcare_auth`);
    await db.query(`USE healthcare_auth`);

    // Users Table
    await db.query(`
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

    // Licenses Table (for doctors)
    await db.query(`
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
  } finally {
    process.exit();
  }
}

module.exports = { createSchema };
createSchema();

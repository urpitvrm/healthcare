const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../Database/db");

const authService = {};



// LOGIN SERVICE
authService.login = async (username, password) => {
  // const pool = await initDB();  // ✅ ensure we have a connected pool
  try {
    if (!username || !password) {
      return { success: false, message: "Username and password are required" };
    }

    const email = username.toLowerCase();

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]); // ✅ MySQL syntax

    if (!rows.length) {
      return { success: false, message: "User not found" };
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return { success: false, message: "Invalid password" };
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return { success: true, token, role: user.role };
  } catch (error) {
    return { success: false, message: "Internal server error" };
  }
};

// SIGNUP SERVICE
authService.signUp = async (name, username, password, role = "patient") => {
  // const pool = await initDB();  // ✅ ensure we have a connected pool

  try {
    if (!username || !password) {
      return { success: false, message: "Username and password are required" };
    }
    if (role !== "patient") {
      return { success: false, message: "Only patient signup is allowed" };
    }

    const email = username.toLowerCase();
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    ); // ✅ MySQL syntax

    if (existingUser.length) {
      return { success: false, message: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)", // ✅ MySQL syntax
      [name, email, hashedPassword, role]
    );

    return { success: true };
  } catch (err) {
    console.error("Error during signup:", err);
    return { success: false, message: "Internal server error" };
  }
};

authService.PatientDetails = async (
  userId,
  full_name,
  dob,
  gender,
  address,
  phone_number
) => {
  try {
    // Insert patient details, ignoring the insert if user_id already exists
    const [result] = await pool.query(
      `INSERT IGNORE INTO patients (user_id, full_name, dob, gender, address, phone)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, full_name, dob, gender, address, phone_number]
    );

    // Check if the insert was successful
    if (result.affectedRows === 0) {
      return { success: false, message: "Patient with this user_id already exists" };
    }

    return { success: true, message: "Patient details added successfully", data: result };
  } catch (error) {
    console.error("Error fetching patient details:", error);
    return { success: false, message: "Internal server error" };
  }
};


authService.PatientDetails = async (
  userId,
  full_name,
  dob,
  gender,
  address,
  phone_number
) => {
  try {

    

   const [result] = await pool.query(
    `INSERT INTO patients (user_id, full_name, dob, gender, address, phone)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, full_name, dob, gender, address, phone_number]
);

    return { success: true, message: "Patient details added successfully", data: result };
  } catch (error) {
    console.error("Error fetching patient details:", error);
    return { success: false, message: "Internal server error" };
  }
};
authService.DoctorDetails = async (user_id,full_name,phone,specialization,experience_years ,hospital_name,clinic_address,consultation_fee ,bio ,profile_image) => {
  try {   

    const [result] = await pool.query(`INSERT IGNORE INTO doctors (user_id,full_name,phone,specialization,experience_years ,hospital_name,clinic_address,consultation_fee ,bio ,profile_image) VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [user_id,full_name,phone,specialization,experience_years ,hospital_name,clinic_address,consultation_fee ,bio ,profile_image]
    );

    return { success: true, data: result[0], message: "Doctor details added successfully" };
  } catch (error) {
    console.error("Error fetching patient details:", error);
    return { success: false, message: "Internal server error" };
  }
};


module.exports = authService;

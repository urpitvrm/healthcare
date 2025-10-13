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

    

   const [result] = await pool.query(
    `INSERT INTO patients (user_id, full_name, dob, gender, address, phone)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, full_name, dob, gender, address, phone_number]
);


    // if (!rows.length) {
    //   return { success: false, message: "Patient not found" };
    // }

    return { success: true, message: "Patient details added successfully", data: result };
  } catch (error) {
    console.error("Error fetching patient details:", error);
    return { success: false, message: "Internal server error" };
  }
};
authService.DoctorDetails = async (doctorId) => {
  try {
    if (!patientId) {
      return { success: false, message: "Patient ID is required" };
    }

    const [rows] = await pool.query(
      "SELECT id, name, email, is_verified, created_at, updated_at FROM users WHERE id = ? AND role = 'patient'",
      [patientId]
    ); // ✅ MySQL syntax

    if (!rows.length) {
      return { success: false, message: "Patient not found" };
    }

    return { success: true, data: rows[0] };
  } catch (error) {
    console.error("Error fetching patient details:", error);
    return { success: false, message: "Internal server error" };
  }
};

module.exports = authService;

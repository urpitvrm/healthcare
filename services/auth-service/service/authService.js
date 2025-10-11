const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../Database/db");

const authService = {};

// LOGIN SERVICE
authService.login = async (username, password) => {
    // const pool = await initDB();  // ✅ ensure we have a connected pool

    if (!username || !password) {
        return { success: false, message: "Username and password are required" };
    }

    const email = username.toLowerCase();
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);  // ✅ MySQL syntax

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
};

// SIGNUP SERVICE
authService.signUp = async (name, username, password, role = "patient") => {
    // const pool = await initDB();  // ✅ ensure we have a connected pool

    if (!username || !password) {
        return { success: false, message: "Username and password are required" };
    }

    if (role !== "patient") {
        return { success: false, message: "Only patient signup is allowed" };
    }

    const email = username.toLowerCase();
    const [existingUser] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);  // ✅ MySQL syntax

    if (existingUser.length) {
        return { success: false, message: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
        "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",  // ✅ MySQL syntax
        [name, email, hashedPassword, role]
    );

    return { success: true };
};

module.exports = authService;

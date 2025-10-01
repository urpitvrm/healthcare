const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../Database/db");

const authService = {};

// LOGIN SERVICE
authService.login = async (username, password) => {
    if (!username || !password) {
        return { success: false, message: "Username and password are required" };
    }

    const email = username.toLowerCase();
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

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
authService.signUp = async (username, password, role = "patient") => {
    if (!username || !password) {
        return { success: false, message: "Username and password are required" };
    }

    // Only allow patients to self-signup
    if (role !== "patient") {
        return { success: false, message: "Only patient signup is allowed" };
    }

    const email = username.toLowerCase();
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length) {
        return { success: false, message: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
        "INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)",
        [email, hashedPassword, "patient"]
    );

    return { success: true };
};

module.exports = authService;

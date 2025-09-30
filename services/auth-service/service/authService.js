const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../Database/db");

const authService = {};

// LOGIN SERVICE
authService.login = async (username, password) => {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [username]);

    if (!rows.length) {
        return { success: false, message: "User not found" };
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
        return { success: false, message: "Invalid password" };
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return { success: true, token, role: user.role };
};

// SIGNUP SERVICE
authService.signUp = async (username, password, role = "patient") => {
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [username]);
    if (existingUser.length) {
        return { success: false, message: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
        "INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)",
        [username, hashedPassword, role]
    );

    return { success: true };
};

module.exports = authService;

const authService = require('../service/authService');

const authController = {};

// LOGIN
authController.login = async (req, res) => {
    try {
        const { username, password } = req.query;
        const result = await authService.login(username, password);

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        res.status(200).json({ 
            message: "Login successful", 
            token: result.token, 
            role: result.role 
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// SIGNUP
authController.signUp = async (req, res) => {
    try {
        const { name,username, password, role } = req.query;
        console.log("we are inside the signup page--------",name,username, password, role);
        const result = await authService.signUp(name,username, password, role);

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



module.exports = authController;

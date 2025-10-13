const authService = require('../service/authService');

const authController = {};
const dayjs = require("dayjs"); // Import dayjs to handle date formatting

// Utility to convert date to MySQL format (YYYY-MM-DD)
const formatDate = (dobString) => {
    const formattedDob = dayjs(dobString, "DD-MM-YYYY").format("YYYY-MM-DD");
    if (!dayjs(formattedDob).isValid()) {
        throw new Error("Invalid date format");
    }
    return formattedDob;
};

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

authController.patientDetails = async (req, res) => {
    try {
        
        const {userId,full_name,dob,gender,address,phone_number} = req.body;
        
        console.log("we are inside the patient details page--------",userId,full_name,dob,gender,address,phone_number);

        const result = await authService.PatientDetails(userId,full_name,dob,gender,address,phone_number);
        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }
        res.status(200).json({ message: result.message, data: result.data  });
    } catch (error) {
        console.error("Error fetching patient details:", error);
        res.status(500).json({ message: "Internal server error" });
    }   
};
authController.doctorDetails = async (req, res) => {
    try {
        const {user_id,full_name,phone,specialization,experience_years ,hospital_name,clinic_address,consultation_fee ,bio ,profile_image,  } = req.body;
        // const profile_image = req.file ? req.file.path : null; // Assuming you're using multer for file uploads
        const result = await authService.DoctorDetails(user_id,full_name,phone,specialization,experience_years ,hospital_name,clinic_address,consultation_fee ,bio ,profile_image);
        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }
        res.status(200).json({ success:true ,message: result.message });
    } catch (error) {
        console.error("Error fetching doctor details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



module.exports = authController;

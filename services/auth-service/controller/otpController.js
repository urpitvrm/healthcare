

const otpController = {};
const otpService = require('../service/otpService');

otpController.sendOTP = async (req, res) => {
    try {
        const { username } = req.query;
        const result = await otpService.sendOTP(username);  
        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {   
        console.error("Error during sending OTP:", error);
        res.status(500).json({ message: "Internal server error" });
    }   
};
module.exports = otpController;
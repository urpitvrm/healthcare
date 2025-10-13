const otpService = {};

const pool = require("../Database/db");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// In-memory OTP store (for demo)
otpService.otpStore = {};

// --- SEND OTP ---
otpService.sendOTP = async (email) => {
  try {
    if (!email) {
      return { success: false, message: "Email is required" };
    }

    const userEmail = email.toLowerCase();

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Save OTP with 10 min expiry
    otpService.otpStore[userEmail] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    console.log(`✅ OTP generated for ${userEmail}: ${otp}`);

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for 587/25
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.SMTP_FROM || `"Healthcare Platform" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial; font-size: 16px;">
          <p>Dear User,</p>
          <p>Your OTP code is: <b>${otp}</b></p>
          <p>This OTP will expire in <b>10 minutes</b>.</p>
          <p>If you didn’t request this, please ignore this email.</p>
          <br/>
          <p>Best regards,</p>
          <p><b>Healthcare Platform</b></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    return { success: false, message: "Failed to send OTP" };
  }
};

// --- VERIFY OTP ---
otpService.verifyOTP = async (email, enteredOtp) => {
  try {
    const userEmail = email.toLowerCase();
    const record = otpService.otpStore[userEmail];

    if (!record) {
      return { success: false, message: "OTP not found or expired" };
    }

    if (Date.now() > record.expiresAt) {
      delete otpService.otpStore[userEmail];
      return { success: false, message: "OTP expired" };
    }

    if (record.otp !== enteredOtp) {
      return { success: false, message: "Invalid OTP" };
    }

    // OTP verified successfully
    delete otpService.otpStore[userEmail]; // remove used OTP
    return { success: true, message: "OTP verified successfully" };
  } catch (error) {
    console.error("❌ Error verifying OTP:", error);
    return { success: false, message: "Verification failed" };
  }
};

module.exports = otpService;

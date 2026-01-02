const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authLimiter, otpLimiter } = require("../middlewares/rateLimiter");

// SIGNUP
router.post("/signup", authLimiter, authController.signup);

// VERIFY EMAIL
router.post("/verify-email", authLimiter, authController.verifyEmail);

// LOGIN
router.post("/login", authLimiter, authController.login);

// FORGOT PASSWORD (OTP)
router.post("/generate-otp", otpLimiter, authController.generateOTP);

// RESET PASSWORD
router.post("/reset-password", authLimiter, authController.resetPassword);

module.exports = router;
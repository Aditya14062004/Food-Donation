const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authLimiter, otpLimiter } = require("../middlewares/rateLimiter");

// ================= AUTH ROUTES =================

// SIGNUP
router.post("/signup", authLimiter, authController.signup);

// VERIFY EMAIL
router.post("/verify-email", authLimiter, authController.verifyEmail);

// LOGIN (sets HTTP-only cookie)
router.post("/login", authLimiter, authController.login);

// LOGOUT (clears HTTP-only cookie)
router.post("/logout", authController.logout);

// FORGOT PASSWORD (GENERATE OTP)
router.post("/generate-otp", otpLimiter, authController.generateOTP);

// RESET PASSWORD
router.post("/reset-password", authLimiter, authController.resetPassword);

module.exports = router;
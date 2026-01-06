const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const validate = require("../middlewares/validate");
const {
  signupSchema,
  verifyEmailSchema,
  loginSchema,
  generateOtpSchema,
  resetPasswordSchema,
} = require("../validators/authValidator");

const { authLimiter, otpLimiter } = require("../middlewares/rateLimiter");

// ================= AUTH ROUTES =================

// SIGNUP
router.post("/signup", authLimiter, validate(signupSchema), authController.signup);

// VERIFY EMAIL
router.post("/verify-email", authLimiter, validate(verifyEmailSchema), authController.verifyEmail);

// LOGIN
router.post("/login", authLimiter, validate(loginSchema), authController.login);

// LOGOUT
router.post("/logout", authController.logout);

// FORGOT PASSWORD (OTP)
router.post("/generate-otp", otpLimiter, validate(generateOtpSchema), authController.generateOTP);

// RESET PASSWORD
router.post("/reset-password", authLimiter, validate(resetPasswordSchema), authController.resetPassword);

module.exports = router;
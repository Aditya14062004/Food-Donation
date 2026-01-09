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

router.post("/signup", authLimiter, validate(signupSchema), authController.signup);
router.post("/verify-email", authLimiter, validate(verifyEmailSchema), authController.verifyEmail);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.post("/generate-otp", otpLimiter, validate(generateOtpSchema), authController.generateOTP);
router.post("/reset-password", authLimiter, validate(resetPasswordSchema), authController.resetPassword);

module.exports = router;
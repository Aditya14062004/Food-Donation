const rateLimit = require("express-rate-limit");

// 🔐 Auth related (login, signup, otp)
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                 // 10 requests per IP
  message: {
    success: false,
    message: "Too many attempts. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 📧 OTP specific (very strict)
exports.otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,                  // 3 OTP requests
  message: {
    success: false,
    message: "OTP limit exceeded. Try again later."
  },
});

// 🌐 General API limiter
exports.apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,               // 100 requests
});
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const NGO = require("../models/NGO");
const Restaurant = require("../models/Restaurant");
const sendEmail = require("../utils/sendEmails");

// ================= HELPERS =================
const getModel = (role) => {
  if (role === "admin") return Admin;
  if (role === "ngo") return NGO;
  if (role === "restaurant") return Restaurant;
  return null;
};

const generateToken = (user, role) =>
  jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ================= SIGNUP =================
exports.signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      address,
      contactNo,
      coordinates,
    } = req.body;

    const Model = getModel(role);
    if (!Model) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const exists = await Model.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const userData = {
      name,
      email,
      password,
      isVerified: false,
      emailOtp: otp,
      emailOtpExpiry: Date.now() + 10 * 60 * 1000,
    };

    if (role !== "admin") {
      userData.address = address;
      userData.contactNo = contactNo;
      userData.location = {
        type: "Point",
        coordinates,
      };
    }

    const user = new Model(userData);
    await user.save();

    await sendEmail(
      email,
      "Verify your email",
      `Your email verification OTP is: ${otp}`
    );

    res.status(201).json({
      success: true,
      message: "Signup successful. Please verify your email.",
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= VERIFY EMAIL =================
exports.verifyEmail = async (req, res) => {
  try {
    const { email, role, otp } = req.body;
    const Model = getModel(role);

    const user = await Model.findOne({ email });

    if (
      !user ||
      user.emailOtp !== otp ||
      user.emailOtpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.emailOtp = null;
    user.emailOtpExpiry = null;

    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("VERIFY EMAIL ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN (HTTP-ONLY COOKIE) =================
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const Model = getModel(role);

    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before login" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user, role);

    // 🔐 SET TOKEN IN HTTP-ONLY COOKIE
    res.cookie("token", token, cookieOptions);

    res.json({
      success: true,
      role,
      message: "Login successful",
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGOUT =================
exports.logout = async (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json({ success: true, message: "Logged out successfully" });
};

// ================= FORGOT PASSWORD =================
exports.generateOTP = async (req, res) => {
  try {
    const { email, role } = req.body;
    const Model = getModel(role);

    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendEmail(email, "Password Reset OTP", `Your OTP is ${otp}`);

    res.json({ success: true, message: "OTP sent" });
  } catch (error) {
    console.error("OTP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    const { email, role, otp, newPassword } = req.body;
    const Model = getModel(role);

    const user = await Model.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = newPassword;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    await sendEmail(
      email,
      "Password Reset Successful",
      "Your password has been updated successfully"
    );

    res.json({ success: true, message: "Password updated" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
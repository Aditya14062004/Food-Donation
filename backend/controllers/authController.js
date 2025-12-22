const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const NGO = require("../models/NGO");
const Restaurant = require("../models/Restaurant");
const sendEmail = require("../utils/sendEmails");

// ================= UTILITIES =================

// Get model based on role
const getModel = (role) => {
  if (role === "admin") return Admin;
  if (role === "ngo") return NGO;
  if (role === "restaurant") return Restaurant;
  return null;
};

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ================= SIGNUP =================
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, address, contactNo, coordinates } =
      req.body;

    const Model = getModel(role);
    if (!Model) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await Model.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const userData = {
      name,
      email,
      password,
    };

    // NGO & Restaurant extra fields
    if (role !== "admin") {
      if (
        !address ||
        !contactNo ||
        !coordinates ||
        !Array.isArray(coordinates) ||
        coordinates.length !== 2
      ) {
        return res.status(400).json({
          message: "Address, contact number and valid coordinates are required",
        });
      }

      userData.address = address;
      userData.contactNo = contactNo;
      userData.location = {
        type: "Point",
        coordinates, // [lng, lat]
      };
    }

    const user = new Model(userData);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Registered successfully",
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const Model = getModel(role);
    if (!Model) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, role);

    res.json({
      success: true,
      token,
      role,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GENERATE OTP =================
exports.generateOTP = async (req, res) => {
  try {
    const { email, role } = req.body;

    const Model = getModel(role);
    if (!Model) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    await sendEmail(
      email,
      "Password Reset OTP",
      `Your OTP is ${otp}`
    );

    res.json({
      success: true,
      message: "OTP sent successfully",
    });
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
    if (!Model) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    await sendEmail(
      email,
      "Password Reset Successful",
      "Your password has been updated successfully"
    );

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
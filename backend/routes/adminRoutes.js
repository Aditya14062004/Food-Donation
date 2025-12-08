const express = require('express');
const router = express.Router();
const Admin = require('./../models/Admin.js');
const sendEmail = require('../utils/sendEmails.js');

// ================= REGISTER ===================
router.post('/signup', async function (req, res) {
    try {
        const data = req.body;
        const { email } = data;

        const existingUser = await Admin.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        const newAdmin = new Admin(data);
        const response = await newAdmin.save();

        console.log("Admin Saved");
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            admin: { 
                _id: response._id,
                name: response.name,
                email: response.email
            }
        });

    } catch (error) {
        console.error(error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


// ================= LOGIN ===================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.json({
            success: true,
            message: "Login successful",
            admin: {
                _id: admin._id,
                name: admin.name,
                email: admin.email
            }
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// ================= GENERATE OTP ===================
router.post('/generateotp', async (req, res) => {
    try {
        const { email } = req.body;

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ error: 'Invalid user' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        admin.otp = otp;
        admin.otpExpiry = Date.now() + 5 * 60 * 1000; 
        await admin.save();

        await sendEmail(admin.email, "Password Reset OTP", `Your OTP is ${otp}`);

        res.json({
            success: true,
            message: "OTP sent successfully",
            admin: admin
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: error.message });
    }
});


// ================= PASSWORD RESET ===================
router.post('/passwordreset', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (!admin) return res.status(400).json({ msg: "User not found" });

        if (admin.otp !== otp || admin.otpExpiry < Date.now()) {
            return res.status(400).json({ msg: "Invalid or expired OTP" });
        }

        admin.password = newPassword;
        admin.otp = undefined;
        admin.otpExpiry = undefined;
        await admin.save();

        res.json({
            success: true,
            message: "Password reset successfully",
            admin: admin
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;
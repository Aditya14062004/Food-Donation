const express = require('express');
const router = express.Router();
const NGO = require('./../models/NGO.js');   // ✔ FIXED — correct model
const sendEmail = require('./../utils/sendEmails.js');

// Register router
router.post('/signup', async function (req, res) {
    try {
        const data = req.body;
        const { email } = data;

        // Check if user already exists
        const existingUser = await NGO.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        // Create new user
        const newNGO = new NGO(data);
        const response = await newNGO.save();

        console.log("Data Saved");
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            NGO: response
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

// login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user by email
        const ngo = await NGO.findOne({ email });

        if (!ngo) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // compare password
        const isMatch = await ngo.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.json({
            success: true,
            message: "Login successful",
            ngo
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

        const ngo = await NGO.findOne({ email });

        if (!ngo) {
            return res.status(401).json({ error: 'Invalid user' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        ngo.otp = otp;
        ngo.otpExpiry = Date.now() + 5 * 60 * 1000; 
        await ngo.save();

        await sendEmail(ngo.email, "Password Reset OTP", `Your OTP is ${otp}`);

        res.json({
            success: true,
            message: "OTP sent successfully",
            ngo: ngo
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
        const ngo = await NGO.findOne({ email });

        if (!ngo) return res.status(400).json({ msg: "User not found" });

        if (ngo.otp !== otp || ngo.otpExpiry < Date.now()) {
            return res.status(400).json({ msg: "Invalid or expired OTP" });
        }

        ngo.password = newPassword;
        ngo.otp = undefined;
        ngo.otpExpiry = undefined;
        await ngo.save();

        res.json({
            success: true,
            message: "Password reset successfully",
            ngo: ngo
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;
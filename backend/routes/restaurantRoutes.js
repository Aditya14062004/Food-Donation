const express = require('express');
const router = express.Router();
const restaurant = require('./../models/restaurant.js');   // ✔ FIXED — correct model
const sendEmail = require('./../utils/sendEmails.js');

// Register router
router.post('/signup', async function (req, res) {
    try {
        const data = req.body;
        const { email } = data;

        // Check if user already exists
        const existingUser = await restaurant.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        // Create new user
        const newRestaurant = new restaurant(data);
        const response = await newRestaurant.save();

        console.log("Data Saved");
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            restaurant: response
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
        const newRestaurant = await restaurant.findOne({ email });

        if (!newRestaurant) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // compare password
        const isMatch = await newRestaurant.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.json({
            success: true,
            message: "Login successful",
            restaurant: newRestaurant
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

        const newRestaurant = await restaurant.findOne({ email });

        if (!newRestaurant) {
            return res.status(401).json({ error: 'Invalid user' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        newRestaurant.otp = otp;
        newRestaurant.otpExpiry = Date.now() + 5 * 60 * 1000; 
        await newRestaurant.save();

        await sendEmail(newRestaurant.email, "Password Reset OTP", `Your OTP is ${otp}`);

        res.json({
            success: true,
            message: "OTP sent successfully",
            restaurant: newRestaurant
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
        const newRestaurant = await restaurant.findOne({ email });

        if (!newRestaurant) return res.status(400).json({ msg: "User not found" });

        if (newRestaurant.otp !== otp || newRestaurant.otpExpiry < Date.now()) {
            return res.status(400).json({ msg: "Invalid or expired OTP" });
        }

        newRestaurant.password = newPassword;
        newRestaurant.otp = undefined;
        newRestaurant.otpExpiry = undefined;
        await newRestaurant.save();

        res.json({
            success: true,
            message: "Password reset successfully",
            restaurant: newRestaurant
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;
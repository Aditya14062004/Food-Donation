const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  contactNo: { type: String, required: true },
  address: { type: String, required: true },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
    },
  },

  isVerified: {type: Boolean, default: false},
  emailOtp: String,
  emailOtpExpiry: Date,
  otp: String,
  otpExpiry: Date,
});

restaurantSchema.index({ location: "2dsphere" });

// ✅ CORRECT PASSWORD HASHING
restaurantSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
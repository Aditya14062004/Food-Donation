const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const ngoSchema = new mongoose.Schema({
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

  otp: String,
  otpExpiry: Date,
});

// 🔐 Hash password
ngoSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// 📍 Geospatial index
ngoSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("NGO", ngoSchema);
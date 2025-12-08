const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// defining the user schema
const ngoSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    otp: { type: String},
    otpExpiry: { type: Date},
});

ngoSchema.pre('save', async function () {
    // If password not modified, skip
    if (!this.isModified('password')) return;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

ngoSchema.methods.comparePassword = async function(candidatePassword){
    try {
        // use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
}

// Creating user model
const NGO = mongoose.model('NGO', ngoSchema);
module.exports = NGO;
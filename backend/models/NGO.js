const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const ngoSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'ngo' },
  address: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  otp: String,
  otpExpiry: Date
});

ngoSchema.index({ location: '2dsphere' });

ngoSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

ngoSchema.methods.comparePassword = function (p) {
  return bcrypt.compare(p, this.password);
};

module.exports = mongoose.model('NGO', ngoSchema);
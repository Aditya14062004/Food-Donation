const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO' },
  foodName: String,
  quantity: String,
  pickupAddress: String,
  pickupLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number]
  },
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

donationSchema.index({ pickupLocation: '2dsphere' });

module.exports = mongoose.model('Donation', donationSchema);
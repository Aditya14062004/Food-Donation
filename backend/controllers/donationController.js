const Donation = require('../models/Donation');
const Restaurant = require('../models/Restaurant');
const NGO = require('../models/NGO');
const sendEmail = require('../utils/sendEmails');

exports.createDonation = async (req, res) => {
  const restaurant = await Restaurant.findById(req.user.id);

  const donation = await Donation.create({
    ...req.body,
    restaurant: restaurant._id,
    pickupLocation: restaurant.location
  });

  // Notify all nearby NGOs (within 5km)
  const ngos = await NGO.find({
    location: {
      $near: {
        $geometry: restaurant.location,
        $maxDistance: 5000
      }
    }
  });

  for (let ngo of ngos) {
    await sendEmail(
      ngo.email,
      'New Food Donation Available',
      `New donation available near you: ${donation.foodName}`
    );
  }

  res.json(donation);
};

exports.acceptDonation = async (req, res) => {
  const donation = await Donation.findById(req.params.id);
  donation.ngo = req.user.id;
  donation.status = 'Accepted';
  await donation.save();
  res.json(donation);
};
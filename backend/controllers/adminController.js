const Donation = require('../models/Donation');
const NGO = require('../models/NGO');
const Restaurant = require('../models/Restaurant');

exports.getDashboardStats = async (req, res) => {
  res.json({
    totalDonations: await Donation.countDocuments(),
    acceptedDonations: await Donation.countDocuments({ status: 'Accepted' }),
    totalNGOs: await NGO.countDocuments(),
    totalRestaurants: await Restaurant.countDocuments()
  });
};
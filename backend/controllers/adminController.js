const Donation = require('../models/Donation');
const NGO = require('../models/NGO');
const Restaurant = require('../models/Restaurant');


exports.getDashboardStats = async (req, res) => {
  const restaurants = await Restaurant.countDocuments();
  const ngos = await NGO.countDocuments();
  const donations = await Donation.countDocuments();
  const accepted = await Donation.countDocuments({ status: "accepted" });

  res.json({
    restaurants,
    ngos,
    donations,
    accepted,
  });
};
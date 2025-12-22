const NGO = require('../models/NGO');
const Restaurant = require('../models/Restaurant');

exports.getNearestNGOs = async (req, res) => {
  const restaurant = await Restaurant.findById(req.user.id);

  const ngos = await NGO.aggregate([
    {
      $geoNear: {
        near: restaurant.location,
        distanceField: 'distance',
        spherical: true
      }
    },
    {
      $project: {
        name: 1,
        address: 1,
        distanceKm: { $round: [{ $divide: ['$distance', 1000] }, 2] }
      }
    }
  ]);

  res.json(ngos);
};

exports.getMyDonations = async (req, res) => {
  const donations = await Donation.find({
    restaurant: req.user.id,
  })
    .populate("ngo", "name contactNo")
    .sort({ createdAt: -1 });

  res.json(donations);
};
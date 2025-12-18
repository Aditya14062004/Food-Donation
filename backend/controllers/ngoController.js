const Restaurant = require('../models/Restaurant');
const NGO = require('../models/NGO');

exports.getNearestRestaurants = async (req, res) => {
  const ngo = await NGO.findById(req.user.id);

  const restaurants = await Restaurant.aggregate([
    {
      $geoNear: {
        near: ngo.location,
        distanceField: 'distance',
        spherical: true
      }
    },
    {
      $project: {
        name: 1,
        distanceKm: { $round: [{ $divide: ['$distance', 1000] }, 2] }
      }
    }
  ]);

  res.json(restaurants);
};
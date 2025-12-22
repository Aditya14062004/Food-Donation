const Donation = require("../models/Donation");
const NGO = require("../models/NGO");
const Restaurant = require("../models/Restaurant");

exports.getNearestRestaurants = async (req, res) => {
  const ngo = await NGO.findById(req.user.id);

  const restaurants = await Restaurant.aggregate([
    {
      $geoNear: {
        near: ngo.location,
        distanceField: "distance",
        spherical: true,
      },
    },
    {
      $project: {
        name: 1,
        address: 1,
        contactNo: 1,
        distanceKm: { $round: [{ $divide: ["$distance", 1000] }, 2] },
      },
    },
  ]);

  res.json(restaurants);
};

// ================= AVAILABLE DONATIONS =================
exports.getAvailableDonations = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.user.id);

    const donations = await Donation.find({ status: "pending" })
      .populate("restaurant", "name address contactNo location");

    const result = donations
      .filter((d) => d.restaurant && d.restaurant.location)
      .map((d) => {
        const ngoCoords = ngo.location.coordinates;
        const resCoords = d.restaurant.location.coordinates;

        const distanceKm = calculateDistance(
          ngoCoords[1],
          ngoCoords[0],
          resCoords[1],
          resCoords[0]
        );

        return {
          _id: d._id,
          foodName: d.foodName,
          quantity: d.quantity,
          distanceKm: Number(distanceKm.toFixed(2)),
          restaurant: {
            name: d.restaurant.name,
            address: d.restaurant.address,
            contactNo: d.restaurant.contactNo,
          },
        };
      });

    res.json(result);
  } catch (error) {
    console.error("NGO DONATION ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Haversine
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

exports.acceptDonation = async (req, res) => {
  const donation = await Donation.findById(req.params.donationId);

  if (!donation || donation.status !== "pending") {
    return res.status(400).json({ message: "Donation unavailable" });
  }

  donation.ngo = req.user.id;
  donation.status = "accepted";
  await donation.save();

  res.json({ message: "Donation accepted" });
};

// Helper
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
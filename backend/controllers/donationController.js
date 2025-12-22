const Donation = require("../models/Donation");
const Restaurant = require("../models/Restaurant");
const NGO = require("../models/NGO");
const sendEmail = require("../utils/sendEmails");

// ================= CREATE DONATION =================
exports.createDonation = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.user.id);

    const donation = await Donation.create({
      foodName: req.body.foodName,
      quantity: req.body.quantity,
      restaurant: restaurant._id,
      pickupLocation: restaurant.location,
    });

    // 📩 Notify nearby NGOs (within 5km)
    const ngos = await NGO.find({
      location: {
        $near: {
          $geometry: restaurant.location,
          $maxDistance: 5000,
        },
      },
    });

    for (const ngo of ngos) {
      await sendEmail(
        ngo.email,
        "New Food Donation Available",
        `A new food donation is available near you.\n\nFood: ${donation.foodName}\nQuantity: ${donation.quantity}\nRestaurant: ${restaurant.name}`
      );
    }

    res.status(201).json(donation);
  } catch (error) {
    console.error("CREATE DONATION ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= ACCEPT DONATION =================
exports.acceptDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate("restaurant", "name email")
      .populate("ngo", "name contactNo");

    if (!donation || donation.status === "accepted") {
      return res.status(400).json({ message: "Donation not available" });
    }

    donation.status = "accepted";
    donation.ngo = req.user.id;
    await donation.save();

    const ngo = await NGO.findById(req.user.id);

    // 📩 EMAIL TO RESTAURANT (IMPORTANT FEATURE)
    await sendEmail(
      donation.restaurant.email,
      "Donation Accepted",
      `Your food donation has been accepted.\n\nNGO Name: ${ngo.name}\nContact Number: ${ngo.contactNo}`
    );

    res.json(donation);
  } catch (error) {
    console.error("ACCEPT DONATION ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
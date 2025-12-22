const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    foodName: { type: String, required: true },
    quantity: { type: String, required: true },

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },

    pickupLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: [Number],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
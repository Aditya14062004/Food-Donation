const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const { getAvailableDonations } = require("../controllers/ngoController");
const { acceptDonation } = require("../controllers/donationController");

router.get("/available-donations", auth("ngo"), getAvailableDonations);
router.post("/accept-donation/:id", auth("ngo"), acceptDonation);

module.exports = router;
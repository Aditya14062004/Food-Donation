const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const { createDonation } = require('../controllers/donationController');
const { getNearestNGOs } = require('../controllers/restaurantController');
const { getMyDonations } = require('../controllers/restaurantController');

router.post('/donate', auth('restaurant'), createDonation);
router.get('/nearest-ngos', auth('restaurant'), getNearestNGOs);
router.get("/my-donations", auth("restaurant"), getMyDonations);

module.exports = router;
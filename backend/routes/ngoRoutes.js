const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const { acceptDonation } = require('../controllers/donationController');
const { getNearestRestaurants } = require('../controllers/ngoController');

router.post('/accept/:id', auth('ngo'), acceptDonation);
router.get('/nearest-restaurants', auth('ngo'), getNearestRestaurants);

module.exports = router;
const router = require('express').Router();
const auth = require('../controllers/authController');

router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.post('/generate-otp', auth.generateOTP);
router.post('/reset-password', auth.resetPassword);

module.exports = router;
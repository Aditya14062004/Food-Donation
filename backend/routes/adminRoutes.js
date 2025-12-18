const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const { getDashboardStats } = require('../controllers/adminController');

router.get('/stats', auth('admin'), getDashboardStats);

module.exports = router;
const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const authenticate = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

router.get('/', offerController.getOffers);
router.get('/stats', offerController.getStats);
router.get('/:id', offerController.getOffer);

module.exports = router;

const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const sourceRoutes = require('./sources');
const channelRoutes = require('./channels');
const offerRoutes = require('./offers');
const ruleRoutes = require('./rules');

// Mount routes
router.use('/auth', authRoutes);
router.use('/sources', sourceRoutes);
router.use('/channels', channelRoutes);
router.use('/offers', offerRoutes);
router.use('/rules', ruleRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;

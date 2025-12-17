const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channelController');
const authenticate = require('../middleware/auth');
const validateRequest = require('../middleware/validator');
const { channelSchemas } = require('../../utils/validators');

// All routes require authentication
router.use(authenticate);

router.get('/', channelController.getChannels);
router.get('/:id', channelController.getChannel);
router.post('/', validateRequest(channelSchemas.create), channelController.createChannel);
router.put('/:id', validateRequest(channelSchemas.update), channelController.updateChannel);
router.delete('/:id', channelController.deleteChannel);

module.exports = router;

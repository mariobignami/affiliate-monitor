const express = require('express');
const router = express.Router();
const sourceController = require('../controllers/sourceController');
const authenticate = require('../middleware/auth');
const validateRequest = require('../middleware/validator');
const { sourceSchemas } = require('../../utils/validators');

// All routes require authentication
router.use(authenticate);

router.get('/', sourceController.getSources);
router.get('/:id', sourceController.getSource);
router.post('/', validateRequest(sourceSchemas.create), sourceController.createSource);
router.put('/:id', validateRequest(sourceSchemas.update), sourceController.updateSource);
router.delete('/:id', sourceController.deleteSource);

module.exports = router;

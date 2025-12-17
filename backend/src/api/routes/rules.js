const express = require('express');
const router = express.Router();
const ruleController = require('../controllers/ruleController');
const authenticate = require('../middleware/auth');
const validateRequest = require('../middleware/validator');
const { ruleSchemas } = require('../../utils/validators');

// All routes require authentication
router.use(authenticate);

router.get('/', ruleController.getRules);
router.get('/:id', ruleController.getRule);
router.post('/', validateRequest(ruleSchemas.create), ruleController.createRule);
router.put('/:id', validateRequest(ruleSchemas.update), ruleController.updateRule);
router.delete('/:id', ruleController.deleteRule);

module.exports = router;

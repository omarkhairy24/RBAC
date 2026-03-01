const express = require('express');
const router = express.Router();
const controller = require('./controller');
const validation = require('./validation');
const validator = require('../../common/middleware/validator');

const { authenticate } = require('../../common/middleware/authenticate')

router.get('/', authenticate, controller.getAll);

router.post('/generate-key', authenticate, controller.generateKey);

router.delete('/delete-key/:id', authenticate, validation.deleteKey, validator, controller.deleteKey);

module.exports = router;
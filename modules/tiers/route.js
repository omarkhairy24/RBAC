const express = require('express');
const router = express.Router();
const controller = require('./controller');

const { authenticate } = require('../../common/middleware/authenticate');

router.patch('/upgrade', authenticate, controller.upgradeTier);

module.exports = router;
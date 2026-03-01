const express = require('express');
const router = express.Router();
const controller = require('../controller/permissions');
const validation = require('../validation/permissions');
const validator = require('../../../common/middleware/validator');
const { authApiKey } = require('../../../common/middleware/authKeys');

router.get('/', authApiKey, controller.getAll);

router.post('/', authApiKey, validation.addPermission, validator, controller.addPermission);

router.delete('/:id', authApiKey, validation.deletePermission, validator, controller.deletePermission);

module.exports = router;
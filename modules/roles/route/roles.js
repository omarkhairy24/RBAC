const express = require('express');
const router = express.Router();
const controller = require('../controller/roles');
const validation = require('../validation/roles');
const validator = require('../../../common/middleware/validator');
const { authApiKey } = require('../../../common/middleware/authKeys');

router.get('/', authApiKey, controller.getAll);

router.post('/', authApiKey, validation.create, validator, controller.create);

router.patch('/:id/add-permissions', authApiKey, validation.addPermissions, validator, controller.addPermissions);

router.delete('/:id/remove-permissions', authApiKey, validation.removePermissions, validator, controller.removePermissions);

router.delete('/:id', authApiKey, validation.delete, validator, controller.delete);

module.exports = router;
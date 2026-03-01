const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');
const validation = require('../validation/user');
const validator = require('../../../common/middleware/validator');
const { authApiKey } = require('../../../common/middleware/authKeys');

router.get('/', authApiKey, controller.getAll);

router.get('/:id', authApiKey, controller.getById);

router.post('/', authApiKey, validation.create, validator, controller.create);

router.patch('/:id/block', authApiKey, validation.blockUser, validator, controller.blockUser);

router.patch('/:id/unblock', authApiKey, validation.unblockUser, validator, controller.unblockUser);

router.patch('/:id/add-roles', authApiKey, validation.addRoles, validator, controller.addRoles);

router.patch('/:id/remove-roles', authApiKey, validation.removeRoles, validator, controller.removeRoles);

router.patch('/:id', authApiKey, validation.update, validator, controller.update);

router.delete('/:id', authApiKey, validation.deleteUser, validator, controller.deleteUser);

module.exports = router;
const express = require('express');
const router = express.Router();

const queryMiddleware = require('../common/middleware/query');

const authRoute = require('../modules/auth/routes/organization');
const apiKeyRoute = require('../modules/apiKey/route');
const userRoute = require('../modules/user/routes/route');
const permissionRoute = require('../modules/roles/route/permissions');
const roleRoute = require('../modules/roles/route/roles');
const tierRoute = require('../modules/tiers/route');

router.use(queryMiddleware);

router.use('/auth', authRoute);
router.use('/api-key', apiKeyRoute);
router.use('/users', userRoute);
router.use('/permissions', permissionRoute);
router.use('/roles', roleRoute);
router.use('/tier', tierRoute);

module.exports = router;
const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const checkPermission = require('../middlewares/permissionMiddleware');
const verifyJWT = require('../middlewares/authentication');
const permissions = require('../constants/permissions.constants');

router.use(verifyJWT);

router.get(
  '/',
  checkPermission(permissions.readLog),
  logController.getLogs
);

router.get(
  '/:id',
  checkPermission(permissions.readLog),
  logController.getLogById
);

module.exports = router;
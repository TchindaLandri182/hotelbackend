const express = require('express');
const router = express.Router();
const checkPermission = require('../middlewares/permissionMiddleware');
const verifyJWT = require('../middlewares/verifyJWT');
const permissions = require('../constants/permissions.constants');

const zoneController = require('../controllers/zone.controller');

router.use(verifyJWT)

router.post(
    '/zones',
    checkPermission(permissions.createZone),
    zoneController.createZone
  );
  router.put(
    '/zones/:id',
    checkPermission(permissions.updateZone),
    zoneController.updateZone
  );
  router.delete(
    '/zones/:id',
    checkPermission(permissions.deleteZone),
    zoneController.deleteZone
  );
  router.get(
    '/zones/:id',
    checkPermission(permissions.readZone),
    zoneController.getZoneById
  );
  router.get(
    '/zones',
    checkPermission(permissions.readZone),
    zoneController.getZones
  );
  


module.exports = router;

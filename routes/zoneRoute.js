const express = require('express');
const router = express.Router();
const checkPermission = require('../middlewares/permissionMiddleware');
const verifyJWT = require('../middlewares/authentication');
const permissions = require('../constants/permissions.constants');
const zoneController = require('../controllers/zoneController');

router.use(verifyJWT);

router.post('/',
  checkPermission(permissions.createLocation),
  zoneController.createZone
);

router.put('/:id',
  checkPermission(permissions.updateLocation),
  zoneController.updateZone
);

router.delete('/:id',
  checkPermission(permissions.deleteLocation),
  zoneController.deleteZone
);

router.get('/:id',
  checkPermission(permissions.readLocation),
  zoneController.getZoneById
);

router.get('/',
  checkPermission(permissions.readLocation),
  zoneController.getZones
);

module.exports = router;
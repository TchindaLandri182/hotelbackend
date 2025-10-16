const express = require('express');
const router = express.Router();
const regionController = require('../controllers/regionController');
const checkPermission = require('../middlewares/permissionMiddleware');
const verifyJWT = require('../middlewares/authentication');
const permissions = require('../constants/permissions.constants');

router.use(verifyJWT);

router.post('/',
  checkPermission(permissions.createLocation),
  regionController.createRegion
);

router.put('/:id',
  checkPermission(permissions.updateLocation),
  regionController.updateRegion
);

router.delete('/:id',
  checkPermission(permissions.deleteLocation),
  regionController.deleteRegion
);

router.get('/:id',
  checkPermission(permissions.readLocation),
  regionController.getRegionById
);

router.get('/',
  checkPermission(permissions.readLocation),
  regionController.getRegions
);

module.exports = router;
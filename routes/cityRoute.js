const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');
const checkPermission = require('../middlewares/permissionMiddleware');
const verifyJWT = require('../middlewares/authentication');
const permissions = require('../constants/permissions.constants');

router.use(verifyJWT);

router.post('/',
  checkPermission(permissions.createLocation),
  cityController.createCity
);

router.put('/:id',
  checkPermission(permissions.updateLocation),
  cityController.updateCity
);

router.delete('/:id',
  checkPermission(permissions.deleteLocation),
  cityController.deleteCity
);

router.get('/:id',
  checkPermission(permissions.readLocation),
  cityController.getCityById
);

router.get('/',
  checkPermission(permissions.readLocation),
  cityController.getCities
);

module.exports = router;
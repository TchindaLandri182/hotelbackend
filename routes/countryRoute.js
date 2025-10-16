const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');
const checkPermission = require('../middlewares/permissionMiddleware');
const verifyJWT = require('../middlewares/authentication');
const permissions = require('../constants/permissions.constants');

router.use(verifyJWT);

router.post('/',
  checkPermission(permissions.createLocation),
  countryController.createCountry
);

router.put('/:id',
  checkPermission(permissions.updateLocation),
  countryController.updateCountry
);

router.delete('/:id',
  checkPermission(permissions.deleteLocation),
  countryController.deleteCountry
);

router.get('/:id',
  checkPermission(permissions.readLocation),
  countryController.getCountryById
);

router.get('/',
  checkPermission(permissions.readLocation),
  countryController.getCountries
);

module.exports = router;
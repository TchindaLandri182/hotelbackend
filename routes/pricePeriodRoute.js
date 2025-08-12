const express = require('express');
const router = express.Router();
const checkPermission = require('../middlewares/permissionMiddleware');
const verifyJWT = require('../middlewares/authentication');
const permissions = require('../constants/permissions.constants');
const pricePeriodController = require('../controllers/pricePeriodController');

router.use(verifyJWT);

router.post('/',
  checkPermission(permissions.createPricePeriod),
  pricePeriodController.createPricePeriod
);

router.put('/:id',
  checkPermission(permissions.updatePricePeriod),
  pricePeriodController.updatePricePeriod
);

router.delete('/:id',
  checkPermission(permissions.deletePricePeriod),
  pricePeriodController.deletePricePeriod
);

router.get('/:id',
  checkPermission(permissions.readPricePeriod),
  pricePeriodController.getPricePeriodById
);

router.get('/',
  checkPermission(permissions.readPricePeriod),
  pricePeriodController.getPricePeriods
);

module.exports = router;
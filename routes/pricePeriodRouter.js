const express = require('express');
const router = express.Router();
const checkPermission = require('../middlewares/permissionMiddleware');
const verifyJWT = require('../middlewares/verifyJWT');
const permissions = require('../constants/permissions.constants');

const pricePeriodController = require('../controllers/pricePeriod.controller');

router.use(verifyJWT);

// PricePeriod routes
router.post(
  '/price-periods',
  checkPermission(permissions.createPricePeriod),
  pricePeriodController.createPricePeriod
);
router.put(
  '/price-periods/:id',
  checkPermission(permissions.updatePricePeriod),
  pricePeriodController.updatePricePeriod
);
router.delete(
  '/price-periods/:id',
  checkPermission(permissions.deletePricePeriod),
  pricePeriodController.deletePricePeriod
);
router.get(
  '/price-periods/:id',
  checkPermission(permissions.readPricePeriod),
  pricePeriodController.getPricePeriodById
);
router.get(
  '/price-periods',
  checkPermission(permissions.readPricePeriod),
  pricePeriodController.getPricePeriods
);


module.exports = router;
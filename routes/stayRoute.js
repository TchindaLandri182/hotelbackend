const express = require('express');
const router = express.Router();
const checkPermission = require('../middlewares/permissionMiddleware');
const verifyJWT = require('../middlewares/verifyJWT');
const permissions = require('../constants/permissions.constants');

const stayController = require('../controllers/stay.controller');

router.use(verifyJWT)

// Stay routes
router.post(
    '/stays',
    checkPermission(permissions.createStay),
    stayController.createStay
  );
  router.put(
    '/stays/:id',
    checkPermission(permissions.updateStay),
    stayController.updateStay
  );
  router.delete(
    '/stays/:id',
    checkPermission(permissions.deleteStay),
    stayController.deleteStay
  );
  router.get(
    '/stays/:id',
    checkPermission(permissions.readStay),
    stayController.getStayById
  );
  router.get(
    '/stays',
    checkPermission(permissions.readStay),
    stayController.getStays
  );


module.exports = router;

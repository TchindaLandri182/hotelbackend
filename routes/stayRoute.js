const express = require('express');
const router = express.Router();
const checkPermission = require('../middlewares/permissionMiddleware');
const verifyJWT = require('../middlewares/authentication');
const permissions = require('../constants/permissions.constants');
const stayController = require('../controllers/stayController');

router.use(verifyJWT);

router.post('/',
  checkPermission(permissions.createStay),
  stayController.createStay
);

router.put('/:id',
  checkPermission(permissions.updateStay),
  stayController.updateStay
);

router.delete('/:id',
  checkPermission(permissions.deleteStay),
  stayController.deleteStay
);

router.get('/:id',
  checkPermission(permissions.readStay),
  stayController.getStayById
);

router.get('/',
  checkPermission(permissions.readStay),
  stayController.getStays
);

module.exports = router;
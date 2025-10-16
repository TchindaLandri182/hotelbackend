const express = require('express');
const router = express.Router();
const checkPermission = require('../middlewares/permissionMiddleware');
const verifyJWT = require('../middlewares/authentication');
const permissions = require('../constants/permissions.constants');
const roomController = require('../controllers/roomController');

router.use(verifyJWT);

router.post('/',
  checkPermission(permissions.createRoom),
  roomController.createRoom
);

router.put('/:id',
  checkPermission(permissions.updateRoom),
  roomController.updateRoom
);

router.delete('/:id',
  checkPermission(permissions.deleteRoom),
  roomController.deleteRoom
);

router.get('/all',
  checkPermission(permissions.readRoom),
  roomController.getAllRooms
);

router.get('/:id',
  checkPermission(permissions.readRoom),
  roomController.getRoom
);

router.get('/',
  checkPermission(permissions.readRoom),
  roomController.getRooms
);


module.exports = router;
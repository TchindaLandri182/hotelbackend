const express = require('express');
const router = express.Router();
const checkPermission = require('../middlewares/permissionMiddleware');
const verifyJWT = require('../middlewares/verifyJWT');
const permissions = require('../constants/permissions.constants');

const roomController = require('../controllers/room.controller');

router.use(verifyJWT)

router.post(
    '/rooms',
    checkPermission(permissions.createRoom),
    roomController.createRoom
  );
  router.put(
    '/rooms/:id',
    checkPermission(permissions.updateRoom),
    roomController.updateRoom
  );
  router.delete(
    '/rooms/:id',
    checkPermission(permissions.deleteRoom),
    roomController.deleteRoom
  );
  router.get(
    '/rooms/:id',
    checkPermission(permissions.readRoom),
    roomController.getRoomById
  );
  router.get(
    '/rooms',
    checkPermission(permissions.readRoom),
    roomController.getRooms
  );
  


module.exports = router;

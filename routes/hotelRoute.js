const express = require('express');
const router = express.Router();
const checkPermission = require('../middlewares/permissionMiddleware');
const verifyJWT = require('../middlewares/authentication');
const permissions = require('../constants/permissions.constants');
const hotelController = require('../controllers/hotelController');

router.use(verifyJWT);

router.post('/',
  checkPermission(permissions.createHotel),
  hotelController.createHotel
);

router.put('/:id',
  checkPermission(permissions.updateHotel),
  hotelController.updateHotel
);

router.delete('/:id',
  checkPermission(permissions.deleteHotel),
  hotelController.deleteHotel
);

router.get('/:id',
  checkPermission(permissions.readHotel),
  hotelController.getHotelById
);

router.get('/',
  checkPermission(permissions.readHotel),
  hotelController.getHotels
);

module.exports = router;
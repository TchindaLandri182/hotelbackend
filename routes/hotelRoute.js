const express = require('express');
const router = express.Router();
const checkPermission = require('../middlewares/permissionMiddleware');
const verifyJWT = require('../middlewares/authentication');
const permissions = require('../constants/permissions.constants');
const hotelController = require('../controllers/hotelController');
const uploadUserImage = require('../middlewares/multerMiddleware');

router.use(verifyJWT);

//to create new hotel can be created by owner and roles above it
router.post('/',
  checkPermission(permissions.createHotel),
  uploadUserImage.single('logo'),
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

router.get('/all',
  checkPermission(permissions.readHotel),
  hotelController.getAllHotels
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
// const express = require('express');
// const router = express.Router();
// const upload = require('../middlewares/multer');
// const authorizeRoles = require('../middlewares/authorizeRoles');
// const roleList = require('../constants/roleLIst.constants');
// const verifyJWT = require('../middlewares/authentification');
// const {
//     createHotel,
//     getAllHotels,
//     getHotels,
//     getHotel,
//     updateHotel,
//     deleteHotel
// } = require('../controllers/hotel.controller');


// router.post('/', 
//     verifyJWT,
//     authorizeRoles(roleList.admin), 
//     upload.single('logo'), 
//     createHotel
// );
// router.get('/',
//     verifyJWT, 
//     authorizeRoles(roleList.admin, roleList.owner), 
//     getHotels
// );
// router.get('/all',
//     verifyJWT,
//     authorizeRoles(roleList.admin, roleList.owner), 
//     getAllHotels
// );
// router.get('/:id', 
//     verifyJWT,
//     authorizeRoles(roleList.admin, roleList.owner), 
//     getHotel
// );
// router.put('/:id',
//     verifyJWT, 
//     upload.single('logo'),
//     authorizeRoles(roleList.admin, roleList.owner),
//     updateHotel
// );
// router.delete('/:id',
//     verifyJWT, 
//     authorizeRoles(roleList.admin, roleList.owner), 
//     deleteHotel
// );

const express = require('express');
const router = express.Router();
const checkPermission = require('../middlewares/permissionMiddleware');
const verifyJWT = require('../middlewares/verifyJWT');
const permissions = require('../constants/permissions.constants');

const hotelController = require('../controllers/hotel.controller');

router.post(
    '/hotels',
    checkPermission(permissions.createHotel),
    hotelController.createHotel
  );
  router.put(
    '/hotels/:id',
    checkPermission(permissions.updateHotel),
    hotelController.updateHotel
  );
  router.delete(
    '/hotels/:id',
    checkPermission(permissions.deleteHotel),
    hotelController.deleteHotel
  );
  router.get(
    '/hotels/:id',
    checkPermission(permissions.readHotel),
    hotelController.getHotelById
  );
  router.get(
    '/hotels',
    checkPermission(permissions.readHotel),
    hotelController.getHotels
  );

module.exports = router;

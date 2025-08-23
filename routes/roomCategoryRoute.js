const express = require('express');
const router = express.Router();
const {
  getCategoryRoomById,
  getCategoryRooms,
  getAllCategoryRooms,
  createCategoryRoom,
  updateCategoryRoom,
  deleteCategoryRoom
} = require('../controllers/roomCategory.controller');
const verifyJWT = require('../middlewares/authentification');
const authorizeRoles = require('../middlewares/authorizeRoles');

router.use(verifyJWT);

router.post(
  '/',
  authorizeRoles('admin', 'owner'),
  createCategoryRoom
);

router.put(
  '/:id',
  authorizeRoles('admin', 'owner', 'roomManager'),
  updateCategoryRoom
);

router.delete(
  '/:id',
  authorizeRoles('admin', 'owner'),
  deleteCategoryRoom
);

router.get('/:id', getCategoryRoomById);
router.get('/', getCategoryRooms)
router.get('/all', getAllCategoryRooms);

module.exports = router;

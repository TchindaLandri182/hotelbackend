const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/roomCategoryController');
const checkPermission = require('../middlewares/permissionMiddleware');
const verifyJWT = require('../middlewares/authentication');
const permissions = require('../constants/permissions.constants');

router.use(verifyJWT);

router.post(
  '/',
  checkPermission(permissions.createCategoryRoom),
  categoryController.createCategoryRoom
);

router.put(
  '/:id',
  checkPermission(permissions.updateCategoryRoom),
  categoryController.updateCategoryRoom
);

router.delete(
  '/:id',
  checkPermission(permissions.deleteCategoryRoom),
  categoryController.deleteCategoryRoom
);

router.get(
  '/all',
  checkPermission(permissions.readCategoryRoom),
  categoryController.getAllCategoryRooms
);


router.get(
  '/:id',
  checkPermission(permissions.readCategoryRoom),
  categoryController.getCategoryRoomById
);

router.get(
  '/',
  checkPermission(permissions.readCategoryRoom),
  categoryController.getCategoryRooms
);

module.exports = router;
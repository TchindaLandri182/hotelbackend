const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryRoom.controller');
const checkPermission = require('../middlewares/permissionMiddleware');
const verifyJWT = require('../middlewares/verifyJWT');
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
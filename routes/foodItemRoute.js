const express = require('express');
const router = express.Router();
const checkPermission = require('../middlewares/permissionMiddleware');
const verifyJWT = require('../middlewares/authentication');
const permissions = require('../constants/permissions.constants');
const foodItemController = require('../controllers/foodItemController');

router.use(verifyJWT);

router.post('/',
  checkPermission(permissions.createFoodItem),
  foodItemController.createFoodItem
);

router.put('/:id',
  checkPermission(permissions.updateFoodItem),
  foodItemController.updateFoodItem
);

router.delete('/:id',
  checkPermission(permissions.deleteFoodItem),
  foodItemController.deleteFoodItem
);

router.get('/:id',
  checkPermission(permissions.readFoodItem),
  foodItemController.getFoodItemById
);

router.get('/',
  checkPermission(permissions.readFoodItem),
  foodItemController.getFoodItems
);

module.exports = router;
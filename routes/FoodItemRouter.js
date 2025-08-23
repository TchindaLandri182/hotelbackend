const checkPermission = require('../middlewares/permissionMiddleware');
const verifyJWT = require('../middlewares/verifyJWT');
const permissions = require('../constants/permissions.constants');

const foodItemController = require('../controllers/foodItem.controller');

router.use(verifyJWT);

// FoodItem routes
router.post(
  '/food-items',
  checkPermission(permissions.createFoodItem),
  foodItemController.createFoodItem
);
router.put(
  '/food-items/:id',
  checkPermission(permissions.updateFoodItem),
  foodItemController.updateFoodItem
);
router.delete(
  '/food-items/:id',
  checkPermission(permissions.deleteFoodItem),
  foodItemController.deleteFoodItem
);
router.get(
  '/food-items/:id',
  checkPermission(permissions.readFoodItem),
  foodItemController.getFoodItemById
);
router.get(
  '/food-items',
  checkPermission(permissions.readFoodItem),
  foodItemController.getFoodItems
);

module.exports = router;
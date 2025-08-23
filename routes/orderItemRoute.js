const express = require('express');
const router = express.Router();
const checkPermission = require('../middlewares/permissionMiddleware');
const verifyJWT = require('../middlewares/authentication');
const permissions = require('../constants/permissions.constants');
const orderItemController = require('../controllers/OrderItemController');

router.use(verifyJWT);

router.post('/',
  checkPermission(permissions.createOrderItem),
  orderItemController.createOrderItem
);

router.put('/:id',
  checkPermission(permissions.updateOrderItem),
  orderItemController.updateOrderItem
);

router.delete('/:id',
  checkPermission(permissions.deleteOrderItem),
  orderItemController.deleteOrderItem
);

router.get('/:id',
  checkPermission(permissions.readOrderItem),
  orderItemController.getOrderItemById
);

router.get('/',
  checkPermission(permissions.readOrderItem),
  orderItemController.getOrderItems
);

module.exports = router;
const express = require('express');
const router = express.Router();
const checkPermission = require('../middlewares/permissionMiddleware');
const verifyJWT = require('../middlewares/verifyJWT');
const permissions = require('../constants/permissions.constants');

const orderItemController = require('../controllers/orderItem.controller');

router.use(verifyJWT);

router.post(
    '/order-items',
    checkPermission(permissions.createOrderItem),
    orderItemController.createOrderItem
  );
  router.put(
    '/order-items/:id',
    checkPermission(permissions.updateOrderItem),
    orderItemController.updateOrderItem
  );
  router.delete(
    '/order-items/:id',
    checkPermission(permissions.deleteOrderItem),
    orderItemController.deleteOrderItem
  );
  router.get(
    '/order-items/:id',
    checkPermission(permissions.readOrderItem),
    orderItemController.getOrderItemById
  );
  router.get(
    '/order-items',
    checkPermission(permissions.readOrderItem),
    orderItemController.getOrderItems
  );
  
  module.exports = router;
const express = require('express');
const router = express.Router();
const checkPermission = require('../middlewares/permissionMiddleware');
const verifyJWT = require('../middlewares/authentication');
const permissions = require('../constants/permissions.constants');
const invoiceController = require('../controllers/invoiceController');

router.use(verifyJWT);

router.post('/',
  checkPermission(permissions.createInvoice),
  invoiceController.createInvoice
);

router.put('/:id',
  checkPermission(permissions.updateInvoice),
  invoiceController.updateInvoice
);

router.delete('/:id',
  checkPermission(permissions.deleteInvoice),
  invoiceController.deleteInvoice
);

router.get('/:id',
  checkPermission(permissions.readInvoice),
  invoiceController.getInvoiceById
);

router.get('/',
  checkPermission(permissions.readInvoice),
  invoiceController.getInvoices
);

module.exports = router;
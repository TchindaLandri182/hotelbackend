const express = require('express');
const router = express.Router();
const checkPermission = require('../middlewares/permissionMiddleware');
const verifyJWT = require('../middlewares/verifyJWT');
const permissions = require('../constants/permissions.constants');

const invoiceController = require('../controllers/invoice.controller');

router.use(verifyJWT);

router.post(
    '/invoices',
    checkPermission(permissions.createInvoice),
    invoiceController.createInvoice
  );
  router.put(
    '/invoices/:id',
    checkPermission(permissions.updateInvoice),
    invoiceController.updateInvoice
  );
  router.delete(
    '/invoices/:id',
    checkPermission(permissions.deleteInvoice),
    invoiceController.deleteInvoice
  );
  router.get(
    '/invoices/:id',
    checkPermission(permissions.readInvoice),
    invoiceController.getInvoiceById
  );
  router.get(
    '/invoices',
    checkPermission(permissions.readInvoice),
    invoiceController.getInvoices
  );

  module.exports = router;
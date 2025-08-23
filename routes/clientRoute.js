const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const verifyJWT = require('../middlewares/authentication');
const checkPermission = require('../middlewares/permissionMiddleware');
const permissions = require('../constants/permissions.constants');

router.use(verifyJWT);

router.post('/', 
  checkPermission(permissions.createClient),
  clientController.createClient
);

router.put('/:id', 
  checkPermission(permissions.updateClient),
  clientController.updateClient
);

router.delete('/:id', 
  checkPermission(permissions.deleteClient),
  clientController.deleteClient
);

router.get('/:id', 
  checkPermission(permissions.readClient),
  clientController.getClientById
);

router.get('/', 
  checkPermission(permissions.readClient),
  clientController.getClients
);

router.get('/all/by-hotel', 
  checkPermission(permissions.readClient),
  clientController.getAllClients
);

module.exports = router;
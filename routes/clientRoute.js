const express = require('express')
const router = express.Router()
const clientController = require('../controllers/clientController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, clientController.createClient)
router.put('/:id', protect, clientController.updateClient)
router.delete('/:id', protect, clientController.deleteClient)
router.get('/:id', protect, clientController.getClientById)
router.get('/', protect, clientController.getClients)
router.get('/all/by-hotel', protect, clientController.getAllClients)

module.exports = router

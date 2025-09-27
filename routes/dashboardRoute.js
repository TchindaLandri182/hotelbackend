const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const checkPermission = require('../middlewares/permissionMiddleware');
const verifyJWT = require('../middlewares/authentication');

router.use(verifyJWT);

router.get('/stats', dashboardController.getDashboardStats);
router.get('/recent-activities', dashboardController.getRecentActivities);
router.get('/calendar-data', dashboardController.getCalendarData);

module.exports = router;
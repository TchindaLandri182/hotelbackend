const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const uploadUserImage = require('../middlewares/multerMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');
const permissions = require('../constants/permissions.constants');
const verifyJWT = require('../middlewares/authentication');

// Public routes

router.post('/signin', userController.signinUser);
router.post('/signup/invite', userController.signupViaInvite);
router.post('/signup', userController.signupUser);
router.post('/verify-email', verifyJWT, userController.verifyEmailCode);

router.post('/', userController.createUser);
// Protected routes
router.use(verifyJWT);

// Invitation management
router.post('/invite',
  checkPermission(permissions.inviteUser),
  userController.generateInviteLink
);


// Profile completion
router.post('/complete-profile',
  uploadUserImage.single('profileImage'),
  userController.completeProfile
);

// User management
router.get('/',
  checkPermission(permissions.readUser),
  userController.getUsers
);

router.get('/all',
  checkPermission(permissions.readUser),
  userController.getAllUsers
);

router.get('/:id',
  checkPermission(permissions.readUser),
  userController.getUser
);

router.put('/:id',
  checkPermission(permissions.updateUser),
  uploadUserImage.single('profileImage'),
  userController.updateUser
);

router.delete('/:id',
  checkPermission(permissions.deleteUser),
  userController.deleteUser
);



module.exports = router;
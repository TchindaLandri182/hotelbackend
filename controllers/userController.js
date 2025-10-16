const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { sendEmail, generateEmailToken, verifyEmailToken } = require('../services/emailService');
const { deleteFromCloudinary } = require('../services/cloudinary');
const { generateInviteToken, verifyInviteToken } = require('../services/inviteService');
const roleList = require('../constants/roleLIst.constants');
const roleHierarchy = require('../constants/roleHierarchy');
const permissions = require('../constants/permissions.constants');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_token_secret';
const INVITE_TOKEN_SECRET = process.env.INVITE_TOKEN_SECRET || 'invite_token_secret';

function expiresIn(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

// Create JWT token
const createToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '15d' }
  );
};

// Signin with 3-step verification
const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email) return res.status(400).json({ messageCode: 'MSG_0046', message: 'Email is required' });
    if (!password) return res.status(400).json({ messageCode: 'MSG_0047', message: 'Password is required' });
    
    const user = await User.findOne({ email, deleted: false });
    if (!user) return res.status(401).json({ messageCode: 'MSG_0048', message: 'Invalid credentials' });
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ messageCode: 'MSG_0048', message: 'Invalid credentials' });
    
    // Step 1: Check if email is verified
    if (!user.isEmailVerified) {

      const emailToken = generateEmailToken(user._id)
      user.emailCode = Math.floor(1000 + Math.random() * 9000)
      user.emailExpireIn = new Date(Date.now() + 60 * 60 * 1000)
      await user.save()

      // TODO: Send verification email with emailCode
      // sendVerificationEmail(newUser.email, emailCode);

      const token = createToken(user);
      return res.status(403).json({ 
        messageCode: 'MSG_0003', 
        requiresVerification: true,
        token,
        expiresIn: expiresIn(15),
        message: 'Email verification required'
      });
    }
    
    // Step 2: Check if signup is complete
    if (!user.isSignUpComplete) {
      const token = createToken(user);
      return res.json({
        messageCode: 'MSG_0003', 
        requiresProfileCompletion: true,
        token,
        expiresIn: expiresIn(15),
        message: 'Profile completion required'
      });
    }
    
    // Step 3: Full authentication
    const token = createToken(user);
    const userData = user.toObject();
    delete userData.password;
    
    res.json({
      messageCode: 'MSG_0003', 
      token,
      expiresIn: expiresIn(15),
      user: userData
    });
  } catch (error) {
    console.error('Signin Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

// Generate invitation link
const generateInviteLink = async (req, res) => {
  try {
    const inviter = req.user;
    const { role, email } = req.body;
    
    if (!roleHierarchy.canInvite(inviter.role, role)) {
      return res.status(403).json({ 
        messageCode: 'MSG_0049', message: 'You cannot invite this role' 
      });
    }
    
    const token = generateInviteToken({
      inviterId: inviter._id,
      role,
      email
    });
    
    const inviteLink = `${process.env.CLIENT_URL}/signup/invite?token=${token}`;
    
    res.json({
      messageCode: 'MSG_0003', 
      inviteLink,
      message: 'Invitation link generated'
    });
  } catch (error) {
    console.error('Generate Invite Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

// Signup via invitation link
const signupViaInvite = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    // Verify invitation token
    const inviteData = verifyInviteToken(token);
    if (!inviteData) {
      return res.status(400).json({ messageCode: 'MSG_0050', message: 'Invalid or expired token' });
    }
    
    const { inviterId, role, email } = inviteData;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ messageCode: 'MSG_0051', message: 'Email already registered' });
    }
    
    // Create new user
    const hashedPassword = await bcrypt.hash(password, 12);
    const emailCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code
    
    const newUser = new User({
      email,
      password: hashedPassword,
      role,
      invitedBy: inviterId,
      emailCode,
      emailExpireIn: new Date(Date.now() + 3600000), // 1 hour expiration
      isEmailVerified: false,
      isSignUpComplete: false
    });
    
    await newUser.save();
    
    // Send verification email
    await sendEmail({
      to: email,
      subject: 'Verify Your Email',
      html: `<p>Your verification code: ${emailCode}</p>`
    });
    
    res.status(201).json({
      messageCode: 'MSG_0052', message: 'Account created. Please verify your email.',
      requiresVerification: true
    });
  } catch (error) {
    console.error('Signup via Invite Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

// Verify email with code
const verifyEmailCode = async (req, res) => {
  try {
    const { code } = req.body;
    const user = req.user;
    
    if (!user) {
      return res.status(404).json({ messageCode: 'MSG_0053', message: 'User not found' });
    }
    
    if (user.isEmailVerified) {
      return res.status(400).json({ messageCode: 'MSG_0054', message: 'Email already verified' });
    }

    if (new Date() > user.emailExpireIn) {
      return res.status(400).json({ messageCode: 'MSG_0056', message: 'Verification code expired' });
    }
    
    if (user.emailCode !== code) {
      return res.status(400).json({ messageCode: 'MSG_0055', message: 'Invalid verification code' });
    }
    
    user.isEmailVerified = true;
    user.emailCode = undefined;
    user.emailExpireIn = undefined;
    await user.save();
    
    res.json({
      messageCode: 'MSG_0003', 
      user,
      requiresProfileCompletion: !user.isSignUpComplete,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Verify Email Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

// Complete signup profile
const   completeProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const user = req.user;
    
    if (!user) {
      return res.status(404).json({ messageCode: 'MSG_0053', message: 'User not found' });
    }
    
    if (!firstName || !lastName) {
      return res.status(400).json({ messageCode: 'MSG_0057', message: 'First name and last name are required' });
    }
    
    user.firstName = firstName;
    user.lastName = lastName;
    user.isSignUpComplete = true;
    
    if (req.file) {
      // Delete old image if exists
      if (user.profileImage?.public_id) {
        await deleteFromCloudinary(user.profileImage.public_id);
      }
      user.profileImage = {
        public_id: req.file?.filename,
        url: req.file?.path
      };
    }
    
    await user.save();
    
    const userData = user.toObject();
    delete userData.password;
    
    res.json({
      messageCode: 'MSG_0003', 
      user: userData,
      message: 'Profile completed successfully'
    });
  } catch (error) {
    console.error('Complete Profile Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

// Update user (with role-based permissions)
const updateUser = async (req, res) => {
  try {
    const updater = req.user;
    const userId = req.params.id;
    
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate || userToUpdate.deleted) {
      return res.status(404).json({ messageCode: 'MSG_0053', message: 'User not found' });
    }
  
    // Check permission hierarchy
    if (!roleHierarchy.canManage(updater.role, userToUpdate.role) && updater._id.toString() !== userId) {
      return res.status(403).json({ 
        messageCode: 'MSG_0058', message: 'You cannot manage this user' 
      });
    }
  
    // Handle profile image
    if (req.file) {
      if (userToUpdate.profileImage?.public_id) {
        await deleteFromCloudinary(userToUpdate.profileImage.public_id);
      }
      userToUpdate.profileImage = {
        public_id: req.file?.filename,
        url: req.file?.path
      };
    }
    
    // Update fields
    if (req.body.firstName) userToUpdate.firstName = req.body.firstName;
    if (req.body.lastName) userToUpdate.lastName = req.body.lastName;
    
    // Role update (only by higher roles)
    if (req.body.role && roleHierarchy.canAssignRole(updater.role, req.body.role)) {
      userToUpdate.role = req.body.role;
    }
    
    // Permission update
    if (req.body.permissions && updater.role === 'admin') {
      userToUpdate.permissions = req.body.permissions;
    }
    
    await userToUpdate.save();
    
    const userData = userToUpdate.toObject();
    delete userData.password;
    
    res.json({ messageCode: 'MSG_0003',  user: userData, message: 'User updated' });
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

// Delete user (with role-based permissions)
const deleteUser = async (req, res) => {
  try {
    const deleter = req.user;
    const userId = req.params.id;
    
    const userToDelete = await User.findById(userId);
    if (!userToDelete || userToDelete.deleted) {
      return res.status(404).json({ messageCode: 'MSG_0053', message: 'User not found' });
    }
    
    // Check permission hierarchy
    if (!roleHierarchy.canManage(deleter.role, userToDelete.role)) {
      return res.status(403).json({ 
        messageCode: 'MSG_0059', message: 'You cannot delete this user' 
      });
    }
    
    // Soft delete
    userToDelete.deleted = true;
    userToDelete.email = `${userToDelete.email}_deleted_${Date.now()}`;
    
    // Delete profile image
    if (userToDelete.profileImage?.public_id) {
      await deleteFromCloudinary(userToDelete.profileImage.public_id);
    }
    
    await userToDelete.save();
    
    res.json({ messageCode: 'MSG_0060', message: 'User deleted' });
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

// Get user by ID
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -emailCode -emailExpireIn')
      .populate('hotel', 'name address');
    
    if (!user || user.deleted) {
      return res.status(404).json({ messageCode: 'MSG_0053', message: 'User not found' });
    }
    
    res.json({ messageCode: 'MSG_0003',  user });
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

// Get users with filters
const getUsers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      role = '',
      search = '',
      hotel 
    } = req.query;
    
    const skip = (page - 1) * limit;
    const query = { deleted: false };
    
    if (role) query.role = role;
    if (hotel) query.hotel = hotel;
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -emailCode -emailExpireIn')
        .skip(skip)
        .limit(Number(limit))
        .populate('hotel', 'name'),
      User.countDocuments(query)
    ]);
    
    res.json({
      messageCode: 'MSG_0003', 
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      users
    });
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};


// 2. User Registration
const createUser = async (req, res) => {
  try {
    const creator = req.user;
    const { firstName, lastName, email, password, role, hotel } = req.body;
    
    // Authorization checks
    if (!creator) return res.status(403).json({ messageCode: 'MSG_0061', message: 'Unauthorized' });
    
    const isCreatingAdmin = role === roleList.admin;
    const isCreatingOwner = role === roleList.owner;
    const isCreatingManager = [roleList.hotelManager, roleList.restaurantManager].includes(role);
    
    const isCreatorAdmin = creator.role === roleList.admin;
    const isCreatorOwner = creator.role === roleList.owner;
    
    if (
      (isCreatingAdmin && !isCreatorAdmin) ||
      (isCreatingOwner && !isCreatorAdmin) ||
      (isCreatingManager && !(isCreatorAdmin || isCreatorOwner))
    ) {
      return res.status(403).json({ messageCode: 'MSG_0062', message: 'Permission denied' });
    }
    
    // Validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({ messageCode: 'MSG_0063', message: 'Invalid email format' });
    }
    
    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })) {
      return res.status(400).json({ messageCode: 'MSG_0064', message: 'Password not strong enough' });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email, deleted: false });
    if (existingUser) {
      return res.status(409).json({ messageCode: 'MSG_0051', message: 'Email already registered' });
    }
    
    // Create new user
    const hashedPassword = await bcrypt.hash(password, 12);
    const emailCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code
    
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      hotel: isCreatingManager ? hotel : null,
      emailCode,
      emailExpireIn: new Date(Date.now() + 3600000), // 1 hour expiration
      createdBy: creator._id
    });
    
    // Handle profile image
    if (req.file) {
      newUser.profileImage = {
        public_id: req.file.public_id,
        url: req.file.secure_url
      };
    }
    
    await newUser.save();
    
    // TODO: Send verification email with emailCode
    // sendVerificationEmail(newUser.email, emailCode);
    
    const userData = newUser.toObject();
    delete userData.password;
    delete userData.emailCode;
    delete userData.emailExpireIn;
    
    res.status(201).json({
      messageCode: 'MSG_0065', message: 'User created. Please verify your email.',
      user: userData
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};


const signupUser = async (req, res) => {
  try {
    const { email, password, confirmPassword, role } = req.body;
    
    // Validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({ messageCode: 'MSG_0063', message: 'Invalid email format' });
    }

    //Check if role is owner
    if(role !== 'owner') return res.status(403).json({ messageCode: 'MSG_0062', message: 'Permission denied' })

    // Check if user exists
    const existingUser = await User.findOne({ email, deleted: false });
    if (existingUser) {
      return res.status(409).json({ messageCode: 'MSG_0051', message: 'Email already registered' });
    }
    
    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })) {
      return res.status(400).json({ messageCode: 'MSG_0064', message: 'Password not strong enough' });
    }

    if(password != confirmPassword) return res.status(400).json({ messageCode: 'MSG_0101', message: 'Password don\'t match' });
    
    // Create new user
    const hashedPassword = await bcrypt.hash(password, 12);
    const emailCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code
    
    const newUser = new User({
      email,
      password: hashedPassword,
      role,
      emailCode,
      emailExpireIn: new Date(Date.now() + 3600000), // 1 hour expiration
    });
    
    // Handle profile image
    if (req.file) {
      newUser.profileImage = {
        public_id: req.file.public_id,
        url: req.file.secure_url
      };
    }
    
    await newUser.save();
    
    if (process.env.NODE_ENV !== "production") {
      console.log(`[USERINFO] ${email}`);
      console.log(`  ├─ Password: ${password}`);
      console.log(`  └─ EmailCode: ${emailCode}\n`);
    }
    // TODO: Send verification email with emailCode
    // sendVerificationEmail(newUser.email, emailCode);
    
    const userData = newUser.toObject();
    delete userData.password;
    delete userData.emailCode;
    delete userData.emailExpireIn;

    //create user token
    const token = createToken(userData);
    
    res.status(201).json({
      messageCode: 'MSG_0065', message: 'User created. Please verify your email.',
      user: userData,
      expiresIn: expiresIn(15),
      token
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};




// 5. Get All Users (Simplified)
const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;

    const user = req.user
    const managebleRoles = roleHierarchy.getManageableRoles(user.role)
    const filter = {
      role: { $in: managebleRoles},
      deleted: false
    }
    if(role) filter.role = role;
    // if(user?.hotel) filter.hotel = user.hotel
    
    
    const users = await User.find(filter)
      .select('-password -emailCode -emailExpireIn -isEmailVerified -isSignUpComplete');
    
    res.json({ messageCode: 'MSG_0003',  users });
  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

// 9. Send Password Reset Email
const sendResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ messageCode: 'MSG_0046', message: 'Email is required' });
    }
    
    const user = await User.findOne({ email, deleted: false });
    if (!user) {
      return res.status(404).json({ messageCode: 'MSG_0053', message: 'User not found' });
    }
    
    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id },
      RESET_TOKEN_SECRET,
      { expiresIn: '1h' }
    );
    
    // TODO: Send email with reset token
    // sendPasswordResetEmail(user.email, resetToken);
    
    res.json({ messageCode: 'MSG_0066', message: 'Password reset email sent' });
  } catch (error) {
    console.error('Send Reset Email Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

// 10. Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ messageCode: 'MSG_0067', message: 'Token and new password required' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, RESET_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user || user.deleted) {
      return res.status(404).json({ messageCode: 'MSG_0053', message: 'User not found' });
    }
    
    // Validate password strength
    if (!validator.isStrongPassword(newPassword, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })) {
      return res.status(400).json({ messageCode: 'MSG_0064', message: 'Password not strong enough' });
    }
    
    // Update password
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    
    res.json({ messageCode: 'MSG_0068', message: 'Password reset successfully' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ messageCode: 'MSG_0069', message: 'Reset token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ messageCode: 'MSG_0070', message: 'Invalid token' });
    }
    console.error('Reset Password Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

// 11. Resend Verification Email
const resendVerificationEmail = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    
    if (!user || user.deleted) {
      return res.status(404).json({ messageCode: 'MSG_0053', message: 'User not found' });
    }
    
    if (!user.emailCode) {
      return res.status(400).json({ messageCode: 'MSG_0054', message: 'Email already verified' });
    }
    
    // Generate new code
    user.emailCode = Math.floor(100000 + Math.random() * 900000);
    user.emailExpireIn = new Date(Date.now() + 3600000);
    await user.save();
    
    // TODO: Send verification email
    // sendVerificationEmail(user.email, user.emailCode);
    
    res.json({ messageCode: 'MSG_0071', message: 'Verification email resent' });
  } catch (error) {
    console.error('Resend Verification Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

module.exports = {
  signinUser,
  generateInviteLink,
  signupViaInvite,
  verifyEmailCode,
  completeProfile,
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  signupUser,
  createUser,
  getAllUsers,
  sendResetPassword,
  resetPassword,
  resendVerificationEmail
};
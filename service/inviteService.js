const jwt = require('jsonwebtoken');
const INVITE_TOKEN_SECRET = process.env.INVITE_TOKEN_SECRET || 'invite_token_secret';

// Generate invitation token
exports.generateInviteToken = (payload) => {
  return jwt.sign(payload, INVITE_TOKEN_SECRET, { expiresIn: '7d' });
};

// Verify invitation token
exports.verifyInviteToken = (token) => {
  try {
    return jwt.verify(token, INVITE_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};
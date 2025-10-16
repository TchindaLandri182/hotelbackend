const nodemailer = require('nodemailer');

const EMAIL_TOKEN_SECRET = process.env.EMAIL_TOKEN_SECRET || 'email token secret'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// const good = nodemailer.createTransport()
exports.sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    };
    
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email Send Error:', error);
    return false;
  }
};

exports.generateEmailToken = (payload) => {
  return jwt.sign(payload, EMAIL_TOKEN_SECRET, { expiresIn: '1h' });
};

exports.verifyEmailToken = (token) => {
  try {
    return jwt.verify(token, EMAIL_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};
const cloudinary = require('cloudinary').v2;

// Validate configuration exists
if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
  throw new Error('Missing Cloudinary configuration in environment variables');
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true
});

// Test the configuration
cloudinary.api.ping()
  .then(result => console.log('Cloudinary connection test ok'))
  .catch(err => console.error('Cloudinary connection failed:'));

module.exports = cloudinary;
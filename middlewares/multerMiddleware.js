const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../configs/cloudinary');
const allowedImageFormat = require('../constants/allowedImageFormat');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'hotelmanagement',
    allowed_formats: allowedImageFormat,
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const upload = multer({ storage });

exports.uploadUserImage = upload;
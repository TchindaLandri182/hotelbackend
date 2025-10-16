const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../configs/cloudinary');
const allowedImageFormat = require('../constants/allowedImageFormat');

const storage = new CloudinaryStorage({
  cloudinary,
  params:(req, file) => {return {
    folder: 'hotel',
    allowed_formats: allowedImageFormat,
    public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    resource_type: 'auto'
  }}
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;
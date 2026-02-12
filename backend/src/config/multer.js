const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const createStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '..', '..', 'uploads', folder));
    },
    filename: (req, file, cb) => {
      const hash = crypto.randomBytes(8).toString('hex');
      const ext = path.extname(file.originalname);
      cb(null, `${hash}-${Date.now()}${ext}`);
    },
  });

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de arquivo não suportado. Use JPG, PNG ou WebP.'), false);
  }
};

const avatarUpload = multer({
  storage: createStorage('avatars'),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const galleryUpload = multer({
  storage: createStorage('gallery'),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = { avatarUpload, galleryUpload };

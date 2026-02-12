const { Router } = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { galleryUpload } = require('../config/multer');
const galleryController = require('../controllers/galleryController');

const router = Router();

router.get('/', galleryController.getAll);
router.post('/', authenticate, authorize('ADMIN'), galleryUpload.single('image'), galleryController.upload);
router.delete('/:id', authenticate, authorize('ADMIN'), galleryController.remove);

module.exports = router;

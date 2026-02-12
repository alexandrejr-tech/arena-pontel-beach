const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { avatarUpload } = require('../config/multer');
const userController = require('../controllers/userController');

const router = Router();

router.use(authenticate);

router.get('/profile', userController.getProfile);

router.put(
  '/profile',
  [body('name').optional().trim().notEmpty().withMessage('Nome não pode ser vazio.')],
  validate,
  userController.updateProfile
);

router.put(
  '/change-password',
  [
    body('currentPassword').notEmpty().withMessage('Senha atual é obrigatória.'),
    body('newPassword').isLength({ min: 6 }).withMessage('Nova senha deve ter no mínimo 6 caracteres.'),
  ],
  validate,
  userController.changePassword
);

router.put('/upload-avatar', avatarUpload.single('avatar'), userController.uploadAvatar);

// Admin routes
router.get('/admin/all', authorize('ADMIN'), userController.getAllUsers);
router.get('/admin/stats', authorize('ADMIN'), userController.getAdminStats);
router.post(
  '/admin/create',
  authorize('ADMIN'),
  [
    body('name').trim().notEmpty().withMessage('Nome é obrigatório.'),
    body('email').isEmail().withMessage('Email inválido.'),
    body('cpf').notEmpty().withMessage('CPF é obrigatório.'),
    body('phone').optional(),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres.'),
  ],
  validate,
  userController.createUser
);

router.put(
  '/admin/:id',
  authorize('ADMIN'),
  [
    body('name').optional().trim().notEmpty().withMessage('Nome não pode ser vazio.'),
    body('email').optional().isEmail().withMessage('Email inválido.'),
    body('cpf').optional().notEmpty().withMessage('CPF não pode ser vazio.'),
    body('phone').optional(),
    body('password').optional().isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres.'),
  ],
  validate,
  userController.updateUser
);

router.delete('/admin/:id', authorize('ADMIN'), userController.deleteUser);

router.post(
  '/admin/:id/plan',
  authorize('ADMIN'),
  [body('planId').notEmpty().withMessage('Plano é obrigatório.')],
  validate,
  userController.assignPlan
);

router.delete('/admin/:id/plan', authorize('ADMIN'), userController.removePlan);

module.exports = router;

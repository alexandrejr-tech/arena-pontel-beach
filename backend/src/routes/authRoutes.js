const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Nome é obrigatório.'),
    body('email').isEmail().withMessage('Email inválido.'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres.'),
    body('cpf').trim().notEmpty().withMessage('CPF é obrigatório.'),
  ],
  validate,
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido.'),
    body('password').notEmpty().withMessage('Senha é obrigatória.'),
  ],
  validate,
  authController.login
);

router.post('/refresh-token', authController.refreshToken);

router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Email inválido.')],
  validate,
  authController.forgotPassword
);

router.post(
  '/reset-password/:token',
  [body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres.')],
  validate,
  authController.resetPassword
);

router.get('/me', authenticate, authController.getMe);

module.exports = router;

const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const contactController = require('../controllers/contactController');

const router = Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Nome é obrigatório.'),
    body('email').isEmail().withMessage('Email inválido.'),
    body('message').trim().notEmpty().withMessage('Mensagem é obrigatória.'),
  ],
  validate,
  contactController.sendMessage
);

module.exports = router;

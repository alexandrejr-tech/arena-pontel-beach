const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const planController = require('../controllers/planController');

const router = Router();

router.get('/', planController.getAll);
router.get('/:id', planController.getById);

router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  [
    body('name').trim().notEmpty().withMessage('Nome é obrigatório.'),
    body('description').trim().notEmpty().withMessage('Descrição é obrigatória.'),
    body('price').isFloat({ min: 0 }).withMessage('Preço inválido.'),
    body('duration').isInt({ min: 1 }).withMessage('Duração inválida.'),
    body('benefits').isArray().withMessage('Benefícios devem ser uma lista.'),
  ],
  validate,
  planController.create
);

router.put('/:id', authenticate, authorize('ADMIN'), planController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), planController.remove);

module.exports = router;

const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const subscriptionController = require('../controllers/subscriptionController');

const router = Router();

router.use(authenticate);

router.get('/my-subscription', subscriptionController.getMySubscription);

router.post(
  '/subscribe',
  [body('planId').notEmpty().withMessage('ID do plano é obrigatório.')],
  validate,
  subscriptionController.subscribe
);

router.put('/cancel', subscriptionController.cancelSubscription);

module.exports = router;

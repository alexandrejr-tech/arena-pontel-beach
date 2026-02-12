const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const bookingController = require('../controllers/bookingController');

const router = Router();

// Rota pública - agenda visível para todos
router.get('/public/schedule', bookingController.getPublicSchedule);

// Rotas autenticadas
router.use(authenticate);

router.get('/', bookingController.getUserBookings);
router.get('/available', bookingController.getAvailableSlots);

router.post(
  '/',
  [
    body('courtType').isIn(['FUTEVOLEI', 'BEACH_TENNIS', 'LOCACAO', 'EVENTO']).withMessage('Tipo de quadra inválido.'),
    body('date').isISO8601().withMessage('Data inválida.'),
    body('startTime').matches(/^\d{2}:\d{2}$/).withMessage('Horário de início inválido.'),
    body('endTime').matches(/^\d{2}:\d{2}$/).withMessage('Horário de término inválido.'),
  ],
  validate,
  bookingController.createBooking
);

router.delete('/:id', bookingController.cancelBooking);
router.get('/admin/all', authorize('ADMIN'), bookingController.getAllBookings);

module.exports = router;

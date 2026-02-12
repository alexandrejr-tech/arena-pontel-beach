const { Router } = require('express');

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const planRoutes = require('./planRoutes');
const bookingRoutes = require('./bookingRoutes');
const subscriptionRoutes = require('./subscriptionRoutes');
const contactRoutes = require('./contactRoutes');
const galleryRoutes = require('./galleryRoutes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/plans', planRoutes);
router.use('/bookings', bookingRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/contact', contactRoutes);
router.use('/gallery', galleryRoutes);

module.exports = router;

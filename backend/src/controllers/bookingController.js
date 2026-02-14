const prisma = require('../config/database');
const { AppError } = require('../middleware/errorHandler');
const { sendEmail } = require('../config/email');
const { bookingConfirmationEmail } = require('../utils/emailTemplates');
const { formatDateBR } = require('../utils/helpers');

// Helper: converte "HH:MM" para minutos
const timeToMinutes = (time) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

// Helper: converte minutos para "HH:MM"
const minutesToTime = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

// Helper: verifica se slot conflita com bookings existentes
const isSlotConflicting = (startMins, endMins, existingBookings, courtType) => {
  return existingBookings.some((b) => {
    if (courtType && b.courtType !== courtType) return false;
    const bStart = timeToMinutes(b.startTime);
    const bEnd = timeToMinutes(b.endTime);
    // Verifica sobreposição
    return startMins < bEnd && endMins > bStart;
  });
};

// Duração em minutos por tipo de quadra
const SLOT_DURATION = {
  FUTEVOLEI: 60,
  BEACH_TENNIS: 60,
  LOCACAO: 90, // 1h30
  EVENTO: 60,
};

exports.getUserBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const where = { userId: req.user.id };
    if (status) where.status = status;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.booking.count({ where }),
    ]);

    res.json({
      success: true,
      data: bookings,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

exports.getAvailableSlots = async (req, res, next) => {
  try {
    const { date, courtType } = req.query;
    if (!date) throw new AppError('Data é obrigatória.', 400);

    const queryDate = new Date(date);
    const dayOfWeek = queryDate.getDay();

    let openHour = 6, closeHour = 22;
    if (dayOfWeek === 6) { openHour = 7; closeHour = 20; }
    if (dayOfWeek === 0) { openHour = 7; closeHour = 18; }

    const existingBookings = await prisma.booking.findMany({
      where: {
        date: queryDate,
        status: 'CONFIRMED',
      },
      select: { startTime: true, endTime: true, courtType: true },
    });

    const duration = courtType ? SLOT_DURATION[courtType] || 60 : 60;
    const step = courtType === 'LOCACAO' ? 30 : 60; // Para locação, incremento de 30min
    const allSlots = [];
    const openMins = openHour * 60;
    const closeMins = closeHour * 60;

    for (let startMins = openMins; startMins + duration <= closeMins; startMins += step) {
      const endMins = startMins + duration;
      const startTime = minutesToTime(startMins);
      const endTime = minutesToTime(endMins);
      const isBooked = isSlotConflicting(startMins, endMins, existingBookings, courtType);
      allSlots.push({ startTime, endTime, available: !isBooked, duration });
    }

    res.json({ success: true, data: allSlots });
  } catch (error) {
    next(error);
  }
};

exports.createBooking = async (req, res, next) => {
  try {
    const { courtType, date, startTime, endTime } = req.body;

    const bookingDate = new Date(date);
    const today = new Date();
    const todayDate = new Date(today);
    todayDate.setHours(0, 0, 0, 0);
    if (bookingDate < todayDate) {
      throw new AppError('Não é possível agendar em datas passadas.', 400);
    }

    // Se for hoje, bloqueia horários que já passaram
    const startMins = timeToMinutes(startTime);
    if (bookingDate.getTime() === todayDate.getTime()) {
      const nowMins = today.getHours() * 60 + today.getMinutes();
      if (startMins <= nowMins) {
        throw new AppError('Este horário já passou.', 400);
      }
    }

    // Verifica conflito considerando sobreposição de horários
    const endMins = timeToMinutes(endTime);

    const existingBookings = await prisma.booking.findMany({
      where: {
        courtType,
        date: bookingDate,
        status: 'CONFIRMED',
      },
      select: { startTime: true, endTime: true },
    });

    const hasConflict = existingBookings.some((b) => {
      const bStart = timeToMinutes(b.startTime);
      const bEnd = timeToMinutes(b.endTime);
      return startMins < bEnd && endMins > bStart;
    });

    if (hasConflict) {
      throw new AppError('Este horário já está reservado.', 409);
    }

    const booking = await prisma.booking.create({
      data: { userId: req.user.id, courtType, date: bookingDate, startTime, endTime },
    });

    try {
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      await sendEmail({
        to: user.email,
        subject: 'Agendamento Confirmado - Arena Pontel Beach',
        html: bookingConfirmationEmail(user.name, {
          courtType,
          date: formatDateBR(bookingDate),
          startTime,
          endTime,
        }),
      });
    } catch (emailErr) {
      console.error('Erro ao enviar email de confirmação:', emailErr.message);
    }

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });

    if (!booking) throw new AppError('Agendamento não encontrado.', 404);
    if (booking.userId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new AppError('Acesso não autorizado.', 403);
    }
    if (booking.status !== 'CONFIRMED') {
      throw new AppError('Este agendamento não pode ser cancelado.', 400);
    }

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// Rota pública para visualizar agenda
exports.getPublicSchedule = async (req, res, next) => {
  try {
    const { date, courtType } = req.query;
    if (!date) throw new AppError('Data é obrigatória.', 400);

    const queryDate = new Date(date);
    const dayOfWeek = queryDate.getDay();

    let openHour = 6, closeHour = 22;
    if (dayOfWeek === 6) { openHour = 7; closeHour = 20; }
    if (dayOfWeek === 0) { openHour = 7; closeHour = 18; }

    const existingBookings = await prisma.booking.findMany({
      where: {
        date: queryDate,
        status: 'CONFIRMED',
      },
      select: { startTime: true, endTime: true, courtType: true },
    });

    const duration = courtType ? SLOT_DURATION[courtType] || 60 : 60;
    const step = courtType === 'LOCACAO' ? 30 : 60;
    const allSlots = [];
    const openMins = openHour * 60;
    const closeMins = closeHour * 60;

    // Verifica se é hoje para filtrar horários passados
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const isToday = date === todayStr;
    const nowMins = now.getHours() * 60 + now.getMinutes();

    for (let startMins = openMins; startMins + duration <= closeMins; startMins += step) {
      const endMins = startMins + duration;
      const startTime = minutesToTime(startMins);
      const endTime = minutesToTime(endMins);

      // Se for hoje, marca horários passados como indisponíveis
      const isPast = isToday && startMins <= nowMins;

      // Verifica se está ocupado para cada tipo de quadra
      const bookedTypes = [];
      for (const b of existingBookings) {
        const bStart = timeToMinutes(b.startTime);
        const bEnd = timeToMinutes(b.endTime);
        if (startMins < bEnd && endMins > bStart) {
          if (!bookedTypes.includes(b.courtType)) {
            bookedTypes.push(b.courtType);
          }
        }
      }

      const available = isPast ? false : courtType
        ? !isSlotConflicting(startMins, endMins, existingBookings, courtType)
        : bookedTypes.length === 0;

      allSlots.push({
        startTime,
        endTime,
        available,
        bookedFor: isPast ? ['PAST'] : bookedTypes,
        duration
      });
    }

    res.json({ success: true, data: allSlots, openHour, closeHour, duration });
  } catch (error) {
    next(error);
  }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, courtType, date } = req.query;
    const where = {};
    if (status) where.status = status;
    if (courtType) where.courtType = courtType;
    if (date) where.date = new Date(date);

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { date: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.booking.count({ where }),
    ]);

    res.json({
      success: true,
      data: bookings,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

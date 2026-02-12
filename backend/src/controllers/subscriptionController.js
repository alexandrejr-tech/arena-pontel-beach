const prisma = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

exports.getMySubscription = async (req, res, next) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id },
      include: { plan: true },
    });

    res.json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

exports.subscribe = async (req, res, next) => {
  try {
    const { planId } = req.body;

    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan || !plan.active) {
      throw new AppError('Plano não encontrado ou inativo.', 404);
    }

    const existing = await prisma.subscription.findUnique({ where: { userId: req.user.id } });
    if (existing && existing.status === 'ACTIVE') {
      throw new AppError('Você já possui uma assinatura ativa. Cancele-a primeiro.', 400);
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    const data = { userId: req.user.id, planId, startDate, endDate, status: 'ACTIVE' };

    let subscription;
    if (existing) {
      subscription = await prisma.subscription.update({
        where: { userId: req.user.id },
        data,
        include: { plan: true },
      });
    } else {
      subscription = await prisma.subscription.create({
        data,
        include: { plan: true },
      });
    }

    res.status(201).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

exports.cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await prisma.subscription.findUnique({ where: { userId: req.user.id } });

    if (!subscription || subscription.status !== 'ACTIVE') {
      throw new AppError('Nenhuma assinatura ativa encontrada.', 404);
    }

    const updated = await prisma.subscription.update({
      where: { userId: req.user.id },
      data: { status: 'CANCELLED' },
      include: { plan: true },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

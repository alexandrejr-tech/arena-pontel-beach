const prisma = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

exports.getAll = async (req, res, next) => {
  try {
    const plans = await prisma.plan.findMany({
      where: { active: true },
      orderBy: { price: 'asc' },
    });
    res.json({ success: true, data: plans });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const plan = await prisma.plan.findUnique({ where: { id: req.params.id } });
    if (!plan) throw new AppError('Plano não encontrado.', 404);
    res.json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, description, price, duration, benefits } = req.body;
    const plan = await prisma.plan.create({
      data: { name, description, price: parseFloat(price), duration: parseInt(duration), benefits },
    });
    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, description, price, duration, benefits, active } = req.body;
    const plan = await prisma.plan.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(duration !== undefined && { duration: parseInt(duration) }),
        ...(benefits && { benefits }),
        ...(active !== undefined && { active }),
      },
    });
    res.json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await prisma.plan.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: { message: 'Plano removido com sucesso.' } });
  } catch (error) {
    next(error);
  }
};

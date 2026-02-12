const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, cpf: true, phone: true, avatar: true, role: true, createdAt: true },
    });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, phone },
      select: { id: true, name: true, email: true, cpf: true, phone: true, avatar: true, role: true },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new AppError('Senha atual incorreta.', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.json({ success: true, data: { message: 'Senha alterada com sucesso.' } });
  } catch (error) {
    next(error);
  }
};

exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('Nenhum arquivo enviado.', 400);
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar: avatarUrl },
      select: { id: true, name: true, email: true, avatar: true },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// Admin: Listar todos os usuários
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const where = { role: 'USER' };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: search } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          cpf: true,
          phone: true,
          createdAt: true,
          subscription: {
            include: { plan: { select: { name: true } } }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Criar usuário
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, cpf, phone, password } = req.body;

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) throw new AppError('Email já cadastrado.', 400);

    const existingCpf = await prisma.user.findUnique({ where: { cpf } });
    if (existingCpf) throw new AppError('CPF já cadastrado.', 400);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, cpf, phone, password: hashedPassword, role: 'USER' },
      select: { id: true, name: true, email: true, cpf: true, phone: true, createdAt: true },
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// Admin: Atualizar usuário
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, cpf, phone, password } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.role !== 'USER') {
      throw new AppError('Usuário não encontrado.', 404);
    }

    if (email && email !== user.email) {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) throw new AppError('Email já cadastrado.', 400);
    }

    if (cpf && cpf !== user.cpf) {
      const existingCpf = await prisma.user.findUnique({ where: { cpf } });
      if (existingCpf) throw new AppError('CPF já cadastrado.', 400);
    }

    const updateData = { name, email, cpf, phone };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, cpf: true, phone: true, createdAt: true },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// Admin: Excluir usuário
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.role !== 'USER') {
      throw new AppError('Usuário não encontrado.', 404);
    }

    // Delete related records first
    await prisma.booking.deleteMany({ where: { userId: id } });
    await prisma.subscription.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });

    res.json({ success: true, data: { message: 'Usuário excluído com sucesso.' } });
  } catch (error) {
    next(error);
  }
};

// Admin: Atribuir plano ao usuário
exports.assignPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { planId } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.role !== 'USER') {
      throw new AppError('Usuário não encontrado.', 404);
    }

    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan || !plan.active) {
      throw new AppError('Plano não encontrado ou inativo.', 404);
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    const existing = await prisma.subscription.findUnique({ where: { userId: id } });

    let subscription;
    if (existing) {
      subscription = await prisma.subscription.update({
        where: { userId: id },
        data: { planId, startDate, endDate, status: 'ACTIVE' },
        include: { plan: true },
      });
    } else {
      subscription = await prisma.subscription.create({
        data: { userId: id, planId, startDate, endDate, status: 'ACTIVE' },
        include: { plan: true },
      });
    }

    res.json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

// Admin: Remover plano do usuário
exports.removePlan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const subscription = await prisma.subscription.findUnique({ where: { userId: id } });
    if (!subscription) {
      throw new AppError('Usuário não possui plano.', 404);
    }

    await prisma.subscription.delete({ where: { userId: id } });

    res.json({ success: true, data: { message: 'Plano removido com sucesso.' } });
  } catch (error) {
    next(error);
  }
};

// Admin: Estatísticas do dashboard
exports.getAdminStats = async (_req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalUsers,
      todayBookings,
      activeSubscriptions,
      recentUsers,
      recentBookings
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.booking.count({ where: { date: { gte: today, lt: tomorrow }, status: 'CONFIRMED' } }),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.user.findMany({
        where: { role: 'USER' },
        select: { id: true, name: true, email: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.booking.findMany({
        where: { status: 'CONFIRMED' },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        todayBookings,
        activeSubscriptions,
        recentUsers,
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

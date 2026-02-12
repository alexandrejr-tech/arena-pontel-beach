const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const { AppError } = require('../middleware/errorHandler');
const { validateCPF, generateToken } = require('../utils/helpers');
const { sendEmail } = require('../config/email');
const { welcomeEmail, passwordResetEmail } = require('../utils/emailTemplates');

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
  return { accessToken, refreshToken };
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, cpf, phone } = req.body;

    const cleanCPF = cpf.replace(/\D/g, '');
    if (!validateCPF(cleanCPF)) {
      throw new AppError('CPF inválido.', 400);
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { cpf: cleanCPF }] },
    });
    if (existingUser) {
      throw new AppError('Email ou CPF já cadastrado.', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, cpf: cleanCPF, phone },
      select: { id: true, name: true, email: true, role: true },
    });

    const { accessToken, refreshToken } = generateTokens(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    try {
      await sendEmail({ to: email, subject: 'Bem-vindo à Arena Pontel Beach!', html: welcomeEmail(name) });
    } catch (emailErr) {
      console.error('Erro ao enviar email de boas-vindas:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      data: { user, accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('Email ou senha incorretos.', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Email ou senha incorretos.', 401);
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.json({
      success: true,
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError('Refresh token não fornecido.', 400);
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.refreshToken !== refreshToken) {
      throw new AppError('Refresh token inválido.', 401);
    }

    const tokens = generateTokens(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    res.json({ success: true, data: tokens });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.json({ success: true, data: { message: 'Se o email existir, enviaremos um link de recuperação.' } });
    }

    const resetToken = generateToken();
    const resetTokenExp = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExp },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/resetar-senha/${resetToken}`;

    await sendEmail({
      to: email,
      subject: 'Redefinição de Senha - Arena Pontel Beach',
      html: passwordResetEmail(user.name, resetUrl),
    });

    res.json({ success: true, data: { message: 'Se o email existir, enviaremos um link de recuperação.' } });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await prisma.user.findFirst({
      where: { resetToken: token, resetTokenExp: { gte: new Date() } },
    });

    if (!user) {
      throw new AppError('Token inválido ou expirado.', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null, resetTokenExp: null },
    });

    res.json({ success: true, data: { message: 'Senha redefinida com sucesso.' } });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
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

const prisma = require('../config/database');
const { AppError } = require('../middleware/errorHandler');
const fs = require('fs');
const path = require('path');

exports.getAll = async (req, res, next) => {
  try {
    const { category } = req.query;
    const where = category ? { category } : {};

    const images = await prisma.gallery.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: images });
  } catch (error) {
    next(error);
  }
};

exports.upload = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('Nenhum arquivo enviado.', 400);
    }

    const { description, category } = req.body;
    const imageUrl = `/uploads/gallery/${req.file.filename}`;

    const image = await prisma.gallery.create({
      data: { imageUrl, description, category },
    });

    res.status(201).json({ success: true, data: image });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const image = await prisma.gallery.findUnique({ where: { id: req.params.id } });
    if (!image) throw new AppError('Imagem não encontrada.', 404);

    const filePath = path.resolve(__dirname, '..', '..', image.imageUrl.replace(/^\//, ''));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.gallery.delete({ where: { id: req.params.id } });

    res.json({ success: true, data: { message: 'Imagem removida com sucesso.' } });
  } catch (error) {
    next(error);
  }
};

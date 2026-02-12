const prisma = require('../config/database');
const { sendEmail } = require('../config/email');

exports.sendMessage = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    const contact = await prisma.contact.create({
      data: { name, email, phone, message },
    });

    try {
      await sendEmail({
        to: process.env.SMTP_USER,
        subject: `Nova mensagem de contato - ${name}`,
        html: `
          <h2>Nova mensagem de contato</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefone:</strong> ${phone || 'Não informado'}</p>
          <p><strong>Mensagem:</strong></p>
          <p>${message}</p>
        `,
      });
    } catch (emailErr) {
      console.error('Erro ao enviar notificação de contato:', emailErr.message);
    }

    res.status(201).json({ success: true, data: { message: 'Mensagem enviada com sucesso!' } });
  } catch (error) {
    next(error);
  }
};

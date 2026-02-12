const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: #03A7D6; padding: 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
    .body { padding: 30px; color: #333333; line-height: 1.6; }
    .button { display: inline-block; padding: 14px 28px; background: #03A7D6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
    .footer { padding: 20px 30px; text-align: center; color: #999999; font-size: 12px; border-top: 1px solid #eeeeee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Arena Pontel Beach</h1>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>Arena Pontel Beach - A nova referencia em esportes de areia</p>
      <p>Rua Eleni Manga de Araujo Lalier, Campinas - SP</p>
    </div>
  </div>
</body>
</html>
`;

const welcomeEmail = (name) =>
  baseTemplate(`
    <h2>Bem-vindo(a), ${name}!</h2>
    <p>Sua conta na Arena Pontel Beach foi criada com sucesso.</p>
    <p>Agora voce pode agendar horarios, escolher planos e aproveitar tudo que temos a oferecer.</p>
    <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Acessar minha conta</a>
    <p>Qualquer duvida, entre em contato conosco.</p>
  `);

const passwordResetEmail = (name, resetUrl) =>
  baseTemplate(`
    <h2>Ola, ${name}</h2>
    <p>Recebemos uma solicitacao para redefinir sua senha.</p>
    <p>Clique no botao abaixo para criar uma nova senha:</p>
    <a href="${resetUrl}" class="button">Redefinir Senha</a>
    <p>Este link expira em 1 hora.</p>
    <p>Se voce nao solicitou a redefinicao, ignore este email.</p>
  `);

const bookingConfirmationEmail = (name, booking) =>
  baseTemplate(`
    <h2>Agendamento Confirmado!</h2>
    <p>Ola, ${name}! Seu agendamento foi confirmado:</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
      <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Modalidade:</td><td style="padding:8px;border-bottom:1px solid #eee;">${booking.courtType}</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Data:</td><td style="padding:8px;border-bottom:1px solid #eee;">${booking.date}</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Horario:</td><td style="padding:8px;border-bottom:1px solid #eee;">${booking.startTime} - ${booking.endTime}</td></tr>
    </table>
    <p>Nos vemos na arena!</p>
  `);

module.exports = { welcomeEmail, passwordResetEmail, bookingConfirmationEmail };

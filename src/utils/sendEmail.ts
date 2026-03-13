import nodemailer from 'nodemailer';

interface SendEmailOptions {
  subject: string;
  htmlBody: string;
}

export async function sendEmail({ subject, htmlBody }: SendEmailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true para 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // Tu App Password de Gmail
      },
    });

    // Configuración del correo, forzando tu dirección como destino único
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || 'stevengalocr@gmail.com', // Destino forzado para pruebas
      subject: `[GaloDev Contacto] ${subject}`,
      html: htmlBody,
    };

    // Enviar correo
    const info = await transporter.sendMail(mailOptions);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    return { success: false, error: 'Hubo un error al enviar el correo.' };
  }
}

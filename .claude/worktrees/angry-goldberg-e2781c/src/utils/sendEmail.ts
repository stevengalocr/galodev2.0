import nodemailer from 'nodemailer';

interface SendEmailOptions {
  subject: string;
  htmlBody: string;
}

export async function sendEmail({ subject, htmlBody }: SendEmailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: 465, // Forzado a 465 para Vercel
      secure: true, // Forzado a true para SSL (requerido en Vercel)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // Tu App Password de Gmail
      },
    });

    // Configuración del correo, forzando tu dirección como destino único
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || 'galodevcr@gmail.com', // Destino forzado
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

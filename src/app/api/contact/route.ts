import { NextResponse } from 'next/server';
import { sendEmail } from '@/utils/sendEmail';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Recibimos los datos del nuevo formulario de contacto
    const { nombre, email, telefono, propuesta } = body;

    // Validación básica de los campos requeridos en el nuevo componente
    if (!nombre || !email || !telefono || !propuesta) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Nueva Propuesta / Contacto: ${nombre}</h2>
        <p style="font-size: 16px;"><strong>👤 Nombre:</strong> ${nombre}</p>
        <p style="font-size: 16px;"><strong>✉️ Email:</strong> ${email}</p>
        <p style="font-size: 16px;"><strong>📱 Teléfono/WhatsApp:</strong> ${telefono}</p>
        
        <h3 style="margin-top: 25px; color: #1f2937;">Detalle de la Propuesta:</h3>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; font-size: 15px; line-height: 1.6; white-space: pre-wrap; border-left: 4px solid #2563eb;">
          ${propuesta}
        </div>
        
        <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #888; text-align: center;">Este correo es estrictamente confidencial y se generó desde el portal web de GaloDev.</p>
      </div>
    `;

    const result = await sendEmail({
      subject: `Nueva Propuesta Comercial: ${nombre}`,
      htmlBody,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Propuesta enviada con éxito' });
  } catch (error) {
    console.error('Error in contact route:', error);
    return NextResponse.json({ error: 'Petición inválida' }, { status: 400 });
  }
}

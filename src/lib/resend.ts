import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

export type EnviarConfirmacionParams = {
  runnerEmail: string;
  runnerName: string;
  raceTitle: string;
  distanceName: string;
  bibNumber: string;
  shirtSize: string;
  raceDate: string;
  raceLocation: string;
  ticketUrl: string;
};

export async function enviarCorreoConfirmacionBoleto(params: EnviarConfirmacionParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY no configurado, saltando envío de correo.");
    return { success: false, error: "RESEND_API_KEY no configurado" };
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || "Písale <onboarding@resend.dev>";

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Boleto Confirmado - Písale</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Container Principal -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #111827; border-radius: 24px; border: 1px solid #1f2937; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);" cellspacing="0" cellpadding="0">
          
          <!-- Header con Brand -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; text-align: center; background: linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(217, 70, 239, 0.15) 100%); border-bottom: 1px solid #1f2937;">
              <div style="display: inline-block; padding: 8px 16px; border-radius: 9999px; background: rgba(124, 58, 237, 0.15); border: 1px solid rgba(124, 58, 237, 0.3); margin-bottom: 16px;">
                <span style="font-size: 11px; font-weight: 800; color: #a78bfa; text-transform: uppercase; letter-spacing: 1.5px;">✓ Inscripción Oficial Confirmada</span>
              </div>
              <h1 style="margin: 0; font-size: 28px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">
                ¡Nos vemos en la meta, ${params.runnerName.split(" ")[0]}!
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #9ca3af;">
                Tu lugar en <strong style="color: #f3f4f6;">${params.raceTitle}</strong> está 100% asegurado.
              </p>
            </td>
          </tr>

          <!-- Tarjeta de Boleto (Pass) -->
          <tr>
            <td style="padding: 32px;">
              <table role="presentation" width="100%" style="background-color: #1f2937; border-radius: 18px; border: 1px solid #374151; overflow: hidden;" cellspacing="0" cellpadding="0">
                <!-- Nombre y Distancia -->
                <tr>
                  <td style="padding: 20px; border-bottom: 1px dashed #4b5563;">
                    <table role="presentation" width="100%">
                      <tr>
                        <td>
                          <span style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; display: block;">Evento</span>
                          <span style="font-size: 18px; font-weight: 900; color: #ffffff; display: block; margin-top: 2px;">${params.raceTitle}</span>
                        </td>
                        <td align="right">
                          <span style="display: inline-block; padding: 6px 14px; border-radius: 9999px; background: linear-gradient(135deg, #7c3aed 0%, #d946ef 100%); font-size: 12px; font-weight: 900; color: #ffffff;">
                            ${params.distanceName}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Datos Clave (Grid) -->
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" width="100%">
                      <tr>
                        <td width="50%" style="padding-bottom: 16px;">
                          <span style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; display: block;">Número de Folio</span>
                          <span style="font-size: 18px; font-weight: 900; color: #a78bfa; font-family: monospace; display: block; margin-top: 2px;">${params.bibNumber}</span>
                        </td>
                        <td width="50%" style="padding-bottom: 16px;">
                          <span style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; display: block;">Talla de Playera</span>
                          <span style="font-size: 18px; font-weight: 900; color: #ffffff; display: block; margin-top: 2px;">Talla ${params.shirtSize}</span>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%">
                          <span style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; display: block;">Fecha del Evento</span>
                          <span style="font-size: 13px; font-weight: 700; color: #f3f4f6; display: block; margin-top: 2px;">${params.raceDate}</span>
                        </td>
                        <td width="50%">
                          <span style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; display: block;">Sede / Ciudad</span>
                          <span style="font-size: 13px; font-weight: 700; color: #f3f4f6; display: block; margin-top: 2px;">${params.raceLocation}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Botón Ver Boleto con QR -->
              <table role="presentation" width="100%" style="margin-top: 28px;">
                <tr>
                  <td align="center">
                    <a href="${params.ticketUrl}" style="display: inline-block; padding: 16px 36px; border-radius: 14px; background: linear-gradient(135deg, #7c3aed 0%, #d946ef 50%, #f97316 100%); color: #ffffff; font-size: 14px; font-weight: 900; text-decoration: none; box-shadow: 0 10px 25px -5px rgba(217, 70, 239, 0.4); letter-spacing: 0.3px;">
                      Ver mi Boleto con Código QR →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Nota de entrega de kits -->
              <p style="margin: 24px 0 0 0; font-size: 12px; color: #9ca3af; text-align: center; line-height: 1.5;">
                💡 <strong>Importante:</strong> Muestra el código QR desde tu celular o impreso el día de la entrega de kits junto con tu identificación oficial.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #0f172a; border-top: 1px solid #1f2937; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748b;">
                Písale Marketplace Deportivo · Cronometraje, Inscripciones y Eventos Oficiales
              </p>
              <p style="margin: 6px 0 0 0; font-size: 10px; color: #475569;">
                Este correo fue enviado automáticamente como comprobante oficial de tu inscripción.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: params.runnerEmail,
      subject: `🎟️ Tu Boleto Oficial (${params.bibNumber}) - ${params.raceTitle}`,
      html: htmlContent,
    });

    if (result.error) {
      console.error("Resend API error:", result.error);
      return { success: false, error: result.error.message || "Error al enviar correo con Resend" };
    }

    console.log("Correo enviado con Resend exitosamente:", result.data);
    return { success: true, data: result.data };
  } catch (error: any) {
    console.error("Error enviando correo con Resend:", error);
    return { success: false, error: error?.message || "Error al enviar correo" };
  }
}

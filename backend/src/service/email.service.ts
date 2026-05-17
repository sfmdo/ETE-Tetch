import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

export class EmailService {
  private transporter;
  private colors = {
    primary: '#002542',
    onPrimary: '#ffffff',
    primaryContainer: '#1b3b5a',
    onPrimaryContainer: '#87a5ca',
    tertiary: '#ffba38',
    background: '#f2f4f5',
    surface: '#ffffff',
    textVariant: '#43474d'
  };

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendPickupNotification(orderData: any) {
    const { Order_Number, Client_Name, Client_Email, Brand_Model, Order_Total } = orderData;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; -webkit-text-size-adjust: 100%; }
          table { border-collapse: collapse; width: 100%; }
        </style>
      </head>
      <body style="background-color: ${this.colors.background}; padding: 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: ${this.colors.surface}; border-radius: 12px; overflow: hidden; border: 1px solid #e1e3e4;">
          
          <tr>
            <td style="background-color: ${this.colors.primaryContainer}; padding: 40px 30px; position: relative;">
              <div style="display: inline-block; padding: 4px 12px; background-color: rgba(255, 186, 56, 0.2); border-radius: 20px; margin-bottom: 15px;">
                <span style="color: ${this.colors.tertiary}; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                  ● Notificación de Servicio
                </span>
              </div>
              <h1 style="color: ${this.colors.onPrimary}; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">
                Listo para Recogida
              </h1>
              <p style="color: ${this.colors.onPrimaryContainer}; margin: 10px 0 0 0; font-size: 16px;">
                El mantenimiento de su equipo ha finalizado con éxito.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px;">
              <h2 style="color: ${this.colors.primary}; font-size: 20px; margin-top: 0;">Actualización de Servicio</h2>
              <p style="color: ${this.colors.textVariant}; line-height: 1.6; font-size: 15px;">
                Estimado(a) <strong>${Client_Name}</strong>,<br><br>
                Nos complace informarle que su equipo <strong>${Brand_Model}</strong> ha superado todas las pruebas de integridad y calibración de rendimiento. Ya puede pasar por él a nuestro centro logístico.
              </p>
              
              <div style="margin-top: 25px;">
                <a href="#" style="background-color: ${this.colors.primary}; color: ${this.colors.onPrimary}; padding: 12px 25px; text-decoration: none; font-weight: bold; font-size: 12px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
                  Ver Detalles de la Orden →
                </a>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table role="presentation" style="background-color: ${this.colors.primary}; border-radius: 10px; width: 100%;">
                <tr>
                  <td style="padding: 25px; color: ${this.colors.onPrimary};">
                    <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.7; margin: 0 0 15px 0; font-weight: bold;">
                      Resumen del Pedido
                    </p>
                    
                    <table role="presentation" style="width: 100%; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; margin-bottom: 15px;">
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <div style="font-size: 10px; opacity: 0.6; text-transform: uppercase;">Número de Orden</div>
                          <div style="font-size: 16px; font-weight: bold;">#${Order_Number}</div>
                        </td>
                        <td style="padding-bottom: 10px; text-align: right;">
                          <div style="font-size: 10px; opacity: 0.6; text-transform: uppercase;">Estado</div>
                          <div style="font-size: 16px; font-weight: bold; color: ${this.colors.tertiary};">Completado</div>
                        </td>
                      </tr>
                    </table>

                    <div>
                      <div style="font-size: 10px; opacity: 0.6; text-transform: uppercase;">Monto Total a Pagar</div>
                      <div style="font-size: 32px; font-weight: 900; margin-top: 5px;">$${Number(Order_Total).toFixed(2)}</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 30px; background-color: #f8fafb; border-top: 1px solid #eeeeee; text-align: center;">
              <p style="font-size: 11px; color: #999999; margin: 0;">
                ETE-Tech Architectural Hardware Management<br>
                Silicon Slate District, Suite 100
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    return await this.transporter.sendMail({
      from: `"ETE-Tech Support" <${process.env.EMAIL_USER}>`,
      to: Client_Email,
      subject: `✅ Equipo Listo para Entrega - Orden #${Order_Number}`,
      html: htmlContent,
    });
  }

  async sendTemporalPassword(email: string, temporalPassword: string) {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; -webkit-text-size-adjust: 100%; }
          table { border-collapse: collapse; width: 100%; }
        </style>
      </head>
      <body style="background-color: ${this.colors.background}; padding: 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: ${this.colors.surface}; border-radius: 12px; overflow: hidden; border: 1px solid #e1e3e4;">
          
          <tr>
            <td style="background-color: ${this.colors.primaryContainer}; padding: 40px 30px; position: relative;">
              <div style="display: inline-block; padding: 4px 12px; background-color: rgba(255, 186, 56, 0.2); border-radius: 20px; margin-bottom: 15px;">
                <span style="color: ${this.colors.tertiary}; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                  🔒 Seguridad de Acceso
                </span>
              </div>
              <h1 style="color: ${this.colors.onPrimary}; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">
                Clave Temporal
              </h1>
              <p style="color: ${this.colors.onPrimaryContainer}; margin: 10px 0 0 0; font-size: 16px;">
                Tu acceso de emergencia ha sido generado correctamente.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px;">
              <h2 style="color: ${this.colors.primary}; font-size: 20px; margin-top: 0;">Restablecer Contraseña</h2>
              <p style="color: ${this.colors.textVariant}; line-height: 1.6; font-size: 15px;">
                Hola,<br><br>
                Recibimos una solicitud para acceder a tu cuenta de ETE-Tech. Para ingresar de nuevo, utiliza la contraseña temporal que te proporcionamos en la parte de abajo. 
                <br><br>
                Una vez que logres iniciar sesión con éxito, recuerda cambiar esta clave en tu menú de configuración por una contraseña segura y definitiva.
              </p>
              
              <div style="margin-top: 25px;">
                <a href="#" style="background-color: ${this.colors.primary}; color: ${this.colors.onPrimary}; padding: 12px 25px; text-decoration: none; font-weight: bold; font-size: 12px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
                  Ir a Iniciar Sesión →
                </a>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table role="presentation" style="background-color: ${this.colors.primary}; border-radius: 10px; width: 100%;">
                <tr>
                  <td style="padding: 25px; color: ${this.colors.onPrimary};">
                    <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.7; margin: 0 0 12px 0; font-weight: bold;">
                      Tu contraseña temporal es:
                    </p>
                    
                    <div style="background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); padding: 18px 15px; border-radius: 6px; font-family: Consolas, 'Courier New', monospace; font-size: 22px; font-weight: bold; text-align: center; letter-spacing: 2px; color: ${this.colors.onPrimary}; margin-bottom: 12px;">
                      ${temporalPassword}
                    </div>

                    <p style="font-size: 11px; opacity: 0.7; line-height: 1.5; margin: 0;">
                      * Nota: Esta clave es de un solo uso y expirará si no la utilizas pronto. Asegúrate de cambiarla en la configuración de tu perfil.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 30px; background-color: #f8fafb; border-top: 1px solid #eeeeee; text-align: center;">
              <p style="font-size: 11px; color: #999999; margin: 0;">
                ETE-Tech Architectural Hardware Management<br>
                Soporte de Sistemas de Seguridad
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    return await this.transporter.sendMail({
      from: `"ETE-Tech Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🔑 Acceso Temporal a tu cuenta - ETE-Tech`,
      html: htmlContent,
    });
  }
}
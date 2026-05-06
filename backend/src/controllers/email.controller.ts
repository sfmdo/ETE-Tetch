import { Request, Response } from 'express';
import { EmailService } from '../service/email.service';
import userService from '../service/user.service';
import crypto from 'crypto';

const correoService = new EmailService();

const generarPasswordTemporal = (longitud = 10): string => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$*';
  let password = '';
  for (let i = 0; i < longitud; i++) {
    const randomIndex = crypto.randomInt(0, caracteres.length);
    password += caracteres[randomIndex];
  }
  return password;
};

export const enviarAvisoCliente = async (req: Request, res: Response) => {
  try {
    const datosOrden = req.body;

    if (!datosOrden.Order_Number) {
      return res.status(400).json({ ok: false, msg: 'Falta el número de orden' });
    }

    await correoService.sendPickupNotification(datosOrden);

    return res.json({ ok: true, msg: 'Correo enviado con éxito' });
  } catch (error) {
    console.error('Error en enviarAvisoCliente:', error);
    return res.status(500).json({ ok: false, msg: 'Error al procesar el envío' });
  }
};

export const enviarClaveTemporal = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ ok: false, msg: 'Falta el correo electrónico (email)' });
    }

    const usuarioExistente = await userService.findByEmail(email);
    if (!usuarioExistente) {
      return res.status(404).json({ ok: false, msg: 'No existe ningún usuario registrado con este correo' });
    }

    const temporalPassword = generarPasswordTemporal(10);

    const actualizado = await userService.updatePasswordByEmail(email, temporalPassword);
    
    if (!actualizado) {
      return res.status(500).json({ ok: false, msg: 'No se pudo actualizar la contraseña en el sistema' });
    }

    await correoService.sendTemporalPassword(email, temporalPassword);

    return res.json({ 
      ok: true, 
      msg: 'Se ha generado una nueva contraseña temporal y se ha enviado al correo electrónico proporcionado.' 
    });
  } catch (error) {
    console.error('Error en enviarClaveTemporal:', error);
    return res.status(500).json({ ok: false, msg: 'Error al procesar el restablecimiento de contraseña' });
  }
};

export default enviarAvisoCliente;
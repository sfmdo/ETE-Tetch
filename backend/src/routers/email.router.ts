import { Router } from 'express';
import { enviarAvisoCliente, enviarClaveTemporal } from '../../src/controllers/email.controller'
import { verifyToken } from '../../src/middleware/auth.middleware';

const router = Router();

router.post('/send-notification', verifyToken, enviarAvisoCliente);

router.post('/reset-password', enviarClaveTemporal);

export default router;
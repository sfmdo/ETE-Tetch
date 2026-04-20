import { Router } from 'express';
import OrderController from '../controllers/order.controller';
import { verifyToken } from '../middleware/auth.middleware'

const router = Router();

router.use(verifyToken);

// Rutas de Órdenes (Logística)
router.post('/', OrderController.createInitialOrder);        // Recepción
router.post('/add-items', OrderController.addItemsToOrder); // Agregar piezas
router.put('/:id/diagnosis', OrderController.finishDiagnosis); // Diagnóstico técnico
router.patch('/:id/status', OrderController.updateStatus);    // Cambios manuales de estado

// Rutas de Pagos (Finanzas - Nuevo Controlador)
//router.post('/payments/paypal/create', PaymentController.createPaypalOrder);
//router.post('/payments/paypal/capture', PaymentController.capturePaypalOrder);

export default router;
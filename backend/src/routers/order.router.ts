import { Router } from 'express';
import OrderController from '../controllers/order.controller';
import { verifyToken } from '../middleware/auth.middleware'
import * as PayPal from '../controllers/paypal.controller';

const router = Router();

router.use(verifyToken);

router.get('/get-all', OrderController.getAllOrders);               // Lista general (Dashboard)
router.get('/:id', OrderController.getOrderById);      // Cabecera básica
router.get('/:id/full', OrderController.getFullOrderDetails); // Detalle completo + Productos

// Rutas de Órdenes (Logística)
router.post('/', OrderController.createInitialOrder);        // Recepción
router.post('/add-items', OrderController.addItemsToOrder); // Agregar piezas
router.put('/:id/diagnosis', OrderController.finishDiagnosis); // Diagnóstico técnico
router.patch('/:id/status', OrderController.updateStatus);    // Cambios manuales de estado
router.post('/create-order',PayPal.createPaypalOrder); // conexion con Paypal.
router.post('/capture-order',PayPal.capturePaypalOrder); // guardar la orden de Paypal.
router.post('/:id/pay', OrderController.payOrder); // Cambiar el pending balance de la orden
router.get('/client/:clientId', OrderController.getClientOrders); //Obtener todas las ordenes de un solo cliente

// Rutas de Pagos (Finanzas - Nuevo Controlador)
router.post('/paypal/create', PayPal.createPaypalOrder);
router.post('/paypal/capture', PayPal.capturePaypalOrder);

export default router;
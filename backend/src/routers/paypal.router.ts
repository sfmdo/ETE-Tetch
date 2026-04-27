import { Router } from 'express';
import { createPaypalOrder, capturePaypalOrder } from '../controllers/paypal.controller';

const router = Router();

router.post('/create-order', createPaypalOrder);
router.post('/capture-order', capturePaypalOrder);

export default router;

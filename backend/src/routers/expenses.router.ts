import { Router } from 'express';
import ExpenseController from '../../src/controllers/expense.controller'
import { verifyToken } from '../../src/middleware/auth.middleware';

const router = Router();

router.use(verifyToken);

router.get('/', ExpenseController.listAll);
router.get('/:id', ExpenseController.getDetail);
router.post('/', ExpenseController.create);
router.delete('/:id', ExpenseController.remove);

export default router;
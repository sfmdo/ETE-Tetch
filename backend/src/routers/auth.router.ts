import { Router } from 'express';
import authController from '../controllers/auth.controller';
const router = Router();

// POST: http://localhost:3000/api/auth/register
router.post('/register', authController.register);

// POST: http://localhost:3000/api/auth/login
router.post('/login', authController.login);

export default router;
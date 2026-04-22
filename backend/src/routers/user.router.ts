import { Router } from 'express';
import userController from '../controllers/user.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

router.use(verifyToken);

// GET: http://localhost:3000/api/users/profile
router.get('/profile', userController.getProfile);

// PATCH: http://localhost:3000/api/users/profile
router.patch('/profile', userController.updateProfile);

export default router;
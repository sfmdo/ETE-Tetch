import { Router } from 'express';
import ProductController from '../controllers/product_services.controller';
import { verifyToken } from '../middleware/auth.middleware'

const router = Router();

router.get('/all', ProductController.getAll);        // GET /api/products/all
router.get('/only-products', ProductController.getProducts); // GET /api/products/only-products
router.get('/only-services', ProductController.getServices); // GET /api/products/only-services

router.use(verifyToken);

router.post('/', ProductController.create);          // POST /api/products
router.put('/:id', ProductController.update);       // PUT /api/products/10
router.delete('/:id', ProductController.delete);    // DELETE /api/products/10

export default router;
import { Router } from 'express';
import { createProduct, listProducts } from '../controllers/productController.js';
import { auth, authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/', auth, listProducts);
router.post('/', auth, authorize('admin', 'encargado'), createProduct);

export default router;

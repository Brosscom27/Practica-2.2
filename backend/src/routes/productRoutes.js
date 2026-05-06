import { Router } from 'express';
import { createProduct, listProducts, updateProduct, deleteProduct } from '../controllers/productController.js';
import { auth, authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/', auth, listProducts);
router.post('/', auth, authorize('admin', 'encargado'), createProduct);
router.put('/:id', auth, authorize('admin', 'encargado'), updateProduct);
router.delete('/:id', auth, authorize('admin'), deleteProduct);

export default router;

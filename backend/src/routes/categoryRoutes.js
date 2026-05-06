import { Router } from 'express';
import { createCategory, listCategories, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { auth, authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/', auth, listCategories);
router.post('/', auth, authorize('admin', 'encargado'), createCategory);
router.put('/:id', auth, authorize('admin', 'encargado'), updateCategory);
router.delete('/:id', auth, authorize('admin', 'encargado'), deleteCategory);

export default router;

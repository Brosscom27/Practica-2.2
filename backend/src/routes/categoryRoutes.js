import { Router } from 'express';
import { createCategory, listCategories } from '../controllers/categoryController.js';
import { auth, authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/', auth, listCategories);
router.post('/', auth, authorize('admin', 'encargado'), createCategory);

export default router;

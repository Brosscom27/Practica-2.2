import { Router } from 'express';
import { createWarehouse, listWarehouses, updateWarehouse, deleteWarehouse } from '../controllers/warehouseController.js';
import { auth, authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/', auth, listWarehouses);
router.post('/', auth, authorize('admin', 'encargado'), createWarehouse);
router.put('/:id', auth, authorize('admin', 'encargado'), updateWarehouse);
router.delete('/:id', auth, authorize('admin'), deleteWarehouse);

export default router;

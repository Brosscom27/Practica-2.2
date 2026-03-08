import { Router } from 'express';
import { createWarehouse, listWarehouses } from '../controllers/warehouseController.js';
import { auth, authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/', auth, listWarehouses);
router.post('/', auth, authorize('admin', 'encargado'), createWarehouse);

export default router;

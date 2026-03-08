import { Router } from 'express';
import { lowStockReport, movementsReport, stockReport } from '../controllers/reportController.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

router.get('/stock', auth, stockReport);
router.get('/low-stock', auth, lowStockReport);
router.get('/movements', auth, movementsReport);

export default router;

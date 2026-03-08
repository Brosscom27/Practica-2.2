import { Router } from 'express';
import { createMovement, movementHistory } from '../controllers/movementController.js';
import { auth, authorize } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { movementValidator } from '../validators/movementValidators.js';

const router = Router();

router.get('/', auth, movementHistory);
router.post('/', auth, authorize('admin', 'encargado'), movementValidator, validateRequest, createMovement);

export default router;

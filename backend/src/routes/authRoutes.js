import { Router } from 'express';
import { login, register } from '../controllers/authController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { loginValidator, registerValidator } from '../validators/authValidators.js';

const router = Router();

router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);

export default router;

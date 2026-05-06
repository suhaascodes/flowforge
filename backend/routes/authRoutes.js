import { Router } from 'express';
import { register, login, logout, validateToken } from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';
import { loginValidators, registerValidators } from '../validators/authValidators.js';

const router = Router();

router.post('/register', ...registerValidators, register);
router.post('/login', ...loginValidators, login);
router.get('/validate', authenticate, validateToken);
router.post('/logout', authenticate, logout);

export default router;
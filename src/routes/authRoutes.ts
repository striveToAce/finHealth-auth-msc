import { Router } from 'express';
import { signup, login, refreshToken, profileInfo } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateLogin, validateSignup } from '../validators/auth';
import { validateRequest } from '../middlewares/validateRequest';

const router = Router();

router.post('/signup',validateSignup,validateRequest, signup);
router.post('/login',validateLogin,validateRequest, login);
router.post('/refreshToken',refreshToken)
router.post('/profileInfo',authMiddleware,profileInfo)

export { router as authRoutes };
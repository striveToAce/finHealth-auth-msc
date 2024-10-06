import { Router } from 'express';
import { signup, login, refreshToken } from '../controllers/authController';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refreshToken',refreshToken)

export { router as authRoutes };
import express from 'express';
import { login, refresh, getMe, logout, changePassword } from '../controller/authController.js';
import { verifyToken } from '../middleware/auth.js';
import { validate, loginSchema, changePasswordSchema } from '../validator/authValidator.js';

const router = express.Router();

router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.get('/me', verifyToken, getMe);
router.post('/logout', verifyToken, logout);
router.put('/change-password', verifyToken, validate(changePasswordSchema), changePassword);

export default router;

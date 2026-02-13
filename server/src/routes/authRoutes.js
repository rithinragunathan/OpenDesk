import { Router } from 'express';
import { googleSignIn, login, register } from '../controllers/authController.js';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/google', googleSignIn);

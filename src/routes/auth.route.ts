import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';

const authRouter = Router();
authRouter.get('/login', login);
authRouter.post('/register', register)

export default authRouter;
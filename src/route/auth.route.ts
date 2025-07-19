import { Router } from 'express';
import { AuthController } from '../controller/auth.controller';

const authRouter = Router();
authRouter.post('/register', AuthController.register)

export default authRouter;
import { UserController } from './../controller/user-controller';
import { Router } from 'express';

const userRouter = Router();
userRouter.post('/', UserController.create)
userRouter.patch('/', UserController.update)
userRouter.get('/', UserController.getUsers)

export default userRouter;
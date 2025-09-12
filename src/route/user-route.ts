import { UserController } from './../controller/user-controller';
import { Router } from 'express';

const userRouter = Router();
userRouter.post('/', UserController.create)
userRouter.get('/', UserController.getList)

export default userRouter;
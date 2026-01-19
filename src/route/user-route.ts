import { UserController } from "./../controller/user-controller";
import { Router } from "express";

const userRouter = Router();
userRouter.get("/", UserController.getList);
userRouter.get("/:id", UserController.findById);

export default userRouter;

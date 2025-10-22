import { UserController } from "./../controller/user-controller";
import { Router } from "express";

const userRouter = Router();
userRouter.post("/", UserController.create);
userRouter.get("/", UserController.getList);
userRouter.get("/:id", UserController.findById);
userRouter.delete("/:id", UserController.delete);
userRouter.patch("/", UserController.update);

export default userRouter;

import { adminAuth, userAuth } from "../middleware/auth-middleware";
import { UserController } from "./../controller/user-controller";
import { Router } from "express";

const userRouter = Router();
userRouter.get("/admin/users/", adminAuth, UserController.getList);
userRouter.get("/admin/users/:id", adminAuth, UserController.findById);
userRouter.post("/admin/users/", adminAuth, UserController.create);
userRouter.delete("/admin/users/:id", adminAuth, UserController.delete);
userRouter.get("/user/profile", userAuth, UserController.getProfile);
userRouter.put("/user/profile", userAuth, UserController.updateProfile);
userRouter.post("/user/change_password", userAuth, UserController.changePassword);

export default userRouter;

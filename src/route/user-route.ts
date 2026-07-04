import { adminAuth, userAuth } from "../middleware/auth-middleware";
import { UserController } from "./../controller/user-controller";
import { Router } from "express";

const userRouter = Router();
// admin routes
userRouter.get("/admin/users/", adminAuth, UserController.getList);
userRouter.get("/admin/users/profile", adminAuth, UserController.getProfile);
userRouter.put("/admin/users/profile", adminAuth, UserController.updateProfile);
userRouter.post(
  "/admin/users/change_password",
  adminAuth,
  UserController.changePassword,
);
userRouter.post("/admin/users/", adminAuth, UserController.create);
userRouter.get("/admin/users/:id", adminAuth, UserController.findById);
userRouter.patch("/admin/users/:id", adminAuth, UserController.changeStatus);

// user routes
userRouter.get("/user/profile", userAuth, UserController.getProfile);
userRouter.put("/user/profile", userAuth, UserController.updateProfile);
userRouter.post(
  "/user/change_password",
  userAuth,
  UserController.changePassword,
);

export default userRouter;

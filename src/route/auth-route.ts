import { Router } from "express";
import { AuthController } from "../controller/auth-controller";

const authRouter = Router();
authRouter.post("/user/register", AuthController.userRegister);
authRouter.post("/user/login", AuthController.userLogin);
authRouter.post("/admin/login", AuthController.adminLogin);

export default authRouter;
